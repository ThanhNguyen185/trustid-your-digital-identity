import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { QrArt, ScoreRing, SectionTitle } from "@/components/trustid/ui-bits";
import { candidates, student, verificationChecks } from "@/lib/trustid-data";

export const Route = createFileRoute("/enterprise")({
  head: () => ({
    meta: [
      { title: "Dashboard doanh nghiệp – Xác minh ứng viên | TrustID AI" },
      {
        name: "description",
        content:
          "Web Dashboard TrustID AI cho doanh nghiệp: quét QR xác minh ứng viên trong vài giây, AI sàng lọc theo JD và phát hành chứng nhận thực tập đã xác thực.",
      },
      { property: "og:title", content: "Dashboard doanh nghiệp – TrustID AI" },
      {
        property: "og:description",
        content: "Xác minh credential, kiểm tra trạng thái hiệu lực và toàn vẹn blockchain tức thì.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EnterpriseDashboard,
});

const nav = [
  "Dashboard",
  "Xác minh ứng viên",
  "Quản lý ứng viên",
  "Đối sánh việc làm",
  "Quản lý Credential",
  "Phát hành chứng nhận thực tập",
  "Lịch sử xác minh",
  "API tích hợp",
];

function EnterpriseDashboard() {
  const [active, setActive] = useState(nav[1]!);
  const [scanned, setScanned] = useState(false);
  const [issuedIntern, setIssuedIntern] = useState(false);

  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="hidden w-64 shrink-0 flex-col bg-sidebar px-4 py-6 text-sidebar-foreground lg:flex">
        <Link to="/" className="mb-8 flex items-center gap-2 px-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-card-gradient text-sm font-bold text-primary-foreground">
            T
          </span>
          <span className="font-display font-bold">TrustID AI</span>
        </Link>
        <p className="px-2 text-[11px] uppercase tracking-widest opacity-60">Công ty ABC</p>
        <nav className="mt-3 space-y-1">
          {nav.map((n) => (
            <button
              key={n}
              onClick={() => setActive(n)}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                active === n
                  ? "bg-sidebar-accent font-semibold text-sidebar-primary"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60"
              }`}
            >
              {n}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 px-5 py-8 lg:px-10">
        <div className="mb-8">
          <Link to="/" className="text-sm font-semibold text-primary hover:underline lg:hidden">
            ← TrustID AI
          </Link>
          <h1 className="text-2xl font-bold">{active}</h1>
          <p className="text-sm text-muted-foreground">Công ty ABC · Verifier Portal</p>
        </div>

        <section className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <SectionTitle title="Xác minh ứng viên" desc="Quét QR, nhập mã Credential hoặc mở liên kết xác minh." />
            <QrArt className="mx-auto max-w-[220px] border border-border" />
            <div className="mt-5 flex gap-2">
              <Input placeholder="Nhập mã Credential (VC-2026-000184)" />
              <Button onClick={() => setScanned(true)}>Xác minh</Button>
            </div>
            <Button variant="outline" className="mt-2 w-full" onClick={() => setScanned(true)}>
              Quét mã QR của ứng viên
            </Button>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="text-lg font-bold">Kết quả xác minh</h2>
            {scanned ? (
              <>
                <div className="mt-4 rounded-2xl bg-success/10 p-4">
                  <p className="text-sm text-muted-foreground">Ứng viên</p>
                  <p className="font-display text-xl font-bold">{student.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {student.major} · {student.school}
                  </p>
                </div>
                <ul className="mt-4 divide-y divide-border">
                  {verificationChecks.map((c) => (
                    <li key={c.label} className="flex items-center justify-between py-2.5 text-sm">
                      <span className="text-muted-foreground">{c.label}</span>
                      <span className="font-semibold text-success">✓ {c.value}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 rounded-xl bg-muted/60 p-3 text-xs text-muted-foreground">
                  Hash đối chiếu trên blockchain khớp với credential được chia sẻ. Phạm vi chia sẻ do
                  ứng viên cấp quyền, hiệu lực 30 ngày.
                </p>
              </>
            ) : (
              <p className="mt-6 rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                Chưa có kết quả. Quét QR hoặc nhập mã credential để xác minh.
              </p>
            )}
          </div>
        </section>

        <section className="mt-10 grid gap-6 xl:grid-cols-[1.2fr_1fr]">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <SectionTitle
              title="AI hỗ trợ tuyển dụng"
              desc="Tải lên Job Description, AI đối chiếu với các hồ sơ đã được xác thực."
            />
            <Textarea
              rows={3}
              defaultValue="Tuyển Chuyên viên phân tích dữ liệu: tốt nghiệp Tài chính/Kinh tế, thành thạo Excel & SQL, ưu tiên có Power BI và tiếng Anh IELTS 7.0+."
            />
            <div className="mt-5 space-y-3">
              {candidates.map((c) => (
                <div key={c.name} className="flex items-start gap-4 rounded-2xl border border-border p-4">
                  <ScoreRing value={c.score} />
                  <div className="min-w-0">
                    <p className="text-sm font-bold">
                      {c.name} <span className="font-normal text-muted-foreground">· {c.role}</span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{c.note}</p>
                    <span className="mt-2 inline-flex rounded-full bg-success/12 px-2 py-0.5 text-[11px] font-semibold text-success">
                      ✓ Credential đã xác thực
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 rounded-xl bg-accent/10 p-3 text-xs text-foreground">
              AI chỉ hỗ trợ sàng lọc và cung cấp thông tin, không tự động ra quyết định tuyển dụng
              cuối cùng.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="text-lg font-bold">Phát hành chứng nhận thực tập</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Verified Internship Credential được thêm trực tiếp vào hồ sơ số của sinh viên.
            </p>
            <div className="mt-4 space-y-3 text-sm">
              {[
                ["Doanh nghiệp", "Công ty ABC"],
                ["Vị trí thực tập", "Data Analyst Intern"],
                ["Bộ phận", "Khối Phân tích"],
                ["Thời gian", "01/06/2026 – 31/08/2026"],
                ["Kết quả", "Hoàn thành tốt"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-semibold">{v}</span>
                </div>
              ))}
            </div>
            <Button className="mt-5 w-full" onClick={() => setIssuedIntern(true)}>
              Phát hành Credential
            </Button>
            {issuedIntern ? (
              <p className="mt-3 rounded-xl bg-success/12 p-3 text-xs font-semibold text-success">
                ✓ Đã ký số và ghi nhận blockchain · Credential đã vào ví của {student.name}
              </p>
            ) : null}
          </div>
        </section>
      </main>
    </div>
  );
}
