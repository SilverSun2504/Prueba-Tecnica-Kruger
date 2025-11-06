package com.kruger.kdevbill.dto.response;

import com.kruger.kdevbill.entity.enums.PaymentMethod;
import com.kruger.kdevbill.entity.enums.PaymentStatus;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PaymentResponse {
    private Long id;
    private BigDecimal amount;
    private PaymentMethod method;
    private PaymentStatus status;
    private LocalDateTime paidAt;
    private String reference;
    private Long invoiceId;
}