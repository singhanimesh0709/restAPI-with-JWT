import Joi from "joi";

        
        
        //Validation
        const productSchema = Joi.object({
            name: Joi.string().required(),
            price: Joi.number().required(),
            size: Joi.string().required(),
            image: Joi.string() 
            
            
            // image is not a string, but for our case it'll work as we'rre doing the error handling of  image in multer.
     
         });

   export default productSchema;      