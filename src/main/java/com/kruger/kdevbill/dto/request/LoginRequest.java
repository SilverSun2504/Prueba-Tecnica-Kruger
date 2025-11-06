package com.kruger.kdevbill.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {

    @NotBlank(message = "Usuario es requerido")
    private String username;

    @NotBlank(message = "La contraseña es requerida")
    private String password;
}