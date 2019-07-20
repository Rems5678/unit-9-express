/* eslint-disable function-paren-newline */
const express = require('express');

const fileController = require('../controllers/fileController');

const router = express.Router();

// ADD STORE FAVORITE ROUTE HANDLER HERE
// router.get('/:id', fileController.getFavs)
router.post('/:id', fileController.getFavs, fileController.addFav, (req, res, next) => {
res.status(200).json({favs: res.locals.favs});
})

// ADD REMOVE FAVORITE ROUTE HANDLER HERE


module.exports = router;
