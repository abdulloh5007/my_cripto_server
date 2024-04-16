import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors'

import { registerValidation, loginValidation } from './validation.js';
import checkAuth from './utils/checkAuth.js';

import * as UserController from './controllers/UserController.js'
import handleValidationErrors from './utils/handleValidationErrors.js';

mongoose
    .connect('mongodb+srv://admin:levou0706@cluster0.snkpble.mongodb.net/my_coin')
    .then(() => console.log('db ok'))
    .catch((err) => console.log('db error: ' + err))

const app = express();

const port = 7777;

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage })

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)

app.post('/upload', checkAuth, upload.single('image'), UserController.url)

app.listen(port, (err) => {
    if (err) {
        return console.log('Server isn`t ok');
    }
    else {
        console.log(`Now server runnning in PORT http://localhost:${port}`);
    }
})