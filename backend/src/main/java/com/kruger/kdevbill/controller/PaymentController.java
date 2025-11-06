package com.kruger.kdevbill.controller;

import com.kruger.kdevbill.dto.response.PaymentResponse;
import com.kruger.kdevbill.service.payment.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
@Tag(name = "Pagos", description = "Operaciones de gestión de pagos")
@SecurityRequirement(name = "bearerAuth")
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping
    @Operation(summary = "Obtener mis pagos", description = "Obtiene todos los pagos del cliente autenticado")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de pagos obtenida exitosamente"),
            @ApiResponse(responseCode = "401", description = "Usuario no autenticado")
    })
    public ResponseEntity<List<PaymentResponse>> getMyPayments() {
        return ResponseEntity.ok(paymentService.getMyPayments());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener pago por ID", description = "Obtiene un pago específico por su ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Pago encontrado exitosamente"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado"),
            @ApiResponse(responseCode = "404", description = "Pago no encontrado")
    })
    public ResponseEntity<PaymentResponse> getPaymentById(
            @Parameter(description = "ID del pago", required = true) @PathVariable Long id) {
        return ResponseEntity.ok(paymentService.getPaymentById(id));
    }
}