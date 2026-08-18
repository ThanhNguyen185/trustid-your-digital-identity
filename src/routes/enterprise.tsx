import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { QrArt, ScoreRing, SectionTitle, StatusPill } from "@/components/trustid/ui-bits";
import {
  candidates,
  credentials,
  student,
  verificationChecks,
} from "@/lib/trustid-data";

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

const TABS = [
  "Dashboard",
  "Xác minh ứng viên",
  "Quản lý ứng viên",
  "Đối sánh việc làm",
  "Quản lý Credential",
  "Phát hành chứng nhận thực tập",
  "Lịch sử xác minh",
  "API tích hợp",
] as const;

type Tab = (typeof TABS)[number];

const stats = [
  { label: "Ứng viên đang theo dõi", value: "348", note: "+26 trong tháng" },
  { label: "Credential đã xác minh", value: "1.284", note: "+112 trong tháng" },
  { label: "Tỷ lệ xác minh hợp lệ", value: "96,4%", note: "46 hồ sơ bị từ chối" },
  { label: "Thời gian xác minh TB", value: "3,2 giây", note: "Quét QR → kết quả" },
  { label: "Chứng nhận thực tập đã cấp", value: "87", note: "Năm 2026" },
  { label: "Lượt gọi API", value: "24.910", note: "30 ngày gần nhất" },
];

const applicants = [
  { name: "Nguyễn Văn A", role: "Data Analyst", school: "Đại học X", state: "Đã xác minh", stage: "Phỏng vấn vòng 2" },
  { name: "Trần Thị B", role: "Data Analyst", school: "Đại học Y", state: "Đã xác minh", stage: "Sàng lọc hồ sơ" },
  { name: "Lê Minh C", role: "Business Analyst", school: "Đại học X", state: "Chờ xác minh", stage: "Mới ứng tuyển" },
  { name: "Phạm Quốc D", role: "Finance Intern", school: "Đại học Z", state: "Không hợp lệ", stage: "Dừng hồ sơ" },
  { name: "Vũ Hà E", role: "Data Analyst", school: "Đại học Y", state: "Đã xác minh", stage: "Đề nghị nhận việc" },
];

const verifyHistory = [
  { id: "VC-2026-000184", name: "Nguyễn Văn A", at: "18/08/2026 09:12", by: "hr.linh@abc.vn", result: "Hợp lệ" },
  { id: "VC-2026-000185", name: "Nguyễn Văn A", at: "18/08/2026 09:12", by: "hr.linh@abc.vn", result: "Hợp lệ" },
  { id: "VC-2026-000201", name: "Trần Thị B", at: "17/08/2026 16:40", by: "hr.nam@abc.vn", result: "Hợp lệ" },
  { id: "VC-2025-008812", name: "Phạm Quốc D", at: "16/08/2026 11:05", by: "hr.nam@abc.vn", result: "Đã thu hồi" },
  { id: "VC-2025-004417", name: "Vũ Hà E", at: "15/08/2026 08:22", by: "api-key-prod", result: "Hợp lệ" },
];

const stateTone: Record<string, string> = {
  "Đã xác minh": "bg-success/12 text-success",
  "Chờ xác minh": "bg-warning/18 text-warning-foreground",
  "Không hợp lệ": "bg-destructive/10 text-destructive",
  "Hợp lệ": "bg-success/12 text-success",
  "Đã thu hồi": "bg-destructive/10 text-destructive",
};

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-border bg-card p-6 shadow-soft ${className}`}>{children}</div>
  );
}

function Tag({ value }: { value: string }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${stateTone[value] ?? "bg-muted text-muted-foreground"}`}>
      {value}
    </span>
  );
}

function EnterpriseDashboard() {
  const [active, setActive] = useState<Tab>("Dashboard");

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
          {TABS.map((n) => (
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

      <main className="min-w-0 flex-1 px-5 py-8 lg:px-10">
        <div className="mb-6">
          <Link to="/" className="text-sm font-semibold text-primary hover:underline lg:hidden">
            ← TrustID AI
          </Link>
          <h1 className="text-2xl font-bold">{active}</h1>
          <p className="text-sm text-muted-foreground">Công ty ABC · Verifier Portal</p>
        </div>

        <div className="mb-8 flex gap-2 overflow-x-auto pb-2 lg:hidden">
          {TABS.map((n) => (
            <button
              key={n}
              onClick={() => setActive(n)}
              className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium ${
                active === n ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        {active === "Dashboard" ? <Overview onGo={setActive} /> : null}
        {active === "Xác minh ứng viên" ? <VerifyTab /> : null}
        {active === "Quản lý ứng viên" ? <ApplicantsTab /> : null}
        {active === "Đối sánh việc làm" ? <MatchTab /> : null}
        {active === "Quản lý Credential" ? <CredentialTab /> : null}
        {active === "Phát hành chứng nhận thực tập" ? <InternshipTab /> : null}
        {active === "Lịch sử xác minh" ? <HistoryTab /> : null}
        {active === "API tích hợp" ? <ApiTab /> : null}
      </main>
    </div>
  );
}

function Overview({ onGo }: { onGo: (t: Tab) => void }) {
  return (
    <>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
            <p className="mt-1 font-display text-3xl font-bold">{s.value}</p>
            <p className="mt-1 text-xs text-accent">{s.note}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <Card>
          <SectionTitle title="Hoạt động xác minh gần đây" desc="5 lượt xác minh mới nhất của tài khoản doanh nghiệp." />
          <ul className="divide-y divide-border">
            {verifyHistory.map((h) => (
              <li key={h.id + h.at} className="flex items-center justify-between gap-3 py-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{h.name}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">{h.id} · {h.at}</p>
                </div>
                <Tag value={h.result} />
              </li>
            ))}
          </ul>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => onGo("Lịch sử xác minh")}>
            Xem toàn bộ lịch sử
          </Button>
        </Card>

        <Card>
          <h2 className="text-lg font-bold">Thao tác nhanh</h2>
          <div className="mt-4 grid gap-2">
            {(["Xác minh ứng viên", "Đối sánh việc làm", "Phát hành chứng nhận thực tập", "API tích hợp"] as Tab[]).map(
              (t) => (
                <button
                  key={t}
                  onClick={() => onGo(t)}
                  className="rounded-xl border border-border px-4 py-3 text-left text-sm font-medium transition-colors hover:border-primary/60 hover:bg-primary/5"
                >
                  {t}
                </button>
              ),
            )}
          </div>
          <p className="mt-5 rounded-xl bg-muted/60 p-3 text-xs text-muted-foreground">
            Doanh nghiệp chỉ xem được phạm vi dữ liệu do ứng viên cấp quyền, mặc định hiệu lực 30 ngày.
          </p>
        </Card>
      </section>
    </>
  );
}

function VerifyTab() {
  const [scanned, setScanned] = useState(false);
  return (
    <section className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
      <Card>
        <SectionTitle title="Xác minh ứng viên" desc="Quét QR, nhập mã Credential hoặc mở liên kết xác minh." />
        <QrArt className="mx-auto max-w-[220px] border border-border" />
        <div className="mt-5 flex gap-2">
          <Input placeholder="Nhập mã Credential (VC-2026-000184)" />
          <Button onClick={() => setScanned(true)}>Xác minh</Button>
        </div>
        <Button variant="outline" className="mt-2 w-full" onClick={() => setScanned(true)}>
          Quét mã QR của ứng viên
        </Button>
      </Card>

      <Card>
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
              Hash đối chiếu trên blockchain khớp với credential được chia sẻ. Phạm vi chia sẻ do ứng
              viên cấp quyền, hiệu lực 30 ngày.
            </p>
          </>
        ) : (
          <p className="mt-6 rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            Chưa có kết quả. Quét QR hoặc nhập mã credential để xác minh.
          </p>
        )}
      </Card>
    </section>
  );
}

function ApplicantsTab() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("Tất cả");
  const rows = useMemo(
    () =>
      applicants.filter(
        (a) =>
          (filter === "Tất cả" || a.state === filter) &&
          (a.name.toLowerCase().includes(q.toLowerCase()) || a.role.toLowerCase().includes(q.toLowerCase())),
      ),
    [q, filter],
  );

  return (
    <Card>
      <SectionTitle title="Quản lý ứng viên" desc="Tìm kiếm, lọc theo trạng thái xác minh và theo dõi tiến trình tuyển dụng." />
      <div className="flex flex-wrap gap-2">
        <Input
          className="max-w-xs"
          placeholder="Tìm theo tên hoặc vị trí…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        {["Tất cả", "Đã xác minh", "Chờ xác minh", "Không hợp lệ"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === f ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/60"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="pb-2 pr-3 font-medium">Ứng viên</th>
              <th className="pb-2 pr-3 font-medium">Vị trí</th>
              <th className="pb-2 pr-3 font-medium">Trường</th>
              <th className="pb-2 pr-3 font-medium">Trạng thái</th>
              <th className="pb-2 font-medium">Tiến trình</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.name} className="border-b border-border/60 last:border-0">
                <td className="py-3 pr-3 font-semibold">{a.name}</td>
                <td className="py-3 pr-3 text-muted-foreground">{a.role}</td>
                <td className="py-3 pr-3 text-muted-foreground">{a.school}</td>
                <td className="py-3 pr-3"><Tag value={a.state} /></td>
                <td className="py-3 text-muted-foreground">{a.stage}</td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                  Không tìm thấy ứng viên phù hợp.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function MatchTab() {
  const [analyzed, setAnalyzed] = useState(false);
  return (
    <section className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
      <Card>
        <SectionTitle
          title="AI hỗ trợ tuyển dụng"
          desc="Nhập Job Description, AI đối chiếu với các hồ sơ đã được xác thực."
        />
        <Textarea
          rows={4}
          defaultValue="Tuyển Chuyên viên phân tích dữ liệu: tốt nghiệp Tài chính/Kinh tế, thành thạo Excel & SQL, ưu tiên có Power BI và tiếng Anh IELTS 7.0+."
        />
        <Button className="mt-3" onClick={() => setAnalyzed(true)}>
          Phân tích &amp; xếp hạng ứng viên
        </Button>

        {analyzed ? (
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
        ) : (
          <p className="mt-5 rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            Nhấn “Phân tích” để AI xếp hạng ứng viên theo JD.
          </p>
        )}
      </Card>

      <Card>
        <h2 className="text-lg font-bold">Tiêu chí đối sánh</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {[
            ["Bằng cấp & ngành học", "40%"],
            ["Kỹ năng chuyên môn", "30%"],
            ["Chứng chỉ & ngoại ngữ", "20%"],
            ["Kinh nghiệm thực tập", "10%"],
          ].map(([k, v]) => (
            <li key={k} className="flex items-center justify-between border-b border-border/60 pb-2">
              <span className="text-muted-foreground">{k}</span>
              <span className="font-semibold">{v}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 rounded-xl bg-accent/10 p-3 text-xs text-foreground">
          AI chỉ hỗ trợ sàng lọc và cung cấp thông tin, không tự động ra quyết định tuyển dụng cuối cùng.
        </p>
      </Card>
    </section>
  );
}

function CredentialTab() {
  const [q, setQ] = useState("");
  const rows = credentials.filter(
    (c) => c.title.toLowerCase().includes(q.toLowerCase()) || c.id.toLowerCase().includes(q.toLowerCase()),
  );
  const [openId, setOpenId] = useState<string | null>(null);
  const open = rows.find((r) => r.id === openId) ?? null;

  return (
    <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
      <Card>
        <SectionTitle title="Quản lý Credential" desc="Tra cứu credential ứng viên đã chia sẻ và kiểm tra trạng thái hiệu lực." />
        <Input
          className="max-w-xs"
          placeholder="Tìm theo mã hoặc tên credential…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[620px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-2 pr-3 font-medium">Mã</th>
                <th className="pb-2 pr-3 font-medium">Credential</th>
                <th className="pb-2 pr-3 font-medium">Đơn vị cấp</th>
                <th className="pb-2 pr-3 font-medium">Trạng thái</th>
                <th className="pb-2 font-medium" />
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} className="border-b border-border/60 last:border-0">
                  <td className="py-3 pr-3 font-mono text-xs">{c.id}</td>
                  <td className="py-3 pr-3">{c.icon} {c.title}</td>
                  <td className="py-3 pr-3 text-muted-foreground">{c.issuer}</td>
                  <td className="py-3 pr-3"><StatusPill status={c.status} /></td>
                  <td className="py-3">
                    <Button size="sm" variant="outline" onClick={() => setOpenId(c.id)}>
                      Chi tiết
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-bold">Chi tiết credential</h2>
        {open ? (
          <div className="mt-4 space-y-3 text-sm">
            <p className="font-display text-lg font-bold">{open.icon} {open.title}</p>
            <p className="text-xs text-muted-foreground">
              {open.issuer} · Cấp ngày {open.issuedAt}
            </p>
            <StatusPill status={open.status} />
            <div className="space-y-2 pt-2">
              {Object.entries(open.detail).map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-semibold">{v}</span>
                </div>
              ))}
            </div>
            <p className="break-all rounded-xl bg-muted/60 p-3 font-mono text-[11px] text-muted-foreground">
              hash: {open.hash}
            </p>
          </div>
        ) : (
          <p className="mt-6 rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            Chọn một credential để xem chi tiết và hash blockchain.
          </p>
        )}
      </Card>
    </section>
  );
}

function InternshipTab() {
  const [issued, setIssued] = useState(false);
  return (
    <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
      <Card>
        <SectionTitle
          title="Phát hành chứng nhận thực tập"
          desc="Verified Internship Credential được thêm trực tiếp vào hồ sơ số của sinh viên."
        />
        <div className="grid gap-3">
          <Input defaultValue="Nguyễn Văn A" placeholder="Sinh viên" />
          <Input defaultValue="Data Analyst Intern" placeholder="Vị trí thực tập" />
          <Input defaultValue="Khối Phân tích" placeholder="Bộ phận" />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input defaultValue="01/06/2026" placeholder="Từ ngày" />
            <Input defaultValue="31/08/2026" placeholder="Đến ngày" />
          </div>
          <Textarea rows={3} defaultValue="Hoàn thành tốt: xây dựng báo cáo doanh thu tự động, hỗ trợ làm sạch dữ liệu khách hàng." />
        </div>
        <Button className="mt-5 w-full" onClick={() => setIssued(true)}>
          Ký số &amp; phát hành Credential
        </Button>
      </Card>

      <Card>
        <h2 className="text-lg font-bold">Tiến trình phát hành</h2>
        {issued ? (
          <ol className="mt-4 space-y-2 text-xs">
            {[
              "Xác nhận thông tin thực tập",
              "Tạo Verifiable Credential",
              "Ký số bằng khoá doanh nghiệp",
              "Tạo dấu vân tay số (Hash)",
              "Blockchain ghi nhận Hash + Status",
            ].map((s) => (
              <li key={s} className="flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2 text-success">
                ✓ {s}
              </li>
            ))}
            <li className="pt-1 font-mono text-[11px] text-muted-foreground">
              tx: 0x51cc…f8a1 · Status: Verified
            </li>
            <li className="pt-2 text-xs font-semibold text-success">
              ✓ Credential đã vào ví của {student.name}
            </li>
          </ol>
        ) : (
          <p className="mt-6 rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            Điền thông tin và nhấn phát hành để xem tiến trình ký số.
          </p>
        )}
      </Card>
    </section>
  );
}

function HistoryTab() {
  const [filter, setFilter] = useState("Tất cả");
  const rows = verifyHistory.filter((h) => filter === "Tất cả" || h.result === filter);
  return (
    <Card>
      <SectionTitle title="Lịch sử xác minh" desc="Toàn bộ lượt xác minh của tài khoản doanh nghiệp, gồm cả gọi qua API." />
      <div className="flex flex-wrap gap-2">
        {["Tất cả", "Hợp lệ", "Đã thu hồi"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === f ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/60"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[620px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="pb-2 pr-3 font-medium">Thời gian</th>
              <th className="pb-2 pr-3 font-medium">Credential</th>
              <th className="pb-2 pr-3 font-medium">Ứng viên</th>
              <th className="pb-2 pr-3 font-medium">Người xác minh</th>
              <th className="pb-2 font-medium">Kết quả</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((h) => (
              <tr key={h.id + h.at} className="border-b border-border/60 last:border-0">
                <td className="py-3 pr-3 text-muted-foreground">{h.at}</td>
                <td className="py-3 pr-3 font-mono text-xs">{h.id}</td>
                <td className="py-3 pr-3">{h.name}</td>
                <td className="py-3 pr-3 text-muted-foreground">{h.by}</td>
                <td className="py-3"><Tag value={h.result} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function ApiTab() {
  const [revealed, setRevealed] = useState(false);
  return (
    <section className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
      <Card>
        <SectionTitle title="API tích hợp" desc="Kết nối TrustID AI với hệ thống ATS / HRM của doanh nghiệp." />
        <div className="space-y-4 text-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">API Key (Production)</p>
            <div className="mt-2 flex gap-2">
              <code className="flex-1 truncate rounded-xl bg-muted/60 px-3 py-2 font-mono text-xs">
                {revealed ? "trustid_live_sk_9f21c8ab4d7e0356" : "trustid_live_sk_••••••••••••••••"}
              </code>
              <Button size="sm" variant="outline" onClick={() => setRevealed((v) => !v)}>
                {revealed ? "Ẩn" : "Hiện"}
              </Button>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Endpoint</p>
            <ul className="mt-2 space-y-2 font-mono text-xs">
              <li className="rounded-xl bg-muted/60 px-3 py-2">GET /v1/credentials/:id</li>
              <li className="rounded-xl bg-muted/60 px-3 py-2">POST /v1/verify</li>
              <li className="rounded-xl bg-muted/60 px-3 py-2">POST /v1/internship-credentials</li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Webhook</p>
            <Input className="mt-2" defaultValue="https://ats.abc.vn/hooks/trustid" />
            <Button size="sm" className="mt-2">Lưu webhook</Button>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-bold">Trạng thái kết nối</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {[
            ["API Gateway", "Hoạt động"],
            ["Blockchain Node", "Hoạt động"],
            ["Webhook ATS", "Hoạt động"],
            ["Sandbox Key", "Chưa cấu hình"],
          ].map(([k, v]) => (
            <li key={k} className="flex items-center justify-between border-b border-border/60 pb-2">
              <span className="text-muted-foreground">{k}</span>
              <span className={`font-semibold ${v === "Hoạt động" ? "text-success" : "text-warning-foreground"}`}>
                {v === "Hoạt động" ? "● " : "○ "}
                {v}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-5 rounded-xl bg-muted/60 p-3 text-xs text-muted-foreground">
          Giới hạn 1.000 request/phút. Mọi lượt gọi đều được ghi vào Lịch sử xác minh.
        </p>
      </Card>
    </section>
  );
}
