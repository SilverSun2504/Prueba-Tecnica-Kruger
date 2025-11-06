package com.kruger.kdevbill.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class SubscriptionCreateRequest {

    @NotNull(message = "Plan ID es obligatorio")
    @Positive(message = "Plan ID debe ser un número positivo")
    private Long planId;

    // Optional: Si se proporciona, se usa este customer (útil para ADMIN)
    // Si no se proporciona, se busca/crea el customer del usuario autenticado
    @Positive(message = "Customer ID debe ser un número positivo")
    private Long customerId;

}