package com.kruger.kdevbill.service.invoice.impl;

import com.kruger.kdevbill.dto.response.InvoiceResponse;
import com.kruger.kdevbill.dto.response.PaymentResponse;
import com.kruger.kdevbill.entity.Customer;
import com.kruger.kdevbill.entity.Invoice;
import com.kruger.kdevbill.entity.Payment;
import com.kruger.kdevbill.entity.Subscription;
import com.kruger.kdevbill.entity.User;
import com.kruger.kdevbill.entity.enums.InvoiceStatus;
import com.kruger.kdevbill.entity.enums.PaymentStatus;
import com.kruger.kdevbill.mapper.InvoiceMapper;
import com.kruger.kdevbill.mapper.PaymentMapper;
import com.kruger.kdevbill.repository.CustomerRepository;
import com.kruger.kdevbill.repository.InvoiceRepository;
import com.kruger.kdevbill.repository.PaymentRepository;
import com.kruger.kdevbill.repository.SubscriptionRepository;
import com.kruger.kdevbill.security.SecurityHelper;
import com.kruger.kdevbill.service.invoice.InvoiceService;
import com.kruger.kdevbill.service.subscription.impl.BillingHelper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class InvoiceServiceImpl implements InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;
    private final CustomerRepository customerRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final SecurityHelper securityHelper;
    private final InvoiceMapper invoiceMapper;
    private final PaymentMapper paymentMapper;
    private final PaymentHelper paymentHelper;
    private final BillingHelper billingHelper;

    @Override
    @Transactional(readOnly = true)
    public List<InvoiceResponse> getMyInvoices() {
        User authenticatedUser = securityHelper.getAuthenticatedUser();

        // Búsqueda del customer por ID del owner para evitar problemas de comparación
        // de instancias
        Customer customer = customerRepository.findByOwnerId(authenticatedUser.getId())
                .orElseThrow(() -> new RuntimeException(
                        "No customer profile found for user: " + authenticatedUser.getUsername() +
                                ". Please create a customer profile first or contact administrator."));

        List<Invoice> invoices = invoiceRepository.findBySubscription_CustomerId(customer.getId());

        return invoices.stream()
                .map(invoiceMapper::toInvoiceResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public InvoiceResponse getInvoiceById(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found with id: " + id));
        Long ownerId = invoice.getSubscription().getCustomer().getOwner().getId();
        if (!securityHelper.isAdmin() && !securityHelper.isOwner(ownerId)) {
            throw new AccessDeniedException("You do not have permission to view this invoice");
        }
        return invoiceMapper.toInvoiceResponse(invoice);
    }

    @Override
    @Transactional
    public PaymentResponse payInvoice(Long id) {
        Invoice invoice = invoiceRepository.findByIdAndStatus(id, InvoiceStatus.OPEN)
                .orElseThrow(() -> new RuntimeException("Invoice not found or is not in 'OPEN' status. ID: " + id));
        Long ownerId = invoice.getSubscription().getCustomer().getOwner().getId();
        if (!securityHelper.isAdmin() && !securityHelper.isOwner(ownerId)) {
            throw new AccessDeniedException("You do not have permission to pay this invoice");
        }
        Payment payment = paymentHelper.processPayment(invoice);
        Payment savedPayment = paymentRepository.save(payment);
        if (savedPayment.getStatus() == PaymentStatus.SUCCESS) {
            invoice.setStatus(InvoiceStatus.PAID);
            invoiceRepository.save(invoice);
            Subscription subscription = invoice.getSubscription();
            if (subscription.getNextBillingDate() != null &&
                    subscription.getNextBillingDate().isEqual(invoice.getDueDate().minusDays(7))) {

                LocalDate newNextBillingDate = billingHelper.calculateNextBillingDate(
                        subscription.getNextBillingDate(),
                        subscription.getPlan());
                subscription.setNextBillingDate(newNextBillingDate);
                subscriptionRepository.save(subscription);
            }
        }
        return paymentMapper.toPaymentResponse(savedPayment);
    }
}