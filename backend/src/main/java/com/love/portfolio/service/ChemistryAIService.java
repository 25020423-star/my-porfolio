package com.love.portfolio.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class ChemistryAIService {
    private static final Logger log = LoggerFactory.getLogger(ChemistryAIService.class);
    private final GeminiClient geminiClient;
    private final ObjectMapper objectMapper;

    public ChemistryAIService(GeminiClient geminiClient, ObjectMapper objectMapper) {
        this.geminiClient = geminiClient;
        this.objectMapper = objectMapper;
    }

    public Map<String, String> solveChemistry(String reactants) {
        return solveChemistryWithImage(null, reactants);
    }

    public Map<String, String> solveChemistryWithImage(byte[] imageBytes, String userPrompt) {
        String prompt = "Bạn là chuyên gia Hóa học. Phân tích đề bài và trả về JSON nghiêm ngặt gồm hai trường "
                + "balanced và explanation, không dùng markdown. Đề bài: "
                + (userPrompt == null ? "Phân tích hình ảnh được gửi kèm." : userPrompt);
        try {
            String response = imageBytes == null
                    ? geminiClient.generateText(prompt)
                    : geminiClient.generateWithImage(prompt, imageBytes, MediaType.IMAGE_JPEG_VALUE);
            return objectMapper.readValue(extractJson(response), new TypeReference<>() {});
        } catch (Exception error) {
            log.warn("Unable to solve chemistry request", error);
            return Map.of("balanced", "Lỗi AI", "explanation", "Không thể xử lý yêu cầu lúc này.");
        }
    }

    public String generateQuiz(String topic) {
        String prompt = "Bạn là giáo viên Hóa học. Tạo 5 câu hỏi trắc nghiệm về " + topic
                + ". Trả về duy nhất JSON array; mỗi phần tử gồm question, options (4 lựa chọn), correct (0-3), explanation bằng tiếng Việt.";
        try {
            return stripCodeFence(geminiClient.generateText(prompt));
        } catch (Exception error) {
            log.warn("Unable to generate chemistry quiz", error);
            return "[]";
        }
    }

    public Map<String, Object> researchTopic(String topic, String type) {
        String fields = switch (type == null ? "chemistry" : type.toLowerCase()) {
            case "ai" -> "overview, architecture, use_cases, limitations";
            case "deep_learning" -> "overview, optimization, hardware, future_trends";
            default -> "overview, properties, applications, safety";
        };
        String prompt = "Viết báo cáo nghiên cứu học thuật bằng tiếng Việt về " + topic
                + ". Trả về JSON nghiêm ngặt với các trường: " + fields + ". Không dùng markdown.";
        try {
            return objectMapper.readValue(extractJson(geminiClient.generateText(prompt)), new TypeReference<>() {});
        } catch (Exception error) {
            log.warn("Unable to research chemistry topic", error);
            return Map.of("overview", "Không thể truy xuất dữ liệu nghiên cứu lúc này.");
        }
    }

    private String extractJson(String value) {
        String clean = stripCodeFence(value);
        int start = clean.indexOf('{');
        int end = clean.lastIndexOf('}');
        if (start < 0 || end <= start) throw new IllegalArgumentException("Gemini response is not a JSON object");
        return clean.substring(start, end + 1);
    }

    private String stripCodeFence(String value) {
        return value.replace("```json", "").replace("```", "").trim();
    }
}
