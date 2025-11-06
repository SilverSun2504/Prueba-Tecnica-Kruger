package com.kruger.kdevbill.mapper;

import com.kruger.kdevbill.dto.response.PaymentResponse;
import com.kruger.kdevbill.entity.Payment;
import org.springframework.stereotype.Component;

@Component
public class PaymentMapper {

    public PaymentResponse toPaymentResponse(Payment payment) {
        PaymentResponse response = new PaymentResponse();
        response.setId(payment.getId());
        response.setAmount(payment.getAmount());
        response.setMethod(payment.getMethod());
        response.setStatus(payment.getStatus());
        response.setPaidAt(payment.getPaidAt());
        response.setReference(payment.getReference()); 
        if (payment.getInvoice() != null) {
            response.setInvoiceId(payment.getInvoice().getId());
        }
        return response;
    }
}