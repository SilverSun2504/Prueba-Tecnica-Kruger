package com.kruger.kdevbill.dto.response;

import com.kruger.kdevbill.entity.enums.BillingCycle;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class PlanResponse {
    private Long id;
    private String name;
    private BigDecimal price;
    private BillingCycle billingCycle;
    private boolean active;
}