package com.kruger.kdevbill.service.payment;

import com.kruger.kdevbill.dto.response.PaymentResponse;

import java.util.List;

public interface PaymentService {

    List<PaymentResponse> getMyPayments();

    PaymentResponse getPaymentById(Long id);
}