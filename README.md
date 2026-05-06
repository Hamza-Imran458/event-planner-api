# Event Planner Monorepo

This project is split into two clean apps:

- `backend/` - Express API with authentication + CRUD + tests
- `frontend/` - React Native (Expo) mobile app

## Coursework 2 Submission Notes

- **Documentation (design + evaluation)**: see `CS4S763_CW2_Documentation.md`
- **Demo video link**: add your Panopto link inside `CS4S763_CW2_Documentation.md`
- **Auth + CRUD evidence**: show API calls in console / backend logs during demo

## Citation

- As required by the assessment brief, this project **acknowledges Justin Fletcher** (module tutorial / learning materials guidance).
- All implementation decisions and submitted code were produced and integrated by the student for this coursework, using the libraries listed in this repository.

## 1) Prerequisites

Install these first:

- Node.js LTS (recommended 18 or 20)
- npm (comes with Node)
- Git
- Expo Go app on phone (optional) OR Android Studio emulator

Check versions:

```bash
node -v
npm -v
git --version
```

## 2) Environment Setup

The backend reads environment values from root `.env`.

Create or update `.env` in the root:

```env
PORT=3000
JWT_SECRET=your_super_secret_key
```

## 3) Install Packages

From project root, run:

```bash
cd backend
npm install

cd ../frontend
npm install
```

This generates:

- `backend/package-lock.json`
- `frontend/package-lock.json`

## 4) Run the Project

Open two terminals.

Terminal 1 (backend):

```bash
cd backend
npm run dev
```

Terminal 2 (frontend):

```bash
cd frontend
npm start
```

Then press:

- `a` to open Android emulator
- or scan QR with Expo Go app on mobile

## 5) API URL Configuration (Important)

File: `frontend/src/config/api.js`

- Android emulator / real device needs your laptop LAN IP
- iOS simulator can use localhost

Example:

```js
const LOCAL_IP = '192.168.1.5';
```

Replace this with your own IP (find via `ipconfig` on Windows).

## 6) How to Use App (Demo Flow)

1. Register user
2. Login user
3. Create event
4. Refresh and view events
5. Update event
6. Delete event
7. Show API log in app for assessment evidence

## 7) Backend Testing

Run tests:

```bash
cd backend
npm test
```

## 8) Packages Used

### Backend packages

- `express`
- `dotenv`
- `jsonwebtoken`
- `bcryptjs`
- Dev: `jest`, `supertest`, `nodemon`

### Frontend packages

- `expo`
- `react`, `react-native`
- `@react-navigation/native`
- `@react-navigation/native-stack`
- `@react-native-async-storage/async-storage`
- `react-native-safe-area-context`
- `react-native-screens`
- `expo-status-bar`

## 9) Setup on Friend's System

Share project with GitHub or zip.

On friend's laptop:

1. Install Node.js LTS + Git + Expo Go / Android Studio
2. Clone project:
   ```bash
   git clone <your-repo-url>
   cd "Event Planer"
   ```
3. Create root `.env`:
   ```env
   PORT=3000
   JWT_SECRET=your_super_secret_key
   ```
4. Install dependencies:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
5. Update `frontend/src/config/api.js` with friend's IP
6. Start backend + frontend in separate terminals
7. Ensure phone and laptop are on same Wi-Fi (if using Expo Go)

## 10) Common Issues

- `Network request failed` in mobile app:
  - Wrong IP in `api.js`
  - Backend not running
  - Phone and laptop on different networks
- `Unauthorized` on CRUD:
  - Login first to get token
- Port busy:
  - Change `PORT` in `.env` and update API URL if needed
