package com.kruger.kdevbill.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = ex.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(
                        fieldError -> fieldError.getField(),
                        fieldError -> fieldError.getDefaultMessage() != null ? fieldError.getDefaultMessage() : "Invalid value"
                ));
        return new ResponseEntity<>(Map.of("error", "Validation Failed", "details", errors), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, String>> handleAccessDenied(AccessDeniedException ex) {
        return new ResponseEntity<>(Map.of("error", "Access Denied", "message", ex.getMessage()), HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleEntityNotFound(RuntimeException ex) {
        if (ex.getMessage().toLowerCase().contains("not found")) {
            return new ResponseEntity<>(Map.of("error", "Not Found", "message", ex.getMessage()), HttpStatus.NOT_FOUND);
        }
        
        if (ex.getMessage().toLowerCase().contains("already")) {
             return new ResponseEntity<>(Map.of("error", "Conflict", "message", ex.getMessage()), HttpStatus.CONFLICT);
        }

        return new ResponseEntity<>(Map.of("error", "Internal Server Error", "message", ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}