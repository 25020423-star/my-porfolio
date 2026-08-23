package com.love.portfolio.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class AIService {
    private static final Logger log = LoggerFactory.getLogger(AIService.class);
    private final GeminiClient geminiClient;

    public AIService(GeminiClient geminiClient) {
        this.geminiClient = geminiClient;
    }

    public String getAIResponse(String userPrompt) {
        String prompt = "Bạn là trợ lý AI của Hoàng Mạnh Trường (Mtruong_dev), am hiểu Hóa học, Java, "
                + "Spring Boot, AI, Deep Learning và dịch vụ gia sư. Hãy trả lời thân thiện, chuyên nghiệp bằng tiếng Việt. "
                + "Học phí gia sư khoảng 200k-350k/buổi; anh Trường học tại UET - ĐHQGHN.\n\nNgười dùng: " + userPrompt;
        try {
            return geminiClient.generateText(prompt);
        } catch (Exception error) {
            log.warn("Gemini AI request failed", error);
            return "Xin lỗi, mình đang gặp chút trục trặc kỹ thuật. Hãy nhắn lại sau vài giây nhé!";
        }
    }
}
