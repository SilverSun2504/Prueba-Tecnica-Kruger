package com.kruger.kdevbill.controller;

import com.kruger.kdevbill.dto.response.InvoiceResponse;
import com.kruger.kdevbill.dto.response.PaymentResponse;
import com.kruger.kdevbill.service.invoice.InvoiceService;
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
@RequestMapping("/invoices")
@RequiredArgsConstructor
@Tag(name = "Facturas", description = "Operaciones de gestión de facturas")
@SecurityRequirement(name = "bearerAuth")
public class InvoiceController {

    private final InvoiceService invoiceService;

    @GetMapping
    @Operation(summary = "Obtener mis facturas", description = "Obtiene todas las facturas del cliente autenticado")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de facturas obtenida exitosamente"),
            @ApiResponse(responseCode = "401", description = "Usuario no autenticado")
    })
    public ResponseEntity<List<InvoiceResponse>> getMyInvoices() {
        return ResponseEntity.ok(invoiceService.getMyInvoices());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener factura por ID", description = "Obtiene una factura específica por su ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Factura encontrada exitosamente"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado"),
            @ApiResponse(responseCode = "404", description = "Factura no encontrada")
    })
    public ResponseEntity<InvoiceResponse> getInvoiceById(
            @Parameter(description = "ID de la factura", required = true) @PathVariable Long id) {
        return ResponseEntity.ok(invoiceService.getInvoiceById(id));
    }

    @PostMapping("/{id}/pay")
    @Operation(summary = "Pagar factura", description = "Procesa el pago de una factura pendiente")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Pago procesado exitosamente"),
            @ApiResponse(responseCode = "400", description = "Factura ya pagada o datos inválidos"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado"),
            @ApiResponse(responseCode = "404", description = "Factura no encontrada")
    })
    public ResponseEntity<PaymentResponse> payInvoice(
            @Parameter(description = "ID de la factura a pagar", required = true) @PathVariable Long id) {
        return ResponseEntity.ok(invoiceService.payInvoice(id));
    }
}