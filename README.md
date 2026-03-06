# Event Planner API – Day 1

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
    └── eventRoutes.js  # Routes for /api/events
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

   - Root: [http://localhost:5000](http://localhost:5000)
   - All events: [http://localhost:5000/api/events](http://localhost:5000/api/events)
   - One event: [http://localhost:5000/api/events/1](http://localhost:5000/api/events/1)

The server runs on port **5000** by default. To use another port, set `PORT` (e.g. `PORT=3000 npm start`).

## What’s included (Day 1)

- Express app with JSON body parsing
- In-memory event list with 3 sample events
- **GET** `/api/events` – list all events
- **GET** `/api/events/:id` – get one event (404 if not found)

Create, update, and delete can be added in later days.
