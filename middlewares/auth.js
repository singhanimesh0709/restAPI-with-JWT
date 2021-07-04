import CustomErrorHandler from "../services/CustomErrorHandler";
import JwtService from "../services/JwtService";

const auth = async (req,res,next)=>{

let authHeader = req.headers.authorization;
//console.log(authHeader);

if(!authHeader){// so agar header nhi hai toh error throw kiya
   return next(CustomErrorHandler.unAuthorized());  
}
// agar header hai toh, code yha aa jayega.
const token = authHeader.split(' ')[1]; 
// matlab eha se split karna hai, yha hum space jha mila wha split kar rhe hai, jisme array me  0 index pe bearer hoga aur 1 pe token.
try {
  const {_id,role}= await JwtService.verify(token);//destructure issliye kar paa rhe hai kyuki, payload me in token we gave _id and role. so i verified, we'll get that.
      //req.user = {};//JS me kisi bhi object pr we can calll an property or attach one, we jut attached user to req,
     const user = {
      _id,
      role
     }
     req.user = user;//why are we attaching user to req?
     next();//very importan tto pass it coz tabji toh wo nickleg isme se, coz it's a middleware.
} catch (err) {
   return next( CustomErrorHandler.unAuthorized());
}





}

export default auth;