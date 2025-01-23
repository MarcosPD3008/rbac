# Architectural Decision Record (ADR)

## ADR-002: PostgreSQL as the Database Management System

### Status
*Accepted*

### Context
The system requires a database management system (DBMS) to store and manage data. The DBMS must be reliable, scalable, and support the features required by the system. The system is a web application that will be deployed on a cloud platform. The system is expected to have a large number of users and a high volume of data. The system must be able to handle concurrent requests and provide high availability.

### Decision
PostgreSQL will be used as the database management system for the system. PostgreSQL is a powerful, open-source DBMS that is known for its reliability, scalability, and feature-richness. PostgreSQL supports advanced features such as ACID compliance, transactions, indexes, and constraints. PostgreSQL is widely used in the industry and has a large community of users and developers. PostgreSQL is supported by most cloud platforms and can be easily deployed on a cloud platform.

### Consequences
#### ✅ Pros:
- PostgreSQL is a reliable and scalable DBMS that can handle a large number of users and a high volume of data.
- PostgreSQL supports advanced features such as ACID compliance, transactions, indexes, and constraints.
- PostgreSQL is widely used in the industry and has a large community of users and developers.

#### ❌ Cons:
- PostgreSQL may require more resources compared to other DBMSs, which could increase the cost of hosting the system.
- PostgreSQL may have a steeper learning curve for developers who are not familiar with it.

### Alternatives Considered
- MySQL: MySQL is another popular open-source DBMS that is widely used in the industry. MySQL is known for its performance and ease of use. However, MySQL has some limitations compared to PostgreSQL, such as lack of support for advanced features like full-text search and window functions.

### Extra

#### Docker Command: 
```bash
docker run --name rbac-postgres -e POSTGRES_USER=rbac -e POSTGRES_PASSWORD=RBAC-PWD* -e POSTGRES_DB=rbacDB -p 5432:5432 -d postgres
```

---
*Created on: 09/Jan/2025*
