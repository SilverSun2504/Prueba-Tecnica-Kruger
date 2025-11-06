package com.kruger.kdevbill.service.auth.impl;

import com.kruger.kdevbill.dto.request.LoginRequest;
import com.kruger.kdevbill.dto.request.RegisterRequest;
import com.kruger.kdevbill.dto.response.AuthResponse;
import com.kruger.kdevbill.entity.Customer;
import com.kruger.kdevbill.entity.User;
import com.kruger.kdevbill.entity.enums.Role;
import com.kruger.kdevbill.repository.UserRepository;
import com.kruger.kdevbill.repository.CustomerRepository;
import com.kruger.kdevbill.security.JwtService;
import com.kruger.kdevbill.service.auth.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

        private final UserRepository userRepository;
        private final CustomerRepository customerRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;

        @Override
        @Transactional
        public AuthResponse register(RegisterRequest request) {
                if (userRepository.existsByUsername(request.getUsername())) {
                        throw new IllegalArgumentException("Error: Username is already taken!");
                }

                if (userRepository.existsByEmail(request.getEmail())) {
                        throw new IllegalArgumentException("Error: Email is already in use!");
                }

                // Determinar rol basado en el username
                Role userRole = request.getUsername().toLowerCase().contains("admin") ? Role.ADMIN : Role.USER;

                User user = User.builder()
                                .username(request.getUsername())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .role(userRole)
                                .build();

                User savedUser = userRepository.save(user);

                // Auto-crear customer para usuarios USER (no ADMIN)
                if (userRole == Role.USER) {
                        Customer customer = Customer.builder()
                                        .name(savedUser.getUsername() + " Customer")
                                        .email(savedUser.getEmail())
                                        .owner(savedUser)
                                        .build();
                        customerRepository.save(customer);
                        log.info("Auto-created customer for new USER: {} (User ID: {})",
                                        savedUser.getUsername(), savedUser.getId());
                }

                String jwtToken = jwtService.generateToken(savedUser);

                return AuthResponse.builder()
                                .token(jwtToken)
                                .username(savedUser.getUsername())
                                .role(savedUser.getRole().name())
                                .build();
        }

        @Override
        public AuthResponse login(LoginRequest request) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getUsername(),
                                                request.getPassword()));

                User user = userRepository.findByUsername(request.getUsername())
                                .orElseThrow(() -> new IllegalStateException("User not found after authentication"));

                String jwtToken = jwtService.generateToken(user);

                return AuthResponse.builder()
                                .token(jwtToken)
                                .username(user.getUsername())
                                .role(user.getRole().name())
                                .build();
        }

        @Override
        @Transactional(readOnly = true)
        public List<Map<String, Object>> getAllCustomersDebug() {
                return customerRepository.findAll().stream()
                                .map(customer -> {
                                        Map<String, Object> map = new HashMap<>();
                                        map.put("customer_id", customer.getId());
                                        map.put("customer_name", customer.getName());
                                        map.put("owner_id", customer.getOwner() != null ? customer.getOwner().getId()
                                                        : null);
                                        map.put("owner_username",
                                                        customer.getOwner() != null ? customer.getOwner().getUsername()
                                                                        : null);
                                        return map;
                                })
                                .collect(Collectors.toList());
        }

        @Override
        @Transactional
        public Map<String, Object> createMissingCustomers() {
                log.info("Starting migration: Creating customers for users without customer profile");

                Map<String, Object> result = new HashMap<>();
                List<String> createdCustomers = new java.util.ArrayList<>();

                // Obtener todos los usuarios USER que no tienen customer
                List<User> usersWithoutCustomer = userRepository.findAll().stream()
                                .filter(user -> user.getRole() == Role.USER)
                                .filter(user -> !customerRepository.findByOwnerId(user.getId()).isPresent())
                                .collect(Collectors.toList());

                log.info("Found {} users without customer profile", usersWithoutCustomer.size());

                // Crear customer para cada uno
                for (User user : usersWithoutCustomer) {
                        try {
                                Customer customer = Customer.builder()
                                                .name(user.getUsername() + " Customer")
                                                .email(user.getEmail())
                                                .owner(user)
                                                .build();
                                customerRepository.save(customer);

                                String info = String.format("Created customer for user: %s (ID: %d)",
                                                user.getUsername(), user.getId());
                                createdCustomers.add(info);
                                log.info(info);
                        } catch (Exception e) {
                                log.error("Failed to create customer for user: {} - Error: {}",
                                                user.getUsername(), e.getMessage());
                        }
                }

                result.put("total_users_migrated", createdCustomers.size());
                result.put("created_customers", createdCustomers);
                result.put("message", "Migration completed successfully");

                log.info("Migration completed: {} customers created", createdCustomers.size());
                return result;
        }
}