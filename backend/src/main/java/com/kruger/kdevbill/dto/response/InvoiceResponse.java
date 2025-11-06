package com.kruger.kdevbill.dto.response;

import com.kruger.kdevbill.entity.enums.InvoiceStatus;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class InvoiceResponse {
    private Long id;
    private BigDecimal amount;
    private InvoiceStatus status;
    private LocalDate dueDate;
    private LocalDateTime issuedAt;
    private Long subscriptionId;
}