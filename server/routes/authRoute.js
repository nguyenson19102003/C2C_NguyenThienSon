const router = require("express").Router();
const authController = require('../controllers/auth');

router.post('/register', authController.postRegister);

router.post('/login', authController.postLogin);
router.get('/logout', authController.logout);

router.patch('/updateStateUser/:addressUser', authController.updateStateUser);

router.get('/getUsers', authController.getUsers);

module.exports = router;