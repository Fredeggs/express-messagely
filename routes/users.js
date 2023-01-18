const express = require("express");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");
const router = new express.Router();
const User = require("../models/user");

/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/
router.get('/', ensureLoggedIn, async (req, res, next) => {
    try {
        const allUsers = await User.all();
        res.json({users: allUsers})
    } catch (e) {
        next(e);
    }
})

/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/
router.get('/:username',ensureCorrectUser, async (req, res, next) => {
    const { username } = req.params
    try {
        const user = await User.get(username);
        res.json({user: user})
    } catch (e) {
        next(e);
    }
})

/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get('/:username/to', ensureCorrectUser, async (req, res, next) => {
    const { username } = req.params
    try {
        const msgs = await User.messagesTo(username);
        res.json({messages: msgs})
    } catch (e) {
        next(e);
    }
})

/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get('/:username/from', ensureCorrectUser, async (req, res, next) => {
    const { username } = req.params
    try {
        const msgs = await User.messagesFrom(username);
        res.json({messages: msgs})
    } catch (e) {
        next(e);
    }
})

module.exports = router;
