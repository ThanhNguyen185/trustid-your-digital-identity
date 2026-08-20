import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/trustid/ui-bits";
import { pipeline } from "@/lib/trustid-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TrustID AI – Hạ tầng hồ sơ số xác thực cho sinh viên" },
      {
        name: "description",
        content:
          "TrustID AI: xác thực một lần, tái sử dụng mọi nơi. Nền tảng định danh, credential số và xác minh kết nối sinh viên, trường đại học và doanh nghiệp.",
      },
      { property: "og:title", content: "TrustID AI – Xác thực một lần, tái sử dụng mọi nơi" },
      {
        property: "og:description",
        content:
          "Ví hồ sơ năng lực số: AI xác thực danh tính và bằng cấp, Blockchain đảm bảo toàn vẹn, sinh viên kiểm soát quyền chia sẻ.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const roles = [
  {
    to: "/student",
    icon: "🎓",
    label: "Sinh viên",
    title: "TrustID AI Mobile",
    desc: "Xác thực danh tính, ví hồ sơ số, chia sẻ QR, đối sánh việc làm và học bổng.",
  },
  {
    to: "/university",
    icon: "🏛️",
    label: "Trường đại học",
    title: "Web Dashboard",
    desc: "Phát hành, quản lý và thu hồi Credential; thống kê xác minh và cảnh báo bất thường.",
  },
  {
    to: "/enterprise",
    icon: "🏢",
    label: "Doanh nghiệp",
    title: "Web Dashboard",
    desc: "Xác minh ứng viên trong vài giây, AI sàng lọc hồ sơ, phát hành chứng nhận thực tập.",
  },
] as const;

const layers = [
  { name: "API Gateway", desc: "Xác thực request, phân quyền, điều phối dịch vụ." },
  { name: "Identity Manager", desc: "Tài khoản, danh tính, phiên đăng nhập, quyền truy cập." },
  {
    name: "AI Core",
    desc: "OCR, Computer Vision, Face Matching/Liveness, Fraud Detection, AI Matching.",
  },
  {
    name: "Credential Layer",
    desc: "Tạo credential, ký số, tạo hash. Pending → Verified → Revoked.",
  },
  { name: "Blockchain Layer", desc: "Hash + trạng thái, smart contract Issue → Verify → Revoke." },
  { name: "Data Layer", desc: "PostgreSQL cho nghiệp vụ, object storage mã hoá cho tài liệu." },
];

function Landing() {
  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-card-gradient text-sm font-bold text-primary-foreground">
              T
            </span>
            <span className="font-display text-lg font-bold">TrustID AI</span>
          </div>
          <nav className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/university">Trường</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link to="/enterprise">Doanh nghiệp</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/student">Mở app sinh viên</Link>
            </Button>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
          <div className="text-primary-foreground">
            <span className="glass-panel inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-wide">
              AI · Verifiable Credentials · Blockchain
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight md:text-5xl">
              Xác thực một lần –<br />
              Tái sử dụng mọi nơi
            </h1>
            <p className="mt-5 max-w-xl text-base/7 opacity-90">
              Hồ sơ học tập và năng lực được xác thực. Chủ động chia sẻ. An toàn và minh bạch.
              TrustID AI là hạ tầng hồ sơ số kết nối trường đại học – sinh viên – doanh nghiệp trong
              toàn bộ vòng đời học tập và nghề nghiệp.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="secondary">
                <Link to="/student">Trải nghiệm app sinh viên</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-transparent text-primary-foreground hover:bg-white/10"
              >
                <Link to="/enterprise">Xem luồng xác minh</Link>
              </Button>
            </div>
            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-4">
              {[
                ["38.216", "Credential phát hành"],
                ["9.751", "Lượt xác minh / 30 ngày"],
                ["< 3s", "Thời gian xác minh QR"],
              ].map(([v, l]) => (
                <div key={l} className="glass-panel rounded-2xl p-4">
                  <dt className="font-display text-2xl font-bold">{v}</dt>
                  <dd className="mt-1 text-xs opacity-80">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="glass-panel rounded-3xl p-6 text-primary-foreground">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-80">
              Vòng đời hồ sơ
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              {[
                "Học tập",
                "Xác thực danh tính & tài liệu",
                "Hồ sơ số (Verifiable Credential)",
                "Học bổng / Du học",
                "Thực tập",
                "Việc làm",
                "Kinh nghiệm nghề nghiệp",
              ].map((s, i) => (
                <li key={s} className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-white/20 text-xs font-bold">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <SectionTitle
          eyebrow="Ba giao diện"
          title="Chọn vai trò để xem prototype"
          desc="Toàn bộ dữ liệu trong bản demo là dữ liệu mô phỏng phục vụ trình diễn luồng sản phẩm."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {roles.map((r) => (
            <Link
              key={r.to}
              to={r.to}
              className="group rounded-3xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:border-accent/60 hover:shadow-lift"
            >
              <span className="text-3xl">{r.icon}</span>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-accent">
                {r.label}
              </p>
              <h3 className="mt-1 text-lg font-bold">{r.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{r.desc}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                Mở giao diện
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="mx-auto max-w-6xl px-5">
          <SectionTitle
            eyebrow="Quy trình 8 bước"
            title="Từ định danh đến xác minh"
            desc="AI xác thực, Credential Layer chuẩn hoá, Blockchain ghi nhận hash và trạng thái."
          />
          <ol className="grid gap-4 md:grid-cols-4">
            {pipeline.map((p) => (
              <li key={p.step} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                  {p.step}
                </span>
                <h3 className="mt-3 text-sm font-bold">{p.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{p.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <SectionTitle eyebrow="Kiến trúc" title="Hệ thống xử lý phía sau" />
        <div className="grid gap-4 md:grid-cols-3">
          {layers.map((l) => (
            <div key={l.name} className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-sm font-bold text-primary">{l.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{l.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 rounded-2xl border border-accent/30 bg-accent/10 p-5 text-sm text-foreground">
          Blockchain không lưu dữ liệu cá nhân. Chỉ hash, trạng thái và thông tin cần thiết để kiểm
          chứng được ghi nhận — bảo đảm tính toàn vẹn và khả năng kiểm tra trạng thái suốt vòng đời
          credential.
        </p>
      </section>

      <footer className="border-t border-border py-10">
        <div className="mx-auto max-w-6xl px-5 text-sm text-muted-foreground">
          TrustID AI — Một danh tính · Một hồ sơ số · Nhiều mục đích sử dụng.
        </div>
      </footer>
    </main>
  );
}
