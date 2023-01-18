const express = require("express");
const { ensureCorrectUser, ensureLoggedIn } = require("../middleware/auth");
const router = new express.Router();
const Message = require("../models/message");

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/
router.get('/:id', ensureCorrectUser, async (req, res, next) => {
    const { id } = req.params
    try {
        const msg = await Message.get(id);
        res.json({message: msg});
    } catch (e) {
        next(e);
    }
})


/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/
router.post('/', ensureLoggedIn, async (req, res, next) => {
    const { to_username, body } = req.body
    try {
        const msg = await Message.create(to_username, req.user, body);
        res.json({message: msg});
    } catch (e) {
        next(e);
    }
})


/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/
router.post('/:id/read', ensureCorrectUser, async (req, res, next) => {
    const { id } = req.params
    try {
        await Message.markRead(id);
        res.json({message: `Message id: ${id} was read!`});
    } catch (e) {
        next(e);
    }
})

module.exports = router;


