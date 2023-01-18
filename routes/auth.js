const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { ensureLoggedIn } = require("../middleware/auth");
const User = require("../models/user");

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
router.post('/login', async (req, res, next) => {
    const {username, password} = req.body
    try {
        const isValidUser = await User.authenticate(username, password)
        if (isValidUser){
            const token = jwt.sign({ username }, SECRET_KEY);
            User.updateLoginTimestamp(username);
            return res.json({ token })
        }
        throw new ExpressError("Invalid username/password combination", 400);
    } catch (e) {
        next(e);
    }

})


/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
router.post('/register', async (req, res, next) => {
    const {username, password, first_name, last_name, phone} = req.body
    try {
        if (!username || !password || !first_name || !last_name || !phone) {
            throw new ExpressError("Username, password, name and phone number are required", 400);
        }
        await User.register({username, password, first_name, last_name, phone});
        const token = jwt.sign({username}, SECRET_KEY);
        User.updateLoginTimestamp(username);
        return res.json({ token })

    } catch (e) {
        next(e);
    }

})

module.exports = router;
