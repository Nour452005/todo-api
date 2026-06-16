# Todo REST API

A REST API built with Node.js, Express, and PostgreSQL.

## Tech Stack
- Node.js
- Express
- PostgreSQL
- pg (node-postgres)
- dotenv

## Setup

1. Clone the repository
2. Install dependencies
   npm install
3. Create a .env file in the root folder
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=todo_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   PORT=3000
4. Create the database in PostgreSQL
   CREATE TABLE todos (
       id SERIAL PRIMARY KEY,
       title VARCHAR(200) NOT NULL,
       description TEXT,
       completed BOOLEAN DEFAULT FALSE,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
5. Run the server
   node index.js

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /todos | Get all todos |
| GET | /todos/:id | Get one todo |
| POST | /todos | Create a todo |
| PUT | /todos/:id | Update a todo |
| DELETE | /todos/:id | Delete a todo |

## Request Body Examples

### POST /todos
{
  "title": "Learn Express",
  "description": "Build a REST API"
}

### PUT /todos/:id
{
  "title": "Learn Express",
  "description": "Build a REST API",
  "completed": true
}