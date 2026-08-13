export type CredentialStatus = "verified" | "pending" | "revoked";

export type Credential = {
  id: string;
  icon: string;
  title: string;
  type: string;
  issuer: string;
  issuedAt: string;
  status: CredentialStatus;
  hash: string;
  detail: Record<string, string>;
};

export const student = {
  name: "Nguyễn Văn A",
  major: "Tài chính",
  school: "Trường Đại học X",
  did: "did:trustid:0x8a41...c9f2",
  gpa: "3.62 / 4.0",
  identityVerified: true,
};

export const credentials: Credential[] = [
  {
    id: "VC-2026-000184",
    icon: "🎓",
    title: "Bằng Cử nhân Tài chính",
    type: "Bằng đại học",
    issuer: "Đại học X",
    issuedAt: "12/06/2026",
    status: "verified",
    hash: "0x7f3a91c4d2e8b05a6f1c93de77b04a2c8e51fd39",
    detail: {
      "Xếp loại": "Giỏi",
      "Hình thức đào tạo": "Chính quy",
      "Số hiệu văn bằng": "DHX-2026-10482",
    },
  },
  {
    id: "VC-2026-000185",
    icon: "📊",
    title: "Bảng điểm toàn khoá",
    type: "Bảng điểm",
    issuer: "Đại học X",
    issuedAt: "12/06/2026",
    status: "verified",
    hash: "0x2b18ce70a94f3d61b8027ac5e93f10d47c6a8be2",
    detail: { GPA: "3.62 / 4.0", "Số tín chỉ": "134", "Khoá": "2022 – 2026" },
  },
  {
    id: "VC-2025-004417",
    icon: "🌐",
    title: "IELTS Academic 7.5",
    type: "Chứng chỉ ngoại ngữ",
    issuer: "British Council",
    issuedAt: "03/11/2025",
    status: "verified",
    hash: "0x9d40fa1e6c73b28950adf417e2c0b6835179ea44",
    detail: { Listening: "8.0", Reading: "7.5", Writing: "7.0", Speaking: "7.5" },
  },
  {
    id: "VC-2025-009930",
    icon: "🏢",
    title: "Chứng nhận thực tập – Data Analyst",
    type: "Chứng nhận thực tập",
    issuer: "Công ty ABC",
    issuedAt: "30/08/2025",
    status: "verified",
    hash: "0x51cc7802b4ef9a13d6708f25ba3c14e097d6f8a1",
    detail: { "Bộ phận": "Khối Phân tích", "Thời gian": "3 tháng", "Kết quả": "Hoàn thành tốt" },
  },
  {
    id: "VC-2025-002210",
    icon: "🏆",
    title: "Giải Nhì NCKH cấp trường",
    type: "Giải thưởng",
    issuer: "Đại học X",
    issuedAt: "20/05/2025",
    status: "verified",
    hash: "0x0e6b39d7c1a8425fbe93077c4a10d582f6c93bb7",
    detail: { "Đề tài": "Mô hình dự báo rủi ro tín dụng", "Cấp": "Trường" },
  },
  {
    id: "VC-2026-000512",
    icon: "📜",
    title: "Chứng chỉ Phân tích dữ liệu",
    type: "Chứng chỉ nghề nghiệp",
    issuer: "Trung tâm đào tạo Y",
    issuedAt: "02/08/2026",
    status: "pending",
    hash: "—",
    detail: { "Trạng thái": "Đang đối chiếu đơn vị phát hành" },
  },
];

export const statusMeta: Record<CredentialStatus, { label: string; tone: string; mark: string }> = {
  verified: { label: "Đã xác thực", tone: "success", mark: "✓" },
  pending: { label: "Đang chờ xác minh", tone: "warning", mark: "⚠" },
  revoked: { label: "Không hợp lệ", tone: "destructive", mark: "✕" },
};

export const jobMatches = [
  {
    title: "Chuyên viên phân tích dữ liệu",
    company: "Công ty ABC",
    score: 91,
    matched: ["Excel", "SQL", "Phân tích dữ liệu", "Tài chính"],
    missing: ["Power BI"],
    reason:
      "Hồ sơ có bằng đại học ngành Tài chính đã xác thực, chứng nhận thực tập đúng lĩnh vực và kỹ năng SQL được ghi nhận trong dự án.",
  },
  {
    title: "Chuyên viên phân tích tài chính",
    company: "Tập đoàn DEF",
    score: 86,
    matched: ["Phân tích BCTC", "Excel", "IELTS 7.5"],
    missing: ["Python", "SQL nâng cao"],
    reason: "Đáp ứng yêu cầu bằng cấp và ngoại ngữ; cần bổ sung kỹ năng lập trình phân tích.",
  },
  {
    title: "Trợ lý nghiên cứu đầu tư",
    company: "Quỹ GHI",
    score: 78,
    matched: ["NCKH", "Tài chính", "Viết báo cáo"],
    missing: ["CFA Level 1", "Bloomberg"],
    reason: "Kinh nghiệm nghiên cứu khoa học phù hợp, thiếu chứng chỉ chuyên môn ngành đầu tư.",
  },
];

export const skillGap = [
  { skill: "Phân tích báo cáo tài chính", level: 88, status: "Đạt" },
  { skill: "Excel nâng cao", level: 84, status: "Đạt" },
  { skill: "Python", level: 46, status: "Cần cải thiện" },
  { skill: "Power BI", level: 22, status: "Cần bổ sung" },
  { skill: "SQL", level: 38, status: "Cần bổ sung" },
];

export const courseSuggestions = [
  "Power BI cho phân tích tài chính – 6 tuần",
  "SQL thực chiến cho Data Analyst – 4 tuần",
  "Python cho tài chính định lượng – 8 tuần",
];

export const scholarships = [
  {
    name: "Học bổng A – Tài năng Tài chính",
    provider: "Quỹ Phát triển Giáo dục A",
    score: 94,
    matched: ["GPA đáp ứng", "Đúng ngành", "Có chứng chỉ IELTS", "Có hoạt động ngoại khoá"],
    missing: ["Chứng nhận hoạt động xã hội"],
  },
  {
    name: "Học bổng B – Du học Thạc sĩ",
    provider: "Đại học Quốc tế B",
    score: 88,
    matched: ["IELTS 7.5", "Bằng loại Giỏi", "Nghiên cứu khoa học"],
    missing: ["Thư giới thiệu", "GMAT"],
  },
];

export const shareHistory = [
  { org: "Công ty ABC", purpose: "Ứng tuyển thực tập", date: "18/06/2026", expires: "30 ngày", state: "Đang hiệu lực" },
  { org: "Quỹ học bổng A", purpose: "Hồ sơ học bổng", date: "02/05/2026", expires: "Hết hạn", state: "Đã hết hạn" },
  { org: "Đại học Quốc tế B", purpose: "Hồ sơ du học", date: "11/04/2026", expires: "60 ngày", state: "Đang hiệu lực" },
];

export const universityStats = [
  { label: "Sinh viên", value: "12.480", note: "+184 trong tháng" },
  { label: "Credential đã phát hành", value: "38.216", note: "+1.204 trong tháng" },
  { label: "Đang chờ phát hành", value: "265", note: "Cần duyệt" },
  { label: "Đã thu hồi", value: "37", note: "Vòng đời credential" },
  { label: "Lượt xác minh", value: "9.751", note: "30 ngày gần nhất" },
  { label: "Hồ sơ bất thường", value: "12", note: "AI Fraud Detection" },
];

export const universityCredentials = [
  { id: "VC-2026-000184", student: "Nguyễn Văn A", type: "Bằng tốt nghiệp", date: "12/06/2026", status: "verified" as const },
  { id: "VC-2026-000185", student: "Nguyễn Văn A", type: "Bảng điểm", date: "12/06/2026", status: "verified" as const },
  { id: "VC-2026-000201", student: "Trần Thị B", type: "Bằng tốt nghiệp", date: "12/06/2026", status: "pending" as const },
  { id: "VC-2026-000202", student: "Lê Minh C", type: "Giấy xác nhận sinh viên", date: "10/06/2026", status: "verified" as const },
  { id: "VC-2025-008812", student: "Phạm Quốc D", type: "Bảng điểm", date: "22/12/2025", status: "revoked" as const },
];

export const candidates = [
  { name: "Nguyễn Văn A", role: "Data Analyst", score: 94, verified: true, note: "Đáp ứng đầy đủ bằng cấp, kỹ năng và chứng chỉ." },
  { name: "Trần Thị B", role: "Data Analyst", score: 89, verified: true, note: "Mạnh về SQL, thiếu kinh nghiệm tài chính." },
  { name: "Lê Minh C", role: "Data Analyst", score: 81, verified: true, note: "Nền tảng thống kê tốt, chưa có chứng chỉ BI." },
];

export const verificationChecks = [
  { label: "Danh tính", value: "Đã xác thực" },
  { label: "Bằng đại học", value: "Hợp lệ" },
  { label: "Bảng điểm", value: "Hợp lệ" },
  { label: "IELTS", value: "Hợp lệ" },
  { label: "Chứng nhận thực tập", value: "Hợp lệ" },
  { label: "Credential Status", value: "Valid" },
  { label: "Blockchain Integrity", value: "Verified" },
];

export const pipeline = [
  { step: "1", title: "Định danh", desc: "Sinh viên xác thực giấy tờ và khuôn mặt (OCR + Liveness)." },
  { step: "2", title: "Tải hồ sơ", desc: "Bằng cấp, bảng điểm, chứng chỉ được tải lên ví hồ sơ." },
  { step: "3", title: "AI kiểm tra", desc: "OCR, Computer Vision, Face Matching, Fraud Detection." },
  { step: "4", title: "Xác minh nguồn phát hành", desc: "Đối chiếu với trường đại học / tổ chức cấp." },
  { step: "5", title: "Phát hành Credential", desc: "Hồ sơ hợp lệ trở thành Verifiable Credential có ký số." },
  { step: "6", title: "Ghi nhận Blockchain", desc: "Lưu Hash + trạng thái, không lưu dữ liệu cá nhân." },
  { step: "7", title: "Sinh viên chia sẻ", desc: "QR / link kèm phạm vi và thời hạn truy cập." },
  { step: "8", title: "Doanh nghiệp xác minh", desc: "Quét QR → kiểm tra credential và trạng thái hiệu lực." },
];
