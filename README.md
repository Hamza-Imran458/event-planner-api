# Event Planner API

A simple REST API for an Event Planner application (Node.js + Express, JavaScript).

## Project structure

```
Event Planer/
├── server.js           # App entry point, starts Express and mounts routes
├── package.json
├── config/
│   └── index.js        # Config (e.g. port) – extend later
├── models/
│   └── eventModel.js   # In-memory event array and helper functions
├── controllers/
│   └── eventController.js   # Request handlers for events
└── routes/
    └── eventRoutes.js  # Routes for /events
```

## Event data model

Each event has:

- **id** – number (auto-increment)
- **name** – string
- **date** – string `YYYY-MM-DD`
- **location** – string
- **description** – string

Data is stored in memory only (no database).

## How to run the project

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the server**

   ```bash
   npm start
   ```

   Or with auto-restart during development:

   ```bash
   npm run dev
   ```

3. **Try the API**

   - Root: [http://localhost:3000](http://localhost:3000)
   - All events: [http://localhost:3000/events](http://localhost:3000/events)
   - One event: [http://localhost:3000/events/1](http://localhost:3000/events/1)

The server runs on port **3000** by default. To use another port, set `PORT` (e.g. `PORT=5000 npm start`).

## Manual testing (Day 2 – GET endpoints)

1. Start the server: `npm run dev`
2. **GET all events** – open in browser: [http://localhost:3000/events](http://localhost:3000/events)  
   - Expect: status 200, JSON array of all events (or empty array `[]` if none).
3. **GET event by id** – open: [http://localhost:3000/events/1](http://localhost:3000/events/1)  
   - Expect: status 200, single event object.
4. **GET non-existent event** – open: [http://localhost:3000/events/999](http://localhost:3000/events/999)  
   - Expect: status 404, JSON `{ "message": "Event not found" }`.

## What’s included

- **Day 1:** Express app, in-memory events, basic structure.
- **Day 2:** GET endpoints with error handling:
  - **GET** `/events` – list all events (200 + JSON array).
  - **GET** `/events/:id` – one event by id (200 + object, or 404 + error message).
  - Try-catch in controller; 500 for unexpected errors.
