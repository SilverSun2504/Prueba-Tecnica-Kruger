package com.kruger.kdevbill.service.customer;

import com.kruger.kdevbill.dto.request.CustomerRequest;
import com.kruger.kdevbill.dto.response.CustomerResponse;

import java.util.List;

public interface CustomerService {

    CustomerResponse createCustomer(CustomerRequest request);

    List<CustomerResponse> getAllCustomers();

    CustomerResponse getCustomerById(Long id);

    CustomerResponse getMyCustomerDetails();
}