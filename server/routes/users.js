const User = require("../models/User")
const router = require("express").Router()
const bcrypt = require("bcryptjs")

// Update user details
router.put("/:id", async (req, res) => {
    if(req.body.userId === req.params.id) {
        if(req.body.password) {
            try {
                // Generate new password
                const salt = await bcrypt.genSalt(12);
                // Hash salt with the requested password and update the request
                req.body.password = await bcrypt.hash(req.body.password, salt)
            } catch (err) {
                res.status(500).json(err)
            }
        }
        // Update the user in the db
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            })
            res.status(200).json("User has been updated")
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(403).json("Unauthorized access")
    }
})

// Delete user
router.delete("/:id", async (req, res) => {
    if(req.body.userId === req.params.id) {
        try {
            await User.findByIdAndDelete(req.params.id)
            res.status(200).json("User has been deleted")
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(403).json("Unauthorized access")
    }
})

// Get a single user
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        // Get all user properties but not password and update/created at
        const {password, updatedAt, createdAt, ...other} = user._doc
        res.status(200).json(other)
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router