# Financial Tool App - Development Guidelines

## Core Development Principles

### Code Quality Standards
- **Clean Code**: Write self-documenting code with clear variable and function names
- **Simplicity**: Prefer simple, straightforward solutions over complex implementations
- **Modularity**: Break down functionality into small, focused modules and components
- **Efficiency**: Optimize for performance and resource usage without sacrificing readability
- **Reusability**: Design components and functions to be reusable across different parts of the application

### Error Handling & Robustness
- Implement comprehensive error handling at all levels
- Use try-catch blocks appropriately to prevent cascading failures
- Validate inputs and provide meaningful error messages
- Design graceful degradation - if one feature fails, the rest of the app should continue working
- Log errors appropriately for debugging purposes

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

### Backend
- **Language**: TypeScript/Node.js
- **Database**: SQLite for lightweight, file-based storage
- **Architecture**: RESTful API design with clear separation of concerns

### Development Workflow
1. Plan the feature/change
2. Implement in small, testable chunks
3. Test thoroughly at each step
4. Refactor if needed to maintain code quality
5. Document any complex logic
6. Move to next increment only after current one is solid

## File Organization
- Keep related files together
- Use clear, descriptive folder and file names
- Separate concerns (frontend/backend/database/utilities)
- Maintain consistent naming conventions throughout the project

## Remember
Always refer to this document before implementing any changes or new features. These guidelines ensure we build a maintainable, robust, and efficient Financial Tool App.