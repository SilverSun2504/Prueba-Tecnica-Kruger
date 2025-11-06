package com.kruger.kdevbill.mapper;

import com.kruger.kdevbill.dto.request.CustomerRequest;
import com.kruger.kdevbill.dto.response.CustomerBasicResponse;
import com.kruger.kdevbill.dto.response.CustomerResponse;
import com.kruger.kdevbill.entity.Customer;
import com.kruger.kdevbill.entity.User;
import org.springframework.stereotype.Component;

@Component
public class CustomerMapper {

    public Customer toCustomer(CustomerRequest request, User owner) {
        return Customer.builder()
                .name(request.getName())
                .email(request.getEmail())
                .owner(owner)
                .build();
    }

    public CustomerResponse toCustomerResponse(Customer customer) {
        CustomerResponse response = new CustomerResponse();
        response.setId(customer.getId());
        response.setName(customer.getName());
        response.setEmail(customer.getEmail());
        response.setCreatedAt(customer.getCreatedAt());
        if (customer.getOwner() != null) {
            response.setOwnerUsername(customer.getOwner().getUsername());
        }
        return response;
    }
    
    public CustomerBasicResponse toCustomerBasicResponse(Customer customer) {
        CustomerBasicResponse response = new CustomerBasicResponse();
        response.setId(customer.getId());
        response.setName(customer.getName());
        response.setEmail(customer.getEmail());
        return response;
    }
}