import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionTitle, StatusPill } from "@/components/trustid/ui-bits";
import { universityCredentials, universityStats } from "@/lib/trustid-data";

export const Route = createFileRoute("/university")({
  head: () => ({
    meta: [
      { title: "Dashboard trường đại học – Phát hành Credential | TrustID AI" },
      {
        name: "description",
        content:
          "Web Dashboard TrustID AI cho trường đại học: phát hành, quản lý và thu hồi Verifiable Credential, thống kê xác minh, quản lý quyền và API tích hợp.",
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

const TABS = [
  "Dashboard",
  "Quản lý sinh viên",
  "Phát hành Credential",
  "Quản lý Credential",
  "Thu hồi Credential",
  "Thống kê xác minh",
  "Quản lý quyền",
  "API tích hợp",
] as const;

type Tab = (typeof TABS)[number];
type CredStatus = "pending" | "verified" | "revoked";
type CredRow = {
  id: string;
  student: string;
  type: string;
  date: string;
  status: CredStatus;
  reason?: string;
};

const students = [
  { code: "SV21001", name: "Nguyễn Văn A", major: "Khoa học dữ liệu", course: "K21", identity: "Đã định danh", creds: 4 },
  { code: "SV21042", name: "Trần Thị B", major: "Hệ thống thông tin", course: "K21", identity: "Đã định danh", creds: 3 },
  { code: "SV22118", name: "Lê Minh C", major: "Kinh tế", course: "K22", identity: "Chờ định danh", creds: 1 },
  { code: "SV20077", name: "Phạm Quốc D", major: "Tài chính", course: "K20", identity: "Đã định danh", creds: 2 },
  { code: "SV22203", name: "Vũ Hà E", major: "Khoa học dữ liệu", course: "K22", identity: "Chưa định danh", creds: 0 },
];

const issueByMonth = [
  { m: "T3", v: 820 },
  { m: "T4", v: 1140 },
  { m: "T5", v: 960 },
  { m: "T6", v: 1810 },
  { m: "T7", v: 1320 },
  { m: "T8", v: 1204 },
];

const recentActivity = [
  { at: "18/08 09:12", text: "Phát hành 42 bằng tốt nghiệp cho khoa Khoa học dữ liệu" },
  { at: "17/08 15:04", text: "Thu hồi credential VC-2025-008812 (sai bảng điểm)" },
  { at: "17/08 10:31", text: "AI cảnh báo 2 hồ sơ nghi chỉnh sửa ảnh scan" },
  { at: "16/08 08:20", text: "Công ty ABC xác minh 18 credential qua API" },
];

const verifiers = [
  { org: "Công ty ABC", count: 2140, rate: 97 },
  { org: "Ngân hàng XYZ", count: 1385, rate: 95 },
  { org: "Quỹ học bổng A", count: 764, rate: 99 },
  { org: "Đại học Quốc tế B", count: 512, rate: 96 },
];

const weekly = [
  { w: "Tuần 1", v: 1820 },
  { w: "Tuần 2", v: 2310 },
  { w: "Tuần 3", v: 2645 },
  { w: "Tuần 4", v: 2976 },
];

const staff = [
  { name: "Nguyễn Thu Hà", email: "ha.nt@dhx.edu.vn", unit: "Phòng đào tạo", role: "Admin" },
  { name: "Đỗ Văn Kiên", email: "kien.dv@dhx.edu.vn", unit: "Khoa KHDL", role: "Issuer" },
  { name: "Lý Mai Anh", email: "anh.lm@dhx.edu.vn", unit: "Khoa Kinh tế", role: "Issuer" },
  { name: "Trịnh Bảo", email: "bao.t@dhx.edu.vn", unit: "Phòng CTSV", role: "Viewer" },
];

const ROLE_PERMS: Record<string, string[]> = {
  Admin: ["Xem", "Phát hành", "Thu hồi", "API"],
  Issuer: ["Xem", "Phát hành"],
  Viewer: ["Xem"],
};
const ALL_PERMS = ["Xem", "Phát hành", "Thu hồi", "API"];

const endpoints = [
  { method: "POST", path: "/v1/credentials/issue", desc: "Phát hành credential mới" },
  { method: "POST", path: "/v1/credentials/{id}/revoke", desc: "Thu hồi credential" },
  { method: "GET", path: "/v1/credentials/{id}", desc: "Tra cứu trạng thái credential" },
  { method: "GET", path: "/v1/students/{code}/credentials", desc: "Danh sách credential của sinh viên" },
];

const apiLogs = [
  { at: "18/08 09:12", ep: "POST /v1/credentials/issue", code: 201, ms: 412 },
  { at: "18/08 08:57", ep: "GET /v1/credentials/VC-2026-000184", code: 200, ms: 88 },
  { at: "17/08 16:41", ep: "POST /v1/credentials/VC-2025-008812/revoke", code: 200, ms: 355 },
  { at: "17/08 14:02", ep: "GET /v1/students/SV21042/credentials", code: 200, ms: 121 },
  { at: "17/08 11:19", ep: "POST /v1/credentials/issue", code: 422, ms: 96 },
];

const identityTone: Record<string, string> = {
  "Đã định danh": "bg-success/12 text-success",
  "Chờ định danh": "bg-warning/18 text-warning-foreground",
  "Chưa định danh": "bg-muted text-muted-foreground",
};

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-border bg-card p-6 shadow-soft ${className}`}>{children}</div>;
}

function Tag({ value }: { value: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
        identityTone[value] ?? "bg-muted text-muted-foreground"
      }`}
    >
      {value}
    </span>
  );
}

function fakeHash(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return `0x${h.toString(16).padStart(8, "0").repeat(5).slice(0, 40)}`;
}

/* ---------------- Tab 1: Dashboard ---------------- */
function Overview({ rows, onGo }: { rows: CredRow[]; onGo: (t: Tab) => void }) {
  const max = Math.max(...issueByMonth.map((x) => x.v));
  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {universityStats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
            <p className="mt-1 font-display text-3xl font-bold">{s.value}</p>
            <p className="mt-1 text-xs text-accent">{s.note}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <SectionTitle title="Credential phát hành theo tháng" desc="6 tháng gần nhất." />
          <div className="flex h-44 items-end gap-3">
            {issueByMonth.map((b) => (
              <div key={b.m} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-lg bg-card-gradient"
                  style={{ height: `${(b.v / max) * 100}%` }}
                  aria-label={`${b.m}: ${b.v}`}
                />
                <span className="text-[11px] text-muted-foreground">{b.m}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle title="Hoạt động gần đây" desc="Nhật ký hệ thống issuer." />
          <ul className="space-y-3 text-sm">
            {recentActivity.map((a) => (
              <li key={a.at} className="flex gap-3">
                <span className="w-20 shrink-0 text-xs text-muted-foreground">{a.at}</span>
                <span>{a.text}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <SectionTitle title="Lối tắt" desc="Đi nhanh tới nghiệp vụ thường dùng." />
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => onGo("Phát hành Credential")}>+ Phát hành Credential</Button>
          <Button variant="outline" onClick={() => onGo("Quản lý Credential")}>
            Duyệt {rows.filter((r) => r.status === "pending").length} hồ sơ chờ
          </Button>
          <Button variant="outline" onClick={() => onGo("Thu hồi Credential")}>
            Thu hồi credential
          </Button>
          <Button variant="outline" onClick={() => onGo("Thống kê xác minh")}>
            Xem thống kê xác minh
          </Button>
        </div>
      </Card>
    </div>
  );
}

/* ---------------- Tab 2: Quản lý sinh viên ---------------- */
function StudentsTab() {
  const [q, setQ] = useState("");
  const [major, setMajor] = useState("Tất cả");
  const [selected, setSelected] = useState(students[0]!.code);

  const majors = ["Tất cả", ...Array.from(new Set(students.map((s) => s.major)))];
  const list = useMemo(
    () =>
      students.filter(
        (s) =>
          (major === "Tất cả" || s.major === major) &&
          (s.name.toLowerCase().includes(q.toLowerCase()) || s.code.toLowerCase().includes(q.toLowerCase())),
      ),
    [q, major],
  );
  const current = students.find((s) => s.code === selected)!;

  return (
    <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
      <Card>
        <SectionTitle title="Danh sách sinh viên" desc="Tìm theo tên hoặc mã sinh viên, lọc theo ngành." />
        <div className="mb-4 flex flex-wrap gap-2">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm sinh viên…" className="max-w-xs" />
          {majors.map((m) => (
            <button
              key={m}
              onClick={() => setMajor(m)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                major === m ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-2 pr-3 font-medium">Mã SV</th>
                <th className="pb-2 pr-3 font-medium">Họ tên</th>
                <th className="pb-2 pr-3 font-medium">Ngành</th>
                <th className="pb-2 pr-3 font-medium">Khóa</th>
                <th className="pb-2 font-medium">Định danh</th>
              </tr>
            </thead>
            <tbody>
              {list.map((s) => (
                <tr
                  key={s.code}
                  onClick={() => setSelected(s.code)}
                  className={`cursor-pointer border-b border-border/60 last:border-0 ${
                    selected === s.code ? "bg-muted/50" : "hover:bg-muted/30"
                  }`}
                >
                  <td className="py-3 pr-3 font-mono text-xs">{s.code}</td>
                  <td className="py-3 pr-3 font-medium">{s.name}</td>
                  <td className="py-3 pr-3 text-muted-foreground">{s.major}</td>
                  <td className="py-3 pr-3 text-muted-foreground">{s.course}</td>
                  <td className="py-3">
                    <Tag value={s.identity} />
                  </td>
                </tr>
              ))}
              {list.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-muted-foreground">
                    Không tìm thấy sinh viên phù hợp.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <SectionTitle title="Hồ sơ sinh viên" desc="Thông tin định danh và credential." />
        <p className="font-display text-xl font-bold">{current.name}</p>
        <p className="text-sm text-muted-foreground">
          {current.code} · {current.major} · {current.course}
        </p>
        <div className="mt-4 space-y-2 text-sm">
          {[
            ["DID", `did:trustid:${current.code.toLowerCase()}`],
            ["Trạng thái định danh", current.identity],
            ["Số credential", String(current.creds)],
            ["Email", `${current.code.toLowerCase()}@sv.dhx.edu.vn`],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-3 border-b border-border/60 pb-2 last:border-0">
              <span className="text-muted-foreground">{k}</span>
              <span className="text-right font-medium">{v}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ---------------- Tab 3: Phát hành Credential ---------------- */
const CRED_TYPES = ["Bằng tốt nghiệp", "Bảng điểm", "Chứng chỉ", "Giấy xác nhận sinh viên", "Thành tích", "Chứng nhận thực tập"];
const ISSUE_STEPS = [
  "Kiểm tra dữ liệu sinh viên trong hệ thống đào tạo",
  "Ký số bằng khóa riêng của trường (Issuer DID)",
  "Băm dữ liệu credential (SHA-256)",
  "Ghi hash và trạng thái lên blockchain",
  "Đẩy credential vào ví sinh viên",
];

function IssueTab({ onIssued }: { onIssued: (row: CredRow) => void }) {
  const [studentCode, setStudentCode] = useState(students[0]!.code);
  const [type, setType] = useState(CRED_TYPES[0]!);
  const [title, setTitle] = useState("Cử nhân Khoa học dữ liệu");
  const [date, setDate] = useState("2026-06-12");
  const [note, setNote] = useState("");
  const [result, setResult] = useState<{ id: string; hash: string } | null>(null);

  const submit = () => {
    const student = students.find((s) => s.code === studentCode)!;
    const id = `VC-2026-${String(Math.floor(100000 + Math.random() * 899999)).slice(0, 6)}`;
    onIssued({
      id,
      student: student.name,
      type,
      date: date.split("-").reverse().join("/"),
      status: "verified",
    });
    setResult({ id, hash: fakeHash(id + title) });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
      <Card>
        <SectionTitle title="Tạo Credential mới" desc="Điền thông tin và phát hành cho sinh viên." />
        <div className="space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Sinh viên</span>
            <select
              value={studentCode}
              onChange={(e) => setStudentCode(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              {students.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.code} · {s.name}
                </option>
              ))}
            </select>
          </label>

          <div>
            <span className="mb-2 block text-sm font-medium">Loại credential</span>
            <div className="flex flex-wrap gap-2">
              {CRED_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    type === t ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/60"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <label className="block text-sm">
            <span className="mb-1 block font-medium">Tiêu đề</span>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Ngày cấp</span>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Ghi chú</span>
            <Textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Xếp loại, số hiệu văn bằng…" />
          </label>

          <Button onClick={submit}>Ký số &amp; phát hành</Button>
        </div>
      </Card>

      <Card>
        <SectionTitle title="Tiến trình phát hành" desc="Mô phỏng ký số và ghi blockchain." />
        <ol className="space-y-2 text-xs">
          {ISSUE_STEPS.map((s, i) => (
            <li
              key={s}
              className={`flex gap-2 rounded-lg px-3 py-2 ${result ? "bg-success/10 text-success" : "bg-muted/50 text-muted-foreground"}`}
            >
              <span className="font-semibold">{i + 1}.</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
        {result ? (
          <div className="mt-4 space-y-1 rounded-xl border border-success/30 bg-success/8 p-4 text-xs">
            <p className="font-semibold text-success">Đã phát hành thành công</p>
            <p className="font-mono">{result.id}</p>
            <p className="break-all font-mono text-muted-foreground">{result.hash}</p>
          </div>
        ) : (
          <p className="mt-4 rounded-xl bg-muted/60 p-3 text-xs text-muted-foreground">
            Blockchain chỉ lưu hash và trạng thái, không lưu dữ liệu cá nhân của sinh viên.
          </p>
        )}
      </Card>
    </div>
  );
}

/* ---------------- Tab 4: Quản lý Credential ---------------- */
const STATUS_FILTERS = ["Tất cả", "pending", "verified", "revoked"] as const;

function ManageTab({ rows, onApprove }: { rows: CredRow[]; onApprove: (id: string) => void }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<(typeof STATUS_FILTERS)[number]>("Tất cả");
  const [openId, setOpenId] = useState<string | null>(null);

  const list = rows.filter(
    (r) =>
      (status === "Tất cả" || r.status === status) &&
      (r.id.toLowerCase().includes(q.toLowerCase()) || r.student.toLowerCase().includes(q.toLowerCase())),
  );
  const open = rows.find((r) => r.id === openId) ?? null;

  return (
    <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
      <Card>
        <SectionTitle title="Tra cứu Credential" desc="Vòng đời: Pending → Verified → Revoked." />
        <div className="mb-4 flex flex-wrap gap-2">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Mã credential hoặc tên sinh viên…" className="max-w-xs" />
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                status === s ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
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
              {list.map((r) => (
                <tr key={r.id} className="border-b border-border/60 last:border-0">
                  <td className="py-3 pr-3 font-mono text-xs">{r.id}</td>
                  <td className="py-3 pr-3">{r.student}</td>
                  <td className="py-3 pr-3 text-muted-foreground">{r.type}</td>
                  <td className="py-3 pr-3">
                    <StatusPill status={r.status} />
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      {r.status === "pending" ? (
                        <Button size="sm" variant="secondary" onClick={() => onApprove(r.id)}>
                          Duyệt phát hành
                        </Button>
                      ) : null}
                      <Button size="sm" variant="outline" onClick={() => setOpenId(r.id)}>
                        Chi tiết
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {list.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-muted-foreground">
                    Không có credential phù hợp.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <SectionTitle title="Chi tiết Credential" desc="Thông tin ký số và blockchain." />
        {open ? (
          <div className="space-y-2 text-sm">
            {[
              ["Mã", open.id],
              ["Sinh viên", open.student],
              ["Loại", open.type],
              ["Ngày cấp", open.date],
              ["Issuer", "did:trustid:dhx"],
              ["Trạng thái", open.status],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3 border-b border-border/60 pb-2 last:border-0">
                <span className="text-muted-foreground">{k}</span>
                <span className="text-right font-medium">{v}</span>
              </div>
            ))}
            <p className="break-all pt-2 font-mono text-xs text-muted-foreground">{fakeHash(open.id)}</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Chọn một credential để xem chi tiết hash và issuer.</p>
        )}
      </Card>
    </div>
  );
}

/* ---------------- Tab 5: Thu hồi Credential ---------------- */
function RevokeTab({ rows, onRevoke }: { rows: CredRow[]; onRevoke: (id: string, reason: string) => void }) {
  const active = rows.filter((r) => r.status === "verified");
  const revoked = rows.filter((r) => r.status === "revoked");
  const [target, setTarget] = useState<string>("");
  const [reason, setReason] = useState("");
  const [confirming, setConfirming] = useState(false);

  const submit = () => {
    if (!target || !reason.trim()) return;
    onRevoke(target, reason.trim());
    setTarget("");
    setReason("");
    setConfirming(false);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
      <Card>
        <SectionTitle title="Thu hồi Credential" desc="Chọn credential đang hiệu lực và nêu lý do." />
        <label className="mb-4 block text-sm">
          <span className="mb-1 block font-medium">Credential</span>
          <select
            value={target}
            onChange={(e) => {
              setTarget(e.target.value);
              setConfirming(false);
            }}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">— Chọn credential —</option>
            {active.map((r) => (
              <option key={r.id} value={r.id}>
                {r.id} · {r.student} · {r.type}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Lý do thu hồi</span>
          <Textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Sai dữ liệu bảng điểm, phát hành nhầm…" />
        </label>

        {confirming ? (
          <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/8 p-4 text-sm">
            <p className="font-semibold text-destructive">Xác nhận thu hồi {target}?</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Trạng thái trên blockchain chuyển sang Revoked. Doanh nghiệp quét QR sau đó sẽ thấy credential không còn hiệu lực.
            </p>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="destructive" onClick={submit}>
                Xác nhận thu hồi
              </Button>
              <Button size="sm" variant="outline" onClick={() => setConfirming(false)}>
                Hủy
              </Button>
            </div>
          </div>
        ) : (
          <Button className="mt-4" variant="destructive" disabled={!target || !reason.trim()} onClick={() => setConfirming(true)}>
            Thu hồi credential
          </Button>
        )}
      </Card>

      <Card>
        <SectionTitle title="Đã thu hồi" desc="Lịch sử thu hồi và lý do." />
        {revoked.length === 0 ? (
          <p className="text-sm text-muted-foreground">Chưa có credential nào bị thu hồi.</p>
        ) : (
          <ul className="space-y-3 text-sm">
            {revoked.map((r) => (
              <li key={r.id} className="rounded-xl border border-border/70 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-xs">{r.id}</span>
                  <StatusPill status="revoked" />
                </div>
                <p className="mt-1">
                  {r.student} · {r.type}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Lý do: {r.reason ?? "Không ghi nhận"}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

/* ---------------- Tab 6: Thống kê xác minh ---------------- */
function StatsTab() {
  const max = Math.max(...weekly.map((w) => w.v));
  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Lượt xác minh", value: "9.751", note: "30 ngày gần nhất" },
          { label: "Tỷ lệ hợp lệ", value: "96,8%", note: "312 lượt không hợp lệ" },
          { label: "Thời gian phản hồi TB", value: "142 ms", note: "API xác minh" },
          { label: "Đơn vị xác minh", value: "184", note: "+12 trong tháng" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
            <p className="mt-1 font-display text-3xl font-bold">{s.value}</p>
            <p className="mt-1 text-xs text-accent">{s.note}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card>
          <SectionTitle title="Lượt xác minh theo tuần" desc="Tháng 8/2026." />
          <div className="space-y-3">
            {weekly.map((w) => (
              <div key={w.w}>
                <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                  <span>{w.w}</span>
                  <span>{w.v.toLocaleString("vi-VN")}</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-card-gradient" style={{ width: `${(w.v / max) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle title="Đơn vị xác minh nhiều nhất" desc="Theo số lượt trong 30 ngày." />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="pb-2 pr-3 font-medium">Đơn vị</th>
                  <th className="pb-2 pr-3 font-medium">Lượt</th>
                  <th className="pb-2 font-medium">Tỷ lệ hợp lệ</th>
                </tr>
              </thead>
              <tbody>
                {verifiers.map((v) => (
                  <tr key={v.org} className="border-b border-border/60 last:border-0">
                    <td className="py-3 pr-3">{v.org}</td>
                    <td className="py-3 pr-3 text-muted-foreground">{v.count.toLocaleString("vi-VN")}</td>
                    <td className="py-3 font-semibold text-success">{v.rate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ---------------- Tab 7: Quản lý quyền ---------------- */
function RolesTab() {
  const [rows, setRows] = useState(staff);
  return (
    <div className="space-y-6">
      <Card>
        <SectionTitle title="Người dùng nội bộ" desc="Gán vai trò cho cán bộ của trường." />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-2 pr-3 font-medium">Họ tên</th>
                <th className="pb-2 pr-3 font-medium">Email</th>
                <th className="pb-2 pr-3 font-medium">Đơn vị</th>
                <th className="pb-2 font-medium">Vai trò</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => (
                <tr key={u.email} className="border-b border-border/60 last:border-0">
                  <td className="py-3 pr-3 font-medium">{u.name}</td>
                  <td className="py-3 pr-3 text-muted-foreground">{u.email}</td>
                  <td className="py-3 pr-3 text-muted-foreground">{u.unit}</td>
                  <td className="py-3">
                    <select
                      value={u.role}
                      onChange={(e) =>
                        setRows((r) => r.map((x) => (x.email === u.email ? { ...x, role: e.target.value } : x)))
                      }
                      className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                    >
                      {Object.keys(ROLE_PERMS).map((role) => (
                        <option key={role}>{role}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <SectionTitle title="Ma trận quyền" desc="Quyền mặc định theo vai trò." />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-2 pr-3 font-medium">Vai trò</th>
                {ALL_PERMS.map((p) => (
                  <th key={p} className="pb-2 pr-3 font-medium">
                    {p}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(ROLE_PERMS).map(([role, perms]) => (
                <tr key={role} className="border-b border-border/60 last:border-0">
                  <td className="py-3 pr-3 font-medium">{role}</td>
                  {ALL_PERMS.map((p) => (
                    <td key={p} className="py-3 pr-3">
                      {perms.includes(p) ? (
                        <span className="text-success">✓</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ---------------- Tab 8: API tích hợp ---------------- */
function ApiTab() {
  const [revealed, setRevealed] = useState(false);
  const [webhook, setWebhook] = useState("https://dhx.edu.vn/hooks/trustid");
  const key = "sk_univ_dhx_9f2c41ab77e0d5";

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card>
          <SectionTitle title="API Key" desc="Dùng cho hệ thống đào tạo của trường." />
          <div className="flex flex-wrap items-center gap-2">
            <code className="flex-1 truncate rounded-lg bg-muted px-3 py-2 font-mono text-xs">
              {revealed ? key : `${key.slice(0, 12)}••••••••••••`}
            </code>
            <Button size="sm" variant="outline" onClick={() => setRevealed((v) => !v)}>
              {revealed ? "Ẩn" : "Hiện"}
            </Button>
            <Button size="sm" variant="outline" onClick={() => void navigator.clipboard?.writeText(key)}>
              Sao chép
            </Button>
            <Button size="sm" variant="secondary">
              Tạo lại
            </Button>
          </div>
          <p className="mt-3 rounded-xl bg-muted/60 p-3 text-xs text-muted-foreground">
            Không chia sẻ khóa qua email. Khóa cũ hết hiệu lực ngay khi tạo lại.
          </p>
        </Card>

        <Card>
          <SectionTitle title="Webhook" desc="Nhận sự kiện phát hành / thu hồi / xác minh." />
          <Input value={webhook} onChange={(e) => setWebhook(e.target.value)} />
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {["credential.issued", "credential.revoked", "credential.verified"].map((e) => (
              <span key={e} className="rounded-full bg-muted px-3 py-1 font-mono text-muted-foreground">
                {e}
              </span>
            ))}
          </div>
          <Button size="sm" className="mt-4">
            Lưu webhook
          </Button>
        </Card>
      </div>

      <Card>
        <SectionTitle title="Endpoint" desc="Base URL: https://api.trustid.ai" />
        <div className="space-y-2">
          {endpoints.map((e) => (
            <div key={e.path} className="flex flex-wrap items-center gap-3 rounded-xl border border-border/70 px-3 py-2 text-sm">
              <span className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-xs font-semibold text-primary">{e.method}</span>
              <code className="font-mono text-xs">{e.path}</code>
              <span className="text-xs text-muted-foreground">{e.desc}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle title="Log gọi API" desc="5 request gần nhất." />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-2 pr-3 font-medium">Thời gian</th>
                <th className="pb-2 pr-3 font-medium">Endpoint</th>
                <th className="pb-2 pr-3 font-medium">Mã</th>
                <th className="pb-2 font-medium">Thời lượng</th>
              </tr>
            </thead>
            <tbody>
              {apiLogs.map((l) => (
                <tr key={l.at + l.ep} className="border-b border-border/60 last:border-0">
                  <td className="py-3 pr-3 text-muted-foreground">{l.at}</td>
                  <td className="py-3 pr-3 font-mono text-xs">{l.ep}</td>
                  <td className={`py-3 pr-3 font-semibold ${l.code < 300 ? "text-success" : "text-destructive"}`}>{l.code}</td>
                  <td className="py-3 text-muted-foreground">{l.ms} ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ---------------- Shell ---------------- */
function UniversityDashboard() {
  const [active, setActive] = useState<Tab>("Dashboard");
  const [rows, setRows] = useState<CredRow[]>(universityCredentials);

  const approve = (id: string) =>
    setRows((r) => r.map((x) => (x.id === id ? { ...x, status: "verified" } : x)));
  const revoke = (id: string, reason: string) =>
    setRows((r) => r.map((x) => (x.id === id ? { ...x, status: "revoked", reason } : x)));
  const addRow = (row: CredRow) => setRows((r) => [row, ...r]);

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
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link to="/" className="text-sm font-semibold text-primary hover:underline lg:hidden">
              ← TrustID AI
            </Link>
            <h1 className="text-2xl font-bold">{active}</h1>
            <p className="text-sm text-muted-foreground">Đại học X · Issuer Portal</p>
          </div>
          <Button onClick={() => setActive("Phát hành Credential")}>+ Tạo Credential</Button>
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

        {active === "Dashboard" ? <Overview rows={rows} onGo={setActive} /> : null}
        {active === "Quản lý sinh viên" ? <StudentsTab /> : null}
        {active === "Phát hành Credential" ? <IssueTab onIssued={addRow} /> : null}
        {active === "Quản lý Credential" ? <ManageTab rows={rows} onApprove={approve} /> : null}
        {active === "Thu hồi Credential" ? <RevokeTab rows={rows} onRevoke={revoke} /> : null}
        {active === "Thống kê xác minh" ? <StatsTab /> : null}
        {active === "Quản lý quyền" ? <RolesTab /> : null}
        {active === "API tích hợp" ? <ApiTab /> : null}
      </main>
    </div>
  );
}
