const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require("path");
const fs = require('fs')

const mongoURI = 'mongodb+srv://root:root@cluster0.e9ezaox.mongodb.net/Project?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoURI)
    .catch((err) => console.error("MongoDB connection error", err));

const userSchema = new mongoose.Schema({
  _id: Number,
  name: String,
  email: { type: String, required: true, unique: true },
  password: String,
});
const User = mongoose.model("Id", userSchema);

app.use(express.json());


  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "Project", "code.html"));
  });
  
  app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "Project", "signup.html"));
  });
  app.get("/login", (req, res) => {
      res.sendFile(path.join(__dirname, "Project", "login.html"));
    });

    app.get("/booking", (req, res) => {
      res.sendFile(path.join(__dirname, "Project", "booking.html"));
    });
    app.get("/contact", (req, res) => {
      res.sendFile(path.join(__dirname, "Project", "contact.html"));
    });
    app.get("/flightbooking", (req, res) => {
      res.sendFile(path.join(__dirname, "Project", "flight booking.html"));
    });
    app.get("/hotels", (req, res) => {
      res.sendFile(path.join(__dirname, "Project", "hotels.html"));
    });
    app.get("/service", (req, res) => {
      res.sendFile(path.join(__dirname, "Project", "service.html"));
    });
  


app.post("/sign", async (req, res) => {
  try {
    const _id = await getNextSequence();
    const { name, email, password } = req.body;
    const newUser = new User({ _id, name, email, password });
    const savedUser = await newUser.save();
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.post('/log', async (req, res) => {
    const { email, password } = req.body;
    try {
        
        const user = await User.findOne({ email, password });
        if (user) {
            res.json({ success: true, message: `Congratulations ${user.name}, you have successfully logged in`, user });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
    
        console.error('Error finding user:', error);
        res.status(500).json({ success: false, message: 'An error occurred while processing your request' });
    }
});

const contactSchema = new mongoose.Schema({
    name: String,
    phone: Number,
    email: String,
    message: String
});

const Contact = mongoose.model('Contact', contactSchema);

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the 'public' directory

// Route to handle form submission
app.post('/cont', (req, res) => {
    const { name, phone, email, message } = req.body;

    // Create a new contact document based on the model
    const contact = new Contact({ name, phone, email, message });

    // Save the contact document to the database
    contact.save()
        .then(() => {
            console.log('Message saved successfully');
            res.json({ success: true });
        })
        .catch(error => {
            console.error('Error saving message:', error);
            res.status(500).json({ success: false, message: 'Failed to save message.' });
        });
});
async function getNextSequence() {
  const userCount = await User.countDocuments();
  return userCount + 1;
}

const bookingSchema = new mongoose.Schema({
    destination: String,
    date: Date,
    adults: Number,
    children: Number,
    tourType: String
  });
  
  // Create a model based on the schema
  const Booking = mongoose.model('Booking', bookingSchema);
  
  // Middleware to parse JSON bodies
  app.use(bodyParser.json());
  
  // Route to handle form submission
  app.post('/bookings', (req, res) => {
    const { destination, date, adults, children, tourType } = req.body;
  
    // Create a new booking document based on the model
    const booking = new Booking({
      destination,
      date,
      adults,
      children,
      tourType
    });
  
    // Save the booking document to the database
    booking.save()
      .then(() => {
        console.log('Tour booked successfully');
        res.json({ success: true });
      })
      .catch(error => {
        console.error('Error booking tour:', error);
        res.status(500).json({ success: false, message: 'Failed to book tour.' });
      });
  });

const PORT = 3000;
app.listen(PORT);
