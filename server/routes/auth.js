const router = require("express").Router()
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const dotenv = require("dotenv")

dotenv.config()

// Twilio config
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const serviceId = process.env.TWILIO_SERVICE_ID
const client = require("twilio")(accountSid, authToken)

// Register new user
router.post("/register", async (req, res) => {
    try {
        // Generate new hashed password
        const salt = await bcrypt.genSalt(12)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        // Create a new user instance
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        })

        // Save user to db and respond
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err)
    }
})

// Login user
router.post("/login", async (req, res) => {
    try {
        // Find the user with the requested email
        const user = await User.findOne({ email: req.body.email })
        if (!user) res.status(404).json("This user does not exist")

        // Compare requested password to the user password
        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if (!validPassword) res.status(400).json("The password is not correct")

        // Respond with the authenticated user object
        res.status(200).json(user)
    } catch (err) {
        res.status(500).json(err)
    }
})


// Twilio send verification token
router.get("/login", (req, res) => {
    client.verify.services(serviceId).verifications
        .create({
            to: `+${req.query.phonenumber}`,
            channel: req.query.channel
        })
        .then(
            verification => {
                try {
                    return res.status(200).json(verification.status)
                } catch (err) {
                    return res.status(500).json(err)
                }
            }
        )
})

// Twilio check verification token
router.get("/verify", (req, res) => {
    client.verify.services(serviceId).verificationChecks
        .create({
            to: `+${req.query.phonenumber}`,
            code: req.query.code
        })
        .then(
            verification => {
                try {
                    return res.status(200).json(verification.status)
                } catch (err) {
                    return res.status(500).json(err)
                }
            }
        )
})

module.exports = router