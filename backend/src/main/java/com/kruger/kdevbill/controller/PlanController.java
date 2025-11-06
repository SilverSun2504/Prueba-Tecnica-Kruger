package com.kruger.kdevbill.controller;

import com.kruger.kdevbill.dto.request.PlanRequest;
import com.kruger.kdevbill.dto.response.PlanResponse;
import com.kruger.kdevbill.service.plan.PlanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/plans")
@RequiredArgsConstructor
@Tag(name = "Planes", description = "Operaciones de gestión de planes de facturación")
@SecurityRequirement(name = "bearerAuth")
public class PlanController {

    private final PlanService planService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Crear plan", description = "Crea un nuevo plan de facturación (Solo administradores)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Plan creado exitosamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
    public ResponseEntity<PlanResponse> createPlan(
            @Valid @RequestBody PlanRequest request) {
        return new ResponseEntity<>(planService.createPlan(request), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Listar todos los planes", description = "Obtiene la lista completa de planes disponibles")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de planes obtenida exitosamente")
    })
    public ResponseEntity<List<PlanResponse>> getAllPlans() {
        return ResponseEntity.ok(planService.getAllPlans());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Actualizar plan", description = "Actualiza un plan existente (Solo administradores)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Plan actualizado exitosamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado"),
            @ApiResponse(responseCode = "404", description = "Plan no encontrado")
    })
    public ResponseEntity<PlanResponse> updatePlan(
            @Parameter(description = "ID del plan", required = true) @PathVariable Long id,
            @Valid @RequestBody PlanRequest request) {
        return ResponseEntity.ok(planService.updatePlan(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Eliminar plan", description = "Elimina un plan existente (Solo administradores)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Plan eliminado exitosamente"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado"),
            @ApiResponse(responseCode = "404", description = "Plan no encontrado")
    })
    public ResponseEntity<Void> deletePlan(
            @Parameter(description = "ID del plan a eliminar", required = true) @PathVariable Long id) {
        planService.deletePlan(id);
        return ResponseEntity.noContent().build();
    }
}