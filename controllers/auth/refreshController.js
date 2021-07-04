import Joi from "joi";
import { REFRESH_SECRET } from "../../config";
import { User , RefreshToken} from '../../models';
import CustomErrorHandler from "../../services/CustomErrorHandler";
import JwtService from "../../services/JwtService";


const refreshController={
  async refresh(req,res,next){
    
  //Validation
  const refreshSchema = Joi.object({
    refresh_token: Joi.string().required()
   });

   const {error} = refreshSchema.validate(req.body);

   if(error){
       return next(error);
   }
   //db checking
   let  refreshToken;
   try {
     refreshToken = await RefreshToken.findOne({token: req.body.refresh_token});
     
     if(!refreshToken){// matlab kisi ne revoke ya logput kiya hai.
        
         return next(CustomErrorHandler.unAuthorized("Invalid refresh_token "));
     }
     let userId;
     try {
           const { _id } = await JwtService.verify(refreshToken.token , REFRESH_SECRET);
           userId = _id;
           
        } catch (error) {
         return next(CustomErrorHandler.unAuthorized("Invalid refresh_token "));
     }
      // checking if user still exist is dB
     const user = await User.findOne({_id: userId});
     if(!user){
         return next(CustomErrorHandler.unAuthorized("User not found"));
     } 
     // usesr mil gya toh we regenerate the tokens ans save them
     const  access_token = JwtService.sign({_id: user._id , role: user.role});
     const refresh_token = JwtService.sign({_id: user._id , role: user.role}, '1y',REFRESH_SECRET);
    // savinng to the db 
    await RefreshToken.create({token:refresh_token});

      res.json({access_token : access_token , refresh_token : refresh_token});


   } catch (err) {
       return next(new Error("Something went wrong "+ err.message));
   }
  
   
   }   
}

export default refreshController;