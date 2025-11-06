package com.kruger.kdevbill.dto.request;

import com.kruger.kdevbill.entity.enums.BillingCycle;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PlanRequest {

    @NotBlank(message = "Nombre del plan es obligatorio")
    private String name;

    @NotNull(message = "El precio es obligatorio")
    @DecimalMin(value = "0.0", inclusive = true, message = "El precio debe ser cero o positivo")
    private BigDecimal price;

    @NotNull(message = "El ciclo de facturación es obligatorio")
    private BillingCycle billingCycle;

    @NotNull(message = "'active' este campo es obligatorio")
    private Boolean active;
}