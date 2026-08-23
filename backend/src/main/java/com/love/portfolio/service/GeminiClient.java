package com.love.portfolio.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
public class GeminiClient {
    private final RestTemplate restTemplate;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.model:gemini-1.5-flash}")
    private String model;

    public GeminiClient(RestTemplateBuilder builder) {
        this.restTemplate = builder.build();
    }

    public String generateText(String prompt) {
        return generate(prompt, null, null);
    }

    public String generateWithImage(String prompt, byte[] imageBytes, String mimeType) {
        return generate(prompt, imageBytes, mimeType);
    }

    private String generate(String prompt, byte[] imageBytes, String mimeType) {
        List<Map<String, Object>> parts = new ArrayList<>();
        parts.add(Map.of("text", prompt));
        if (imageBytes != null && imageBytes.length > 0) {
            parts.add(Map.of("inline_data", Map.of(
                    "mime_type", mimeType == null ? MediaType.IMAGE_JPEG_VALUE : mimeType,
                    "data", Base64.getEncoder().encodeToString(imageBytes)
            )));
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        Map<String, Object> request = Map.of("contents", List.of(Map.of("parts", parts)));
        String url = "https://generativelanguage.googleapis.com/v1/models/" + model
                + ":generateContent?key=" + apiKey;
        ResponseEntity<JsonNode> response = restTemplate.exchange(
                url, HttpMethod.POST, new HttpEntity<>(request, headers), JsonNode.class);
        JsonNode text = response.getBody() == null ? null
                : response.getBody().path("candidates").path(0).path("content").path("parts").path(0).path("text");
        if (text == null || text.isMissingNode() || text.asText().isBlank()) {
            throw new IllegalStateException("Gemini returned an empty response");
        }
        return text.asText();
    }
}
