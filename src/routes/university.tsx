import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { StatusPill, SectionTitle } from "@/components/trustid/ui-bits";
import { universityCredentials, universityStats } from "@/lib/trustid-data";

export const Route = createFileRoute("/university")({
  head: () => ({
    meta: [
      { title: "Dashboard trường đại học – Phát hành Credential | TrustID AI" },
      {
        name: "description",
        content:
          "Web Dashboard TrustID AI cho trường đại học: phát hành, quản lý và thu hồi Verifiable Credential, thống kê xác minh và cảnh báo hồ sơ bất thường.",
      },
      { property: "og:title", content: "Dashboard trường đại học – TrustID AI" },
      {
        property: "og:description",
        content: "Phát hành và quản lý vòng đời Credential: Pending → Verified → Revoked.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: UniversityDashboard,
});

const nav = [
  "Dashboard",
  "Quản lý sinh viên",
  "Phát hành Credential",
  "Quản lý Credential",
  "Thu hồi Credential",
  "Thống kê xác minh",
  "Quản lý quyền",
  "API tích hợp",
];

function UniversityDashboard() {
  const [active, setActive] = useState(nav[0]!);
  const [rows, setRows] = useState(universityCredentials);
  const [issued, setIssued] = useState<string | null>(null);

  const revoke = (id: string) =>
    setRows((r) => r.map((x) => (x.id === id ? { ...x, status: "revoked" as const } : x)));
  const approve = (id: string) =>
    setRows((r) => r.map((x) => (x.id === id ? { ...x, status: "verified" as const } : x)));

  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="hidden w-64 shrink-0 flex-col bg-sidebar px-4 py-6 text-sidebar-foreground lg:flex">
        <Link to="/" className="mb-8 flex items-center gap-2 px-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-card-gradient text-sm font-bold text-primary-foreground">
            T
          </span>
          <span className="font-display font-bold">TrustID AI</span>
        </Link>
        <p className="px-2 text-[11px] uppercase tracking-widest opacity-60">Đại học X</p>
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
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link to="/" className="text-sm font-semibold text-primary hover:underline lg:hidden">
              ← TrustID AI
            </Link>
            <h1 className="text-2xl font-bold">{active}</h1>
            <p className="text-sm text-muted-foreground">Đại học X · Issuer Portal</p>
          </div>
          <Button onClick={() => setActive("Phát hành Credential")}>+ Tạo Credential</Button>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {universityStats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
              <p className="mt-1 font-display text-3xl font-bold">{s.value}</p>
              <p className="mt-1 text-xs text-accent">{s.note}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <SectionTitle title="Quản lý Credential" desc="Vòng đời: Pending → Verified → Revoked." />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="pb-2 pr-3 font-medium">Mã</th>
                    <th className="pb-2 pr-3 font-medium">Sinh viên</th>
                    <th className="pb-2 pr-3 font-medium">Loại</th>
                    <th className="pb-2 pr-3 font-medium">Trạng thái</th>
                    <th className="pb-2 font-medium">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-b border-border/60 last:border-0">
                      <td className="py-3 pr-3 font-mono text-xs">{r.id}</td>
                      <td className="py-3 pr-3">{r.student}</td>
                      <td className="py-3 pr-3 text-muted-foreground">{r.type}</td>
                      <td className="py-3 pr-3">
                        <StatusPill status={r.status} />
                      </td>
                      <td className="py-3">
                        {r.status === "pending" ? (
                          <Button size="sm" variant="secondary" onClick={() => approve(r.id)}>
                            Phát hành
                          </Button>
                        ) : r.status === "verified" ? (
                          <Button size="sm" variant="outline" onClick={() => revoke(r.id)}>
                            Thu hồi
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">Đã thu hồi</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 rounded-xl bg-muted/60 p-3 text-xs text-muted-foreground">
              Khi thu hồi, trạng thái chuyển từ ✓ Valid sang ✕ Revoked. Doanh nghiệp quét QR sau đó
              sẽ nhận thông báo credential không còn hiệu lực.
            </p>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="text-lg font-bold">Phát hành Credential</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Chọn loại credential để mô phỏng ký số và ghi nhận blockchain.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Bằng tốt nghiệp", "Bảng điểm", "Chứng chỉ", "Giấy xác nhận", "Thành tích", "Chứng nhận thực tập"].map(
                  (t) => (
                    <button
                      key={t}
                      onClick={() => setIssued(t)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                        issued === t ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/60"
                      }`}
                    >
                      {t}
                    </button>
                  ),
                )}
              </div>
              {issued ? (
                <ol className="mt-4 space-y-2 text-xs">
                  {[
                    "Kiểm tra dữ liệu nguồn",
                    "Tạo Verifiable Credential",
                    "Ký số bằng khoá của trường",
                    "Tạo dấu vân tay số (Hash)",
                    "Blockchain ghi nhận Hash + Status",
                  ].map((s) => (
                    <li key={s} className="flex items-center gap-2 rounded-lg bg-success/8 px-3 py-2 text-success">
                      ✓ {s}
                    </li>
                  ))}
                  <li className="pt-1 font-mono text-[11px] text-muted-foreground">
                    tx: 0xc7f1…a930 · {issued} · Status: Verified
                  </li>
                </ol>
              ) : null}
            </div>

            <div className="rounded-2xl border border-warning/40 bg-warning/10 p-6">
              <h2 className="text-sm font-bold">Cảnh báo AI Fraud Detection</h2>
              <ul className="mt-3 space-y-2 text-xs text-foreground/80">
                <li>⚠ 3 bảng điểm có dấu hiệu chỉnh sửa vùng điểm số</li>
                <li>⚠ 5 hồ sơ sai lệch thông tin người sở hữu so với OCR</li>
                <li>⚠ 4 tài liệu không đối chiếu được đơn vị phát hành</li>
              </ul>
              <Button size="sm" variant="secondary" className="mt-4">
                Chuyển Human-in-the-loop
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
