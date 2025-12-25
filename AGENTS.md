# AGENTS.md

This file provides guidance to agents when working with codes in this repository.

## Development Commands

The project uses bun as the runtime. Key commands:

- `bun dev` - Start development server with hot reload
- `bun run build` - Build TypeScript to JavaScript in `dist/` folder
- `bun start` - Run production build from `dist/`
- `bun run lint` - Check code style with ESLint
- `bun run lint:fix` - Auto-fix ESLint issues
- `bun run prettier` - Check code formatting
- `bun run prettier:fix` - Auto-format code with Prettier
- `bun run db:index` - Sync MongoDB indexes

## Project Structure

- `src/index.ts` - Application entry point
- `src/controllers/` - Route handlers
- `src/routes/` - Express route definitions
- `src/services/` - Business logic & database services
- `src/models/` - Mongoose schemas & models
- `src/middlewares/` - Express middlewares (auth, validation, error handling)
- `src/requests/` - Zod validation schemas for requests
- `src/types/` - TypeScript type definitions
- `src/constants/` - Enums and constants
- `src/utils/` - Utility functions

## Rules

### Code Style

- Use TypeScript with strict type checking
- Follow ESLint and Prettier configurations
- Use ES modules (`import/export`) syntax
- Use path aliases: `@/` maps to `src/`
- ES modules are used throughout (`"type": "module"`)

### Database

- Use Mongoose for MongoDB interactions
- Define models in `src/models/`
- Run `bun run db:index` after modifying indexes (when deploy to production)
- Follow naming convention: PascalCase for model files (e.g., `User.ts`)
- Use camelCase for document MongoDB (e.g., `dateOfBirth`)

### API Development

- Controllers handle HTTP logic (in `src/controllers/`)
- Services contain business logic (in `src/services/`)
- Use Zod for request validation (schemas in `src/requests/`)
- Apply validation middleware: `validate(schema)` from `src/middlewares/validate.middleware.ts`
- Follow RESTful conventions

### Authentication

- Use bcrypt for password hashing
- Implement JWT with refresh token pattern
- Store refresh tokens in MongoDB (`RefreshToken` model)
- Add authentication middleware to protected routes

### Error Handling

- Use centralized error handler in `src/middlewares/error.middlewares.ts`
- Return proper HTTP status codes
- Hide sensitive error details in production
- Show detailed errors only in development mode

### Best Practices

- Always validate user input with Zod schemas
- Use async/await for asynchronous operations
- Handle errors gracefully
- Add TypeScript types for all functions
- Write clean, readable code with proper comments
- Test changes with `bun dev` before committing
- Check for lint errors before making changes final
- Test both success and failure cases with edge cases
- Features without tests are incomplete - every new feature or bug fix needs test coverage
- Don't skip tests due to type issues - fix the types instead
- No log statements (`console.log`, `debugger`) in tests or production code
- Ask before generating new files
- Performance is critical - parameter reassignment is allowed for optimization
