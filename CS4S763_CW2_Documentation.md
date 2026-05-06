# CS4S763 Coursework 2 — App Documentation (Design + Evaluation)

## Project Overview
- **App name**: Event Planner
- **Type**: Mobile app (React Native / Expo) + REST API (Express)
- **Core goal**: Authenticate user and perform CRUD operations on events via API.

## Libraries / Templates Used (What I used and why)
### Frontend
- Expo / React Native
- React Navigation
- Formik + Yup (form handling + validation)

### Backend
- Express
- JWT (authentication)
- bcryptjs (password hashing)
- Jest + Supertest (API tests)

## Required Citation (Assessment)
- This coursework includes an acknowledgement of **Justin Fletcher** (module tutorial / learning materials guidance), as requested in the assessment brief.

> Note: UI is custom-built using React Native components and styling. If any UI components were inspired by a template, describe exactly what you changed here.

## Design (Before Build)
### Screens (Wireframe / Layout Notes)
#### 1) Login Screen
- Inputs: username, password
- Buttons: Sign In, link to Sign Up
- Validation: username min 3, password min 6
- On success: store JWT token and navigate to Events screen

#### 2) Signup Screen
- Inputs: username, password, confirm password
- Validation: same as login + confirm password match
- On success: user is created and user is directed to login

#### 3) Events Screen (List)
- Shows the user’s events (fetched from API)
- Actions: Create, Edit, Delete
- Logout button to clear token

#### 4) Create/Edit Event Modal
- Fields: name, date, time, location, description
- Validation: required fields (client-side) + required fields (server-side)

### API Endpoints Planned
- `POST /register`
- `POST /login`
- `GET /events` (requires JWT)
- `GET /events/:id` (requires JWT)
- `POST /events` (requires JWT)
- `PUT /events/:id` (requires JWT)
- `DELETE /events/:id` (requires JWT)

## Validation + Security (What’s implemented)
- **Frontend validation**: Formik + Yup on login/signup/event forms
- **Backend validation**: required checks for event fields (including `time`)
- **Authentication**: JWT (Bearer token) required for all `/events` routes
- **Authorization**: events are filtered by `userId` so users see only their own events

## Evaluation (After Build)
### What went well
- Auth works and token is stored on device.
- CRUD actions (create/read/update/delete) work and are reflected via API.
- Validation exists on both frontend and backend.

### What could be improved
- Persist events in a real database instead of in-memory arrays.
- Better error messages and loading indicators in all places.
- Add search/filter/sort by date and time.

### How well does final app match original design?
- Describe any differences from your initial plan here (screens changed, extra features, or missing features).

## Demo Evidence (Task 5)
### Demo video link
- **Panopto / video link**: <PASTE_LINK_HERE>

### Demo flow (record this)
1. Register a new user
2. Login and show JWT returned from API
3. Fetch events (GET) and show list updates
4. Create an event (POST) and show it appears in the list
5. Update an event (PUT) and show the updated values in the list
6. Delete an event (DELETE) and show it disappears from the list

### Evidence to show in the video
- Show API calls by:
  - frontend console logs, and/or
  - backend terminal logs, and/or
  - Postman requests + HTTP status codes

