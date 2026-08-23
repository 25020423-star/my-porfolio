package com.love.portfolio.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AdminAuthInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) return true;
        String path = request.getRequestURI();
        boolean publicRead = "GET".equalsIgnoreCase(request.getMethod())
                && (path.startsWith("/api/exams")
                || path.startsWith("/api/settings")
                || path.startsWith("/api/goals")
                || path.startsWith("/api/milestones")
                || path.startsWith("/api/certificates"));
        var session = request.getSession(false);
        boolean authenticated = session != null && Boolean.TRUE.equals(session.getAttribute("adminAuthenticated"));
        if (publicRead || authenticated) return true;
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write("{\"message\":\"Bạn cần đăng nhập quản trị.\"}");
        return false;
    }
}
