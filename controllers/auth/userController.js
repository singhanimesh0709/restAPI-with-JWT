import { User } from "../../models";
import CustomErrorHandler from "../../services/CustomErrorHandler";

const userController = {
  async me(req,res,next){
     
      try {
        const user = await User.findOne({_id: req.user._id}).select('-updatedAt -password -__v'); // so just to have req.user, we added user in that auth middleware to our req.
        if(!user){
            return next(CustomErrorHandler.notFound());
        } 
        res.json(user);
      } catch (err) {
          return next(err);
      }
     

        

    }
}


export default userController;