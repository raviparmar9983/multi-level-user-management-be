# Multi-Level User Management Backend

This is a backend API for a multi-level user management system built with Node.js, Express, TypeScript, and MongoDB.

## Prerequisites

Before starting the project, ensure you have the following installed:

- **Node.js**: Version 16 or higher. Download from [nodejs.org](https://nodejs.org/).
- **npm**: Comes with Node.js.
- **MongoDB**: Either a local MongoDB instance or a cloud MongoDB (like MongoDB Atlas). The project is configured to use MongoDB Atlas in the `.env` file.
- **Git**: For cloning the repository (if applicable).

## Installation

1. **Clone the repository** (if not already done):
   ```
   git clone <repository-url>
   cd multi-level-managnment
   ```

2. **Install dependencies**:
   Run the following command to install all required npm packages:
   ```
   npm install
   ```

## Environment Setup

The project uses environment variables for configuration. A `.env` file is already present in the root directory with default values.

### Required Environment Variables

The following variables are configured in `.env`:

- `PORT`: Server port (default: 3000)
- `DB_URL`: MongoDB connection URL (configured for MongoDB Atlas)
- `SALT_ROUNDS`: Number of salt rounds for bcrypt (default: 10)
- `JWT_SECRET`: Secret key for JWT token generation
- `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASS`, `MAIL_FROM`: Email configuration (using Ethereal for testing)
- `FRONTEND_URL`: Frontend application URL (default: http://localhost:4200)
- `API_URL`: API base URL (default: http://localhost:3000)
- `SITE_KEY`, `SECRET_KEY`: reCAPTCHA keys for captcha validation

If you need to modify these, edit the `.env` file accordingly.

## Running the Application

### Development Mode

To run the application in development mode with hot reloading:

```
npm run dev
```

This will start the server using `ts-node-dev`, which automatically restarts on file changes.

### Production Mode

1. **Build the project**:
   ```
   npm run build
   ```
   This compiles TypeScript to JavaScript in the `dist/` directory.

2. **Start the server**:
   ```
   npm start
   ```
   This runs the compiled JavaScript from `dist/server.js`.

The server will start on the port specified in `PORT` (default: 3000). You can access the API at `http://localhost:3000`.

## API Endpoints

The API provides the following main routes:

- **Authentication**: `/api/auth`
  - POST `/register` - User registration
  - POST `/login` - User login
  - POST `/refresh-token` - Refresh JWT token
  - POST `/forgot-password` - Request password reset
  - POST `/reset-password` - Reset password
  - GET `/verify` - Verify email

- **Users**: `/api/users`
- **Wallet**: `/api/wallet`
- **Transactions**: `/api/transactions`
- **Admin**: `/api/admin`

For detailed API documentation, refer to the route files in `src/routes/` and controller files in `src/controllers/`.

## Database

The application uses MongoDB with Mongoose for data modeling. Ensure your MongoDB instance is running and accessible via the `DB_URL` in `.env`.

## Testing

To test the API endpoints, you can use tools like Postman, Insomnia, or curl. The server provides a health check at the root endpoint: `GET /` which returns "API Running 🚀".

## Project Structure

```
src/
├── server.ts              # Main server file
├── config/
│   ├── db.ts              # Database connection
│   └── env.ts             # Environment configuration
├── controllers/           # Route handlers
├── middlewares/           # Express middlewares
├── models/                # Mongoose models
├── routes/                # API routes
├── services/              # Business logic
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
└── validations/           # Input validations with Yup
```

## Scripts

- `npm run dev`: Start development server with hot reload
- `npm run build`: Compile TypeScript to JavaScript
- `npm start`: Start production server
