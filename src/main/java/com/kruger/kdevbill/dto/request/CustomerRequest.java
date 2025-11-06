package com.kruger.kdevbill.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class CustomerRequest {

    @NotBlank(message = "El nombre del cliente es requerido")
    private String name;

    @NotBlank(message = "El email del cliente es requerido")
    @Email(message = "El formato del email es inválido")
    private String email;

    @NotNull(message = "El ID del usuario (dueño) es requerido")
    @Positive(message = "El ID del usuario debe ser un número positivo")
    private Long userId;
}