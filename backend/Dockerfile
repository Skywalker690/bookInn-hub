# Use an official JDK runtime as a parent image
FROM eclipse-temurin:21-jdk AS build

WORKDIR /app

# Copy Maven wrapper & project files
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn

# Give execution permission to mvnw
RUN chmod +x mvnw

# Download dependencies (helps with caching)
RUN ./mvnw dependency:go-offline

# Copy source code
COPY src ./src

# Package the application
RUN ./mvnw clean package -DskipTests

# ------------------ Final Stage ------------------
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy the packaged JAR from build stage
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]