const router = require("express").Router()
const User = require("../models/User")
const bcrypt = require("bcryptjs")

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
        console.log(err)
    }
})

module.exports = router