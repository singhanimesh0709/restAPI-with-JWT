 import express from 'express';
import {APP_PORT,DB_URI} from './config';
import routes from './routes'; // yha pe routes naam issliye use kar paa rhe hai kyuki wha export default kiya hai
import errorHandler from './middlewares/errorHandler';
import mongoose  from 'mongoose';
 const app = express();
 import path from 'path';
 
 // database connection of MONGOdb
mongoose.connect(DB_URI,{useNewUrlParser:true, useUnifiedTopology:true, useFindAndModify:false,useCreateIndex:true});
const db = mongoose.connection; 
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',()=>{
    console.log("DB connected...")
});
 
global.appRoot = path.resolve(__dirname);
app.use(express.urlencoded({ extended:false}));
 app.use(express.json());
 app.use('/api',routes);
 app.use('/uploads',express.static('uploads '));
app.use(errorHandler);//-- isko yhi last me krna hai addd just beore app.Listen 
 app.listen(APP_PORT,()=>{console.log(`listening on port ${APP_PORT}.`)});


 