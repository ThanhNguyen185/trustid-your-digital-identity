import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { PhoneFrame, QrArt, ScoreRing, StatusPill } from "@/components/trustid/ui-bits";
import {
  courseSuggestions,
  credentials,
  jobMatches,
  scholarships,
  shareHistory,
  skillGap,
  student,
  type Credential,
} from "@/lib/trustid-data";

export const Route = createFileRoute("/student")({
  head: () => ({
    meta: [
      { title: "App sinh viên – Ví hồ sơ số TrustID AI" },
      {
        name: "description",
        content:
          "Prototype ứng dụng di động TrustID AI: xác thực danh tính eKYC, ví Credential, chia sẻ QR có kiểm soát, đối sánh việc làm và học bổng.",
      },
      { property: "og:title", content: "App sinh viên – Ví hồ sơ số TrustID AI" },
      {
        property: "og:description",
        content: "Xác thực danh tính, quản lý credential và chia sẻ hồ sơ bằng QR có thời hạn.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StudentApp,
});

type Tab = "home" | "wallet" | "qr" | "ai" | "privacy";

function StudentApp() {
  const [stage, setStage] = useState<"splash" | "kyc" | "app">("splash");
  const [tab, setTab] = useState<Tab>("home");
  const [selected, setSelected] = useState<Credential | null>(null);

  return (
    <main className="min-h-screen bg-surface py-10">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link to="/" className="text-sm font-semibold text-primary hover:underline">
              ← TrustID AI
            </Link>
            <h1 className="mt-1 text-2xl font-bold">Ứng dụng di động – Sinh viên</h1>
            <p className="text-sm text-muted-foreground">
              Digital Identity Wallet: định danh, credential, chia sẻ có kiểm soát.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setStage("splash");
              setTab("home");
              setSelected(null);
            }}
          >
            Khởi động lại demo
          </Button>
        </div>

        <PhoneFrame>
          {stage === "splash" ? (
            <Splash onStart={() => setStage("kyc")} />
          ) : stage === "kyc" ? (
            <Kyc onDone={() => setStage("app")} />
          ) : selected ? (
            <CredentialDetail credential={selected} onBack={() => setSelected(null)} />
          ) : (
            <div className="flex min-h-full flex-col">
              <AppHeader tab={tab} />
              <div className="flex-1 px-5 pb-28 pt-4">
                {tab === "home" && <HomeScreen onOpen={setSelected} onTab={setTab} />}
                {tab === "wallet" && <WalletScreen onOpen={setSelected} />}
                {tab === "qr" && <ShareScreen />}
                {tab === "ai" && <AiScreen />}
                {tab === "privacy" && <PrivacyScreen />}
              </div>
              <BottomNav tab={tab} onTab={setTab} />
            </div>
          )}
        </PhoneFrame>
      </div>
    </main>
  );
}

function Splash({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex h-full flex-col justify-between bg-hero-gradient px-7 pb-10 pt-24 text-primary-foreground">
      <div>
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/15 text-xl font-bold">
          T
        </span>
        <h2 className="mt-8 text-3xl font-extrabold leading-tight">
          TrustID AI
          <br />
          <span className="text-accent">Xác thực một lần</span>
          <br />
          Tái sử dụng mọi nơi
        </h2>
        <p className="mt-4 text-sm/6 opacity-85">
          Hồ sơ học tập và năng lực được xác thực – Chủ động chia sẻ – An toàn và minh bạch.
        </p>
      </div>
      <div className="space-y-3">
        <Button size="lg" variant="secondary" className="w-full" onClick={onStart}>
          Đăng nhập
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="w-full border-white/40 bg-transparent text-primary-foreground hover:bg-white/10"
          onClick={onStart}
        >
          Đăng ký tài khoản
        </Button>
        <p className="pt-1 text-center text-xs opacity-75">
          Đăng nhập bằng số điện thoại / email + xác thực đa yếu tố (MFA)
        </p>
      </div>
    </div>
  );
}

const kycSteps = [
  {
    title: "Xác thực thông tin định danh",
    body: "Chụp hoặc đọc thông tin từ giấy tờ định danh. AI OCR trích xuất họ tên, ngày sinh, số định danh. Hỗ trợ đọc chip qua NFC nếu thiết bị cho phép.",
    action: "Quét giấy tờ",
    fields: ["Họ tên: Nguyễn Văn A", "Ngày sinh: 14/03/2004", "Số định danh: 0790•••••312"],
  },
  {
    title: "Xác thực khuôn mặt",
    body: "Thực hiện thao tác theo hướng dẫn để hệ thống kiểm tra tính sống (Liveness) và đối sánh khuôn mặt (Face Matching).",
    action: "Bắt đầu quét khuôn mặt",
    fields: ["Nhìn thẳng vào camera", "Quay mặt sang trái", "Quay mặt sang phải", "Chớp mắt"],
  },
];

function Kyc({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);

  if (step >= kycSteps.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-7 text-center">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-success/15 text-3xl text-success">
          ✓
        </span>
        <h2 className="mt-6 text-xl font-bold">Xác thực danh tính thành công</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Danh tính số của bạn đã được thiết lập. Hồ sơ có độ tin cậy thấp sẽ được chuyển sang cơ
          chế Human-in-the-loop để nhân sự có thẩm quyền kiểm tra.
        </p>
        <div className="mt-6 w-full rounded-2xl border border-border bg-card p-4 text-left text-xs">
          <Row k="OCR định danh" v="Đạt" />
          <Row k="Liveness Detection" v="Đạt" />
          <Row k="Face Matching" v="98.4%" />
          <Row k="Fraud Detection" v="Không phát hiện bất thường" />
        </div>
        <Button className="mt-8 w-full" size="lg" onClick={onDone}>
          Vào ví hồ sơ số
        </Button>
      </div>
    );
  }

  const s = kycSteps[step]!;
  return (
    <div className="flex h-full flex-col px-7 pb-8 pt-16">
      <p className="text-xs font-semibold uppercase tracking-widest text-accent">
        Bước {step + 1}/{kycSteps.length}
      </p>
      <h2 className="mt-2 text-xl font-bold">{s.title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>

      <div className="mt-6 grid aspect-[4/5] place-items-center rounded-3xl border-2 border-dashed border-primary/40 bg-primary/5 text-center">
        <div>
          <span className="text-4xl">{step === 0 ? "🪪" : "🙂"}</span>
          <p className="mt-3 px-6 text-xs text-muted-foreground">
            {step === 0 ? "Đặt giấy tờ trong khung hình" : "Giữ khuôn mặt trong khung oval"}
          </p>
        </div>
      </div>

      <ul className="mt-5 space-y-2 text-sm">
        {s.fields.map((f) => (
          <li key={f} className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2">
            <span className="text-success">✓</span>
            {f}
          </li>
        ))}
      </ul>

      <Button className="mt-auto w-full" size="lg" onClick={() => setStep(step + 1)}>
        {s.action}
      </Button>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 py-2 last:border-0">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-semibold">{v}</span>
    </div>
  );
}

const tabLabels: Record<Tab, string> = {
  home: "Trang chủ",
  wallet: "Ví hồ sơ số",
  qr: "Chia sẻ hồ sơ",
  ai: "Cơ hội & năng lực",
  privacy: "Quyền riêng tư",
};

function AppHeader({ tab }: { tab: Tab }) {
  return (
    <div className="bg-hero-gradient px-5 pb-6 pt-12 text-primary-foreground">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs opacity-80">{tabLabels[tab]}</p>
          <h2 className="text-lg font-bold">{student.name}</h2>
          <p className="text-xs opacity-80">
            {student.major} · {student.school}
          </p>
        </div>
        <span className="glass-panel rounded-full px-3 py-1.5 text-xs font-semibold">
          ✓ Danh tính đã xác thực
        </span>
      </div>
      <p className="mt-3 font-mono text-[11px] opacity-70">{student.did}</p>
    </div>
  );
}

function HomeScreen({
  onOpen,
  onTab,
}: {
  onOpen: (c: Credential) => void;
  onTab: (t: Tab) => void;
}) {
  const quick: { label: string; icon: string; tab: Tab }[] = [
    { label: "Thêm hồ sơ", icon: "＋", tab: "wallet" },
    { label: "QR của tôi", icon: "▦", tab: "qr" },
    { label: "Chia sẻ hồ sơ", icon: "↗", tab: "qr" },
    { label: "Cơ hội cho tôi", icon: "◎", tab: "ai" },
    { label: "Quyền chia sẻ", icon: "🔒", tab: "privacy" },
    { label: "Lịch sử", icon: "🕘", tab: "privacy" },
  ];
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-card-gradient p-5 text-primary-foreground shadow-soft">
        <p className="text-xs opacity-80">Hồ sơ học tập số</p>
        <p className="mt-1 font-display text-3xl font-bold">
          {credentials.filter((c) => c.status === "verified").length}
        </p>
        <p className="text-xs opacity-80">Credential đã xác thực · GPA {student.gpa}</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {quick.map((q) => (
          <button
            key={q.label}
            onClick={() => onTab(q.tab)}
            className="rounded-2xl border border-border bg-card p-3 text-center transition-colors hover:border-primary/50"
          >
            <span className="text-lg">{q.icon}</span>
            <p className="mt-1 text-[11px] font-semibold leading-tight">{q.label}</p>
          </button>
        ))}
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold">Hồ sơ của tôi</h3>
        <div className="space-y-2.5">
          {credentials.slice(0, 4).map((c) => (
            <CredentialRow key={c.id} c={c} onOpen={onOpen} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CredentialRow({ c, onOpen }: { c: Credential; onOpen: (c: Credential) => void }) {
  return (
    <button
      onClick={() => onOpen(c)}
      className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-3.5 text-left shadow-soft transition-colors hover:border-primary/50"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-muted text-lg">
        {c.icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold">{c.title}</span>
        <span className="block truncate text-xs text-muted-foreground">{c.issuer}</span>
      </span>
      <StatusPill status={c.status} className="shrink-0" />
    </button>
  );
}

const docTypes = [
  "Bằng đại học",
  "Bảng điểm",
  "Chứng chỉ",
  "Chứng nhận thực tập",
  "Giải thưởng",
  "Chứng nhận khác",
];

function WalletScreen({ onOpen }: { onOpen: (c: Credential) => void }) {
  const [adding, setAdding] = useState(false);
  const [progress, setProgress] = useState(0);
  const pipeline = [
    "Tải tài liệu",
    "AI OCR",
    "Phân tích hình ảnh",
    "Phát hiện bất thường",
    "Đối chiếu thông tin",
    "Xác minh đơn vị phát hành",
    "Phát hành Credential",
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold">Credential Wallet</h3>
        <Button
          size="sm"
          onClick={() => {
            setAdding(!adding);
            setProgress(0);
          }}
        >
          + Thêm hồ sơ
        </Button>
      </div>

      {adding ? (
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
          <p className="text-xs font-semibold">Chọn loại hồ sơ</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {docTypes.map((d) => (
              <button
                key={d}
                onClick={() => setProgress(pipeline.length)}
                className="rounded-full border border-border bg-card px-3 py-1 text-[11px] font-medium hover:border-primary"
              >
                {d}
              </button>
            ))}
          </div>
          <ol className="mt-4 space-y-1.5">
            {pipeline.map((p, i) => (
              <li key={p} className="flex items-center gap-2 text-xs">
                <span className={i < progress ? "text-success" : "text-muted-foreground"}>
                  {i < progress ? "✓" : "○"}
                </span>
                <span className={i < progress ? "font-medium" : "text-muted-foreground"}>{p}</span>
              </li>
            ))}
          </ol>
          {progress >= pipeline.length ? (
            <p className="mt-3 rounded-xl bg-success/12 p-3 text-xs font-semibold text-success">
              ✓ Đã phát hành Hồ sơ chứng thực số – Verifiable Credential
            </p>
          ) : (
            <p className="mt-3 text-[11px] text-muted-foreground">
              Chọn loại hồ sơ để mô phỏng quy trình xác thực bằng AI.
            </p>
          )}
        </div>
      ) : null}

      <div className="space-y-2.5">
        {credentials.map((c) => (
          <CredentialRow key={c.id} c={c} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}

function CredentialDetail({ credential, onBack }: { credential: Credential; onBack: () => void }) {
  return (
    <div className="min-h-full">
      <div className="bg-hero-gradient px-5 pb-8 pt-12 text-primary-foreground">
        <button onClick={onBack} className="text-sm font-semibold opacity-90">
          ← Quay lại
        </button>
        <span className="mt-4 block text-3xl">{credential.icon}</span>
        <h2 className="mt-2 text-xl font-bold">{credential.title}</h2>
        <p className="mt-1 text-xs opacity-85">
          {credential.type} · {credential.issuer}
        </p>
        <span className="glass-panel mt-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold">
          {credential.status === "verified" ? "✓ Đã xác thực" : "⚠ Đang chờ xác minh"}
        </span>
      </div>

      <div className="space-y-5 px-5 pb-10 pt-5">
        <div className="rounded-2xl border border-border bg-card p-4 text-xs">
          <Row k="Người sở hữu" v={student.name} />
          <Row k="Đơn vị phát hành" v={credential.issuer} />
          <Row k="Ngày cấp" v={credential.issuedAt} />
          <Row k="Mã Credential" v={credential.id} />
          {Object.entries(credential.detail).map(([k, v]) => (
            <Row key={k} k={k} v={v} />
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-muted/50 p-4">
          <p className="text-xs font-semibold">Dấu vân tay số (Hash)</p>
          <p className="mt-1 break-all font-mono text-[11px] text-muted-foreground">
            {credential.hash}
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-success">
            <span>✓</span> Blockchain Integrity: Verified
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button size="sm">Chia sẻ</Button>
          <Button size="sm" variant="secondary">
            Tạo QR
          </Button>
          <Button size="sm" variant="outline">
            Kiểm tra
          </Button>
        </div>
      </div>
    </div>
  );
}

function ShareScreen() {
  const [picked, setPicked] = useState<string[]>([
    "VC-2026-000184",
    "VC-2026-000185",
    "VC-2025-004417",
  ]);
  const [generated, setGenerated] = useState(false);

  const toggle = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-card p-4">
        <h3 className="text-sm font-bold">Chọn thông tin muốn chia sẻ</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Bạn không cần chia sẻ toàn bộ dữ liệu cá nhân nếu bên nhận không cần.
        </p>
        <div className="mt-3 space-y-2">
          {credentials.map((c) => (
            <label
              key={c.id}
              className="flex items-center gap-3 rounded-xl bg-muted/60 px-3 py-2 text-xs"
            >
              <Checkbox checked={picked.includes(c.id)} onCheckedChange={() => toggle(c.id)} />
              <span className="flex-1">{c.title}</span>
            </label>
          ))}
          <div className="flex items-center gap-3 rounded-xl bg-destructive/8 px-3 py-2 text-xs text-muted-foreground">
            <span className="text-destructive">✕</span> Số định danh cá nhân (CCCD) – không chia sẻ
          </div>
        </div>
        <Button className="mt-4 w-full" onClick={() => setGenerated(true)}>
          Tạo mã QR
        </Button>
      </div>

      {generated ? (
        <div className="rounded-2xl border border-border bg-card p-4 text-center shadow-soft">
          <QrArt className="mx-auto max-w-[220px]" />
          <p className="mt-3 text-sm font-semibold">Đã tạo liên kết xác minh</p>
          <p className="mt-1 break-all font-mono text-[11px] text-muted-foreground">
            trustid.ai/v/8a41c9f2?scope={picked.length}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Chia sẻ {picked.length} credential · Hiệu lực 30 ngày
          </p>
        </div>
      ) : null}
    </div>
  );
}

function AiScreen() {
  const [view, setView] = useState<"job" | "skill" | "scholarship" | "abroad">("job");
  const tabs = [
    ["job", "Việc làm"],
    ["skill", "Năng lực"],
    ["scholarship", "Học bổng"],
    ["abroad", "Du học"],
  ] as const;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-1 rounded-xl bg-muted p-1">
        {tabs.map(([k, l]) => (
          <button
            key={k}
            onClick={() => setView(k)}
            className={`rounded-lg py-1.5 text-[11px] font-semibold transition-colors ${
              view === k ? "bg-card text-primary shadow-soft" : "text-muted-foreground"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {view === "job" &&
        jobMatches.map((j) => (
          <div key={j.title} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <div className="flex items-start gap-3">
              <ScoreRing value={j.score} />
              <div className="min-w-0">
                <p className="text-sm font-bold">{j.title}</p>
                <p className="text-xs text-muted-foreground">{j.company}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {j.matched.map((m) => (
                <span
                  key={m}
                  className="rounded-full bg-success/12 px-2 py-0.5 text-[11px] font-medium text-success"
                >
                  ✓ {m}
                </span>
              ))}
              {j.missing.map((m) => (
                <span
                  key={m}
                  className="rounded-full bg-warning/20 px-2 py-0.5 text-[11px] font-medium text-warning-foreground"
                >
                  △ {m}
                </span>
              ))}
            </div>
            <p className="mt-3 rounded-xl bg-muted/60 p-3 text-[11px] leading-relaxed text-muted-foreground">
              <b className="text-foreground">AI giải thích: </b>
              {j.reason}
            </p>
          </div>
        ))}

      {view === "skill" && (
        <div className="space-y-3">
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Mục tiêu nghề nghiệp</p>
            <p className="text-sm font-bold">Chuyên viên phân tích tài chính</p>
            <div className="mt-4 space-y-3">
              {skillGap.map((s) => (
                <div key={s.skill}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">{s.skill}</span>
                    <span
                      className={s.status === "Đạt" ? "text-success" : "text-warning-foreground"}
                    >
                      {s.status === "Đạt" ? "✓" : "△"} {s.status}
                    </span>
                  </div>
                  <Progress value={s.level} className="mt-1.5 h-1.5" />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-accent/40 bg-accent/10 p-4">
            <p className="text-xs font-bold">Đề xuất khoá học / chứng chỉ</p>
            <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
              {courseSuggestions.map((c) => (
                <li key={c}>• {c}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {view === "scholarship" &&
        scholarships.map((s) => (
          <div key={s.name} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <div className="flex items-start gap-3">
              <ScoreRing value={s.score} />
              <div className="min-w-0">
                <p className="text-sm font-bold">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.provider}</p>
              </div>
            </div>
            <ul className="mt-3 space-y-1 text-[11px]">
              {s.matched.map((m) => (
                <li key={m} className="text-success">
                  ✓ {m}
                </li>
              ))}
              {s.missing.map((m) => (
                <li key={m} className="text-warning-foreground">
                  △ Còn thiếu: {m}
                </li>
              ))}
            </ul>
          </div>
        ))}

      {view === "abroad" && (
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-sm font-bold">Bộ hồ sơ du học</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Hệ thống tập hợp các credential đã xác thực thành một bộ hồ sơ số duy nhất.
          </p>
          <ul className="mt-3 space-y-2 text-xs">
            {[
              "Bằng tốt nghiệp",
              "Bảng điểm",
              "GPA 3.62",
              "IELTS 7.5",
              "Chứng chỉ nghề nghiệp",
              "Thành tích NCKH",
              "Hoạt động ngoại khoá",
            ].map((i) => (
              <li key={i} className="flex items-center gap-2 rounded-xl bg-muted/60 px-3 py-2">
                <span className="text-success">✓</span> {i}
              </li>
            ))}
          </ul>
          <Button className="mt-4 w-full" size="sm">
            Tạo hồ sơ du học
          </Button>
        </div>
      )}
    </div>
  );
}

function PrivacyScreen() {
  const [allowed, setAllowed] = useState(true);
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold">Quyền truy cập hồ sơ</p>
            <p className="text-xs text-muted-foreground">Công ty ABC · Thời hạn 30 ngày</p>
          </div>
          <Switch checked={allowed} onCheckedChange={setAllowed} />
        </div>
        <div className="mt-4 space-y-1.5 text-xs">
          <p className="font-semibold">Được xem</p>
          {["Bằng đại học", "GPA", "Chứng chỉ IELTS"].map((i) => (
            <p key={i} className="text-success">
              ✓ {i}
            </p>
          ))}
          <p className="pt-2 font-semibold">Không được xem</p>
          {["CCCD", "Địa chỉ", "Thông tin không liên quan"].map((i) => (
            <p key={i} className="text-muted-foreground">
              ✕ {i}
            </p>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button
            size="sm"
            variant={allowed ? "secondary" : "default"}
            onClick={() => setAllowed(true)}
          >
            Cho phép
          </Button>
          <Button size="sm" variant="outline" onClick={() => setAllowed(false)}>
            Thu hồi quyền
          </Button>
        </div>
        <p className="mt-3 text-[11px] text-muted-foreground">
          Privacy by Design · Consent Management: bạn kiểm soát ai xem gì và trong bao lâu.
        </p>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-bold">Lịch sử chia sẻ</h3>
        <div className="space-y-2">
          {shareHistory.map((h) => (
            <div key={h.org} className="rounded-2xl border border-border bg-card p-3.5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{h.org}</p>
                <span
                  className={`text-[11px] font-semibold ${
                    h.state === "Đang hiệu lực" ? "text-success" : "text-muted-foreground"
                  }`}
                >
                  {h.state}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {h.purpose} · {h.date} · {h.expires}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BottomNav({ tab, onTab }: { tab: Tab; onTab: (t: Tab) => void }) {
  const items: { key: Tab; icon: string; label: string }[] = [
    { key: "home", icon: "⌂", label: "Trang chủ" },
    { key: "wallet", icon: "▤", label: "Ví hồ sơ" },
    { key: "qr", icon: "▦", label: "QR" },
    { key: "ai", icon: "◎", label: "Cơ hội" },
    { key: "privacy", icon: "🔒", label: "Riêng tư" },
  ];
  return (
    <nav className="absolute inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-border bg-card/95 px-2 pb-4 pt-2 backdrop-blur">
      {items.map((i) => (
        <button
          key={i.key}
          onClick={() => onTab(i.key)}
          className={`flex flex-col items-center gap-0.5 rounded-xl py-1.5 text-[10px] font-semibold transition-colors ${
            tab === i.key ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <span className="text-base">{i.icon}</span>
          {i.label}
        </button>
      ))}
    </nav>
  );
}
