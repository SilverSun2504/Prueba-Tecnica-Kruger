package com.kruger.kdevbill.service.auth;

import com.kruger.kdevbill.dto.request.LoginRequest;
import com.kruger.kdevbill.dto.request.RegisterRequest;
import com.kruger.kdevbill.dto.response.AuthResponse;
import java.util.List;
import java.util.Map;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    List<Map<String, Object>> getAllCustomersDebug();

    Map<String, Object> createMissingCustomers();
}