package com.kruger.kdevbill.service.auth;

import com.kruger.kdevbill.dto.request.LoginRequest;
import com.kruger.kdevbill.dto.request.RegisterRequest;
import com.kruger.kdevbill.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}