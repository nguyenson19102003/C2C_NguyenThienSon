const router = require("express").Router();
const productsController = require('../controllers/productsController');

router.get('/getProducts', productsController.getProducts);
router.post('/postProduct', productsController.postProduct);
router.patch('/update/:addressItem', productsController.updateProduct);

//getProduct of creator
router.get('/getProducts/:addressOwner', productsController.getAllProductOfCreator);

//buyer
router.post('/postBuyProduct/:addressItem', productsController.postBuyProduct);
router.patch('/buyer/update/:addressItem', productsController.updateBuyer);
router.get('/getBuyProduct/:addressBuyer', productsController.getAllBuyerProduct);

module.exports = router;