package com.love.portfolio.controller;

import com.love.portfolio.service.ChemistryAIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/chemistry")
@CrossOrigin(origins = "*")
public class ChemistryAIController {

    @Autowired
    private ChemistryAIService chemistryAIService;

    @PostMapping("/solve")
    public Object solveEquation(@RequestBody Map<String, String> request) {
        String prompt = request.get("prompt");
        return chemistryAIService.solveChemistry(prompt);
    }

    @PostMapping("/solve-image")
    public Object solveWithImage(@RequestParam(value = "image", required = false) org.springframework.web.multipart.MultipartFile image,
                                 @RequestParam(value = "prompt", required = false) String prompt) {
        try {
            byte[] bytes = (image != null) ? image.getBytes() : null;
            return chemistryAIService.solveChemistryWithImage(bytes, prompt);
        } catch (Exception e) {
            return Map.of("balanced", "Lỗi tải ảnh", "explanation", "Không thể đọc dữ liệu ảnh.");
        }
    }

    @PostMapping("/generate-quiz")
    public String generateQuiz(@RequestBody Map<String, String> request) {
        String topic = request.get("topic");
        return chemistryAIService.generateQuiz(topic);
    }

    @PostMapping("/research")
    public Object research(@RequestBody Map<String, String> request) {
        String topic = request.get("topic");
        String type = request.getOrDefault("type", "chemistry");
        return chemistryAIService.researchTopic(topic, type);
    }
}
