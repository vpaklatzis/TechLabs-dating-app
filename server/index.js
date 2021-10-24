const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const helmet = require("helmet")
const morgan = require("morgan")
const userRoute = require("./routes/users")
const authRoute = require("./routes/auth")
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

// Homepage
app.get("/", (req, res) => {
    res.send("Homepage")
})

app.listen(8800, () => 
    console.log("server is running")
)