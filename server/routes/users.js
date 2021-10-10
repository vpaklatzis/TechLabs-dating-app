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
// Get a single user

module.exports = router