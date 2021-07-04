// jitte bhi saare controllers hai unhe tha import karenge 
// aur fir yha se sabko import karenge, taaki naam me import ke waqt baar baar /controllers na likhna pade.



//kyuki yja bas import karna hai aur export karna hai toh uske liye ek shortcut bhi hai.

export   {default as registerController} from './auth/registerController';
export   {default as loginController} from './auth/loginController';
export   {default as userController} from './auth/userController';
export   {default as refreshController} from './auth/refreshController';
export   {default as productController} from './productController';
