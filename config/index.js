import dotenv from 'dotenv'
dotenv.config();
// isse kya hoga ki dotenv ki jitti bhi files hai wo saari humme yha mil jaegi
//index.js naam bhi speacial hai humme jha bhi ye keys import karni hogi wha bas import from config likhna hoga aur wo samajh jayega that we talking about it.
export const {
    APP_PORT,
    DEBUG_MODE,
    DB_URI,
    JWT_SECRET,
    REFRESH_SECRET,
    APP_URL
} = process.env;