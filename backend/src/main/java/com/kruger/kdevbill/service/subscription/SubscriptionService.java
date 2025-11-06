package com.kruger.kdevbill.service.subscription;

import com.kruger.kdevbill.dto.request.SubscriptionCreateRequest;
import com.kruger.kdevbill.dto.request.SubscriptionUpdateRequest;
import com.kruger.kdevbill.dto.response.InvoiceResponse;
import com.kruger.kdevbill.dto.response.SubscriptionResponse;

import java.util.List;

public interface SubscriptionService {

    SubscriptionResponse createSubscription(SubscriptionCreateRequest request);

    List<SubscriptionResponse> getMySubscriptions();

    List<SubscriptionResponse> getSubscriptionsByCustomerId(Long customerId);

    SubscriptionResponse updateSubscription(Long id, SubscriptionUpdateRequest request);

    InvoiceResponse renewSubscription(Long id);
}