# Financial Tool App

A robust, modular financial management application built with TypeScript, React, Tailwind CSS, and SQLite.

## Project Structure

```
FinancialTool/
├── development-guidelines.md    # Development principles and coding standards
├── frontend/                   # React frontend application
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   ├── pages/            # Page components
│   │   ├── utils/            # Frontend utility functions
│   │   └── index.css         # Tailwind CSS styles
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   └── tsconfig.json         # Frontend TypeScript configuration
├── backend/                   # Node.js backend API
│   ├── src/
│   │   ├── controllers/      # API route controllers
│   │   ├── models/           # Data models and types
│   │   ├── routes/           # Express route definitions
│   │   └── utils/            # Backend utility functions
│   └── tsconfig.json         # Backend TypeScript configuration
├── database/                 # SQLite database files and schema
│   └── schema.sql           # Database schema definition
└── shared/                  # Shared types and utilities
```

## Technology Stack

- **Frontend**: React with TypeScript, Tailwind CSS
- **Backend**: Node.js with TypeScript, Express.js
- **Database**: SQLite with robust schema design
- **Development**: Modular architecture with strong typing

## Development Principles

This project follows strict development guidelines focused on:
- Clean, simple, and modular code design
- Comprehensive error handling and robustness
- Incremental development approach
- Reusable components and utilities
- Type safety throughout the application

## Next Steps

To continue development, you'll need to:

1. Initialize package.json files for frontend and backend
2. Install required dependencies (React, Express, SQLite packages, etc.)
3. Set up build scripts and development servers
4. Implement authentication and core features

## Important

**Always read `development-guidelines.md` before implementing any new features or changes.** This document contains the core principles that ensure consistent, maintainable code throughout the project.

---

*Project initialized on September 26, 2025*