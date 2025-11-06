package com.kruger.kdevbill.mapper;

import com.kruger.kdevbill.dto.response.SubscriptionResponse;
import com.kruger.kdevbill.entity.Subscription;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SubscriptionMapper {

    private final PlanMapper planMapper;
    private final CustomerMapper customerMapper;

    public SubscriptionResponse toSubscriptionResponse(Subscription subscription) {
        SubscriptionResponse response = new SubscriptionResponse();
        response.setId(subscription.getId());
        response.setStatus(subscription.getStatus());
        response.setStartDate(subscription.getStartDate());
        response.setNextBillingDate(subscription.getNextBillingDate());
        response.setCreatedAt(subscription.getCreatedAt());

        if (subscription.getPlan() != null) {
            response.setPlan(planMapper.toPlanResponse(subscription.getPlan()));
        }
        if (subscription.getCustomer() != null) {
            response.setCustomer(customerMapper.toCustomerBasicResponse(subscription.getCustomer()));
        }
        return response;
    }
}