class CustomErrorHandler extends Error{
   
   constructor(status,msg){
     super();
     this.status = status;
     this.message = msg;
   } 

   static alreadyExist(message){ // ye message hum recieve karenge jha se bhi hum isko call kaareenge, toh wha se ek message pass karenge toh yha recieve karenge.
   
      return new CustomErrorHandler(409,message);
   }

   static wrongCreds(message="Username or password is wrong!"){ // ye message hum recieve karenge jha se bhi hum isko call kaareenge, toh wha se ek message pass karenge toh yha recieve karenge.
   
      return new CustomErrorHandler(401,message);
   }

   static unAuthorized(message="Unauthorized"){ // ye message hum recieve karenge jha se bhi hum isko call kaareenge, toh wha se ek message pass karenge toh yha recieve karenge.
   
      return new CustomErrorHandler(401,message);
   }
   static notFound(message="404 Not Found!"){ 
      return new CustomErrorHandler(404,message);
   }
   static serverError(message="Intenal server error!"){ 
      return new CustomErrorHandler(500,message);
   }
       // ye message}
}


export default  CustomErrorHandler;