# TrustID: Your Digital Identity

SCRIPT CHI TIẾT THIẾT KẾ ỨNG DỤNG TRUSTID AI

1. Tổng quan sản phẩm

TrustID AI gồm hai giao diện chính:

Ứng dụng TrustID AI Mobile dành cho sinh viên/cá nhân, đóng vai trò là nơi xác thực danh tính, quản lý hồ sơ số, lưu trữ các hồ sơ chứng thực số và kiểm soát quyền chia sẻ dữ liệu.

TrustID AI Web Dashboard dành cho trường đại học, doanh nghiệp và các tổ chức xác minh, cho phép phát hành hồ sơ số, quản lý hồ sơ sinh viên, xác minh Credential và khai thác các tính năng hỗ trợ tuyển dụng, thực tập, học bổng.

Toàn bộ hệ thống được kết nối thông qua API Gateway với các mô-đun AI và Blockchain. AI chịu trách nhiệm nhận dạng, trích xuất và đánh giá dấu hiệu bất thường; hệ thống Credential chịu trách nhiệm tạo và quản lý hồ sơ chứng thực số; Blockchain ghi nhận dấu vân tay số và trạng thái của Credential để hỗ trợ kiểm chứng tính toàn vẹn.

PHẦN A. ỨNG DỤNG MOBILE – DÀNH CHO SINH VIÊN

2. Màn hình khởi động

Khi mở ứng dụng, người dùng nhìn thấy:

TrustID AI: Xác thực một lần – Tái sử dụng mọi nơi

Bên dưới hiển thị thông điệp: Hồ sơ học tập và năng lực được xác thực – Chủ động chia sẻ – An toàn và minh bạch

Hai lựa chọn:

Đăng nhập

Đăng ký tài khoản

Người dùng có thể đăng nhập bằng số điện thoại/email và xác thực đa yếu tố.

3. Đăng ký và xác thực danh tính

Đây là bước đầu tiên để thiết lập danh tính số của người dùng.

Bước 1: Xác thực thông tin định danh

Người dùng chọn: Xác thực danh tính

Ứng dụng hướng dẫn người dùng chụp/đọc thông tin từ giấy tờ định danh được hỗ trợ.

AI OCR thực hiện: Nhận diện thông tin; Trích xuất họ tên; Ngày sinh; Số định danh; Các trường thông tin cần thiết. Nếu thiết bị và hạ tầng tích hợp cho phép, hệ thống có thể hỗ trợ đọc dữ liệu từ chip qua NFC.

Bước 2: Xác thực khuôn mặt

Ứng dụng yêu cầu người dùng thực hiện thao tác theo hướng dẫn trên màn hình. Ví dụ: Nhìn thẳng vào camera, Quay mặt sang trái, Quay mặt sang phải, Chớp mắt

Mô-đun AI thực hiện kiểm tra tính sống (Liveness Detection) và đối sánh khuôn mặt (Face Matching). Mục tiêu là xác định người đang thực hiện xác thực có phù hợp với danh tính đã cung cấp hay không.

Bước 3: Kết quả

Nếu hợp lệ: Xác thực danh tính thành công

Nếu hệ thống phát hiện bất thường: Cần xác minh bổ sung

Trường hợp có độ tin cậy thấp có thể được chuyển sang cơ chế Human-in-the-loop để nhân sự có thẩm quyền kiểm tra.

4. Trang chủ – Digital Identity Wallet

Sau khi xác thực, người dùng được đưa đến Trang chủ. Trang chủ hiển thị: Trạng thái danh tính: ✓ Danh tính đã xác thực

Hồ sơ của tôi: Thông tin cá nhân; Bằng cấp; Bảng điểm; Chứng chỉ; Thành tích; Hoạt động; Thực tập; Kinh nghiệm. 

Các chức năng nhanh: + Thêm hồ sơ; QR của tôi; Chia sẻ hồ sơ; Cơ hội dành cho tôi; Xác minh hồ sơ

5. Hồ sơ học tập số – Academic Profile

Đây là tính năng trung tâm của TrustID AI. Sinh viên có một hồ sơ học tập số thống nhất, thay vì lưu trữ nhiều file PDF riêng biệt.

Ví dụ: Nguyễn Văn A

Sinh viên ngành Tài chính – Trường Đại học X

Hồ sơ gồm: Bằng tốt nghiệp; Bảng điểm; GPA; Chứng chỉ ngoại ngữ; Chứng chỉ nghề nghiệp; Giải thưởng; Hoạt động ngoại khóa; Nghiên cứu khoa học; Dự án; Kết quả thực tập. Mỗi hồ sơ đều có trạng thái: ✓ Đã xác thực hoặc ⚠ Đang chờ xác minh hoặc ✕ Không hợp lệ

6. Thêm và xác thực hồ sơ

Người dùng chọn: + Thêm hồ sơ

Sau đó lựa chọn: Bằng đại học; Bảng điểm; Chứng chỉ; Chứng nhận thực tập; Giải thưởng; Chứng nhận khác

Ví dụ người dùng tải lên bằng đại học. Quy trình:

Tải tài liệu → AI OCR → Phân tích hình ảnh → Phát hiện bất thường → Đối chiếu thông tin → Xác minh đơn vị phát hành → Phát hành Credential

AI có thể kiểm tra: Nội dung; Cấu trúc; Dấu hiệu chỉnh sửa; Tính nhất quán; Thông tin người sở hữu; Nguồn phát hành.

Nếu tài liệu hợp lệ, hệ thống tạo: Hồ sơ chứng thực số – Verifiable Credential

7. Trang chi tiết Credential

Khi sinh viên chọn “Bằng đại học”, giao diện hiển thị: Bằng Cử nhân Tài chính

Trường phát hành: Đại học X

Người sở hữu: Nguyễn Văn A

Ngày cấp: 2026

Trạng thái: ✓ Đã xác thực

Bên dưới: Mã Credential, Dấu vân tay số (Hash), Ngày xác thực, Đơn vị phát hành, Trạng thái hiệu lực

Người dùng có thể: Chia sẻ, Tạo QR, Kiểm tra trạng thái

8. Ví hồ sơ số – Credential Wallet

Đây là nơi lưu trữ toàn bộ các Credential của sinh viên.

Ví dụ: 🎓 Bằng đại học – Đã xác thực 📊 Bảng điểm – Đã xác thực IELTS – Đã xác thực 🏢 Chứng nhận thực tập – Đã xác thực 🏆 Giải thưởng – Đã xác thực

Mục tiêu là biến TrustID AI thành “ví hồ sơ năng lực số” của sinh viên.

Sinh viên không cần tìm lại từng file giấy tờ khi ứng tuyển.

9. Chia sẻ hồ sơ bằng QR Code

Người dùng chọn: Chia sẻ hồ sơ

Ứng dụng cho phép lựa chọn thông tin muốn chia sẻ.

Ví dụ: ✓ Bằng đại học ✓ GPA ✓ IELTS ✓ Chứng nhận thực tập ✕ CCCD

Sau đó chọn: Tạo mã QR

Hệ thống tạo QR Code hoặc liên kết xác minh. Sinh viên gửi QR cho: Doanh nghiệp; Trường đại học; Tổ chức học bổng; Cơ sở đào tạo; Đơn vị tiếp nhận hồ sơ.

Điểm quan trọng là sinh viên không cần chia sẻ toàn bộ dữ liệu cá nhân nếu bên nhận không cần những dữ liệu đó.

10. Quản lý quyền chia sẻ dữ liệu

Đây là một trong những tính năng quan trọng nhất của TrustID AI. Màn hình:

Quyền truy cập hồ sơ: Công ty ABC

Được xem: ✓ Bằng đại học ✓ GPA ✓ Chứng chỉ IELTS

Không được xem: ✕ CCCD ✕ Địa chỉ ✕ Thông tin không liên quan

Thời hạn: 30 ngày

Sinh viên có thể: Cho phép hoặc Từ chối hoặc Thu hồi quyền truy cập

Điều này thể hiện nguyên tắc Privacy by Design và Consent Management.

11. AI Đối sánh việc làm

Từ hồ sơ đã xác thực, sinh viên chọn: Tìm cơ hội việc làm

AI phân tích hồ sơ và đối chiếu với yêu cầu tuyển dụng.

Ví dụ: Chuyên viên phân tích dữ liệu. Mức độ phù hợp: 91%

Phù hợp: ✓ Excel ✓ SQL ✓ Phân tích dữ liệu ✓ Tài chính

Cần bổ sung: △ Power BI

AI có thể giải thích lý do hình thành điểm phù hợp thay vì chỉ đưa ra một con số.

12. Phân tích khoảng cách năng lực

Sinh viên chọn: Phân tích năng lực

AI so sánh: Năng lực hiện tại với Năng lực yêu cầu của vị trí mục tiêu

Ví dụ: Mục tiêu: Chuyên viên phân tích tài chính

Hệ thống xác định: ✓ Phân tích báo cáo tài chính – Đạt, ✓ Excel – Đạt

△ Python – Cần cải thiện △ Power BI – Cần bổ sung △ SQL – Cần bổ sung → Sau đó hệ thống đề xuất các khóa học/chứng chỉ phù hợp.

Như vậy TrustID AI không chỉ xác thực hồ sơ mà còn hỗ trợ phát triển năng lực nghề nghiệp của sinh viên.

13. Đối sánh học bổng

Sinh viên chọn: Tìm học bổng

AI sử dụng: GPA; ngành học; thành tích; chứng chỉ; hoạt động; điều kiện của học bổng để xác định mức độ phù hợp.

Ví dụ: Học bổng A, Phù hợp: 94%

Lý do: ✓ GPA đáp ứng ✓ Đúng ngành ✓ Có chứng chỉ IELTS ✓ Có hoạt động ngoại khóa

Còn thiếu: △ Chứng nhận hoạt động xã hội

Điều này giúp biến hồ sơ xác thực thành nền tảng hỗ trợ ra quyết định cho sinh viên.

14. Hồ sơ du học

Sinh viên có thể tạo: Hồ sơ du học

Hệ thống tập hợp: Bằng; Bảng điểm; GPA; IELTS; Chứng chỉ; Thành tích; Hoạt động.

Thay vì chuẩn bị từng tài liệu riêng biệt, sinh viên có thể tạo một bộ hồ sơ số đã được xác thực để phục vụ quá trình đăng ký.

PHẦN B. WEB DASHBOARD – DÀNH CHO TRƯỜNG ĐẠI HỌC

15. Dashboard dành cho trường

Trường đại học đăng nhập vào Web Dashboard.

Trang tổng quan hiển thị: Số lượng sinh viên; Số Credential đã phát hành; Số Credential đang chờ; Số Credential đã thu hồi; Số lượt xác minh; Số hồ sơ có dấu hiệu bất thường.

16. Quản lý và phát hành Credential

Nhà trường có thể: Tạo Credential

Chọn loại: Bằng tốt nghiệp; Bảng điểm; Chứng chỉ; Giấy xác nhận; Thành tích; Chứng nhận thực tập.

Sau khi dữ liệu được kiểm tra: Phát hành Credential

Hệ thống ký số và tạo dấu vân tay số.

Blockchain ghi nhận: Hash + trạng thái + thông tin cần thiết để kiểm chứng.

Không lưu trực tiếp dữ liệu cá nhân lên Blockchain.

17. Thu hồi Credential

Nếu phát hiện Credential có sai sót hoặc được cấp không đúng: Nhà trường có thể chọn: Thu hồi Credential

Trạng thái chuyển: ✓ Valid sang: ✕ Revoked

Khi doanh nghiệp quét QR sau đó, hệ thống sẽ thông báo Credential không còn hiệu lực.

Đây là một tính năng quan trọng vì Credential không chỉ cần xác thực tại thời điểm phát hành mà còn phải có khả năng kiểm tra trạng thái trong suốt vòng đời.

PHẦN C. WEB DASHBOARD – DÀNH CHO DOANH NGHIỆP

18. Dashboard tuyển dụng

Doanh nghiệp đăng nhập và lựa chọn: Xác minh ứng viên

Có thể: Quét QR; Nhập mã Credential; Mở liên kết xác minh.

19. Trang kết quả xác minh

Ví dụ: Ứng viên: Nguyễn Văn A Danh tính: ✓ Đã xác thực Bằng đại học: ✓ Hợp lệ Bảng điểm: ✓ Hợp lệ IELTS: ✓ Hợp lệ Chứng nhận thực tập: ✓ Hợp lệ Credential Status: ✓ Valid Blockchain Integrity: ✓ Verified

Kết quả được trình bày trực quan để HR không cần hiểu sâu về Blockchain.

20. AI hỗ trợ tuyển dụng

Doanh nghiệp có thể tải lên: Mô tả công việc (Job Description)

AI phân tích yêu cầu tuyển dụng và đối chiếu với các hồ sơ đã được xác thực.

Ví dụ: Ứng viên A – 94%; Ứng viên B – 89%; Ứng viên C – 81%

AI giải thích: Ứng viên A phù hợp cao do đáp ứng đầy đủ yêu cầu về bằng cấp, kỹ năng và chứng chỉ.

Điểm quan trọng: AI chỉ hỗ trợ sàng lọc và cung cấp thông tin, không tự động quyết định tuyển dụng cuối cùng.

21. Xác minh chứng nhận thực tập

Sau khi sinh viên hoàn thành thực tập:

Doanh nghiệp có thể phát hành: Verified Internship Credential

Credential bao gồm: Tên doanh nghiệp; Vị trí thực tập; Thời gian; Bộ phận; Kết quả hoàn thành. Credential này được đưa vào hồ sơ số của sinh viên.

Như vậy, hồ sơ của sinh viên được cập nhật liên tục: Học tập → Chứng chỉ → Thực tập → Việc làm.

PHẦN D. HỆ THỐNG XỬ LÝ PHÍA SAU

22. API Gateway

Tất cả App Mobile và Web Dashboard kết nối với hệ thống thông qua: REST API

API Gateway chịu trách nhiệm: Xác thực request; Phân quyền; Điều phối API; Kiểm soát truy cập; Kết nối các dịch vụ phía sau.

23. Identity Manager

Quản lý: Tài khoản; Danh tính; Xác thực; Phân quyền; Phiên đăng nhập; Quyền truy cập dữ liệu.

24. AI Core

AI Core gồm các mô-đun: OCR

Trích xuất dữ liệu từ: CCCD; bằng cấp; bảng điểm; chứng chỉ.

Computer Vision. Phân tích hình ảnh tài liệu. Face Matching / Liveness

Đối sánh khuôn mặt và kiểm tra tính sống. Fraud Detection

Phát hiện: chỉnh sửa; giả mạo; thông tin bất thường; dấu hiệu can thiệp vào tài liệu. AI Matching

Bao gồm: Đối sánh việc làm; Phân tích khoảng cách năng lực; Đối sánh học bổng.

25. Credential Layer

Đây là lớp trung gian giữa AI và Blockchain. Quy trình:

AI xác thực

↓

Tạo Credential

↓

Ký số

↓

Tạo Hash

↓

Blockchain ghi nhận

Credential được quản lý theo trạng thái: Pending → Verified → Revoked

26. Blockchain Layer

Blockchain không lưu toàn bộ hồ sơ. Blockchain lưu: Hash + trạng thái + thông tin cần thiết để kiểm chứng

Mục tiêu là: Bảo đảm tính toàn vẹn; Chống sửa đổi; Kiểm chứng nguồn gốc; Theo dõi trạng thái Credential. Smart Contract có thể quản lý các thao tác như: Issue → Verify → Revoke.

27. Quy trình hoàn chỉnh của TrustID AI

Toàn bộ hệ thống có thể được trình bày bằng quy trình 8 bước:

Bước 1 – Định danh: Sinh viên xác thực danh tính và khuôn mặt.

↓

Bước 2 – Tải hồ sơ: Bằng cấp, bảng điểm, chứng chỉ.

↓

Bước 3 – AI kiểm tra: OCR + Face Matching + Fraud Detection.

↓

Bước 4 – Xác minh nguồn phát hành: Đối chiếu với trường đại học/tổ chức cấp chứng chỉ.

↓

Bước 5 – Phát hành Credential: Hồ sơ hợp lệ được chuyển thành Verifiable Credential.

↓

Bước 6 – Ghi nhận Blockchain: Tạo Hash và ghi nhận Hash + Status.

↓

Bước 7 – Sinh viên chia sẻ: QR Code / Link + quyền truy cập.

↓

Bước 8 – Doanh nghiệp xác minh: Quét QR → hệ thống kiểm tra Credential → kiểm tra trạng thái → trả kết quả.

28. Luồng trải nghiệm người dùng mẫu

Một sinh viên tên Nguyễn Văn A tốt nghiệp đại học.

Ngày 1: Nguyễn Văn A đăng ký TrustID AI. → Xác thực danh tính. → Xác thực khuôn mặt.

Ngày 2: Trường phát hành bằng và bảng điểm. → Credential được đưa vào hồ sơ.

Tháng 3: A tìm học bổng. → AI phân tích hồ sơ. → Đề xuất các học bổng phù hợp.

Tháng 6: A ứng tuyển thực tập. → Chia sẻ QR hồ sơ. → Doanh nghiệp xác minh trong vài giây.

Sau kỳ thực tập: Doanh nghiệp phát hành Internship Credential. → Credential được thêm vào hồ sơ.

Sau khi tốt nghiệp: A ứng tuyển việc làm.

→ AI đối sánh hồ sơ với vị trí tuyển dụng.

→ Doanh nghiệp xác minh các Credential.

→ Không cần yêu cầu A gửi lại hàng loạt giấy tờ.

Đây chính là giá trị cốt lõi của TrustID AI: Một danh tính – Một hồ sơ số – Nhiều mục đích sử dụng.

29. Cấu trúc giao diện đề xuất

Mobile App – Sinh viên: Trang chủ

→ Hồ sơ của tôi

→ Credential Wallet

→ QR của tôi

→ Tìm học bổng

→ Tìm thực tập/việc làm

→ Phân tích năng lực

→ Lịch sử chia sẻ

→ Quyền riêng tư

→ Thông báo

→ Cài đặt

Web Dashboard – Trường

Dashboard

→ Quản lý sinh viên

→ Phát hành Credential

→ Quản lý Credential

→ Thu hồi Credential

→ Thống kê xác minh

→ Quản lý quyền

→ API tích hợp

Web Dashboard – Doanh nghiệp

Dashboard

→ Xác minh ứng viên

→ Quản lý ứng viên

→ Đối sánh việc làm

→ Quản lý Credential

→ Phát hành chứng nhận thực tập

→ Lịch sử xác minh

→ API tích hợp

30. Công nghệ phía sau

Theo kiến trúc bạn cung cấp, có thể định hướng công nghệ như sau:

Frontend

Mobile: React Native hoặc Flutter

Web: React / Next.js

Backend

Python / FastAPI

Node.js nếu cần các dịch vụ API bổ sung

Kiến trúc Microservices

AI

PyTorch

OpenCV

OCR

Mô hình nhận diện khuôn mặt

Mô hình phát hiện tài liệu giả mạo

Blockchain

Smart Contract

Web3 RPC

Verifiable Credentials theo chuẩn phù hợp

Hash Ledger

Database

PostgreSQL cho dữ liệu nghiệp vụ

Object Storage cho tài liệu được mã hóa

Blockchain chỉ lưu dữ liệu cần thiết để kiểm chứng

Security

OAuth 2.0 / OpenID Connect

MFA

Encryption

Role-Based Access Control

Audit Log

31. Tóm tắt giá trị của ứng dụng

TrustID AI không nên được định vị đơn thuần là:

"Ứng dụng kiểm tra bằng cấp."

Mà nên được trình bày là:

"Nền tảng hạ tầng hồ sơ số xác thực, kết nối trường đại học – sinh viên – doanh nghiệp trong toàn bộ vòng đời học tập và nghề nghiệp."

Trong đó:

AI

→ Xác thực danh tính + đọc hồ sơ + phát hiện gian lận + phân tích năng lực.

Credential

→ Biến kết quả xác thực thành hồ sơ số có thể kiểm chứng và tái sử dụng.

Blockchain

→ Bảo đảm tính toàn vẹn và trạng thái của hồ sơ.

Mobile App

→ Sinh viên sở hữu và kiểm soát hồ sơ.

Web Dashboard

→ Trường phát hành; doanh nghiệp xác minh và sử dụng.

QR/Link

→ Kết nối nhanh giữa người sở hữu và bên xác minh.

Toàn bộ hệ thống tạo thành vòng đời:

HỌC TẬP → XÁC THỰC → HỒ SƠ SỐ → HỌC BỔNG/DU HỌC → THỰC TẬP → VIỆC LÀM → KINH NGHIỆM NGHỀ NGHIỆP

Đây là cấu trúc sản phẩm phù hợp để TrustID AI vừa có MVP đủ khả thi, vừa có khả năng mở rộng thành hạ tầng định danh và hồ sơ số quy mô lớn trong các giai đoạn sau.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6635532d-f8f6-48b6-97ca-3e74cf48873d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
