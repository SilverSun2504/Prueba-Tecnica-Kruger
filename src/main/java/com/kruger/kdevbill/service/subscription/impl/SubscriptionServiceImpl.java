package com.kruger.kdevbill.service.subscription.impl;

import com.kruger.kdevbill.dto.request.SubscriptionCreateRequest;
import com.kruger.kdevbill.dto.request.SubscriptionUpdateRequest;
import com.kruger.kdevbill.dto.response.InvoiceResponse;
import com.kruger.kdevbill.dto.response.SubscriptionResponse;
import com.kruger.kdevbill.entity.*;
import com.kruger.kdevbill.entity.enums.InvoiceStatus;
import com.kruger.kdevbill.entity.enums.SubscriptionStatus;
import com.kruger.kdevbill.mapper.InvoiceMapper;
import com.kruger.kdevbill.mapper.SubscriptionMapper;
import com.kruger.kdevbill.repository.*;
import com.kruger.kdevbill.security.SecurityHelper;
import com.kruger.kdevbill.service.subscription.SubscriptionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SubscriptionServiceImpl implements SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final CustomerRepository customerRepository;
    private final PlanRepository planRepository;
    private final InvoiceRepository invoiceRepository;
    private final SecurityHelper securityHelper;
    private final BillingHelper billingHelper;
    private final SubscriptionMapper subscriptionMapper;
    private final InvoiceMapper invoiceMapper;

    @Override
    @Transactional
    public SubscriptionResponse createSubscription(SubscriptionCreateRequest request) {
        User authenticatedUser = securityHelper.getAuthenticatedUser();
        log.info("Creating subscription for user: {} (ID: {})", authenticatedUser.getUsername(),
                authenticatedUser.getId());

        // Obtener o buscar el customer
        Customer customer;
        if (request.getCustomerId() != null) {
            // Caso 1: Se proporciona customerId (típicamente ADMIN)
            customer = customerRepository.findById(request.getCustomerId())
                    .orElseThrow(() -> new RuntimeException("Customer not found with id: " + request.getCustomerId()));
            log.info("Using existing customer ID: {}", customer.getId());

            // Verificar permisos: solo ADMIN o el propietario pueden crear suscripciones
            // para ese customer
            if (!securityHelper.isAdmin() && !securityHelper.isOwner(customer.getOwner().getId())) {
                throw new AccessDeniedException("You do not have permission to create subscriptions for this customer");
            }
        } else {
            // Caso 2: No se proporciona customerId, buscar/crear customer del usuario
            // autenticado
            customer = customerRepository.findByOwner(authenticatedUser)
                    .orElseGet(() -> {
                        // Si no existe customer, crear uno automáticamente
                        log.info("Customer not found, creating new customer for user: {}",
                                authenticatedUser.getUsername());
                        Customer newCustomer = Customer.builder()
                                .name(authenticatedUser.getUsername())
                                .email(authenticatedUser.getEmail())
                                .owner(authenticatedUser)
                                .build();
                        Customer savedCustomer = customerRepository.save(newCustomer);
                        log.info("Customer created with ID: {} for user ID: {}", savedCustomer.getId(),
                                authenticatedUser.getId());
                        return savedCustomer;
                    });
            log.info("Using customer ID: {} for user ID: {}", customer.getId(), authenticatedUser.getId());
        }

        Plan plan = planRepository.findById(request.getPlanId())
                .orElseThrow(() -> new RuntimeException("Plan not found with id: " + request.getPlanId()));
        if (!plan.isActive()) {
            throw new IllegalArgumentException("Cannot subscribe to an inactive plan");
        }
        LocalDate startDate = LocalDate.now();
        LocalDate nextBillingDate = billingHelper.calculateNextBillingDate(startDate, plan);
        Subscription subscription = Subscription.builder()
                .customer(customer)
                .plan(plan)
                .status(SubscriptionStatus.ACTIVE)
                .startDate(startDate)
                .nextBillingDate(nextBillingDate)
                .build();
        Subscription savedSubscription = subscriptionRepository.save(subscription);
        log.info("Subscription created with ID: {} for customer ID: {}", savedSubscription.getId(), customer.getId());

        // Generar la primera factura automáticamente
        LocalDateTime issuedAt = LocalDateTime.now();
        LocalDate dueDate = issuedAt.toLocalDate().plusDays(7); // Vence en 7 días
        Invoice initialInvoice = Invoice.builder()
                .subscription(savedSubscription)
                .amount(plan.getPrice())
                .status(InvoiceStatus.OPEN)
                .issuedAt(issuedAt)
                .dueDate(dueDate)
                .build();
        invoiceRepository.save(initialInvoice);
        log.info("Initial invoice created for subscription ID: {} with amount: {}",
                savedSubscription.getId(), plan.getPrice());

        return subscriptionMapper.toSubscriptionResponse(savedSubscription);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubscriptionResponse> getMySubscriptions() {
        User authenticatedUser = securityHelper.getAuthenticatedUser();
        log.info("=== GET MY SUBSCRIPTIONS START ===");
        log.info("User: {} (ID: {})", authenticatedUser.getUsername(), authenticatedUser.getId());
        log.info("User details - Username length: {}, Username bytes: {}",
                authenticatedUser.getUsername().length(),
                java.util.Arrays.toString(authenticatedUser.getUsername().getBytes()));

        // Intentar múltiples estrategias para encontrar el customer
        Customer customer = null;

        // Estrategia 1: Por username del owner
        log.info("Trying Strategy 1: findByOwnerUsername with username: '{}'", authenticatedUser.getUsername());
        customer = customerRepository.findByOwnerUsername(authenticatedUser.getUsername())
                .orElse(null);

        if (customer != null) {
            log.info("Strategy 1 SUCCESS: Found customer by username. Customer ID: {}", customer.getId());
        } else {
            log.warn("Strategy 1 FAILED: Customer not found by username: '{}'", authenticatedUser.getUsername());

            // Estrategia 2: Por ID del owner
            log.info("Trying Strategy 2: findByOwnerId with ID: {}", authenticatedUser.getId());
            customer = customerRepository.findByOwnerId(authenticatedUser.getId())
                    .orElse(null);

            if (customer != null) {
                log.info("Strategy 2 SUCCESS: Found customer by owner ID. Customer ID: {}, Customer name: {}",
                        customer.getId(), customer.getName());
            } else {
                log.warn("Strategy 2 FAILED: Customer not found by owner ID: {}", authenticatedUser.getId());

                // Estrategia 3: Por instancia del User
                customer = customerRepository.findByOwner(authenticatedUser)
                        .orElse(null);

                if (customer != null) {
                    log.info("Strategy 3 SUCCESS: Found customer by User instance. Customer ID: {}", customer.getId());
                } else {
                    log.error("ALL STRATEGIES FAILED: No customer found for user: {} (ID: {})",
                            authenticatedUser.getUsername(), authenticatedUser.getId());

                    // Log todos los customers para debugging
                    java.util.List<Customer> allCustomers = customerRepository.findAll();
                    log.error("Total customers in DB: {}", allCustomers.size());
                    allCustomers.forEach(c -> log.error("  - Customer ID: {}, Owner ID: {}, Owner Username: {}",
                            c.getId(), c.getOwner().getId(), c.getOwner().getUsername()));

                    // Lanzar excepción más descriptiva en lugar de retornar array vacío
                    throw new RuntimeException(
                            "No customer profile found for user: " + authenticatedUser.getUsername() +
                                    ". Please create a customer profile first or contact administrator.");
                }
            }
        }

        log.info("Using customer ID: {} (Owner: {})", customer.getId(), customer.getOwner().getUsername());

        List<Subscription> subscriptions = subscriptionRepository.findByCustomerId(customer.getId());
        log.info("Found {} subscriptions for customer ID: {}", subscriptions.size(), customer.getId());
        log.info("=== GET MY SUBSCRIPTIONS END ===");

        return subscriptions.stream()
                .map(subscriptionMapper::toSubscriptionResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubscriptionResponse> getSubscriptionsByCustomerId(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + customerId));
        if (!securityHelper.isAdmin() && !securityHelper.isOwner(customer.getOwner().getId())) {
            throw new AccessDeniedException("You do not have permission to view these subscriptions");
        }
        return subscriptionRepository.findByCustomerId(customerId).stream()
                .map(subscriptionMapper::toSubscriptionResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public SubscriptionResponse updateSubscription(Long id, SubscriptionUpdateRequest request) {
        Subscription subscription = subscriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subscription not found with id: " + id));
        if (!securityHelper.isAdmin() && !securityHelper.isOwner(subscription.getCustomer().getOwner().getId())) {
            throw new AccessDeniedException("You do not have permission to update this subscription");
        }
        if (request.getPlanId() != null) {
            Plan newPlan = planRepository.findById(request.getPlanId())
                    .orElseThrow(() -> new RuntimeException("Plan not found with id: " + request.getPlanId()));
            if (!newPlan.isActive()) {
                throw new IllegalArgumentException("Cannot change to an inactive plan");
            }
            subscription.setPlan(newPlan);
        }
        subscription.setStatus(request.getStatus());
        if (request.getStatus() == SubscriptionStatus.CANCELED) {
            subscription.setNextBillingDate(null);
        }
        Subscription updatedSubscription = subscriptionRepository.save(subscription);
        return subscriptionMapper.toSubscriptionResponse(updatedSubscription);
    }

    @Override
    @Transactional
    public InvoiceResponse renewSubscription(Long id) {
        Subscription subscription = subscriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subscription not found with id: " + id));
        if (!securityHelper.isAdmin() && !securityHelper.isOwner(subscription.getCustomer().getOwner().getId())) {
            throw new AccessDeniedException("You do not have permission to renew this subscription");
        }

        Plan plan = subscription.getPlan();
        LocalDateTime issuedAt = LocalDateTime.now();
        LocalDate dueDate = issuedAt.toLocalDate().plusDays(7);
        Invoice invoice = Invoice.builder()
                .subscription(subscription)
                .amount(plan.getPrice())
                .status(InvoiceStatus.OPEN)
                .issuedAt(issuedAt)
                .dueDate(dueDate)
                .build();
        Invoice savedInvoice = invoiceRepository.save(invoice);
        return invoiceMapper.toInvoiceResponse(savedInvoice);
    }
}