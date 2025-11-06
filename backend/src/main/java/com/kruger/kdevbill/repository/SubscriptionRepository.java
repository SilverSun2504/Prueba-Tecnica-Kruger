package com.kruger.kdevbill.repository;

import com.kruger.kdevbill.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    @Query("SELECT s FROM Subscription s " +
            "LEFT JOIN FETCH s.customer c " +
            "LEFT JOIN FETCH s.plan p " +
            "WHERE c.id = :customerId")
    List<Subscription> findByCustomerId(@Param("customerId") Long customerId);
}