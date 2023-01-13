const express = require('express');
const router = express.Router();
const saucesCtrl = require('../controllers/sauces');

router.get('/', saucesCtrl.displayAllSauces);
router.get('/:id', saucesCtrl.displayOneSauce);
router.post('/', saucesCtrl.createSauce);
router.put('/', saucesCtrl.updateSauce);
router.delete('/', saucesCtrl.deleteSauce);
router.post('/', saucesCtrl.likeSauce);

module.exports = router;