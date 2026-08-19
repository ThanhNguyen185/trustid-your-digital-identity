# Hoàn thiện dashboard Trường đại học (và kiểm tra Enterprise)

## Hiện trạng
- `src/routes/enterprise.tsx` đã được viết lại: 8 tab, mỗi tab render một component riêng (Overview, VerifyTab, ApplicantsTab, MatchTab, CredentialTab, InternshipTab, HistoryTab, ApiTab) + thanh tab cuộn ngang cho mobile. Chỉ cần rà soát lại responsive và ESLint.
- `src/routes/university.tsx` chưa tách tab: sidebar đổi state nhưng phần nội dung chính luôn hiển thị cùng một trang (stats + bảng credential + phát hành + cảnh báo gian lận), chỉ đổi tiêu đề.

## Việc sẽ làm
Viết lại `src/routes/university.tsx` theo đúng cấu trúc của enterprise, giữ nguyên phong cách UI (sidebar tối, thẻ bo tròn `rounded-2xl border bg-card shadow-soft`, `StatusPill`, `SectionTitle`), thêm thanh tab cuộn ngang trên mobile.

Mỗi tab là một view riêng biệt:

1. **Dashboard** — thẻ số liệu tổng quan (từ `universityStats`), biểu đồ cột đơn giản số credential phát hành theo tháng, hoạt động gần đây, lối tắt sang các tab khác.
2. **Quản lý sinh viên** — bảng sinh viên (mã SV, họ tên, ngành, khóa, trạng thái định danh), ô tìm kiếm + lọc theo khoa/trạng thái, panel chi tiết hồ sơ khi chọn một sinh viên.
3. **Phát hành Credential** — biểu mẫu tạo credential (sinh viên, loại, tiêu đề, ngày cấp, ghi chú) + mô phỏng tiến trình ký số → băm dữ liệu → ghi blockchain, hiển thị mã credential và hash kết quả.
4. **Quản lý Credential** — bảng tra cứu toàn bộ credential có tìm kiếm và lọc trạng thái (pending/verified/revoked), duyệt phát hành cho bản pending, xem chi tiết hash/issuer.
5. **Thu hồi Credential** — chọn credential đang hiệu lực, nhập lý do thu hồi, hộp thoại xác nhận, danh sách credential đã thu hồi kèm lý do và thời điểm.
6. **Thống kê xác minh** — số lượt xác minh, tỷ lệ hợp lệ, thời gian phản hồi trung bình, top đơn vị xác minh, thanh tiến trình theo tuần.
7. **Quản lý quyền** — bảng người dùng nội bộ (Phòng đào tạo, Khoa, Admin) với vai trò, ma trận quyền (xem/phát hành/thu hồi/API), nút đổi vai trò.
8. **API tích hợp** — API key (che một phần + nút sao chép/tạo lại), danh sách endpoint, cấu hình webhook, log gọi API gần đây.

Dữ liệu mẫu bổ sung (sinh viên, log xác minh, người dùng nội bộ, log API) đặt trong `src/lib/trustid-data.ts` để giữ file route gọn.

## Kỹ thuật
- State: `active` tab + state cục bộ trong từng component tab; các nút hành động (phát hành/thu hồi/duyệt) cập nhật state chung của danh sách credential.
- Không đổi backend, không đụng route khác; chỉ frontend/mock data.
- Chạy ESLint sau khi sửa và khắc phục hết cảnh báo.
