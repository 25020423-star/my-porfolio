package com.love.portfolio.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class ChemistryAIServiceTest {
    @Test
    void parsesJsonWrappedInMarkdownFence() {
        GeminiClient client = mock(GeminiClient.class);
        when(client.generateText(anyString())).thenReturn("```json\n{\"balanced\":\"2H2 + O2 → 2H2O\",\"explanation\":\"Đã cân bằng\"}\n```");
        ChemistryAIService service = new ChemistryAIService(client, new ObjectMapper());

        Map<String, String> result = service.solveChemistry("H2 + O2 -> H2O");
        assertEquals("2H2 + O2 → 2H2O", result.get("balanced"));
    }

    @Test
    void returnsSafeFallbackWhenGeminiFails() {
        GeminiClient client = mock(GeminiClient.class);
        when(client.generateText(anyString())).thenThrow(new IllegalStateException("offline"));
        ChemistryAIService service = new ChemistryAIService(client, new ObjectMapper());

        assertEquals("Lỗi AI", service.solveChemistry("H2").get("balanced"));
    }
}
