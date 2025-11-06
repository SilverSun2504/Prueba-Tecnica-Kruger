package com.kruger.kdevbill.dto.response;

import lombok.Data;

@Data
public class CustomerBasicResponse {
    private Long id;
    private String name;
    private String email;
}