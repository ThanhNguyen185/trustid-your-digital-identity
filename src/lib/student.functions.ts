import { createServerFn } from "@tanstack/react-start";
import type { Json, TablesUpdate } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  dataUrlToBytes,
  runCareerAnalysis,
  runKycCheck,
  sha256Hex,
  verifyCredentialDoc,
} from "@/lib/ekyc.server";

export const submitKyc = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { idImage: string; selfie: string }) => {
    if (!input?.idImage?.startsWith("data:image/") || !input?.selfie?.startsWith("data:image/")) {
      throw new Error("Cần cung cấp cả ảnh giấy tờ và ảnh selfie");
    }
    if (input.idImage.length > 8_000_000 || input.selfie.length > 8_000_000) {
      throw new Error("Ảnh quá lớn, vui lòng chụp lại");
    }
    return input;
  })
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const stamp = Date.now();

    const id = dataUrlToBytes(data.idImage);
    const face = dataUrlToBytes(data.selfie);
    const idPath = `${userId}/id-${stamp}.jpg`;
    const selfiePath = `${userId}/selfie-${stamp}.jpg`;

    await supabase.storage.from("kyc").upload(idPath, id.bytes, { contentType: id.contentType, upsert: true });
    await supabase.storage
      .from("kyc")
      .upload(selfiePath, face.bytes, { contentType: face.contentType, upsert: true });

    const result = await runKycCheck(data.idImage, data.selfie);
    const status =
      result.verdict === "verified" ? "verified" : result.verdict === "rejected" ? "rejected" : "pending";

    await supabase.from("kyc_submissions").insert({
      user_id: userId,
      id_doc_path: idPath,
      selfie_path: selfiePath,
      ai_result: result as unknown as Json,
      score: result.face_match_score,
      status,
      note: result.reason,
    });

    const profilePatch: TablesUpdate<"profiles"> = {
      identity_status: status,
      identity_score: result.face_match_score,
      updated_at: new Date().toISOString(),
    };
    if (result.full_name) profilePatch.full_name = result.full_name;
    if (result.dob && /^\d{4}-\d{2}-\d{2}$/.test(result.dob)) profilePatch.dob = result.dob;
    await supabase.from("profiles").update(profilePatch).eq("id", userId);

    return { status, result };
  });

export const verifyCredential = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { credentialId: string; documentImage?: string }) => {
    if (!input?.credentialId) throw new Error("Thiếu credential");
    return input;
  })
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: cred, error } = await supabase
      .from("credentials")
      .select("*")
      .eq("id", data.credentialId)
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!cred) throw new Error("Không tìm thấy credential");

    const check = await verifyCredentialDoc(
      {
        title: cred.title,
        type: cred.cred_type,
        issuer: cred.issuer,
        issued_at: cred.issued_at,
        detail: cred.detail,
      },
      data.documentImage,
    );

    if (check.verdict !== "verified") {
      await supabase
        .from("credentials")
        .update({ reviewer_note: check.reason, status: "pending" })
        .eq("id", cred.id);
      return { status: "pending" as const, note: check.reason, hash: null };
    }

    const hash = await sha256Hex(
      `${cred.id}|${cred.title}|${cred.issuer}|${cred.issued_at ?? ""}|${JSON.stringify(cred.detail)}`,
    );
    await supabase
      .from("credentials")
      .update({
        status: "verified",
        hash,
        reviewer_note: check.reason,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", cred.id);
    return { status: "verified" as const, note: check.reason, hash };
  });

export const analyzeCareer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const [{ data: profile }, { data: creds }] = await Promise.all([
      supabase.from("profiles").select("full_name, school, major, identity_status").eq("id", userId).maybeSingle(),
      supabase
        .from("credentials")
        .select("title, cred_type, issuer, issued_at, detail, status")
        .eq("user_id", userId),
    ]);
    const verified = (creds ?? []).filter((c) => c.status === "verified");
    if (verified.length === 0) {
      throw new Error("Bạn cần có ít nhất một credential đã xác thực để AI phân tích.");
    }
    return runCareerAnalysis({ profile, credentials: verified });
  });

export const getSharedProfile = createServerFn({ method: "GET" })
  .inputValidator((input: { token: string }) => {
    if (!input?.token || input.token.length > 100) throw new Error("Mã chia sẻ không hợp lệ");
    return input;
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: link } = await supabaseAdmin
      .from("share_links")
      .select("*")
      .eq("token", data.token)
      .maybeSingle();
    if (!link || link.revoked || new Date(link.expires_at) < new Date()) {
      return { valid: false as const };
    }
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("full_name, school, major, did, identity_status")
      .eq("id", link.user_id)
      .maybeSingle();
    const { data: creds } = await supabaseAdmin
      .from("credentials")
      .select("id, title, cred_type, issuer, issued_at, status, hash")
      .in("id", link.credential_ids.length ? link.credential_ids : ["00000000-0000-0000-0000-000000000000"]);

    const fields = new Set(link.fields);
    return {
      valid: true as const,
      org: link.org,
      purpose: link.purpose,
      expiresAt: link.expires_at,
      profile: {
        full_name: fields.has("name") ? (profile?.full_name ?? null) : null,
        school: fields.has("school") ? (profile?.school ?? null) : null,
        major: fields.has("major") ? (profile?.major ?? null) : null,
        did: profile?.did ?? null,
        identity_status: profile?.identity_status ?? null,
      },
      credentials: creds ?? [],
    };
  });
