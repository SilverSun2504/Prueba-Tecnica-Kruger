package com.kruger.kdevbill.service.payment.impl;

import com.kruger.kdevbill.dto.response.PaymentResponse;
import com.kruger.kdevbill.entity.Customer;
import com.kruger.kdevbill.entity.Payment;
import com.kruger.kdevbill.entity.User;
import com.kruger.kdevbill.mapper.PaymentMapper;
import com.kruger.kdevbill.repository.CustomerRepository;
import com.kruger.kdevbill.repository.PaymentRepository;
import com.kruger.kdevbill.security.SecurityHelper;
import com.kruger.kdevbill.service.payment.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final CustomerRepository customerRepository;
    private final SecurityHelper securityHelper;
    private final PaymentMapper paymentMapper;

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> getMyPayments() {
        User authenticatedUser = securityHelper.getAuthenticatedUser();
        Customer customer = customerRepository.findByOwner(authenticatedUser)
                .orElseThrow(() -> new RuntimeException("Customer profile not found"));
        return paymentRepository.findByInvoice_Subscription_CustomerId(customer.getId()).stream()
                .map(paymentMapper::toPaymentResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponse getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));
        Long ownerId = payment.getInvoice().getSubscription().getCustomer().getOwner().getId();
        if (!securityHelper.isAdmin() && !securityHelper.isOwner(ownerId)) {
            throw new AccessDeniedException("You do not have permission to view this payment");
        }
        return paymentMapper.toPaymentResponse(payment);
    }
}