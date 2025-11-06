package com.kruger.kdevbill.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CustomerResponse {
    private Long id;
    private String name;
    private String email;
    private LocalDateTime createdAt;
    private String ownerUsername;
}