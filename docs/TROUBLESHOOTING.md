# Troubleshooting Guide

## Overview

This guide helps you diagnose and resolve common issues in the BookInn Hub application.

---

## Table of Contents

1. [Backend Issues](#backend-issues)
2. [Frontend Issues](#frontend-issues)
3. [Database Issues](#database-issues)
4. [Authentication Issues](#authentication-issues)
5. [Deployment Issues](#deployment-issues)
6. [Performance Issues](#performance-issues)
7. [Common Error Messages](#common-error-messages)

---

## Backend Issues

### Issue: Application Won't Start

**Symptoms:**
- Spring Boot application fails to start
- Error in console logs

**Possible Causes & Solutions:**

#### 1. Port 8080 Already in Use

**Error:**
```
Web server failed to start. Port 8080 was already in use.
```

**Solution:**
```bash
# Find process using port 8080
lsof -i :8080
# Or on Windows
netstat -ano | findstr :8080

# Kill the process
kill -9 <PID>
# Or on Windows
taskkill /PID <PID> /F

# Alternative: Change application port
# In application.properties:
server.port=8081
```

#### 2. Database Connection Failed

**Error:**
```
Failed to configure a DataSource
Connection to localhost:5432 refused
```

**Solution:**
```bash
# Check if PostgreSQL is running
pg_isready

# Start PostgreSQL
# macOS: brew services start postgresql
# Ubuntu: sudo service postgresql start
# Windows: Check Services panel

# Verify database exists
psql -U postgres -l

# Create database if missing
psql -U postgres -c "CREATE DATABASE bookinn_db;"

# Check .env file has correct credentials
DB_URL=jdbc:postgresql://localhost:5432/bookinn_db
DB_USER=postgres
DB_PASSWORD=your_password
```

#### 3. Missing Environment Variables

**Error:**
```
Could not resolve placeholder 'JWT_SECRET'
```

**Solution:**
```bash
# Ensure .env file exists in backend directory
cd backend
ls -la .env

# Create .env file if missing
cp .env.example .env

# Edit and add required values
nano .env

# Verify environment variables are loaded
# Add to application.properties if needed
spring.config.import=optional:file:.env[.properties]
```

#### 4. Maven Build Errors

**Error:**
```
Failed to execute goal org.apache.maven.plugins:maven-compiler-plugin
```

**Solution:**
```bash
# Clean and rebuild
./mvnw clean install

# Update dependencies
./mvnw clean install -U

# Skip tests if needed (not recommended)
./mvnw clean install -DskipTests

# Check Java version
java -version
# Should be Java 21 or higher

# If wrong Java version, set JAVA_HOME
export JAVA_HOME=/path/to/jdk-21
```

#### 5. Lombok Not Working

**Error:**
```
Cannot resolve method 'getName' in 'User'
```

**Solution:**
```bash
# For IntelliJ IDEA:
# 1. Install Lombok plugin
# 2. Enable annotation processing:
#    Settings → Build → Compiler → Annotation Processors
#    Check "Enable annotation processing"

# For VS Code:
# Install "Lombok Annotations Support for VS Code"

# Verify Lombok dependency in pom.xml
# Should have:
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
</dependency>

# Rebuild project
./mvnw clean install
```

---

## Frontend Issues

### Issue: Application Won't Start

#### 1. Port 3000 Already in Use

**Error:**
```
Something is already running on port 3000
```

**Solution:**
```bash
# Find and kill process on port 3000
lsof -i :3000
kill -9 <PID>

# Or on Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
PORT=3001 npm start
```

#### 2. npm install Fails

**Error:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Try legacy peer deps
npm install --legacy-peer-deps

# Or use --force (last resort)
npm install --force

# Check Node.js version
node -v
# Should be 16.x or higher

# Update npm
npm install -g npm@latest
```

#### 3. TypeScript Errors

**Error:**
```
TS2307: Cannot find module 'axios' or its corresponding type declarations
```

**Solution:**
```bash
# Install missing types
npm install --save-dev @types/node @types/react @types/react-dom

# Rebuild
npm run build

# Check tsconfig.json is present
cat tsconfig.json

# If issues persist, delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: API Calls Not Working

#### 1. CORS Errors

**Error in Browser Console:**
```
Access to XMLHttpRequest at 'http://localhost:8080/api/...' 
from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solution:**
```java
// Check backend CorsConfig.java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOrigins("http://localhost:3000")  // Add this
                    .allowedMethods("GET", "POST", "PUT", "DELETE")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

#### 2. Network Error / Backend Not Reachable

**Error:**
```
Error: Network Error
```

**Solution:**
```bash
# Check backend is running
curl http://localhost:8080/rooms/all

# Verify API_BASE_URL in frontend
# frontend/src/services/api.ts
export const API_BASE_URL = "http://localhost:8080";  // Correct URL

# Check for firewall issues
# Disable firewall temporarily to test

# Verify backend health
curl -v http://localhost:8080/rooms/all
```

#### 3. 401 Unauthorized Errors

**Error:**
```
Request failed with status code 401
```

**Solution:**
```typescript
// Check token is stored
const token = localStorage.getItem('token');
console.log('Token:', token);

// Check token is being sent
// In api.ts, verify interceptor:
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If token expired, logout and login again
localStorage.clear();
window.location.href = '/login';
```

### Issue: Build Fails

**Error:**
```
Failed to compile
```

**Solution:**
```bash
# Check for syntax errors
npm run build

# Look for missing dependencies
npm install

# Check import statements are correct
# Verify file paths are correct

# Clear build cache
rm -rf build/
npm run build

# Check for circular dependencies
npm ls
```

---

## Database Issues

### Issue: Connection Timeout

**Error:**
```
Connection to localhost:5432 refused
Connection timeout
```

**Solution:**
```bash
# Check PostgreSQL is running
pg_isready -h localhost -p 5432

# Check PostgreSQL logs
# macOS: /usr/local/var/log/postgres.log
# Ubuntu: /var/log/postgresql/postgresql-*.log

# Restart PostgreSQL
# macOS: brew services restart postgresql
# Ubuntu: sudo service postgresql restart

# Verify port is correct
netstat -an | grep 5432

# Check pg_hba.conf allows connections
# Should have:
# local   all   all   trust
# host    all   all   127.0.0.1/32   md5
```

### Issue: Schema/Table Not Found

**Error:**
```
ERROR: relation "users" does not exist
```

**Solution:**
```bash
# Check if tables exist
psql -U postgres -d bookinn_db
\dt

# If no tables, let JPA create them
# In application.properties:
spring.jpa.hibernate.ddl-auto=update

# Or manually create schema
# See docs/DATABASE_SCHEMA.md for SQL

# Check database name is correct
\l  # List all databases
\c bookinn_db  # Connect to correct database
```

### Issue: Slow Queries

**Symptoms:**
- API responses taking too long
- Database CPU usage high

**Solution:**
```sql
-- Check for slow queries
SELECT pid, now() - pg_stat_activity.query_start AS duration, query
FROM pg_stat_activity
WHERE state = 'active' AND now() - pg_stat_activity.query_start > interval '5 seconds';

-- Check for missing indexes
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0;

-- Create missing indexes
CREATE INDEX idx_booking_dates ON booking(check_in_date, check_out_date);

-- Analyze tables
ANALYZE users;
ANALYZE room;
ANALYZE booking;
```

---

## Authentication Issues

### Issue: Cannot Login

#### 1. Invalid Credentials

**Symptoms:**
- Login fails with 401
- Correct password not working

**Solution:**
```bash
# Verify user exists in database
psql -U postgres -d bookinn_db
SELECT id, email, role FROM users WHERE email = 'user@example.com';

# Check password hash
SELECT password FROM users WHERE email = 'user@example.com';
# Should start with $2a$ or $2b$ (BCrypt)

# Reset password manually if needed
UPDATE users 
SET password = '$2a$10$...'  -- Use BCrypt hash generator
WHERE email = 'user@example.com';

# Or create new user via registration endpoint
```

#### 2. Token Invalid/Expired

**Error:**
```
Token has expired
Invalid token
```

**Solution:**
```typescript
// Clear stored token and login again
localStorage.removeItem('token');
localStorage.removeItem('user');
localStorage.removeItem('role');
window.location.href = '/login';

// Check JWT_SECRET is same on backend
// Must match what was used to generate token

// Check token expiration time
// Backend: JWTUtils.java
private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 7; // 7 days
```

#### 3. Role-Based Access Denied

**Error:**
```
403 Forbidden
Access Denied
```

**Solution:**
```sql
-- Check user role in database
SELECT email, role FROM users WHERE email = 'user@example.com';

-- Update role if needed
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@example.com';

-- Verify token has correct role
-- Decode JWT at https://jwt.io
// Should have "role" claim
```

### Issue: Cannot Access Protected Routes

**Symptoms:**
- Redirected to login when already logged in
- Cannot access /profile or /admin pages

**Solution:**
```typescript
// Check AuthUtils functions
import { AuthUtils } from './utils';

console.log('Authenticated:', AuthUtils.isAuthenticated());
console.log('Admin:', AuthUtils.isAdmin());
console.log('Token:', localStorage.getItem('token'));
console.log('Role:', localStorage.getItem('role'));

// Verify ProtectedRoute component logic
// Should check both authentication and role
```

---

## Deployment Issues

### Issue: Backend Cold Start on Render

**Symptoms:**
- First request takes 30-60 seconds
- Subsequent requests fast

**Cause:**
- Render free tier spins down after inactivity

**Solutions:**
```bash
# 1. Upgrade to paid plan (always-on)
# 2. Implement wake-up endpoint
# 3. Use external monitoring service to ping regularly

# Example: Create health endpoint
@GetMapping("/health")
public String health() {
    return "OK";
}

# Ping from frontend on load
useEffect(() => {
  fetch(`${API_BASE_URL}/health`);
}, []);
```

### Issue: Environment Variables Not Set

**Error:**
```
Configuration error
Missing required environment variable
```

**Solution:**
```bash
# Vercel - Add environment variables:
# Dashboard → Project → Settings → Environment Variables

# Render - Add environment variables:
# Dashboard → Service → Environment → Add Environment Variable

# Verify variables are set
# Add temporary log in code (remove after checking):
console.log('API_URL:', process.env.REACT_APP_API_URL);
System.out.println("JWT_SECRET present: " + (jwtSecret != null));
```

### Issue: Build Fails on Vercel

**Error:**
```
Build failed
Command "npm run build" exited with 1
```

**Solution:**
```bash
# Check Vercel build logs for specific error

# Common fixes:
# 1. Ensure all dependencies in package.json
# 2. Fix TypeScript errors
# 3. Set correct build command: npm run build
# 4. Set correct output directory: build
# 5. Set root directory: frontend

# Test build locally
cd frontend
npm run build

# Check .gitignore doesn't exclude required files
```

---

## Performance Issues

### Issue: Slow API Responses

**Diagnosis:**
```bash
# Time API requests
time curl http://localhost:8080/rooms/all

# Check backend logs for slow queries
# Enable query logging in application.properties:
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
logging.level.org.hibernate.SQL=DEBUG
```

**Solutions:**

1. **Add Database Indexes:**
```sql
CREATE INDEX idx_booking_dates ON booking(check_in_date, check_out_date);
CREATE INDEX idx_booking_room ON booking(room_id);
CREATE INDEX idx_booking_user ON booking(user_id);
```

2. **Optimize JPA Fetching:**
```java
// Use LAZY loading
@OneToMany(mappedBy = "room", fetch = FetchType.LAZY)
private List<Booking> bookings;

// Use JOIN FETCH for specific queries
@Query("SELECT r FROM Room r LEFT JOIN FETCH r.bookings WHERE r.id = :id")
Room findRoomWithBookings(@Param("id") Long id);
```

3. **Add Caching:**
```java
@Cacheable("rooms")
public List<Room> getAllRooms() {
    return roomRepository.findAll();
}
```

### Issue: Large Bundle Size (Frontend)

**Check bundle size:**
```bash
npm run build
# Check build/static/js/*.js file sizes
```

**Solutions:**
```bash
# 1. Enable code splitting
# Already done with React Router

# 2. Analyze bundle
npm install -g source-map-explorer
source-map-explorer build/static/js/*.js

# 3. Remove unused dependencies
npm prune

# 4. Use production build
npm run build
```

---

## Common Error Messages

### Backend Errors

#### "Bean creation exception"
```
Error creating bean with name 'securityFilterChain'
```
**Fix:** Check SecurityConfig.java syntax and dependencies

#### "Method not found"
```
NoSuchMethodError: org.springframework...
```
**Fix:** Dependency version conflict. Update Spring Boot version or check dependency compatibility

#### "Access denied"
```
Access is denied (user is anonymous)
```
**Fix:** Add `@PreAuthorize` annotation or check authentication

### Frontend Errors

#### "Cannot find module"
```
Module not found: Can't resolve 'axios'
```
**Fix:** `npm install axios`

#### "Unexpected token"
```
SyntaxError: Unexpected token <
```
**Fix:** Check for HTML returned instead of JSON (API error), verify API URL

#### "Objects are not valid as React child"
```
Error: Objects are not valid as a React child
```
**Fix:** Trying to render object directly. Use `.toString()` or render specific properties

---

## Getting Additional Help

### Enable Debug Logging

**Backend:**
```properties
# application.properties
logging.level.com.sanjo.backend=DEBUG
logging.level.org.springframework.security=DEBUG
```

**Frontend:**
```typescript
// In api.ts
api.interceptors.request.use((config) => {
  console.log('Request:', config);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('Response:', response);
    return response;
  },
  (error) => {
    console.error('Error:', error);
    return Promise.reject(error);
  }
);
```

### Useful Commands

```bash
# Check all environment variables
env | grep -i book

# Check Java processes
jps -l

# Check Node processes
ps aux | grep node

# Check database connections
psql -U postgres -c "SELECT * FROM pg_stat_activity;"

# Check network connections
netstat -an | grep LISTEN

# Check disk space
df -h

# Check memory usage
free -m
```

### Still Need Help?

1. Check [GitHub Issues](https://github.com/Skywalker690/BookInn-Hub2/issues)
2. Review [Documentation](../docs/)
3. Search Stack Overflow
4. Create a new issue with:
   - Error message
   - Steps to reproduce
   - Environment details
   - What you've tried

---

## Preventive Measures

### Best Practices

1. **Always check logs first**
2. **Test locally before deploying**
3. **Keep dependencies updated**
4. **Use version control**
5. **Document changes**
6. **Test in different environments**
7. **Monitor production**
8. **Have rollback plan**

### Regular Maintenance

- [ ] Update dependencies monthly
- [ ] Check logs weekly
- [ ] Monitor database size
- [ ] Review error rates
- [ ] Test backup/restore
- [ ] Verify all endpoints work
- [ ] Check SSL certificates

---

Happy debugging! 🐛🔧
