package com.love.portfolio.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    private String fullName;
    private String avatar;
    private Double avgScore = 0.0;
    private Integer quizCount = 0;
    private Integer studentRank;

    @Column(columnDefinition = "TEXT")
    private String quizHistory; // Store as JSON string for simplicity
}
