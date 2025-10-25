# Development Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

### Backend Requirements

- **Java Development Kit (JDK) 21** or higher
  - Download from: https://adoptium.net/
  - Verify installation: `java -version`

- **Maven 3.6+** (included with the project wrapper)
  - Verify installation: `./mvnw -version`

- **PostgreSQL 12+** (for local development)
  - Download from: https://www.postgresql.org/download/
  - Alternative: Use Docker for PostgreSQL

### Frontend Requirements

- **Node.js 16+** and **npm 8+**
  - Download from: https://nodejs.org/
  - Verify installation: 
    ```bash
    node -version
    npm -version
    ```

### Optional Tools

- **Git** - Version control
- **Docker** - For containerized PostgreSQL
- **Postman** or **Insomnia** - API testing
- **VS Code** or **IntelliJ IDEA** - Code editors

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Skywalker690/BookInn-Hub2.git
cd BookInn-Hub2
```

---

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Database Configuration
DB_URL=jdbc:postgresql://localhost:5432/bookinn_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# AWS S3 Configuration (Optional for local dev)
AWS_ACCESS_KEY=your_aws_access_key
AWS_SECRET_KEY=your_aws_secret_key
BUCKET_NAME=your_s3_bucket_name
```

**Note:** For local development without AWS S3, you can skip the AWS configuration. The application will store image URLs as null or placeholder values.

### 3. Set Up Local Database

#### Option A: Using PostgreSQL directly

1. Install PostgreSQL
2. Create a database:
   ```sql
   CREATE DATABASE bookinn_db;
   ```
3. Update `.env` with your PostgreSQL credentials

#### Option B: Using Docker

```bash
docker run --name bookinn-postgres \
  -e POSTGRES_DB=bookinn_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  -d postgres:14
```

### 4. Build the Project

```bash
./mvnw clean install
```

This will:
- Download dependencies
- Compile the code
- Run tests
- Create executable JAR

### 5. Run the Application

```bash
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8080`

**Verify the backend is running:**
```bash
curl http://localhost:8080/rooms/all
```

### 6. Database Schema & Sample Data

Spring Boot will automatically:
1. Create the database schema on first run using JPA/Hibernate
2. Populate the database with sample data from `data.sql`

**Sample data includes:**
- Demo users (demouser@gmail.com, admin@bookinn.com)
- Sample rooms (Standard, Deluxe, Suite, Presidential)
- Example bookings

**Default password for all demo users:** `password123`

**Note:** The `data.sql` file is located at `backend/src/main/resources/data.sql` and runs automatically on startup.

---

## Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages defined in `package.json`.

### 3. Configure API Base URL

The frontend automatically detects if you're running locally and uses `http://localhost:8080` for API calls.

If you need to override this, edit `src/services/api.ts`:

```typescript
export const API_BASE_URL = "http://localhost:8080";
```

### 4. Start Development Server

```bash
npm start
```

The frontend will start on `http://localhost:3000` and automatically open in your browser.

### 5. Build for Production

To create an optimized production build:

```bash
npm run build
```

Build output will be in the `build/` directory.

---

## Running Tests

### Backend Tests

```bash
cd backend
./mvnw test
```

### Frontend Tests

```bash
cd frontend
npm test
```

For test coverage:
```bash
npm test -- --coverage
```

---

## Development Workflow

### 1. Starting the Full Application

**Terminal 1 - Backend:**
```bash
cd backend
./mvnw spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### 2. Making Changes

- **Backend changes:** Spring Boot DevTools will auto-reload (included in dependencies)
- **Frontend changes:** React hot-reload is enabled by default

### 3. API Testing

Use the following test credentials:

**Demo User:**
- Email: `demouser@gmail.com`
- Password: `demouser`
- Role: USER

**Demo Admin:**
Create an admin user by manually updating the database or through registration and manual role update:
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your_admin@email.com';
```

### 4. Sample Booking Confirmation Codes

Test the "Find Booking" feature with these codes:
- `MFST1FUDJZ`
- `JR5K5NVT1G`
- `OY3OJBOXR8`

---

## Common Development Tasks

### Adding a New Entity

1. Create entity class in `backend/src/main/java/com/sanjo/backend/entity/`
2. Create repository interface
3. Create DTO class
4. Create service interface and implementation
5. Create controller endpoints
6. Add TypeScript types in `frontend/src/types/`
7. Create API service functions
8. Build UI components

### Adding a New Page

1. Create page component in `frontend/src/pages/`
2. Add route in `App.tsx`
3. Add navigation link in `Navbar.tsx`
4. Create necessary API calls

### Database Migrations

For schema changes:
1. Update entity classes
2. For production, use Flyway or Liquibase (not currently configured)
3. For development, JPA auto-update handles it

---

## Troubleshooting

### Backend Issues

**Problem:** Port 8080 already in use
```bash
# Find process using port 8080
lsof -i :8080
# Kill the process
kill -9 <PID>
```

**Problem:** Database connection failed
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists: `CREATE DATABASE bookinn_db;`

**Problem:** JWT token errors
- Ensure `JWT_SECRET` is set in `.env`
- Secret should be at least 256 bits (32 characters)

**Problem:** Maven build fails
```bash
# Clean and rebuild
./mvnw clean install -U
```

### Frontend Issues

**Problem:** npm install fails
```bash
# Clear npm cache
npm cache clean --force
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json
# Reinstall
npm install
```

**Problem:** Port 3000 already in use
```bash
# Kill process on port 3000
lsof -i :3000
kill -9 <PID>
```

**Problem:** API calls failing
- Verify backend is running on port 8080
- Check browser console for CORS errors
- Verify API_BASE_URL in `api.ts`

**Problem:** TypeScript errors
```bash
# Rebuild TypeScript
npm run build
```

---

## IDE Configuration

### IntelliJ IDEA

1. Open the `backend` folder as a Maven project
2. Enable annotation processing for Lombok:
   - Settings → Build, Execution, Deployment → Compiler → Annotation Processors
   - Check "Enable annotation processing"
3. Install Lombok plugin

### VS Code

**Recommended Extensions:**
- Language Support for Java
- Spring Boot Extension Pack
- Lombok Annotations Support
- ESLint
- Prettier
- TypeScript and JavaScript Language Features

**Backend Configuration:**
Create `.vscode/settings.json`:
```json
{
  "java.configuration.updateBuildConfiguration": "automatic",
  "spring-boot.ls.java.home": "/path/to/jdk-21"
}
```

---

## Environment Variables Reference

### Backend (.env)

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| DB_URL | PostgreSQL connection URL | Yes | jdbc:postgresql://localhost:5432/bookinn_db |
| DB_USER | Database username | Yes | postgres |
| DB_PASSWORD | Database password | Yes | mypassword |
| JWT_SECRET | Secret key for JWT tokens | Yes | my_secret_key_256_bits_long |
| AWS_ACCESS_KEY | AWS access key for S3 | No | AKIAIOSFODNN7EXAMPLE |
| AWS_SECRET_KEY | AWS secret key for S3 | No | wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY |
| BUCKET_NAME | S3 bucket name | No | bookinn-hub-images |

### Frontend

No environment variables required for local development. The API URL is automatically detected.

---

## Database Seeding

The database is **automatically seeded** with sample data on application startup using the `data.sql` file.

**Location:** `backend/src/main/resources/data.sql`

**What's included:**
- 5 demo users (including demouser@gmail.com and admin@bookinn.com)
- 10 sample rooms (Standard, Deluxe, Suite, Presidential)
- 7 example bookings (active and past)

**All demo users have the password:** `password123`

**To disable automatic seeding:**
```properties
# In application.properties
spring.sql.init.mode=never
```

**To manually re-seed:**
```bash
psql -U postgres -d bookinn_db -f backend/src/main/resources/data.sql
```

**Sample booking confirmation codes for testing:**
- `MFST1FUDJZ`
- `JR5K5NVT1G`
- `OY3OJBOXR8`

---

## Next Steps

After setting up the development environment:

1. Review the [API Documentation](./API_DOCUMENTATION.md)
2. Understand the [Architecture](./ARCHITECTURE.md)
3. Check [Contributing Guidelines](./CONTRIBUTING.md)
4. Explore the codebase and start developing!

---

## Getting Help

- Check existing issues on GitHub
- Review troubleshooting section
- Contact the development team
- Consult Spring Boot and React documentation

Happy coding! 🚀
