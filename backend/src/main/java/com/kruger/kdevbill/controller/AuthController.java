package com.kruger.kdevbill.controller;

import com.kruger.kdevbill.dto.request.LoginRequest;
import com.kruger.kdevbill.dto.request.RegisterRequest;
import com.kruger.kdevbill.dto.response.AuthResponse;
import com.kruger.kdevbill.service.auth.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticación", description = "Operaciones de registro y login de usuarios")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Registrar nuevo usuario", description = "Permite registrar un nuevo usuario en el sistema")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuario registrado exitosamente"),
            @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos"),
            @ApiResponse(responseCode = "409", description = "El usuario ya existe")
    })
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    @Operation(summary = "Iniciar sesión", description = "Autentica un usuario y devuelve un token JWT")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Login exitoso"),
            @ApiResponse(responseCode = "401", description = "Credenciales inválidas"),
            @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos")
    })
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    @Operation(summary = "Obtener información del usuario autenticado", description = "Devuelve los detalles del usuario actualmente autenticado (endpoint de debug)")
    public ResponseEntity<Map<String, Object>> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> userInfo = new HashMap<>();

        if (auth != null && auth.isAuthenticated()) {
            userInfo.put("username", auth.getName());
            userInfo.put("authorities", auth.getAuthorities());
            userInfo.put("authenticated", auth.isAuthenticated());
            userInfo.put("principal", auth.getPrincipal());
        } else {
            userInfo.put("error", "Usuario no autenticado");
        }

        return ResponseEntity.ok(userInfo);
    }

    @PostMapping("/admin/migrate-customers")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "ADMIN: Migrar usuarios legacy", description = "Crea customer profiles para todos los usuarios USER que no tengan uno (solo ADMIN)")
    @ApiResponse(responseCode = "200", description = "Migración completada exitosamente")
    @ApiResponse(responseCode = "403", description = "Acceso denegado - Solo para administradores")
    public ResponseEntity<Map<String, Object>> migrateCustomersForLegacyUsers() {
        Map<String, Object> result = authService.createMissingCustomers();
        return ResponseEntity.ok(result);
    }
}