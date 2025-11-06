package com.kruger.kdevbill.dto.response;

import com.kruger.kdevbill.entity.enums.SubscriptionStatus;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class SubscriptionResponse {
    private Long id;
    private SubscriptionStatus status;
    private LocalDate startDate;
    private LocalDate nextBillingDate;
    private LocalDateTime createdAt;
    
    private PlanResponse plan;
    private CustomerBasicResponse customer;
}