-- ============================================================
-- Love Portfolio Database Schema
-- Database: defaultdb (Aiven MySQL)
-- Chạy script này trên Aiven Console hoặc MySQL client
-- ============================================================

-- 1. Milestones (kỷ niệm / timeline)
CREATE TABLE IF NOT EXISTS milestone (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    date        VARCHAR(255),
    title       VARCHAR(255),
    description TEXT
);

-- 1b. Bảng phụ cho @ElementCollection List<String> images
--     Aiven yêu cầu có primary key
CREATE TABLE IF NOT EXISTS milestone_images (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    milestone_id BIGINT       NOT NULL,
    images       VARCHAR(500),
    CONSTRAINT fk_milestone_images
        FOREIGN KEY (milestone_id) REFERENCES milestone(id)
        ON DELETE CASCADE
);

-- 2. Locket moments (ảnh khoảnh khắc)
CREATE TABLE IF NOT EXISTS locket_moment (
    id        BIGINT AUTO_INCREMENT PRIMARY KEY,
    image_url VARCHAR(500),
    caption   VARCHAR(255),
    timestamp DATETIME(6)
);

-- 3. Certificates (chứng chỉ)
CREATE TABLE IF NOT EXISTS certificate (
    id        BIGINT AUTO_INCREMENT PRIMARY KEY,
    title     VARCHAR(255),
    image_url VARCHAR(500)
);

-- 4. Chat messages
CREATE TABLE IF NOT EXISTS chat_message (
    id        BIGINT AUTO_INCREMENT PRIMARY KEY,
    sender    VARCHAR(255),
    text      TEXT,
    timestamp DATETIME(6)
);

-- 5. Love locations (bản đồ)
CREATE TABLE IF NOT EXISTS love_location (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(255),
    description TEXT,
    lat         DOUBLE NOT NULL,
    lon         DOUBLE NOT NULL,
    category    VARCHAR(50)  DEFAULT 'date',
    visit_date  VARCHAR(20),
    photo_url   TEXT,
    sort_order  INT          DEFAULT 0
);

-- Migration: nếu bảng đã tồn tại, thêm cột mới
ALTER TABLE love_location ADD COLUMN IF NOT EXISTS category   VARCHAR(50) DEFAULT 'date';
ALTER TABLE love_location ADD COLUMN IF NOT EXISTS visit_date VARCHAR(20);
ALTER TABLE love_location ADD COLUMN IF NOT EXISTS photo_url  TEXT;
ALTER TABLE love_location ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;

-- 6. Reviews (đánh giá gia sư)
CREATE TABLE IF NOT EXISTS review (
    id      BIGINT AUTO_INCREMENT PRIMARY KEY,
    author  VARCHAR(255),
    role    VARCHAR(255),
    content TEXT,
    rating  INT
);

-- 7. Students (học sinh / quiz portal)
CREATE TABLE IF NOT EXISTS students (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    username     VARCHAR(255) NOT NULL UNIQUE,
    password     VARCHAR(255) NOT NULL,
    full_name    VARCHAR(255),
    avatar       VARCHAR(255),
    avg_score    DOUBLE  DEFAULT 0.0,
    quiz_count   INT     DEFAULT 0,
    student_rank INT,
    quiz_history TEXT
);
