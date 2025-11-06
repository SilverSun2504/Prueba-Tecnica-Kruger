package com.kruger.kdevbill.dto.request;

import com.kruger.kdevbill.entity.enums.SubscriptionStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class SubscriptionUpdateRequest {

    @Positive(message = "Plan ID debe ser un número positivo")
    private Long planId;

    @NotNull(message = "Status es obligatorio")
    private SubscriptionStatus status; 
}