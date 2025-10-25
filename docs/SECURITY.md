# Security Documentation

## Overview

BookInn Hub implements multiple layers of security to protect user data, ensure secure authentication, and prevent common web vulnerabilities.

---

## Authentication & Authorization

### JWT-Based Authentication

The application uses JSON Web Tokens (JWT) for stateless authentication.

#### How It Works

1. **User Login:**
   - User submits credentials (email + password)
   - Backend validates credentials
   - If valid, generates JWT token with user info
   - Token returned to client (valid for 7 days)

2. **Subsequent Requests:**
   - Client includes token in Authorization header
   - Backend validates token on each request
   - If valid, request proceeds; if invalid, returns 401

#### Token Structure

```json
{
  "header": {
    "alg": "HS512",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user@example.com",
    "role": "USER",
    "id": "1",
    "iat": 1699000000,
    "exp": 1699604800
  },
  "signature": "..."
}
```

#### Token Generation

**Backend (JWTUtils.java):**
```java
public String generateToken(UserDetails userDetails) {
    return Jwts.builder()
        .setSubject(userDetails.getUsername())
        .claim("role", userDetails.getAuthorities())
        .setIssuedAt(new Date(System.currentTimeMillis()))
        .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
        .signWith(getSigningKey())
        .compact();
}
```

#### Token Validation

**Backend (JWTAuthFilter.java):**
```java
@Override
protected void doFilterInternal(HttpServletRequest request, 
                                HttpServletResponse response, 
                                FilterChain filterChain) {
    String token = extractTokenFromRequest(request);
    if (token != null && jwtUtils.isTokenValid(token)) {
        String username = jwtUtils.extractUsername(token);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        // Set authentication in SecurityContext
    }
    filterChain.doFilter(request, response);
}
```

#### Frontend Token Management

**Token Storage:**
```typescript
// Store after login
localStorage.setItem('token', response.token);
localStorage.setItem('user', JSON.stringify(response.user));
localStorage.setItem('role', response.role);

// Include in requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## Role-Based Access Control (RBAC)

### Roles

The application supports two roles:

1. **USER** - Regular customers
   - Can register and login
   - Can view rooms and availability
   - Can create bookings
   - Can view own booking history
   - Can cancel own bookings

2. **ADMIN** - Hotel managers
   - All USER permissions
   - Can add/update/delete rooms
   - Can view all bookings
   - Can view all users
   - Can cancel any booking

### Endpoint Protection

#### Backend (Spring Security)

```java
// Public endpoints (no authentication required)
@GetMapping("/rooms/all")
public ResponseEntity<Response> getAllRooms() { ... }

// USER or ADMIN required
@PostMapping("/bookings/book-room/{roomId}/{userId}")
@PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
public ResponseEntity<Response> bookRoom(...) { ... }

// ADMIN only
@PostMapping("/rooms/add")
@PreAuthorize("hasAuthority('ADMIN')")
public ResponseEntity<Response> addRoom(...) { ... }
```

#### Frontend (Route Protection)

```tsx
// Protected route component
<Route 
  path="/admin/*" 
  element={
    <ProtectedRoute requireAdmin={true}>
      <AdminDashboard />
    </ProtectedRoute>
  } 
/>

// ProtectedRoute component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const isAuthenticated = AuthUtils.isAuthenticated();
  const isAdmin = AuthUtils.isAdmin();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};
```

---

## Password Security

### Hashing Algorithm

**BCrypt** with strength factor of 10

#### Why BCrypt?

- Adaptive algorithm (can increase cost factor over time)
- Built-in salt generation
- Resistant to rainbow table attacks
- Industry standard

#### Implementation

**Registration:**
```java
@Service
public class UserService {
    @Autowired
    private PasswordEncoder passwordEncoder;

    public Response register(User user) {
        // Hash password before storing
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return response;
    }
}
```

**Login:**
```java
public Response login(LoginRequest loginRequest) {
    // Spring Security automatically verifies password using BCrypt
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
            loginRequest.getEmail(),
            loginRequest.getPassword()
        )
    );
}
```

### Password Requirements

**Current requirements:**
- Minimum length: None (should be implemented)
- Complexity: None (should be implemented)

**Recommended requirements (future enhancement):**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

---

## Input Validation

### Backend Validation

**Using Jakarta Bean Validation:**
```java
@Entity
public class User {
    @NotBlank(message = "Name is required")
    private String name;
    
    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;
}
```

**Controller Validation:**
```java
@PostMapping("/register")
public ResponseEntity<Response> register(@Valid @RequestBody User user) {
    // @Valid triggers validation
    Response response = userService.register(user);
    return ResponseEntity.status(response.getStatusCode()).body(response);
}
```

### Frontend Validation

```tsx
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateBooking = (booking: Booking): string[] => {
  const errors: string[] = [];
  
  if (!booking.checkInDate) {
    errors.push('Check-in date is required');
  }
  
  if (!booking.checkOutDate) {
    errors.push('Check-out date is required');
  }
  
  if (new Date(booking.checkOutDate) <= new Date(booking.checkInDate)) {
    errors.push('Check-out date must be after check-in date');
  }
  
  return errors;
};
```

---

## CORS Policy

### Configuration

**Backend (CorsConfig.java):**
```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOrigins(
                        "http://localhost:3000",
                        "https://your-production-domain.com"
                    )
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true)
                    .maxAge(3600);
            }
        };
    }
}
```

### Security Considerations

- Only allow trusted origins
- Avoid using wildcard (`*`) in production
- Set appropriate max age for preflight caching
- Enable credentials only when necessary

---

## SQL Injection Prevention

### Using JPA/Hibernate

JPA automatically uses prepared statements, preventing SQL injection:

```java
// Safe - uses prepared statements
Optional<User> findByEmail(String email);

// Safe - parameterized query
@Query("SELECT u FROM User u WHERE u.email = :email")
User findUserByEmail(@Param("email") String email);
```

### Avoid String Concatenation

```java
// UNSAFE - DO NOT DO THIS
String query = "SELECT * FROM users WHERE email = '" + email + "'";

// SAFE - use parameters
@Query("SELECT u FROM User u WHERE u.email = ?1")
User findByEmail(String email);
```

---

## XSS (Cross-Site Scripting) Prevention

### Backend

**Automatic Escaping:**
- Spring Boot automatically escapes HTML in JSON responses
- Use `@RestController` for API endpoints

**Manual Sanitization (if needed):**
```java
import org.apache.commons.text.StringEscapeUtils;

String sanitized = StringEscapeUtils.escapeHtml4(userInput);
```

### Frontend

**React's Built-in Protection:**
- React automatically escapes values in JSX
- Prevents XSS by default

```tsx
// Safe - React escapes automatically
<div>{userInput}</div>

// UNSAFE - bypasses escaping (avoid)
<div dangerouslySetInnerHTML={{__html: userInput}} />
```

---

## CSRF Protection

### Current Implementation

**Disabled for JWT-based API:**
```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) {
    http.csrf(AbstractHttpConfigurer::disable);  // Disabled for stateless JWT
    // ...
}
```

### Why Disabled?

- JWT tokens are stored in localStorage (not cookies)
- No automatic cookie transmission
- CSRF attacks target cookie-based sessions
- For JWT APIs, CSRF protection is not needed

### If Using Cookies (Future Enhancement)

Enable CSRF protection:
```java
http.csrf(csrf -> csrf
    .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
);
```

---

## File Upload Security

### AWS S3 Integration

**AwsS3Service.java:**
```java
public String saveImageToS3(MultipartFile photo) {
    try {
        // Validate file type
        String contentType = photo.getContentType();
        if (!isValidImageType(contentType)) {
            throw new OurException("Invalid file type");
        }
        
        // Validate file size
        if (photo.getSize() > MAX_FILE_SIZE) {
            throw new OurException("File too large");
        }
        
        String key = UUID.randomUUID() + "_" + photo.getOriginalFilename();
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType(contentType);
        
        s3Client.putObject(bucketName, key, photo.getInputStream(), metadata);
        return s3Client.getUrl(bucketName, key).toString();
        
    } catch (IOException e) {
        throw new OurException("Failed to upload image");
    }
}

private boolean isValidImageType(String contentType) {
    return contentType != null && (
        contentType.equals("image/jpeg") ||
        contentType.equals("image/png") ||
        contentType.equals("image/jpg")
    );
}
```

### Security Best Practices

1. **Validate file types** - Only allow images
2. **Limit file size** - Prevent DoS attacks
3. **Generate unique filenames** - Prevent overwriting
4. **Scan for malware** - Use antivirus (future enhancement)
5. **Set appropriate permissions** - Read-only public access

---

## Session Management

### Stateless Architecture

- No server-side sessions
- All state in JWT token
- Reduces server memory usage
- Improves scalability

### Token Expiration

```java
private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 7; // 7 days

public String generateToken(UserDetails userDetails) {
    return Jwts.builder()
        .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
        // ...
}
```

### Logout

**Frontend:**
```typescript
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('role');
  window.location.href = '/login';
};
```

**Note:** Server-side logout not needed for stateless JWT (token expires automatically)

---

## HTTPS/TLS

### Production Deployment

- **Frontend (Vercel):** Automatic HTTPS
- **Backend (Render):** Automatic HTTPS
- **Database (NeonDB):** SSL required

### Development

- Local development uses HTTP
- Production must use HTTPS
- Update API URLs accordingly

---

## Environment Variables

### Security Best Practices

1. **Never commit secrets to Git**
2. **Use `.env` files for local development**
3. **Use platform environment variables in production**
4. **Rotate secrets regularly**
5. **Use strong, random values**

### Example `.env.example`

```env
# Database
DB_URL=jdbc:postgresql://localhost:5432/bookinn_db
DB_USER=postgres
DB_PASSWORD=change_this_password

# JWT - MUST BE 256+ BITS
JWT_SECRET=your_very_long_random_secret_key_at_least_256_bits

# AWS S3
AWS_ACCESS_KEY=your_access_key
AWS_SECRET_KEY=your_secret_key
BUCKET_NAME=your_bucket_name
```

---

## Rate Limiting

### Current Status

**Not implemented** - should be added in future

### Recommended Implementation

**Using Bucket4j (Spring Boot):**
```java
@Bean
public RateLimiter rateLimiter() {
    return RateLimiter.create(10.0); // 10 requests per second
}

@Component
public class RateLimitInterceptor implements HandlerInterceptor {
    @Autowired
    private RateLimiter rateLimiter;
    
    @Override
    public boolean preHandle(HttpServletRequest request, 
                            HttpServletResponse response, 
                            Object handler) {
        if (!rateLimiter.tryAcquire()) {
            response.setStatus(429); // Too Many Requests
            return false;
        }
        return true;
    }
}
```

---

## Security Headers

### Recommended Headers (Future Enhancement)

```java
@Configuration
public class SecurityHeadersConfig {
    @Bean
    public FilterRegistrationBean<SecurityHeadersFilter> securityHeaders() {
        FilterRegistrationBean<SecurityHeadersFilter> registration = 
            new FilterRegistrationBean<>();
        registration.setFilter(new SecurityHeadersFilter());
        registration.addUrlPatterns("/*");
        return registration;
    }
}

public class SecurityHeadersFilter implements Filter {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, 
                        FilterChain chain) {
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        // Prevent clickjacking
        httpResponse.setHeader("X-Frame-Options", "DENY");
        
        // XSS protection
        httpResponse.setHeader("X-XSS-Protection", "1; mode=block");
        
        // Content type sniffing
        httpResponse.setHeader("X-Content-Type-Options", "nosniff");
        
        // HTTPS enforcement
        httpResponse.setHeader("Strict-Transport-Security", 
            "max-age=31536000; includeSubDomains");
        
        chain.doFilter(request, response);
    }
}
```

---

## Audit Logging

### Current Status

**Not implemented** - should be added for security monitoring

### Recommended Approach

```java
@Aspect
@Component
public class SecurityAuditAspect {
    @Before("@annotation(PreAuthorize)")
    public void logSecurityEvent(JoinPoint joinPoint) {
        String username = SecurityContextHolder.getContext()
            .getAuthentication().getName();
        String method = joinPoint.getSignature().getName();
        
        log.info("Security event - User: {}, Method: {}", username, method);
    }
}
```

---

## Vulnerability Scanning

### Recommendations

1. **Dependency Scanning:**
   - Use Maven dependency checker
   - Keep dependencies updated
   - Monitor security advisories

2. **Code Scanning:**
   - SonarQube for code quality
   - OWASP Dependency-Check
   - Snyk for vulnerability detection

3. **Penetration Testing:**
   - Regular security audits
   - OWASP ZAP for automated scanning
   - Professional pen testing (for production)

---

## Security Checklist

### Before Deployment

- [ ] All secrets in environment variables (not in code)
- [ ] HTTPS enabled on all services
- [ ] Strong JWT secret (256+ bits)
- [ ] BCrypt password hashing enabled
- [ ] CORS configured for production domains only
- [ ] File upload validation implemented
- [ ] Database SSL connection enabled
- [ ] Input validation on all endpoints
- [ ] Error messages don't leak sensitive info
- [ ] Rate limiting considered
- [ ] Security headers configured
- [ ] Audit logging implemented

### Regular Maintenance

- [ ] Update dependencies monthly
- [ ] Rotate secrets quarterly
- [ ] Review access logs
- [ ] Monitor failed login attempts
- [ ] Backup database regularly
- [ ] Test disaster recovery plan

---

## Incident Response

### In Case of Security Breach

1. **Immediate Actions:**
   - Isolate affected systems
   - Revoke all JWT tokens (change JWT secret)
   - Reset affected user passwords
   - Review access logs

2. **Investigation:**
   - Identify breach vector
   - Assess data impact
   - Document timeline

3. **Recovery:**
   - Patch vulnerability
   - Restore from clean backup if needed
   - Notify affected users
   - Update security measures

4. **Post-Incident:**
   - Conduct security review
   - Update documentation
   - Implement additional controls
   - Train team on lessons learned

---

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Spring Security Documentation](https://spring.io/projects/spring-security)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

---

## Contact

For security issues, please contact the security team directly rather than opening a public issue.
