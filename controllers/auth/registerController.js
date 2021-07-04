import Joi from 'joi';
import CustomErrorHandler from '../../services/CustomErrorHandler';
import { User , RefreshToken} from '../../models';
import bcrypt from 'bcrypt';
import JwtService from '../../services/JwtService'
import { REFRESH_SECRET } from '../../config';


const registerController = {
   async register(req,res,next){
    //CHECKLIST
    // [ ] validate the request
    // [ ] authorise the request
    // [ ] check if user is in the database already
    // [ ] prepare model
    // [ ] store in database
    // [ ] generate jwt token
    // [ ] send response

    //Validation
    const registerSchema = Joi.object({
       name: Joi.string().min(3).max(30).required(),
       email: Joi.string().email().required(),
       password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
       repeat_password: Joi.ref('password')

    });

    const {error} = registerSchema.validate(req.body);
    
    if(error){
       //throw error;
       return next(error); //-- if inside a async function. 
    }
    // -- gar validation me koi problem nhi hui toh code yha aa jayega.
    


      
    try{
      const existUser= await User.exists({email:req.body.email});
      if(existUser){
       return next(CustomErrorHandler.alreadyExist("This email already exists"));// because alreadyExist static method hai toh isisliye hum dot deke use kar paa rhe.
      }
    }catch(err){
     return next(err);
    }
    
    
       
    
    const {name,email,password} = req.body;
    let access_token;
    let refresh_token;
    //Hash password
     const hashedPassword = await bcrypt.hash(password,10);//.then((result)=>{
     
     
      // prepare the model
   
     
     const user = new User({
      name,
      email,
      password: hashedPassword
    });
     

    try{
      const result = await user.save();
     
      // ye user store hone ke baad humme JWT token client ko return karna hai
    
    //Token
     access_token = JwtService.sign({_id: result._id , role: result.role});
     refresh_token = JwtService.sign({_id: result._id , role: result.role}, '1y',REFRESH_SECRET);
     // savinng to the db 
     await RefreshToken.create({token:refresh_token});

    }catch(err){
       return next(err);
    }
   

      
  res.json({access_token : access_token , refresh_token : refresh_token}); // this happens when there is no problem with validation.
      
       
    }
}


export default registerController;