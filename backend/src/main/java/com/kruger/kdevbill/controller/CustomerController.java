package com.kruger.kdevbill.controller;

import com.kruger.kdevbill.dto.request.CustomerRequest;
import com.kruger.kdevbill.dto.response.CustomerResponse;
import com.kruger.kdevbill.service.customer.CustomerService;
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
@RequestMapping("/customers")
@RequiredArgsConstructor
@Tag(name = "Clientes", description = "Operaciones de gestión de clientes")
@SecurityRequirement(name = "bearerAuth")
public class CustomerController {

    private final CustomerService customerService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Crear cliente", description = "Crea un nuevo cliente (Solo administradores)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Cliente creado exitosamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
    public ResponseEntity<CustomerResponse> createCustomer(
            @Valid @RequestBody CustomerRequest request) {
        return new ResponseEntity<>(customerService.createCustomer(request), HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Listar todos los clientes", description = "Obtiene la lista completa de clientes (Solo administradores)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de clientes obtenida exitosamente"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
    public ResponseEntity<List<CustomerResponse>> getAllCustomers() {
        return ResponseEntity.ok(customerService.getAllCustomers());
    }

    @GetMapping("/me")
    @Operation(summary = "Obtener mis detalles", description = "Obtiene los detalles del cliente autenticado")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Detalles del cliente obtenidos exitosamente"),
            @ApiResponse(responseCode = "401", description = "Usuario no autenticado")
    })
    public ResponseEntity<CustomerResponse> getMyCustomerDetails() {
        return ResponseEntity.ok(customerService.getMyCustomerDetails());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('CUSTOMER') and @customerService.isOwner(#id))")
    @Operation(summary = "Obtener cliente por ID", description = "Obtiene un cliente específico por su ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cliente encontrado exitosamente"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado"),
            @ApiResponse(responseCode = "404", description = "Cliente no encontrado")
    })
    public ResponseEntity<CustomerResponse> getCustomerById(
            @Parameter(description = "ID del cliente", required = true) @PathVariable Long id) {
        return ResponseEntity.ok(customerService.getCustomerById(id));
    }
}