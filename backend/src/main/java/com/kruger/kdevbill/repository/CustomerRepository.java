package com.kruger.kdevbill.repository;

import com.kruger.kdevbill.entity.Customer;
import com.kruger.kdevbill.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findByOwner(User owner);

    Optional<Customer> findByOwnerId(Long userId);

    @Query("SELECT c FROM Customer c WHERE c.owner.username = :username")
    Optional<Customer> findByOwnerUsername(@Param("username") String username);

    boolean existsByEmail(String email);
}