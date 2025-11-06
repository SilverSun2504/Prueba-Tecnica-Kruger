package com.kruger.kdevbill.service.customer.impl;

import com.kruger.kdevbill.dto.request.CustomerRequest;
import com.kruger.kdevbill.dto.response.CustomerResponse;
import com.kruger.kdevbill.entity.Customer;
import com.kruger.kdevbill.entity.User;
import com.kruger.kdevbill.mapper.CustomerMapper;
import com.kruger.kdevbill.repository.CustomerRepository;
import com.kruger.kdevbill.repository.UserRepository;
import com.kruger.kdevbill.security.SecurityHelper;
import com.kruger.kdevbill.service.customer.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final CustomerMapper customerMapper;
    private final SecurityHelper securityHelper;

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')") 
    public CustomerResponse createCustomer(CustomerRequest request) {
        User owner = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + request.getUserId()));

        if (customerRepository.findByOwnerId(owner.getId()).isPresent()) {
            throw new IllegalArgumentException("User already has a customer profile");
        }
        if (customerRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already in use by another customer");
        }
        Customer customer = customerMapper.toCustomer(request, owner);
        Customer savedCustomer = customerRepository.save(customer);

        return customerMapper.toCustomerResponse(savedCustomer);
    }

    @Override
    @Transactional(readOnly = true)
    @PreAuthorize("hasRole('ADMIN')")
    public List<CustomerResponse> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(customerMapper::toCustomerResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerResponse getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
        if (!securityHelper.isAdmin() && !securityHelper.isOwner(customer.getOwner().getId())) {
            throw new AccessDeniedException("You do not have permission to view this customer");
        }

        return customerMapper.toCustomerResponse(customer);
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerResponse getMyCustomerDetails() {
        User authenticatedUser = securityHelper.getAuthenticatedUser();
        Customer customer = customerRepository.findByOwner(authenticatedUser)
                .orElseThrow(() -> new RuntimeException("No customer profile found for the authenticated user")); // O una 404

        return customerMapper.toCustomerResponse(customer);
    }
}