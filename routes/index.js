import express from 'express'
import {registerController,loginController,userController,refreshController,productController} from '../controllers';// ab sirf itta likhne se import ho jayega bcoz of what we did in index of controllers
import auth from '../middlewares/auth';
import admin from '../middlewares/admin';
// {...} ye bracket kagaya bcozz wha in index default as use kiya hai

const router = express.Router();


router.post('/register',registerController.register);
router.post('/login',loginController.login);
router.get('/me',auth,userController.me);
router.post('/refresh',refreshController.refresh);
router.post('/logout',auth,loginController.logout);

router.post('/product',[auth,admin],productController.store);
router.put('/product/:id',[auth,admin],productController.update);
router.delete('/product/:id',[auth,admin],productController.destroy);
router.get('/product',productController.index); 
router.get('/product/:id',productController.show); 

export default router;     