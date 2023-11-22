const express = require('express');
const authController = require('../controller/authController');
const blogController = require('../controller/blogController');
const commentController = require('../controller/commentController');


const auth = require('../middlewares/auth');

const router = express.Router();

//testing
router.get('/test', (req,res)=>res.json({msg: 'Working'}))


//user
//register
router.post('/register', authController.register)


//login
router.post('/login', authController.login)

//logout
//the auth middleware is responsible for checking whether a user is authenticated or not 
//before allowing access to the logout endpoint. 
router.post('/logout', auth , authController.logout)

//refresh
router.post('/refresh', authController.refresh);


//blog
//create
router.post('/blog', auth, blogController.create);

//get all
router.get('/blog/all', auth, blogController.getAll);

//get by ID, auth
router.get('/blog/:id', auth, blogController.getById);

//update
router.put('/blog', auth, blogController.update);

//delete
router.delete('/blog/:id', auth, blogController.delete)



//comments
// create
router.post('/comment', auth, commentController.create);

//get
router.get('/comment/:id', auth, commentController.getById);

//CRUD
//create 
//read all blogs
//read blog by ID

//update
//delete


//comment
//create comment
//read comments by blog ID

module.exports = router;