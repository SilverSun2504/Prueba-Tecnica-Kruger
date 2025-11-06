package com.kruger.kdevbill.mapper;

import com.kruger.kdevbill.dto.response.InvoiceResponse;
import com.kruger.kdevbill.entity.Invoice;
import org.springframework.stereotype.Component;

@Component
public class InvoiceMapper {

    public InvoiceResponse toInvoiceResponse(Invoice invoice) {
        InvoiceResponse response = new InvoiceResponse();
        response.setId(invoice.getId());
        response.setAmount(invoice.getAmount());
        response.setStatus(invoice.getStatus());
        response.setDueDate(invoice.getDueDate());
        response.setIssuedAt(invoice.getIssuedAt());
        
        if (invoice.getSubscription() != null) {
            response.setSubscriptionId(invoice.getSubscription().getId());
        }
        return response;
    }
}