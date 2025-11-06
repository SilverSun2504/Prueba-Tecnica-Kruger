package com.kruger.kdevbill.mapper;

import com.kruger.kdevbill.dto.request.PlanRequest;
import com.kruger.kdevbill.dto.response.PlanResponse;
import com.kruger.kdevbill.entity.Plan;
import org.springframework.stereotype.Component;

@Component
public class PlanMapper {

    public Plan toPlan(PlanRequest request) {
        return Plan.builder()
                .name(request.getName())
                .price(request.getPrice())
                .billingCycle(request.getBillingCycle())
                .active(request.getActive())
                .build();
    }

    public PlanResponse toPlanResponse(Plan plan) {
        PlanResponse response = new PlanResponse();
        response.setId(plan.getId());
        response.setName(plan.getName());
        response.setPrice(plan.getPrice());
        response.setBillingCycle(plan.getBillingCycle());
        response.setActive(plan.isActive());
        return response;
    }

    public void updatePlanFromRequest(PlanRequest request, Plan plan) {
        plan.setName(request.getName());
        plan.setPrice(request.getPrice());
        plan.setBillingCycle(request.getBillingCycle());
        plan.setActive(request.getActive());
    }
}