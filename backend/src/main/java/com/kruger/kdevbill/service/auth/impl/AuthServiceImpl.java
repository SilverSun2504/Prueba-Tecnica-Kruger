package com.kruger.kdevbill.service.auth.impl;

import com.kruger.kdevbill.dto.request.LoginRequest;
import com.kruger.kdevbill.dto.request.RegisterRequest;
import com.kruger.kdevbill.dto.response.AuthResponse;
import com.kruger.kdevbill.entity.User;
import com.kruger.kdevbill.entity.enums.Role;
import com.kruger.kdevbill.repository.UserRepository;
import com.kruger.kdevbill.security.JwtService;
import com.kruger.kdevbill.service.auth.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;

        @Override
        @Transactional
        public AuthResponse register(RegisterRequest request) {
                if (userRepository.existsByUsername(request.getUsername())) {
                        throw new IllegalArgumentException("Error: Username is already taken!");
                }

                if (userRepository.existsByEmail(request.getEmail())) {
                        throw new IllegalArgumentException("Error: Email is already in use!");
                }

                // Determinar rol basado en el username
                Role userRole = request.getUsername().toLowerCase().contains("admin") ? Role.ADMIN : Role.USER;

                User user = User.builder()
                                .username(request.getUsername())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .role(userRole)
                                .build();

                User savedUser = userRepository.save(user);

                String jwtToken = jwtService.generateToken(savedUser);

                return AuthResponse.builder()
                                .token(jwtToken)
                                .username(savedUser.getUsername())
                                .role(savedUser.getRole().name())
                                .build();
        }

        @Override
        public AuthResponse login(LoginRequest request) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getUsername(),
                                                request.getPassword()));

                User user = userRepository.findByUsername(request.getUsername())
                                .orElseThrow(() -> new IllegalStateException("User not found after authentication"));

                String jwtToken = jwtService.generateToken(user);

                return AuthResponse.builder()
                                .token(jwtToken)
                                .username(user.getUsername())
                                .role(user.getRole().name())
                                .build();
        }
}