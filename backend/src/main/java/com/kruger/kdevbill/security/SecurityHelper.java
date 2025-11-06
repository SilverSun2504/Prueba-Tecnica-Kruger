package com.kruger.kdevbill.security;

import com.kruger.kdevbill.entity.User;
import com.kruger.kdevbill.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

@Component
public class SecurityHelper {

    private final UserRepository userRepository;

    public SecurityHelper(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new RuntimeException("No authenticated user found");
        }

        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Authenticated user not found in database: " + username));
    }

    public boolean isOwner(Long ownerId) {
        User authenticatedUser = getAuthenticatedUser();
        return authenticatedUser.getId().equals(ownerId);
    }

    public boolean isAdmin() {
        User authenticatedUser = getAuthenticatedUser();
        return authenticatedUser.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"));
    }
}