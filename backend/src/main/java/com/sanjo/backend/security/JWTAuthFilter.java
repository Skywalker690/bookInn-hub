package com.sanjo.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JWTAuthFilter extends OncePerRequestFilter {

    // Injecting JWT utility class and custom UserDetailsService
    private final JWTUtils jwtUtils;
    private final CustomUserDetailsService customUserDetailsService;

    public JWTAuthFilter(JWTUtils jwtUtils, CustomUserDetailsService customUserDetailsService) {
        this.jwtUtils = jwtUtils;
        this.customUserDetailsService = customUserDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // Extract the Authorization header
        final String authHeader = request.getHeader("Authorization");
        final String jwtToken;
        final String userEmail;

        // If Authorization header is missing or blank, continue filter chain
        if (authHeader == null || authHeader.isBlank()) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extract the JWT token by removing "Bearer " prefix
        jwtToken = authHeader.substring(7);

        // Extract email/username from token (custom claim inside your JWT)
        userEmail = jwtUtils.extractUserName(jwtToken);

        // Only proceed if the email exists and there's no already authenticated user
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // Load user details (e.g., from DB or in-memory store)
            UserDetails userDetails = customUserDetailsService.loadUserByUsername(userEmail);

            // Validate the token using userDetails (check signature, expiration, etc.)
            if (jwtUtils.isValidToken(jwtToken, userDetails)) {

                // Create an empty security context and set the authenticated user
                SecurityContext securityContext = SecurityContextHolder.createEmptyContext();

                // Create a token with user's authorities for Spring Security
                UsernamePasswordAuthenticationToken token =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                // Set additional authentication details (like request IP, session, etc.)
                token.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Set the security context for the current thread/request
                securityContext.setAuthentication(token);
                SecurityContextHolder.setContext(securityContext);
            }
        }

        // Continue the filter chain for the next filters/controllers
        filterChain.doFilter(request, response);
    }
}
