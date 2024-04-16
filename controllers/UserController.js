import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'

import UserModel from '../models/user.js'

export const register = async (req, res) => {
    try {
        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const doc = new UserModel({
            email: req.body.email,
            passwordHash: hash,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            uzsCoins: req.body.uzsCoins,

            tapHave: req.body.tapHave,
            tapLevel: req.body.tapLevel,
            energyLevel: req.body.energyLevel,
            energyHave: req.body.energyHave,

            boostTap: req.body.boostTap,
            boostEnergy: req.body.boostEnergy,
        })

        const user = await doc.save()

        const token = jwt.sign({
            _id: user._id,
        }, 'testSec7', {
            expiresIn: '30d',
        })

        if (user) {
            const { passwordHash, ...userData } = user._doc;
        
            res.json({
                ...userData,
                token,
            });
        } else {
            // Если пользователь не сохранен успешно, вернуть сообщение об ошибке
            res.status(500).json({
                message: 'User not saved successfully',
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            messgae: 'Registration error'
        });
    }
}

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });

        if(!user) {
            return res.status(404).json({
                message: 'Email or password incorrect'
            })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)

        if(!isValidPass) {
            return res.status(400).json({
                message: 'Email or password incorrect'
            })
        }

        const token = jwt.sign({
            _id: user._id,
        }, 'testSec7', {
            expiresIn: '30d',
        })

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            messgae: 'Login error'
        });
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)

        if(!user) {
            res.status(404).json({
                message: 'User not found'
            })
        }

        const { passwordHash, ...userData } = user?._doc

        res.json(userData)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            messgae: 'Get error'
        });
    }
}

export const url = (req, res) => {
    try {
        res.json({
            url: `/uploads/${req.file.originalname}`
        })
    } catch (error) {
        console.log(error);
    }
}