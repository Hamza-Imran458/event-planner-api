# 🎪 Event Planner API - Complete Guide

Welcome to the Event Planner API! This is a complete guide to understanding how everything in this project works. Whether you're presenting this project, studying it, or just trying to wrap your head around learning how a backend "Robot Brain" works, this README will explain EVERYTHING, from the folders to the code itself!

---

## 📂 1. The Project "Backpack" (Folder Structure)

Here is a map of every file and folder in this project and what they do. Think of each folder as a different room in a restaurant.

```text
Event Planer/
│
├── .env                 # 🤫 The Secret Safe: Holds hidden passwords (like the JWT secret).
├── package.json         # 📦 The Instruction Manual: Tells your computer what tools to download (Express, Jest, etc.).
├── server.js            # 🏢 The Front Door: The main file that turns the API ON and starts listening for requests.
├── jest.config.js       # 🤖 The Robot Tester Settings: Instructions for the testing robot (Jest).
│
├── config/              # ⚙️ Settings Room: Contains basic settings like what Port the server runs on.
│
├── controllers/         # 👨‍🍳 The Chefs (Logic logic):
│   ├── authController.js   # Chef for passwords. Handles Logging in.
│   └── eventController.js  # Chef for events. Handles creating, getting, updating, and deleting events.
│
├── middleware/          # 💂‍♂️ The Bouncer (Security):
│   └── auth.js             # Checks if the user has a valid "VIP Badge" (Token) before letting them change an event.
│
├── models/              # 📒 The Notebooks (Data storage):
│   ├── eventModel.js       # The notebook where all the Event data is written down.
│   ├── userModel.js        # The notebook where the User passwords (hashed) are written down.
│   └── testData.js         # A temporary notebook used just for testing out the robot.
│
├── routes/              # 📜 The Menu (URLs you can visit):
│   ├── authRoutes.js       # Menu for login: 'Hey waiter, I want to go to /login'
│   └── eventRoutes.js      # Menu for events: 'Hey waiter, give me the /events list'
│
└── tests/               # 🧪 The Quality Testers:
    └── auth.test.js        # The automated test robot that checks if the Login system works automatically!
```

---

## 💻 2. Line-by-Line Code Explanation 

Let's look at the most important files in the project and explain what the code is doing line-by-line!

### 🟢 `server.js` (The Main Engine)
This is the heart of the project. Whenever you run the project, this is the file that starts up.

```javascript
// 1. Load the secret variables from the .env file FIRST.
require('dotenv').config();

// 2. Import Express (The heavy-lifter toolkit that builds the server).
const express = require('express');

// 3. Import the Menus (Routes) from the routes folder.
const eventRoutes = require('./routes/eventRoutes');
const authRoutes = require('./routes/authRoutes');

// 4. Create the actual server application and call it "app".
const app = express();

// 5. Choose a Port number (like an apartment number) for the server to live in.
//    If there is a PORT in the secret .env file, use it. Otherwise, use 3000.
const PORT = process.env.PORT || 3000;

// 6. Tell the server to understand JSON (The language computers use to send data).
app.use(express.json());

// 7. Create a simple Welcome message if someone visits the main URL (/)
app.get('/', (req, res) => {
  res.json({ message: 'Event Planner API is running' });
});

// 8. Mount the Menus! 
//    "If a user asks for anything, check the auth routes first (like /login)"
app.use('/', authRoutes);
//    "If a user asks for /events, hand them over to the eventRoutes file."
app.use('/events', eventRoutes);

// 9. Turn on the server! Only turn it on if we are running this file directly.
if (require.main === module) {
  app.listen(PORT, () => {
    // 10. Print a message to the console so we know the server is awake!
    console.log(`Event Planner API running at http://localhost:${PORT}`);
  });
}

// 11. Export the app so the testing robots can use it without turning the real server on.
module.exports = app;
```

---

### 🟢 `routes/eventRoutes.js` (The Menu)
This file tells the server what URLs people are allowed to visit and who is in charge of answering.

```javascript
// 1. Import Express again so we can use its Router tool.
const express = require('express');
// 2. Create a new Router (A mini-application that just handles routes).
const router = express.Router();
// 3. Import the Chef (Controller) who actually does the work for events.
const eventController = require('../controllers/eventController');
// 4. Import the Bouncer (Middleware) who checks for VIP tokens.
const auth = require('../middleware/auth');

// 5. GET /events 
//    "If someone asks for a list of events, let anyone see it. Tell the chef to getEvents."
router.get('/', eventController.getEvents);

// 6. GET /events/:id 
//    "If someone asks for ONE specific event (like event number 1), tell the chef to getEventById."
router.get('/:id', eventController.getEventById);

// 7. POST /events 
//    "If someone tries to CREATE an event, FIRST pass them to 'auth' (the bouncer). 
//    If the bouncer says they have a token, THEN tell the chef to createEvent."
router.post('/', auth, eventController.createEvent);

// 8. PUT /events/:id 
//    "If someone tries to UPDATE an event, make the 'auth' bouncer check them first."
router.put('/:id', auth, eventController.updateEvent);

// 9. DELETE /events/:id 
//    "If someone tries to DELETE an event, make the 'auth' bouncer check them first."
router.delete('/:id', auth, eventController.deleteEvent);

// 10. Export this mini-menu so server.js can read it.
module.exports = router;
```

---

### 🟢 `middleware/auth.js` (The Security Bouncer)
This is what protects the VIP routes (like Creating or Deleting an event).

```javascript
// 1. Import JSON Web Token toolkit. (This is what makes the VIP badges).
const jwt = require('jsonwebtoken');

// 2. Create the bouncer function. It intercept requests before they reach the Chef.
//    req = what the user sent. res = what we send back. next = "let them pass"
module.exports = (req, res, next) => {
  
  // 3. Look at the User's request and check their "Authorization" header.
  const authHeader = req.header('Authorization');

  // 4. If they didn't bring a badge at all, kick them out! (Error 401)
  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // 5. Badges usually look like "Bearer <token_code>". We just want the token code.
    //    We split the string into an array and grab the second part.
    const token = authHeader.split(' ')[1];

    // 6. If they said "Bearer" but forgot the token part, kick them out!
    if (!token) {
      return res.status(401).json({ message: 'Token format is invalid' });
    }

    // 7. Grab the Secret Code from the .env file.
    //    (The secret code helps us know if the badge is real or fake).
    const secret = process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_production';

    // 8. Ask the JWT toolkit to verify if this token is real using our secret.
    const decoded = jwt.verify(token, secret);

    // 9. If it's real, staple the user's ID to the request so the Chef knows who ordered it.
    req.user = decoded.userId;

    // 10. Tell the bouncer to let the user pass to the next step! (Usually the Chef).
    next();
  } catch (err) {
    // 11. If the token was fake or expired, the verify test fails and kicks them out automatically.
    res.status(401).json({ message: 'Token is not valid' });
  }
};
```

---

### 🟢 `models/eventModel.js` (The Notebook)
This file holds your data in memory. If you had a database, this is where you would connect it!

```javascript
// 1. We create an empty array called "events". 
//    This is literally just a list sitting in the computer's temporary memory.
let events = [];

// 2. We keep track of IDs. The next event made will be ID #1.
let nextId = 1;

// 3. We group all our functions into an object so we can export them together.
const eventModel = {
  
  // A function to get the whole list. Returns the array.
  getAll: () => events,

  // A function to find just one event. 
  // It searches the array for an event whose ID matches what we asked for.
  getById: (id) => events.find(event => event.id === Number(id)),

  // A function to create a new event!
  create: (eventData) => {
    // Create a new object. Give it the nextId, and then copy all the data they sent.
    const newEvent = { id: nextId++, ...eventData };
    // Add it to our array list.
    events.push(newEvent);
    // Return the newly created item.
    return newEvent;
  },

  // A function to update an event.
  update: (id, updateData) => {
    // Find where the event is located in the array.
    const index = events.findIndex(event => event.id === Number(id));
    // If we can't find it, return null (meaning nothing here).
    if (index === -1) return null;
    
    // If we do find it, combine the old data with the new updated data.
    events[index] = { ...events[index], ...updateData };
    return events[index]; // Return the updated event.
  },

  // A function to delete an event.
  delete: (id) => {
    // Find where the event is located in the array.
    const index = events.findIndex(event => event.id === Number(id));
    // If we can't find it, return false.
    if (index === -1) return false;
    
    // If we find it, "splice" (cut) it out of the array permanently.
    events.splice(index, 1);
    return true; // Return true to say "Yep, I deleted it!"
  }
};

// 4. Export the notebook so the Chefs (Controllers) can write in it.
module.exports = eventModel;
```

---

## 🚀 3. How to Run This Project Like a Pro 

1. **Open your Terminal** (like the command prompt).
2. **Make sure you are in the folder `Event Planer`**.
3. **Install the toolkits** (You only have to do this once):
   ```bash
   npm install
   ```
4. **Start the API!**
   ```bash
   npm run dev
   ```
   *(`npm run dev` tells the computer to use "nodemon", a neat tool that automatically restarts the server if you save a code change!)*
5. **Test it!** You can use a program like **Postman** to send requests, or just open a browser and go to `http://localhost:3000/events` to see your events!

---

### 🎉 Summary
That's it! Your server waits at the door (server.js). It looks at the menu (Routes) to see what the user wants. If the user wants to change things, it checks their VIP badge (Middleware). Then it hands the order to the Chef (Controller) who writes down the changes in the notebook (Model). 

**Happy Coding! 💻✨**
