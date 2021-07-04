import Joi from "joi";
import bcrypt from 'bcrypt';
import JwtService from '../../services/JwtService';
import CustomErrorHandler from '../../services/CustomErrorHandler';
import {User , RefreshToken} from '../../models';
import {REFRESH_SECRET} from '../../config';


const loginController={
   async login(req,res,next){
     const loginSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
     })


     const {error} = loginSchema.validate(req.body);

     if(error){
         return next(error);
     }


     const {email,password} = req.body;
 //console.log("*********************888",password);
     
     try {
        const user = await User.findOne({email:email});
        if(!user){
         return next(CustomErrorHandler.wrongCreds("MIla nhi *****"));
        }
        
        const match = await bcrypt.compare(password,user.password);
            if(!match){
               return next(CustomErrorHandler.wrongCreds());  
            }
           
         const  access_token = JwtService.sign({_id: user._id , role: user.role});
         const refresh_token = JwtService.sign({_id: user._id , role: user.role}, '1y',REFRESH_SECRET);
               // savinng to the db 
              await RefreshToken.create({token:refresh_token});

          res.json({access_token : access_token , refresh_token : refresh_token});  
     } catch (err) {
         return next(err);
     }
     

     

  
    },

    async logout(req, res,next){
        //Validation
  const refreshSchema = Joi.object({
    refresh_token: Joi.string().required()
   });

   const {error} = refreshSchema.validate(req.body);

   if(error){
       return next(error);
   }

   try {
       await RefreshToken.deleteOne({token:req.body.refresh_token});

       res.json({status : 1});
   } catch (error) {
       return next(new Error("Something went wrong in the server"));
   }
    }
}

export default loginController;