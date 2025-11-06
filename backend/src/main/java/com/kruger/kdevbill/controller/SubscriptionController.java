package com.kruger.kdevbill.controller;

import com.kruger.kdevbill.dto.request.SubscriptionCreateRequest;
import com.kruger.kdevbill.dto.request.SubscriptionUpdateRequest;
import com.kruger.kdevbill.dto.response.InvoiceResponse;
import com.kruger.kdevbill.dto.response.SubscriptionResponse;
import com.kruger.kdevbill.service.subscription.SubscriptionService;
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
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/subscriptions")
@RequiredArgsConstructor
@Tag(name = "Suscripciones", description = "Operaciones de gestión de suscripciones")
@SecurityRequirement(name = "bearerAuth")
public class SubscriptionController {

        private final SubscriptionService subscriptionService;

        @PostMapping
        @Operation(summary = "Crear suscripción", description = "Crea una nueva suscripción a un plan. " +
                        "Si se proporciona customerId, se crea para ese cliente (requiere permisos). " +
                        "Si no se proporciona, se crea automáticamente un customer para el usuario autenticado si no existe.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "201", description = "Suscripción creada exitosamente"),
                        @ApiResponse(responseCode = "400", description = "Datos inválidos o plan inactivo"),
                        @ApiResponse(responseCode = "403", description = "No tiene permisos para crear suscripción para este cliente"),
                        @ApiResponse(responseCode = "404", description = "Plan o cliente no encontrado")
        })
        public ResponseEntity<SubscriptionResponse> createSubscription(
                        @Valid @RequestBody SubscriptionCreateRequest request) {
                return new ResponseEntity<>(subscriptionService.createSubscription(request), HttpStatus.CREATED);
        }

        @GetMapping
        @Operation(summary = "Obtener mis suscripciones", description = "Obtiene todas las suscripciones del cliente autenticado")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Lista de suscripciones obtenida exitosamente"),
                        @ApiResponse(responseCode = "401", description = "Usuario no autenticado")
        })
        public ResponseEntity<List<SubscriptionResponse>> getMySubscriptions() {
                return ResponseEntity.ok(subscriptionService.getMySubscriptions());
        }

        @GetMapping("/customer/{customerId}")
        @Operation(summary = "Obtener suscripciones por cliente", description = "Obtiene las suscripciones de un cliente específico")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Lista de suscripciones obtenida exitosamente"),
                        @ApiResponse(responseCode = "403", description = "Acceso denegado"),
                        @ApiResponse(responseCode = "404", description = "Cliente no encontrado")
        })
        public ResponseEntity<List<SubscriptionResponse>> getSubscriptionsByCustomer(
                        @Parameter(description = "ID del cliente", required = true) @PathVariable Long customerId) {
                return ResponseEntity.ok(subscriptionService.getSubscriptionsByCustomerId(customerId));
        }

        @PutMapping("/{id}")
        @Operation(summary = "Actualizar suscripción", description = "Actualiza una suscripción existente")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Suscripción actualizada exitosamente"),
                        @ApiResponse(responseCode = "400", description = "Datos inválidos"),
                        @ApiResponse(responseCode = "403", description = "Acceso denegado"),
                        @ApiResponse(responseCode = "404", description = "Suscripción no encontrada")
        })
        public ResponseEntity<SubscriptionResponse> updateSubscription(
                        @Parameter(description = "ID de la suscripción", required = true) @PathVariable Long id,
                        @Valid @RequestBody SubscriptionUpdateRequest request) {
                return ResponseEntity.ok(subscriptionService.updateSubscription(id, request));
        }

        @PostMapping("/{id}/renew")
        @Operation(summary = "Renovar suscripción", description = "Renueva una suscripción y genera una nueva factura")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Suscripción renovada exitosamente"),
                        @ApiResponse(responseCode = "400", description = "Suscripción no puede ser renovada"),
                        @ApiResponse(responseCode = "403", description = "Acceso denegado"),
                        @ApiResponse(responseCode = "404", description = "Suscripción no encontrada")
        })
        public ResponseEntity<InvoiceResponse> renewSubscription(
                        @Parameter(description = "ID de la suscripción a renovar", required = true) @PathVariable Long id) {
                return ResponseEntity.ok(subscriptionService.renewSubscription(id));
        }
}