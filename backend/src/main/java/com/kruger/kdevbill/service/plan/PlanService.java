package com.kruger.kdevbill.service.plan;

import com.kruger.kdevbill.dto.request.PlanRequest;
import com.kruger.kdevbill.dto.response.PlanResponse;

import java.util.List;

public interface PlanService {

    PlanResponse createPlan(PlanRequest request);

    List<PlanResponse> getAllPlans();

    PlanResponse updatePlan(Long id, PlanRequest request);

    void deletePlan(Long id);
}