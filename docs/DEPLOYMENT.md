# Deployment Guide

## Overview

This guide covers deploying the BookInn Hub application to production. The current production setup uses:

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** NeonDB (PostgreSQL)
- **Storage:** AWS S3

---

## Prerequisites

- GitHub account with repository access
- Vercel account
- Render account
- NeonDB account
- AWS account with S3 access

---

## Database Deployment (NeonDB)

### 1. Create NeonDB Project

1. Visit [NeonDB Console](https://console.neon.tech/)
2. Click "Create Project"
3. Choose a name: `bookinn-hub`
4. Select region (choose closest to your backend deployment)
5. Note down the connection details

### 2. Get Connection String

NeonDB provides a connection string in this format:
```
postgresql://username:password@hostname/database?sslmode=require
```

### 3. Configure Database

The database schema will be automatically created by Spring Boot JPA on first connection.

**Optional:** Manually create tables using the schema from [ARCHITECTURE.md](./ARCHITECTURE.md)

### 4. Connection Pooling

NeonDB has built-in connection pooling. Configure your backend's `application.properties`:

```properties
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=2
```

---

## AWS S3 Setup

### 1. Create S3 Bucket

1. Log in to AWS Console
2. Navigate to S3
3. Click "Create bucket"
4. Name: `bookinn-hub-images` (or your preferred name)
5. Region: Choose appropriate region
6. Uncheck "Block all public access" for read access
7. Create bucket

### 2. Configure Bucket Policy

Add this bucket policy to allow public read access:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::bookinn-hub-images/*"
        }
    ]
}
```

### 3. Configure CORS

Add CORS configuration:

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": []
    }
]
```

### 4. Create IAM User

1. Navigate to IAM → Users
2. Create new user: `bookinn-s3-user`
3. Attach policy: `AmazonS3FullAccess` (or create custom policy)
4. Create access keys
5. Save Access Key ID and Secret Access Key

**Custom Policy (Recommended):**
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::bookinn-hub-images/*"
        }
    ]
}
```

---

## Backend Deployment (Render)

### 1. Prepare Backend

Ensure your backend has a `Dockerfile` (already included in the project):

```dockerfile
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### 2. Create Render Service

1. Log in to [Render](https://render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name:** `bookinn-hub-backend`
   - **Environment:** Docker
   - **Region:** Choose appropriate region
   - **Branch:** `main`
   - **Root Directory:** `backend`

### 3. Configure Build Settings

- **Build Command:** `./mvnw clean package -DskipTests`
- **Start Command:** Automatically detected from Dockerfile

### 4. Add Environment Variables

In Render dashboard, add these environment variables:

```
DB_URL=postgresql://username:password@hostname/database?sslmode=require
DB_USER=your_neondb_user
DB_PASSWORD=your_neondb_password
JWT_SECRET=your_super_secret_jwt_key_256_bits_minimum
AWS_ACCESS_KEY=your_aws_access_key
AWS_SECRET_KEY=your_aws_secret_key
BUCKET_NAME=bookinn-hub-images
```

### 5. Configure Health Check

- **Health Check Path:** `/rooms/all`
- **Health Check Interval:** 30 seconds

### 6. Deploy

Click "Create Web Service" and wait for deployment to complete.

### 7. Note the Backend URL

After deployment, note your backend URL:
```
https://bookinn-hub.onrender.com
```

---

## Frontend Deployment (Vercel)

### 1. Prepare Frontend

Update `frontend/src/services/api.ts` with your production backend URL:

```typescript
const isLocal = window.location.hostname === "localhost";

export const API_BASE_URL = isLocal
    ? "http://localhost:8080"
    : "https://bookinn-hub.onrender.com";  // Your Render URL
```

### 2. Create Vercel Project

1. Log in to [Vercel](https://vercel.com/)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`

### 3. Configure Environment Variables (if needed)

If you have any frontend environment variables, add them in Vercel settings.

**Note:** The API URL is hardcoded in the frontend, so no environment variables are needed by default.

### 4. Deploy

Click "Deploy" and wait for the build to complete.

### 5. Configure Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

---

## Post-Deployment Configuration

### 1. Update CORS Configuration

Update `backend/src/main/java/com/sanjo/backend/config/CorsConfig.java`:

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
                            "https://your-vercel-domain.vercel.app"
                        )
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
```

Commit and push the changes to trigger a new deployment.

### 2. Test the Deployment

1. Visit your Vercel URL
2. Try registering a new user
3. Login with the user
4. Browse rooms
5. Create a booking
6. Test admin functions (if you have admin access)

### 3. Seed Production Database (Optional)

Connect to your NeonDB database and run seed scripts:

```bash
psql "postgresql://username:password@hostname/database?sslmode=require" -f seed.sql
```

---

## Continuous Deployment

Both Vercel and Render support automatic deployments from GitHub.

### How it Works

1. Push changes to GitHub
2. Vercel/Render detects the push
3. Automatically builds and deploys

### Branch-Based Deployments

**Vercel:**
- `main` branch → Production
- Other branches → Preview deployments

**Render:**
- Configure multiple environments in Render dashboard
- Set up separate services for staging/production

---

## Monitoring and Maintenance

### Backend Monitoring (Render)

1. **Logs:** View real-time logs in Render dashboard
2. **Metrics:** Monitor CPU, memory, and request metrics
3. **Alerts:** Set up email alerts for service issues

### Frontend Monitoring (Vercel)

1. **Analytics:** Enable Vercel Analytics
2. **Logs:** View deployment and function logs
3. **Performance:** Monitor Core Web Vitals

### Database Monitoring (NeonDB)

1. **Connection Stats:** Monitor active connections
2. **Storage Usage:** Track database size
3. **Query Performance:** Analyze slow queries

### AWS S3 Monitoring

1. **CloudWatch:** Monitor storage metrics
2. **Access Logs:** Enable S3 access logging
3. **Cost Tracking:** Monitor S3 costs

---

## Backup and Recovery

### Database Backups

**NeonDB** provides automatic backups:
- Point-in-time recovery
- Automatic daily backups
- 7-day retention (free tier)

**Manual Backup:**
```bash
pg_dump "postgresql://username:password@hostname/database?sslmode=require" > backup.sql
```

**Restore:**
```bash
psql "postgresql://username:password@hostname/database?sslmode=require" < backup.sql
```

### S3 Backups

- Enable S3 versioning
- Configure lifecycle policies
- Use S3 Cross-Region Replication for critical data

---

## Scaling Considerations

### Backend Scaling

**Render:**
- Upgrade to paid plan for better resources
- Enable auto-scaling
- Use multiple instances for high traffic

### Database Scaling

**NeonDB:**
- Upgrade plan for more connections
- Enable read replicas
- Optimize queries for performance

### Frontend Scaling

**Vercel:**
- Automatic CDN distribution
- Edge caching
- No configuration needed

---

## Security Best Practices

1. **Environment Variables:** Never commit secrets to Git
2. **HTTPS:** Ensure all services use HTTPS
3. **JWT Secret:** Use strong, random secret (256+ bits)
4. **Database:** Use connection pooling and prepared statements
5. **S3:** Limit public access to read-only
6. **CORS:** Restrict to specific origins in production
7. **Rate Limiting:** Implement API rate limiting (future enhancement)

---

## Rollback Strategy

### Backend Rollback (Render)

1. Go to Render dashboard
2. Navigate to service
3. Click "Deploys"
4. Select previous successful deployment
5. Click "Redeploy"

### Frontend Rollback (Vercel)

1. Go to Vercel dashboard
2. Navigate to project
3. Click "Deployments"
4. Find previous deployment
5. Click "..." → "Promote to Production"

---

## Troubleshooting

### Backend Issues

**Cold Start Delays:**
- Render free tier has cold starts (~1 minute)
- Upgrade to paid tier for always-on instances

**Database Connection Errors:**
- Verify connection string
- Check NeonDB connection limits
- Review connection pool settings

**Out of Memory:**
- Increase Render instance size
- Optimize JVM heap settings

### Frontend Issues

**Build Failures:**
- Check build logs in Vercel
- Verify all dependencies are in `package.json`
- Clear Vercel cache and rebuild

**API Connection Issues:**
- Verify backend URL in `api.ts`
- Check CORS configuration
- Review browser console for errors

---

## Cost Optimization

### Free Tier Limits

- **Vercel:** 100 GB bandwidth/month
- **Render:** 750 hours/month (free tier)
- **NeonDB:** 3 GB storage, 1 database
- **AWS S3:** 5 GB storage, 20,000 GET requests

### Recommendations

1. Monitor usage regularly
2. Implement image optimization
3. Use CDN caching effectively
4. Clean up unused S3 objects
5. Optimize database queries

---

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [NeonDB Documentation](https://neon.tech/docs)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)

---

## Support

For deployment issues:
1. Check service status pages
2. Review deployment logs
3. Consult documentation
4. Contact support teams

---

## Checklist

- [ ] NeonDB database created and configured
- [ ] AWS S3 bucket created with proper permissions
- [ ] Backend deployed to Render with environment variables
- [ ] Frontend deployed to Vercel
- [ ] CORS configured correctly
- [ ] Health checks passing
- [ ] Test user registration and login
- [ ] Test room booking flow
- [ ] Admin functions working
- [ ] Monitoring and alerts set up
- [ ] Backup strategy in place

---

Congratulations! Your BookInn Hub application is now deployed to production! 🎉
