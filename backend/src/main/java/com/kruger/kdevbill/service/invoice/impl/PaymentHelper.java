package com.kruger.kdevbill.service.invoice.impl;

import com.kruger.kdevbill.entity.Invoice;
import com.kruger.kdevbill.entity.Payment;
import com.kruger.kdevbill.entity.enums.PaymentMethod;
import com.kruger.kdevbill.entity.enums.PaymentStatus;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.UUID;

@Component
public class PaymentHelper {
    public Payment processPayment(Invoice invoice) {
        PaymentStatus status = PaymentStatus.SUCCESS;
        PaymentMethod method = PaymentMethod.CARD;
        String reference = "PAY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return Payment.builder()
                .invoice(invoice)
                .amount(invoice.getAmount())
                .method(method)
                .status(status)
                .paidAt(LocalDateTime.now())
                .reference(reference)
                .build();
    }
}