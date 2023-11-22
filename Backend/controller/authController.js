const Joi = require("joi");
const User = require('../models/user');
const bcrypt = require('bcryptjs')
const UserDTO = require('../dto/user');
const JWTService = require('../services/JWTservice');
const RefreshToken = require('../models/token');
const auth = require("../middlewares/auth");

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;


    const authController = {
        async register(req, res, next) {
            //1. Validate user input

            const userRegistrationSchema = Joi.object({
                username: Joi.string().min(5).max(30).required(),
                name: Joi.string().max(30).required(),
                email: Joi.string().email().required(),
                password: Joi.string().pattern(passwordPattern),
                confirmPassword: Joi.ref('password')
                
            });

            const {error} = userRegistrationSchema.validate(req.body);

            //2. if error in validation -> return error via middleware
            if  (error){
                return next(error);
            }

            //3. If email or username is already registered -> return error
            const {username, name, email, password} = req.body;
            //check email

            try {
                const emailInUse = await User.exists({email});

                const usernameInUse = await User.exists({username});

                if (emailInUse){
                    const error ={
                        status: 409,
                        message: 'This email is already registered'
                    }

                    return next(error);
                }

                if (usernameInUse){
                    const error ={
                        status: 409,
                        message: 'This username is already registered'
                    }

                    return next(error);
                }
                
            } 
            catch (error) {
                return next(error);
            }

            
            //4. password hash
            const hashedPassword = await bcrypt.hash(password, 10 )

            //5. store user data in DB
            let accessToken;
            let refreshToken;

            let user;

            try {
                
                const userToRegister = new User({
                    username: username,
                    email: email,
                    name: name,
                    password: hashedPassword
                });
    
                user = await userToRegister.save()

                //Token Generation
                accessToken = JWTService.signAccessToken({ _id: user._id }, "30m");

                refreshToken = JWTService.signRefreshToken({ _id: user._id }, "60m");
                } 
            catch (error) {
            return next(error);
            }
            

            // store refresh token in Database
            await JWTService.storeRefreshToken(refreshToken, user._id);

            //send cookies token in DB
            res.cookie('accessToken', accessToken, {
                maxAge: 1000*60*60*24,
                httpOnly: true 
            } );

            res.cookie('refreshToken', refreshToken,{
                maxAge: 1000*60*60*24,
                httpOnly: true 
            });


            //6. response send
            const userDto = new UserDTO(user);
            return res.status(201).json({userDto, auth: true})
        },
        async login(req, res, next) {
            //1. Validate user input
            //2. if validation error, return error
            //3. match username and password
            //4. return response
            
            const userLoginSchema = Joi.object({
                username: Joi.string().min(5).max(30).required(),
                password: Joi.string().pattern(passwordPattern)
                
            });

            const {error} = userLoginSchema.validate(req.body);
            
            if (error){
                return next(error);
            }
            const { username, password } = req.body;

            let user;
            try {
                //match username
                user = await User.findOne({username: username})

                if (!user){
                    const error = {
                        status : 401,
                        message: 'Inavlid username' 
                    }

                    return next (error)
                }

                //match password
                //req.body -> hash -> match

                const match = await bcrypt.compare(password, user.password);

                if (!match){
                    const error = {
                        status : 401,
                        message: 'Invalid password'
                    }
                    return next (error)
                }

            } 
            catch (error) {
                return next(error);
                
            }

            //Token Generation
            const accessToken = JWTService.signAccessToken({ _id: user._id }, "30m");

            const refreshToken = JWTService.signRefreshToken({ _id: user._id }, "60m");

            
            //update refresh token in database
            
            try {
                await RefreshToken.updateOne({
                    _id:user._id
                },
                {token:refreshToken},
                {upsert: true}
                )
                
            } catch (error) {
                return next(error)
                
            }
            
            //saving token
            
            res.cookie('accessToken', accessToken, {
                maxAge: 1000*60*60*24,
                httpOnly: true 
            } );

            res.cookie('refreshToken', refreshToken,{
                maxAge: 1000*60*60*24,
                httpOnly: true 
            });



            const userDto = new UserDTO(user);
            return res.status(200).json({userDto, auth:true});

        },
        //logout
        async logout(req,res,next){

            //1. delete refresh token from db
            const {refreshToken} = req.cookies;

            try {
                await RefreshToken .deleteOne({token:refreshToken});
            } 
            catch (error) {
                return error(next);
            }

            //2. delete cookies
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');

            //3. response
            res.status(200).json({user:null, auth:false})
            
        },
         async refresh(req, res, next){
        // 1. get refreshToken from cookies
        // 2. verify refreshToken
        // 3. generate new tokens
        // 4. update db, return response

        const OriginalRefreshToken = req.cookies.refreshToken;

        let id;
        
        try {
            id = JWTService.verifyRefreshToken(OriginalRefreshToken)._id;
        } catch (e) {
            const error = {
                status:401,
                message: "Unauthorized"
            }

            return next(error);
        }

        try {
            const match = RefreshToken.findOne({_id:id, token: OriginalRefreshToken});

            if (!match){

                const error = {
                    status:401,
                    message: "Unauthorized"
                }
    
                return next(error);
            }

        } catch (error) {
            return next(error);
        }

        try {
            const accessToken = JWTService.signAccessToken({_id:id}, '30m');
            const refreshToken = JWTService.signRefreshToken({_id:id}, '60m');

            await RefreshToken.updateOne({_id:id}, {token:refreshToken});

            res.cookie("accessToken", accessToken, {
                maxAge: 1000*60*24,
                httpOnly: true
            });

            res.cookie("refreshToken", refreshToken, {
                maxAge: 1000*60*24,
                httpOnly: true
            });
            
        } catch (error) {
            return next(error);
        }

        const user = await User.findOne({_id:id});

        const userDTO = new UserDTO(user);

        return res.status(200).json({user: userDTO, auth:true});


        }


    }

    module.exports = authController;