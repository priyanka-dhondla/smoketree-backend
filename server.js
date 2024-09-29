const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/User');
const Address = require('./models/Address');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI).then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

app.post('/register', async (req, res) => {
  const { name,email,phoneNumber, address } = req.body;
  console.log(req.body);

  try {
    if (!name || !email|| !phoneNumber|| !address) {
      return res.status(400).send('Name,email,phoneNumber and Address are required');
    }

    const user = await User.create({ name,email,phoneNumber });
    await Address.create({ address, userId: user._id });

    res.status(201).send('User and address created successfully');
  } catch (error) {
    console.error('Error creating user and address:', error);
    res.status(500).send({ message: 'Error saving user and address', error });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on port ${port}`));
