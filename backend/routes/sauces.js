const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const saucesMiddleware = require('../middleware/sauces')
const multer = require('../middleware/multer-config');

const saucesCtrl = require('../controllers/sauces');

router.get('/', auth, saucesCtrl.displayAllSauces);
router.post('/', auth, multer, saucesMiddleware,saucesCtrl.createSauce);
router.get('/:id', auth, saucesCtrl.displayOneSauce);
router.put('/:id', auth, multer, saucesCtrl.updateSauce);
router.delete('/:id', auth, saucesCtrl.deleteSauce);
router.post('/:id/like', auth, saucesCtrl.likeSauce);

module.exports = router;