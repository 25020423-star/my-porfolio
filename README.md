# Website cá nhân · Gia sư · Love Corner

Website đa khu vực của **Hoàng Mạnh Trường**: portfolio cá nhân, hệ thống giảng dạy, cổng học sinh, thi thử, Lab Hóa học và không gian kỷ niệm riêng. Frontend tĩnh được Spring Boot phục vụ cùng API REST, WebSocket và MySQL.

## Chức năng chính

- **Portfolio**: giới thiệu, kỹ năng, dự án, lộ trình/mục tiêu và khu chia sẻ kiến thức.
- **Giảng dạy**: trang dịch vụ gia sư, cổng học sinh, lịch học, bài tập/tài liệu, học phí và thông báo.
- **Thi thử online**: quản lý đề, câu hỏi, kết quả và bảng xếp hạng học sinh.
- **Lab Hóa học**: công cụ học tập, mô phỏng/lab, cùng các API hỗ trợ nội dung Hóa học.
- **Love Corner**: dòng thời gian, bản đồ kỷ niệm, bucket list, hộp thư, chat, Locket, photobooth và chia sẻ vị trí thời gian thực.
- **Quản trị**: API đăng nhập admin bằng PIN cấu hình qua biến môi trường.

## Công nghệ

| Thành phần | Công nghệ |
| --- | --- |
| Backend | Java 21, Spring Boot 3.2.2, Spring Web, Spring Data JPA |
| Dữ liệu | MySQL (Aiven hoặc MySQL tương thích) |
| Real-time | Spring WebSocket, STOMP, SockJS |
| AI & media | Gemini API, Cloudinary |
| Frontend | HTML, CSS, JavaScript thuần, Font Awesome, Leaflet |
| Build & test | Maven, JUnit 5 |

## Yêu cầu môi trường

- JDK **21**
- Maven 3.9+
- MySQL có thể truy cập từ máy chạy ứng dụng
- Tài khoản Cloudinary và Gemini (tùy tính năng dùng đến)

## Chạy local

1. Tạo file môi trường từ mẫu:

   ```powershell
   Copy-Item .env.example .env
   ```

2. Điền giá trị thật vào `.env`:

   ```env
   DB_URL=jdbc:mysql://HOST:PORT/DATABASE?sslMode=REQUIRED&serverTimezone=UTC
   DB_USER=...
   DB_PASS=...
   GEMINI_API_KEY=...
   ADMIN_PIN=...
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   ```

3. Đảm bảo Java 21 đang được chọn, sau đó chạy một trong hai cách:

   ```powershell
   # Cách nhanh trên Windows: tự nạp .env rồi chạy backend
   .\run-backend.ps1
   ```

   ```powershell
   # Hoặc chạy Maven trực tiếp trong backend
   Set-Location backend
   mvn spring-boot:run
   ```

4. Mở [http://localhost:8080](http://localhost:8080).

> `server.port` mặc định là `8080`; có thể ghi đè bằng biến môi trường `PORT`.

## Build và kiểm thử

Chạy từ thư mục gốc:

```powershell
mvn test
mvn package
```

File JAR sau khi build:

```text
backend/target/portfolio-0.0.1-SNAPSHOT.jar
```

Chạy JAR:

```powershell
java -jar backend/target/portfolio-0.0.1-SNAPSHOT.jar
```

## Cấu trúc thư mục

```text
.
├── backend/
│   └── src/main/
│       ├── java/com/love/portfolio/
│       │   ├── config/          # Security, interceptor, WebSocket
│       │   ├── controller/      # REST API
│       │   ├── model/           # Entity JPA
│       │   ├── repository/      # Truy cập dữ liệu
│       │   └── service/         # AI, Cloudinary, location...
│       └── resources/
│           ├── application.properties
│           └── static/
│               ├── assets/      # CSS, JS, ảnh
│               ├── pages/       # Các giao diện HTML
│               └── index.html
├── .env.example
├── pom.xml                       # Maven reactor (module backend)
└── run-backend.ps1
```

## Nhóm API tiêu biểu

| Nhóm | Endpoint gốc |
| --- | --- |
| Học sinh | `/api/students` |
| Lớp học | `/api/classes` |
| Thi thử | `/api/exams` |
| Mục tiêu | `/api/goals` |
| AI / Hóa học | `/api/ai`, `/api/chemistry` |
| Love Corner | `/api/milestones`, `/api/locations`, `/api/location`, `/api/bucket`, `/api/chat`, `/api/locket` |
| Admin | `/api/auth/admin` |

WebSocket chia sẻ vị trí sử dụng endpoint `/ws-location`.

## Cấu hình và bảo mật

- Không commit `.env`, `application-local.properties`, thư mục `uploads/` hoặc các khóa API.
- Dùng `.env.example` làm danh sách biến môi trường chuẩn cho local và hosting.
- `ADMIN_PIN` phải là giá trị mạnh và chỉ cấu hình ở môi trường server.
- Nếu một khóa từng bị đưa vào file cục bộ hoặc lịch sử Git, hãy thu hồi/rotate khóa đó trước khi deploy.

## Deploy

Project có thể deploy dạng Spring Boot Web Service. Cấu hình tối thiểu cần có ở môi trường deploy:

- `PORT` (nếu nền tảng cấp động)
- `DB_URL`, `DB_USER`, `DB_PASS`
- `GEMINI_API_KEY` nếu bật tính năng AI
- `ADMIN_PIN`
- bộ biến `CLOUDINARY_*` nếu dùng upload ảnh

Lệnh build:

```bash
mvn package -DskipTests
```

Lệnh chạy:

```bash
java -jar backend/target/portfolio-0.0.1-SNAPSHOT.jar
```

## Ghi chú phát triển

- Các trang frontend được phục vụ trực tiếp từ `backend/src/main/resources/static`.
- Thiết kế Love Corner dùng design system chung tại `assets/css/love-feature-system.css` và `assets/js/love-feature-system.js`.
- Một số chức năng bản đồ, định vị và chat phụ thuộc quyền trình duyệt, HTTPS và kết nối dịch vụ ngoài.
