<p align="center">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" />
  <img alt="NestJS" src="https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white" />
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white" />
  <img alt="TypeORM" src="https://img.shields.io/badge/TypeORM-FE0902" />
  <img alt="Docker" src="https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white" />
</p>

# Teslo Shop API (NestJS)

E-commerce REST API built with **NestJS** as part of a course project.  
Includes authentication, role-based access control, Swagger docs, file uploads, validations, pagination, PostgreSQL with Docker, and seed data.

## Features
- JWT Authentication
- RBAC (roles/permissions)
- CRUD modules (products, users, etc.)
- Validation (DTOs)
- Pagination
- File uploads
- Swagger API documentation
- PostgreSQL database (Docker)
- Seed endpoint for demo data

## Tech Stack
- Node.js + TypeScript
- NestJS
- PostgreSQL (Docker / Docker Compose)
- ORM: (TypeORM)
- Swagger (OpenAPI)

## Installation & Running
1. Clone the repository
2. Install dependencies:
   ```yarn install```
3. Copy .env.template and rename it to .env
4. Update the environment variables
5. Start the database:
```docker-compose up -d```
6. Start the app: ```yarn start:dev```
7. Run SEED: 
```http://localhost:3000/api/seed```
