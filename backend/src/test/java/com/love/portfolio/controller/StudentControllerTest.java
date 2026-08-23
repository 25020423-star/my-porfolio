package com.love.portfolio.controller;

import com.love.portfolio.model.Student;
import com.love.portfolio.repository.StudentRepository;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class StudentControllerTest {
    private final StudentRepository repository = mock(StudentRepository.class);
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    private final StudentController controller = new StudentController(repository, encoder);

    @Test
    void registrationHashesPassword() {
        Student request = student("manh", "password123");
        when(repository.findByUsername("manh")).thenReturn(Optional.empty());
        when(repository.save(any(Student.class))).thenAnswer(invocation -> invocation.getArgument(0));

        assertEquals(HttpStatus.OK, controller.register(request).getStatusCode());
        assertTrue(encoder.matches("password123", request.getPassword()));
    }

    @Test
    void legacyPasswordIsUpgradedDuringLogin() {
        Student stored = student("manh", "legacy-pass");
        when(repository.findByUsername("manh")).thenReturn(Optional.of(stored));
        when(repository.save(any(Student.class))).thenAnswer(invocation -> invocation.getArgument(0));
        MockHttpSession session = new MockHttpSession();

        assertEquals(HttpStatus.OK, controller.login(student("manh", "legacy-pass"), session).getStatusCode());
        assertEquals("manh", session.getAttribute("studentUsername"));
        assertTrue(encoder.matches("legacy-pass", stored.getPassword()));
    }

    @Test
    void profileRequiresMatchingStudentSession() {
        MockHttpSession session = new MockHttpSession();
        assertEquals(HttpStatus.UNAUTHORIZED, controller.getProfile("manh", session).getStatusCode());
    }

    private Student student(String username, String password) {
        Student student = new Student();
        student.setUsername(username);
        student.setPassword(password);
        return student;
    }
}
