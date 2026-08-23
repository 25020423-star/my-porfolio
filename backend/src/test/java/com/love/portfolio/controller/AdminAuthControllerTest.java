package com.love.portfolio.controller;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockHttpSession;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class AdminAuthControllerTest {
    private final AdminAuthController controller = new AdminAuthController("2468");

    @Test
    void rejectsWrongPinAndAcceptsConfiguredPin() {
        MockHttpSession session = new MockHttpSession();
        assertEquals(HttpStatus.UNAUTHORIZED, controller.login(Map.of("pin", "0000"), session).getStatusCode());
        assertEquals(HttpStatus.OK, controller.login(Map.of("pin", "2468"), session).getStatusCode());
        assertTrue(controller.me(session).get("authenticated"));
    }

    @Test
    void logoutInvalidatesAdminSession() {
        MockHttpSession session = new MockHttpSession();
        controller.login(Map.of("pin", "2468"), session);
        assertFalse(controller.logout(session).get("authenticated"));
        assertTrue(session.isInvalid());
    }
}
