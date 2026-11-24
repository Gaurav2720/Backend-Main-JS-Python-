# Docker Containerization — Express Student Management Service

**Course:** Backend Web Development  
**Topic:** Containerization with Docker  
**Directory:** `class_docker/`  
**Application Entry:** `student-app.js`

---

## 1. Overview
This practical demonstrates the principles of software containerization using **Docker**. An Express.js microservice (`student-app.js`) offering REST endpoints for student records is packaged into a self-contained, reproducible Linux container image based on `node:18-alpine`.

---

## 2. Dockerfile Breakdown
- `FROM node:18-alpine`: Minimal Alpine-based image (~170MB vs 1GB standard Ubuntu image) reducing attack surface and transfer bandwidth.
- `WORKDIR /usr/src/app`: Creates isolated application folder inside the container.
- `COPY package*.json ./` followed by `RUN npm ci --only=production`: Utilizes **Docker layer caching**. Dependency installation is only re-executed if `package.json` changes, speeding up incremental builds.
- `EXPOSE 3000`: Documents that containerized service listens on port 3000.
- `CMD ["node", "student-app.js"]`: Defines default container entrypoint command.

---

## 3. Build & Run Commands

### 1. Build Docker Image
```bash
docker build -t student-management-service:1.0 .
```

### 2. Inspect Created Image
```bash
docker images | grep student-management-service
```

### 3. Run Container in Detached Mode
```bash
docker run -d -p 3000:3000 --name student-api-container student-management-service:1.0
```

### 4. Verify Running Container & View Logs
```bash
docker ps
docker logs -f student-api-container
```

### 5. Test Endpoints from Host
```bash
# Health check
curl http://localhost:3000/

# List students
curl http://localhost:3000/students

# Add student
curl -X POST http://localhost:3000/students \
  -H "Content-Type: application/json" \
  -d '{"name": "Ananya", "course": "B.Tech CSE"}'
```

### 6. Stop and Cleanup Container
```bash
docker stop student-api-container
docker rm student-api-container
```
