import { ValidationError } from 'joi';
import {DEBUG_MODE} from '../config';
import CustomErrorHandler from '../services/CustomErrorHandler';
 

const errorHandler = (err,req,res,next)=>{
let statusCode = 500;
let data = { // ye humara default data hai jo send hoga for errors jinke liye static method hum nhi banaeneg toh.
    message:" Internal server error",
    ...(DEBUG_MODE==='true' && { originalError:err.message})
   
}

if(err instanceof ValidationError){// this validationError class was provided to us by joi - isko uupar import bhi karna hai
statusCode =422;
data={
    message: err.message// yha pe real error messsage hi bhejma hai bcoz its validation error and we need to know as a user ehat went wrong.
}
}

if(err instanceof CustomErrorHandler){ // yha pe err customErrorHandler class ka object hi toh hai.
    statusCode = err.status; // ye err.status humme issliye mil rha bcoz class ke upar humne isse store kiya hai.
    data={
        message : err.message
    }
}


return res.status(statusCode).json(data);// so isse hume statusCode mil jaega and even error message mil jaega aur hum usse client pe dikha paenge


}

export default errorHandler;