require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env
const express = require('express') // CommonJS import style!
const morgan = require('morgan') // middleware for nice logging of incoming HTTP requests
const cors = require('cors') // middleware for enabling CORS (Cross-Origin Resource Sharing) requests.
const mongoose = require('mongoose')


const app = express() // instantiate an Express object
app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test' })) // log all incoming requests, except when in unit test mode.  morgan has a few logging default styles - dev is a nice concise color-coded style
app.use(cors()) // allow cross-origin resource sharing

// use express's builtin body-parser middleware to parse any data included in a request
app.use(express.json()) // decode JSON-formatted incoming POST data
app.use(express.urlencoded({ extended: true })) // decode url-encoded incoming POST data
// app.use('/public', express.static('/Users/apple/Desktop/Agile/Project/3-simple-mern-stack-app-Ella-zizzzy/back-end/public'));

// connect to database
mongoose
  .connect(`${process.env.DB_CONNECTION_STRING}`)
  .then(data => console.log(`Connected to MongoDB`))
  .catch(err => console.error(`Failed to connect to MongoDB: ${err}`))

// load the dataabase models we want to deal with
const { Message } = require('./models/Message')
const { User } = require('./models/User')

// a route to handle fetching all messages
app.get('/messages', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({})
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

// a route to handle fetching a single message by its id
app.get('/messages/:messageId', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({ _id: req.params.messageId })
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})
// a route to handle logging out users
app.post('/messages/save', async (req, res) => {
  // try to save the message to the database
  try {
    const message = await Message.create({
      name: req.body.name,
      message: req.body.message,
    })
    return res.json({
      message: message, // return the message we just saved
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    return res.status(400).json({
      error: err,
      status: 'failed to save the message to the database',
    })
  }
})

const aboutUsContent = {
  title: "About Us",
  paragraphs: [
    "Hi! My name is Ella Li. ",
    "I'm a senior undergraduate student majoring in Computer Science and Economics at New York University.",
    "I love nail arts. 💅🏼",
    "My favorite game is The Legend of Zelda: Breath of the Wild. ",
    "If a Nintendo character were to represent me, it should be Princess Daisy.🌼",
    ""
  ],
  imageUrl: "https://lh3.googleusercontent.com/drive-viewer/AEYmBYTSOl1cAqSZrHu2IuP_B6McwHqdUbZdvfBsKjw-8sDao-VgXAg36StBr1LuO7wxKY1mrMrtXu8zt2IMU8NA0itE_RamlA=s1600"
  // imageUrl:"http://localhost:5002/public/asset/5F203F70-731C-4F41-A55F-D1C58959862A_1_105_c.jpeg"
};

app.get('/aboutus', (req, res) => {
  res.json(aboutUsContent);
});



// export the express app we created to make it available to other modules
module.exports = app // CommonJS export style!
