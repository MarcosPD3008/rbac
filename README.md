# RBAC API

## Overview
This project implements a **Role-Based Access Control (RBAC)** system using **NestJS**, **Passport**, and **JWT**. It provides a secure and scalable way to manage users, roles, and permissions, enabling fine-grained access control for protected resources.

---

## Features
- **Authentication**: Secure login using email or username with JWT-based authentication.
- **Authorization**: Role and permission-based access control to protect endpoints.
- **Password Encryption**: Secure password storage using Argon2.
- **Extensible Design**: Supports modular addition of roles, permissions, and other authentication strategies.
- **Swagger Documentation**: Auto-generated API documentation for better development experience.
- **Token Blacklist**: Support for token blacklisting to invalidate compromised or unused tokens.

---

## Technologies Used
- **NestJS**: Framework for building scalable and maintainable Node.js applications.
- **Passport.js**: Authentication middleware for Node.js.
- **JWT**: Token-based authentication for stateless APIs.
- **TypeORM**: ORM for managing database operations.
- **PostgreSQL**: Relational database for data storage.
- **Argon2**: Secure password hashing.
- **Redis(Optional)**: In-memory data store for token blacklisting.

---

## Project Structure
```
src/
├── common/
│   ├── base/          # Base entities and services
│   ├── guards/        # Guards for authentication and authorization
│   ├── services/      # Shared services (e.g., encryption)
│   └── common.module.ts
├── config/
│   ├── database/      # Database configuration and providers
│   ├── swagger/       # Swagger setup
│   └── data-source.ts
├── modules/
│   ├── permissions/   # Permissions module
│   ├── roles/         # Roles module
│   ├── users/         # Users module
│   └── auth/          # Authentication module
└── app.module.ts      # Root module
```

---

## Installation
### Prerequisites
- Node.js (v16 or higher)
- Yarn (recommended) or npm
- PostgreSQL

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/MarcosPD3008/rbac
   cd rbac
   ```
2. Install dependencies:
   ```bash
   yarn install
   ```
3. Set up environment variables:
   Create a `.env` file in the root directory with variables in [`.env.example`](./.env.example).:

   
4. Run the application:
   ```bash
   yarn start:dev
   ```
5. Access the API:
   - Base URL: `http://localhost:3000`
   - Swagger Documentation: `http://localhost:3000/api-docs`

---

## API Endpoints
### **Auth**
- `POST /auth/login`: Authenticate a user and retrieve a JWT token.
- `POST /auth/refresh`: Refresh JWT token.
- `POST /auth/logout`: Logout and invalidate JWT token.

### **Users**
- `GET /users`: Retrieve all users.
- `POST /users`: Create a new user.
- `PUT /users/:id`: Update an existing user.
- `DELETE /users/:id`: Delete a user.
- `PUT /users/:id/roles`: Assign or change a role for a user.

### **Roles**
- `GET /roles`: Retrieve all roles.
- `POST /roles`: Create a new role.
- `PUT /roles/:id`: Update an existing role.
- `DELETE /roles/:id`: Delete a role.
- `POST /roles/:id/permissions`: Assign permissions to a role.

### **Permissions**
- `GET /permissions`: Retrieve all permissions.
- `POST /permissions`: Create a new permission.
- `PUT /permissions/:id`: Update an existing permission.
- `DELETE /permissions/:id`: Delete a permission.

---

## Security
- Passwords are securely hashed using Argon2 before storage.
- JWT tokens are used for stateless authentication.
- Access control is enforced using a combination of guards and custom decorators.
- Token blacklisting is supported to invalidate compromised or unused tokens.

---

## Development
### Generate a Migration
```bash
npx typeorm migration:generate -n MigrationName -d src/config/data-source.ts
```

### Run Migrations
```bash
npx typeorm migration:run -d src/config/data-source.ts
```

### Seed Database
To seed initial roles and permissions, create a dedicated seeder script or use migrations.

---

## Future Improvements
- Implement refresh tokens for better token lifecycle management.
- Add social login options (e.g., Google, Facebook).
- Extend role-permission hierarchy for more granular control.

---

## License
This project is licensed under the [MIT License](LICENSE).

---
