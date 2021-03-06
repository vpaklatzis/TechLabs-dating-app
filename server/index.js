const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const helmet = require("helmet")
const morgan = require("morgan")
const userRoute = require("./routes/users")
const authRoute = require("./routes/auth")
const conversationRoute = require("./routes/conversations")
const messageRoute = require("./routes/messages")
const multer = require("multer")
const path = require("path")

dotenv.config()

// Initialize the app
const app = express()

// Connects to MongoDB
mongoose
.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true})
.then(() => console.log("Connected to db"))
.catch(err => console.log(err))

// Instead of making a request, it looks for the profile images inside the public/images folder
app.use("/images", express.static(path.join(__dirname, "public/images")))
app.use(express.static(__dirname + '/views'));

// Middleware
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))

// Multer saves the uploaded profile picture locally
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images")
    },
    // originalname is only for postman testing
    // must be req.body.name, frontend sends the file to backend
    filename: (req, file, cb) => {
        cb(null, req.body.name) 
    }
})

// Upload profile picture route
const upload = multer({storage: storage})

app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
        return res.status(200).json("File uploaded successfully")
    } catch (err) {
        console.log(err)
    }
})

// Users route
app.use("/api/user", userRoute)

// Auth route
app.use("/api/auth", authRoute)

// Conversation route
app.use("/api/conversations", conversationRoute)

// Message route
app.use("/api/messages", messageRoute)

// Homepage
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html")
})

// Select hobbies
app.get("/hobbies", (req, res) => {
    res.sendFile(__dirname + "/views/hobbies.html")
})

app.listen(8080, () => 
    console.log("server is running")
)