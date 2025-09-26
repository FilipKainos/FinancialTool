# Financial Tool App - Development Guidelines

## Core Development Principles

### Code Quality Standards
- **Clean Code**: Write self-documenting code with clear variable and function names
- **Simplicity**: Prefer simple, straightforward solutions over complex implementations
- **Modularity**: Break down functionality into small, focused modules and components
- **Efficiency**: Optimize for performance and resource usage without sacrificing readability
- **Reusability**: Design components and functions to be reusable across different parts of the application
- **Scalability**: Design systems to handle growth in users, data, and features without major rewrites
- **Security**: Implement security-first design with proper authentication, authorization, and data protection

### Error Handling & Robustness
- Implement comprehensive error handling at all levels
- Use try-catch blocks appropriately to prevent cascading failures
- Validate inputs and provide meaningful error messages
- Design graceful degradation - if one feature fails, the rest of the app should continue working
- Log errors appropriately for debugging purposes

### Security & Validation Standards
- **Input Validation**: Validate all user inputs on both client and server sides using schema validation (Zod)
- **Authentication**: Implement secure user authentication with proper password hashing and JWT tokens
- **Authorization**: Ensure users can only access their own financial data through proper authorization checks
- **Data Protection**: Sanitize inputs to prevent SQL injection, XSS, and other injection attacks
- **API Security**: Implement rate limiting, CORS policies, and request validation on all endpoints
- **Sensitive Data**: Never log or expose sensitive financial information in error messages or logs
- **Database Security**: Use parameterized queries and proper database permissions

### Development Approach
- **Incremental Development**: Build in small, testable increments
- **Validate Before Proceeding**: Ensure each component works before adding complexity
- **Time Management**: Aim to complete tasks within 10 minutes unless exceptional circumstances require more time
- **Build on Solid Foundation**: Only add new features once the existing code is robust and tested

## Technology Stack

### Frontend
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS
- **Language**: TypeScript for type safety and better development experience
- **Validation**: Zod schemas for runtime type checking and input validation
- **Forms**: React Hook Form with validation for secure data entry

### Backend
- **Language**: TypeScript/Node.js
- **Database**: SQLite for lightweight, file-based storage
- **Architecture**: RESTful API design with clear separation of concerns
- **Security**: Helmet.js for security headers, bcrypt for password hashing, JWT for authentication
- **Validation**: Server-side input validation using Zod schemas

### Development Workflow
1. Plan the feature/change with security and scalability in mind
2. Implement in small, testable chunks with proper validation
3. Test thoroughly at each step, including security testing
4. Validate all inputs and outputs at component boundaries
5. Refactor if needed to maintain code quality and security standards
6. Document any complex logic and security considerations
7. Move to next increment only after current one is solid and secure

### Scalability Considerations
- Design database schemas that can handle growth (proper indexing, normalization)
- Implement pagination for large data sets from the start
- Use efficient algorithms and data structures
- Plan for horizontal scaling in API design
- Avoid N+1 queries and optimize database interactions
- Design components to handle large volumes of financial data efficiently

## File Organization
- Keep related files together
- Use clear, descriptive folder and file names
- Separate concerns (frontend/backend/database/utilities)
- Maintain consistent naming conventions throughout the project

## Remember
Always refer to this document before implementing any changes or new features. These guidelines ensure we build a maintainable, robust, and efficient Financial Tool App.