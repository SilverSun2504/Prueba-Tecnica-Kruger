package com.kruger.kdevbill.service.invoice;

import com.kruger.kdevbill.dto.response.InvoiceResponse;
import com.kruger.kdevbill.dto.response.PaymentResponse;

import java.util.List;

public interface InvoiceService {

    List<InvoiceResponse> getMyInvoices();

    InvoiceResponse getInvoiceById(Long id);

    PaymentResponse payInvoice(Long id);
}