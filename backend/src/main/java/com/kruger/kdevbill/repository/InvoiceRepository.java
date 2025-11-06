package com.kruger.kdevbill.repository;

import com.kruger.kdevbill.entity.Invoice;
import com.kruger.kdevbill.entity.enums.InvoiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    List<Invoice> findBySubscription_CustomerId(Long customerId);
    
    Optional<Invoice> findByIdAndStatus(Long id, InvoiceStatus status);
}