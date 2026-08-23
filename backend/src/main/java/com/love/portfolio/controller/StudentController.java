package com.love.portfolio.controller;

import com.love.portfolio.model.Student;
import com.love.portfolio.repository.StudentRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    public StudentController(StudentRepository studentRepository, PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Student student) {
        if (student.getUsername() == null || student.getUsername().isBlank()
                || student.getPassword() == null || student.getPassword().length() < 8) {
            return ResponseEntity.badRequest().body("Tên đăng nhập không được trống và mật khẩu phải có ít nhất 8 ký tự.");
        }
        student.setUsername(student.getUsername().trim());
        if (studentRepository.findByUsername(student.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Tài khoản đã tồn tại!");
        }
        student.setPassword(passwordEncoder.encode(student.getPassword()));
        return ResponseEntity.ok(studentRepository.save(student));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Student student, HttpSession session) {
        Optional<Student> foundStudent = studentRepository.findByUsername(student.getUsername());
        if (foundStudent.isEmpty() || student.getPassword() == null) {
            return ResponseEntity.status(401).body("Tên đăng nhập hoặc mật khẩu không đúng.");
        }
        Student stored = foundStudent.get();
        boolean legacyPassword = !stored.getPassword().startsWith("$2");
        boolean matches = legacyPassword
                ? MessageDigest.isEqual(stored.getPassword().getBytes(StandardCharsets.UTF_8), student.getPassword().getBytes(StandardCharsets.UTF_8))
                : passwordEncoder.matches(student.getPassword(), stored.getPassword());
        if (!matches) return ResponseEntity.status(401).body("Tên đăng nhập hoặc mật khẩu không đúng.");
        if (legacyPassword) {
            stored.setPassword(passwordEncoder.encode(student.getPassword()));
            studentRepository.save(stored);
        }
        session.setAttribute("studentUsername", stored.getUsername());
        return ResponseEntity.ok(stored);
    }

    @GetMapping("/profile/{username}")
    public ResponseEntity<?> getProfile(@PathVariable String username, HttpSession session) {
        if (!username.equals(session.getAttribute("studentUsername"))) return ResponseEntity.status(401).build();
        return studentRepository.findByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/save-quiz")
    public ResponseEntity<?> saveQuiz(@RequestBody QuizResultRequest request, HttpSession session) {
        if (!Objects.equals(request.getUsername(), session.getAttribute("studentUsername"))) return ResponseEntity.status(401).build();
        Optional<Student> optStudent = studentRepository.findByUsername(request.getUsername());
        if (optStudent.isPresent()) {
            Student student = optStudent.get();
            
            // Cập nhật thống kê
            int oldCount = student.getQuizCount() != null ? student.getQuizCount() : 0;
            double oldAvg = student.getAvgScore() != null ? student.getAvgScore() : 0.0;
            
            int newCount = oldCount + 1;
            double newAvg = ((oldAvg * oldCount) + request.getScore()) / newCount;
            
            student.setQuizCount(newCount);
            student.setAvgScore(newAvg);
            
            // Cập nhật lịch sử (lưu dạng JSON string)
            String historyJson = String.format("{\"examTitle\":\"%s\",\"score\":%.1f,\"date\":\"%s\"}", 
                    request.getExamTitle(), request.getScore(), new java.util.Date().toString());
            
            String currentHistory = student.getQuizHistory();
            if (currentHistory == null || currentHistory.isEmpty() || currentHistory.equals("[]")) {
                student.setQuizHistory("[" + historyJson + "]");
            } else {
                // Thêm vào chuỗi JSON array hiện tại
                student.setQuizHistory(currentHistory.substring(0, currentHistory.length() - 1) + "," + historyJson + "]");
            }
            
            return ResponseEntity.ok(studentRepository.save(student));
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok().build();
    }

    // DTO class for request
    public static class QuizResultRequest {
        private String username;
        private String examTitle;
        private Double score;
        // getters and setters
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getExamTitle() { return examTitle; }
        public void setExamTitle(String examTitle) { this.examTitle = examTitle; }
        public Double getScore() { return score; }
        public void setScore(Double score) { this.score = score; }
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<java.util.List<Student>> getLeaderboard() {
        return ResponseEntity.ok(studentRepository.findAll().stream()
                .sorted((s1, s2) -> Double.compare(s2.getAvgScore(), s1.getAvgScore()))
                .limit(5)
                .toList());
    }
}
