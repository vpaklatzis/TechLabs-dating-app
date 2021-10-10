const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const helmet = require("helmet")
const morgan = require("morgan")
const userRoute = require("./routes/users")
const authRoute = require("./routes/auth")

// Initialize the app
const app = express()

dotenv.config()

// Connects to MongoDB
mongoose
.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true})
.then(() => console.log("Connected to db"))
.catch(err => console.log(err))

// Middleware
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))

// Users route
app.use("/api/user", userRoute)

// Auth route
app.use("/api/auth", authRoute)

// Homepage
app.get("/", (req, res) => {
    res.send("Homepage")
})

app.listen(8800, () => 
    console.log("server is running")
)