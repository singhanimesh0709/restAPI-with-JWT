import multer from 'multer';
import { Product } from '../models';
import path from 'path';
import CustomErrorHandler from '../services/CustomErrorHandler';
import fs from 'fs';
import Joi from 'joi';
import productSchema from '../validators/productValidator';



const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,'uploads/');
    },
    filename: (req,file,cb) => {
       
      const  uniqueName =`${new Date().toISOString().replace(/:/g, '-')}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        //347575588844-7744848489.jpeg ---> ab iss path ko hum database me save karne wale hai.
        cb(null, uniqueName);
    }
});// iss initial configuration ko multer me pass karenge jisse wo humme ek ready method degi.

const handleMultiPart = multer({storage, limits:{filesize: 1000000 * 5}}).single('image');// 'image field ka naam hai jisme urls ave hoga'


const productController ={
    async store(req,res,next){
      // multipart form data for images.
      // now coz we even recieve images from the client, so we use multer.
       handleMultiPart(req,res,async (err)=>{
           if(err){
               return next(CustomErrorHandler.serverError(err.message));
           }
           //console.log(req.file);

           const filePath = req.file.path;// multer req me file naam ka object jod deta hai.
            // console.log(req.file,"********************");
            //Validation
    
 
     const {error} = productSchema.validate(req.body);
     
     if(error){// ab agar error mil gya toh jo pehle se upload ho gya hai usse delete karna padega. bcoz it failed validation.
       // delete uploaded file 
       fs.unlink(`${appRoot}/${filePath}`,(err)=>{// unlink needs full path to work.
            //rrotfolder/uploads/filename.png
            if(err){// ye issliye bcoz in unlink, the call back runs for every request.
                return next(CustomErrorHandler.serverError(err.message));// delete karne me dikkat hui toh uska error
            } 
        
       });
       
       return next(error);// validation me error aya tph uska wla error. 
     }

     // agar koi error nhi hua, sab acccha chala toh code yha aayega
     //toh ab humme db me apne uss image ka link save karna hai with details
     const{name,price,size} = req.body;
     let document;
     try {
         document = await Product.create({
             name, 
             price,
             size,
             image:filePath
            });
     } catch (err) {
         return next(err);
     }
      
     res.status(201).json(document);// koi bhi resource create hota hai toh status cose is set as 201.
       });

    },
//************************************* UPDATE METHOD ********************************************
    update(req, res,next){
        handleMultiPart(req,res,async (err)=>{
            if(err){
                return next(CustomErrorHandler.serverError(err.message));
            }
            //console.log(req.file);
            let filePath;
            if(req.file){
                 filePath = req.file.path;
            }
            // multer req me file naam ka object jod deta hai.
 
  
      const {error} = productSchema.validate(req.body);
      
      if(error){// ab agar error mil gya toh jo pehle se upload ho gya hai usse delete karna padega. bcoz it failed validation.
        // delete uploaded file 
        if(req.file){
            fs.unlink(`${appRoot}/${filePath}`,(err)=>{// unlink needs full path to work.
                //rrotfolder/uploads/filename.png
                if(err){// ye issliye bcoz in unlink, the call back runs for every request.
                    return next(CustomErrorHandler.serverError(err.message));// delete karne me dikkat hui toh uska error
                } 
            
           });
        }
        
        
        return next(error);// validation me error aya tph uska wla error. 
      }
 
      // agar koi error nhi hua, sab acccha chala toh code yha aayega
      //toh ab humme db me apne uss image ka link save karna hai with details
      const{name,price,size} = req.body;
      let document;
      try {
          document = await Product.findOneAndUpdate({_id: req.params.id},{
              name, 
              price,
              size,
              ...(req.file && {image:filePath})
             },{new: true});
      } catch (err) {
          return next(err);
      }
       
      res.status(201).json(document);// koi bhi resource create hota hai toh status cose is set as 201.
        });   
    },

    //*************************************** DELETE METHOD ****************************************************************
    async destroy(req,res,next){
       let document;
        try {
            document = await Product.findOneAndDelete({_id: req.params.id});
            if(!document){
                return next(new Error('Nothing to delete'));
            }
            // delete the image 
            const imagePath = document._doc.image;//.-doc gives without executing getter, warna humare image prrperty me poora domain name wla save ho jat
            // document.image karne pe cannot set headers after they are sent error ayaa.

            fs.unlink(`${appRoot}/${imagePath}`,(err)=>{
                if(err){
                    return next(CustomErrorHandler.serverError());
                }
            });

        } catch (error) {
            return next(CustomErrorHandler.serverError());
        }

        res.status(201).json(document);
    },


    async index(req,res,next){
       let documents;
       // jyada ho toh pagination karna chahiye
        try {
           documents = await Product.find().select("-updatedAt -__v").sort({_id: -1});
       } catch (error) {
           return next(CustomErrorHandler.serverError());
       }
       res.json(documents);
    },

    async show(req,res,next){
        let document;

        try {
            document = await Product.findOne({_id:req.params.id}).select("-updatedAt -__v");
        } catch (error) {
          return next(CustomErrorHandler.serverError());  
        }

         return res.json(document);
    }
}

export default productController;