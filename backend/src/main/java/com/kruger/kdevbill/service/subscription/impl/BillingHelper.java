package com.kruger.kdevbill.service.subscription.impl;

import com.kruger.kdevbill.entity.Plan;
import com.kruger.kdevbill.entity.enums.BillingCycle;
import org.springframework.stereotype.Component;
import java.time.LocalDate;

@Component
public class BillingHelper {
    public LocalDate calculateNextBillingDate(LocalDate startDate, Plan plan) {
        if (plan.getBillingCycle() == BillingCycle.MONTHLY) {
            return startDate.plusMonths(1);
        } else if (plan.getBillingCycle() == BillingCycle.YEARLY) {
            return startDate.plusYears(1);
        }
        throw new IllegalArgumentException("Unknown billing cycle: " + plan.getBillingCycle());
    }
}