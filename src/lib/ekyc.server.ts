const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

export type KycAiResult = {
  document_type: string | null;
  full_name: string | null;
  dob: string | null;
  id_number_masked: string | null;
  document_readable: boolean;
  face_match_score: number;
  liveness_pass: boolean;
  fraud_flags: string[];
  verdict: "verified" | "rejected" | "review";
  reason: string;
};

function apiKey(): string {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("LOVABLE_API_KEY chưa được cấu hình");
  return key;
}

async function chat(body: unknown): Promise<string> {
  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) {
    if (res.status === 429) throw new Error("Hệ thống AI đang quá tải, vui lòng thử lại sau ít phút.");
    if (res.status === 402) throw new Error("Hạn mức AI đã hết, vui lòng nạp thêm credits.");
    throw new Error(`AI lỗi (${res.status}): ${text.slice(0, 300)}`);
  }
  const json = JSON.parse(text) as { choices?: { message?: { content?: string } }[] };
  return json.choices?.[0]?.message?.content ?? "";
}

function parseJson<T>(raw: string): T {
  const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("AI trả về dữ liệu không hợp lệ");
  return JSON.parse(cleaned.slice(start, end + 1)) as T;
}

export async function runKycCheck(idImage: string, selfie: string): Promise<KycAiResult> {
  const raw = await chat({
    model: "google/gemini-3.5-flash",
    messages: [
      {
        role: "system",
        content:
          "Bạn là hệ thống eKYC. Kiểm tra ảnh giấy tờ tuỳ thân và ảnh chân dung selfie. " +
          "Trích xuất thông tin trên giấy tờ (OCR), đánh giá ảnh selfie có phải người thật (liveness) " +
          "và mức độ trùng khớp khuôn mặt với ảnh trên giấy tờ. " +
          'Chỉ trả về JSON đúng schema: {"document_type":string|null,"full_name":string|null,"dob":"YYYY-MM-DD"|null,' +
          '"id_number_masked":string|null,"document_readable":boolean,"face_match_score":number(0-100),' +
          '"liveness_pass":boolean,"fraud_flags":string[],"verdict":"verified"|"rejected"|"review","reason":string}. ' +
          "Che số định danh, chỉ để lộ 3 số cuối. verdict=verified khi giấy tờ đọc được, liveness đạt và face_match_score>=80; " +
          "rejected khi ảnh không phải giấy tờ tuỳ thân hoặc khuôn mặt không khớp rõ ràng; còn lại review. Trả lời bằng tiếng Việt ở trường reason.",
      },
      {
        role: "user",
        content: [
          { type: "text", text: "Ảnh 1: giấy tờ tuỳ thân. Ảnh 2: selfie của người đăng ký." },
          { type: "image_url", image_url: { url: idImage } },
          { type: "image_url", image_url: { url: selfie } },
        ],
      },
    ],
  });
  const parsed = parseJson<KycAiResult>(raw);
  return {
    ...parsed,
    face_match_score: Math.max(0, Math.min(100, Number(parsed.face_match_score) || 0)),
    fraud_flags: Array.isArray(parsed.fraud_flags) ? parsed.fraud_flags : [],
  };
}

export type CareerAnalysis = {
  jobs: { title: string; company: string; score: number; matched: string[]; missing: string[]; reason: string }[];
  skills: { skill: string; level: number; status: string }[];
  courses: string[];
  scholarships: { name: string; provider: string; score: number; matched: string[]; missing: string[] }[];
};

export async function runCareerAnalysis(payload: unknown): Promise<CareerAnalysis> {
  const raw = await chat({
    model: "google/gemini-3.5-flash",
    messages: [
      {
        role: "system",
        content:
          "Bạn là AI tư vấn nghề nghiệp cho sinh viên Việt Nam. Dựa trên hồ sơ và các credential đã xác thực, " +
          "hãy gợi ý việc làm phù hợp, phân tích khoảng trống kỹ năng, khoá học nên bổ sung và học bổng phù hợp. " +
          'Chỉ trả về JSON: {"jobs":[{"title","company","score"(0-100),"matched":[],"missing":[],"reason"}],' +
          '"skills":[{"skill","level"(0-100),"status"}],"courses":[string],' +
          '"scholarships":[{"name","provider","score"(0-100),"matched":[],"missing":[]}]}. ' +
          "Tối đa 3 việc làm, 5 kỹ năng, 3 khoá học, 2 học bổng. Toàn bộ nội dung bằng tiếng Việt.",
      },
      { role: "user", content: JSON.stringify(payload) },
    ],
  });
  const parsed = parseJson<CareerAnalysis>(raw);
  return {
    jobs: parsed.jobs ?? [],
    skills: parsed.skills ?? [],
    courses: parsed.courses ?? [],
    scholarships: parsed.scholarships ?? [],
  };
}

export function dataUrlToBytes(dataUrl: string): { bytes: Uint8Array; contentType: string } {
  const match = /^data:([^;]+);base64,(.*)$/s.exec(dataUrl);
  if (!match) throw new Error("Ảnh không hợp lệ");
  const contentType = match[1]!;
  const binary = atob(match[2]!);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return { bytes, contentType };
}

export async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return (
    "0x" +
    Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  );
}
