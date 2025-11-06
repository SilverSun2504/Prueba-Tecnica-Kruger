package com.kruger.kdevbill.service.plan.impl;

import com.kruger.kdevbill.dto.request.PlanRequest;
import com.kruger.kdevbill.dto.response.PlanResponse;
import com.kruger.kdevbill.entity.Plan;
import com.kruger.kdevbill.mapper.PlanMapper;
import com.kruger.kdevbill.repository.PlanRepository;
import com.kruger.kdevbill.service.plan.PlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlanServiceImpl implements PlanService {

    private final PlanRepository planRepository;
    private final PlanMapper planMapper;

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public PlanResponse createPlan(PlanRequest request) {
        Plan plan = planMapper.toPlan(request);
        
        Plan savedPlan = planRepository.save(plan);
        
        return planMapper.toPlanResponse(savedPlan);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PlanResponse> getAllPlans() {
        List<Plan> plans = planRepository.findAll();
        
        return plans.stream()
                .map(planMapper::toPlanResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public PlanResponse updatePlan(Long id, PlanRequest request) {
        Plan plan = planRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan not found with id: " + id));

        planMapper.updatePlanFromRequest(request, plan);

        Plan updatedPlan = planRepository.save(plan);

        return planMapper.toPlanResponse(updatedPlan);
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void deletePlan(Long id) {
        if (!planRepository.existsById(id)) {
            throw new RuntimeException("Plan not found with id: " + id);
        }
        planRepository.deleteById(id);
    }
}