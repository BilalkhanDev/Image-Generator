const express = require('express');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;
const jwt=require("jsonwebtoken")
const {PublicPost,PrivatePost} = require('../mongodb/models/post.js');
const bcrypt = require('bcryptjs');
const User=require("./../mongodb/models/User.js")
const SECRET_KEY = 'your-secret-key';
const mongoose = require('mongoose');
const auth=require("../middleware/Auth.js")
dotenv.config();
const router = express.Router();
// Signup API
router.route('/signup').post(async (req, res) => {
  try {
    const { firstName,lastName, email, password } = req.body;
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await user.save();

    res.status(201).json({ message: 'Signup successful' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login API
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });
    
    const userId=user._id
    res.status(200).json({ token ,userId});
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// router.route('/get-posts').get(auth ,async (req, res) => {
  router.get('/get-posts', async (req,res) =>{
  try {
    const posts = await PublicPost.find({});
    res.status(200).json({ success: true, data: posts 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Fetching posts failed, please try again' });
  }
});
router.route('/get-private').get(auth,async (req, res) => {
  try {
    const posts = await PrivatePost.find({});
    res.status(200).json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Fetching posts failed, please try again' });
  }
});
router.route('/create-private').post(auth,async (req, res) => {
  
  try {
    
    const { name, prompt, photo } = req.body;
    const userId=req.userId
    const photoUrl = await cloudinary.uploader.upload(photo);

    const newPost = await PrivatePost.create({
      name,
      prompt,
      photo: photoUrl.url,
      userId // Assuming there is a "user" field in the PublicPost schema to store the user ID
    });

    res.status(200).json({ success: true, data: newPost });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Unable to create a post, please try again',err:err.message });
  }
});
router.route('/create-public').post(auth,async (req, res) => {
  
  try {
    
    const { name, prompt, photo } = req.body;
    const userId=req.userId
    const photoUrl = await cloudinary.uploader.upload(photo);

    const newPost = await PublicPost.create({
      name,
      prompt,
      photo: photoUrl.url,
      userId // Assuming there is a "user" field in the PublicPost schema to store the user ID
    });

    res.status(200).json({ success: true, data: newPost });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Unable to create a post, please try again',err:err.message });
  }
});
// Assume that you have already defined the necessary dependencies and models.

// Route to fetch posts by ID



// Assuming you have already defined the User model
// Replace the path with the correct User model file location

router.route('/get-posts/:userId').get(auth, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Check if the userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid User ID' });
    }

    // Find the user with the given userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Find all posts with the given userId
    const posts = await PrivatePost.find({ userId }).populate('userId');

    res.status(200).json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Unable to fetch posts, please try again', err: err.message });
  }
});





router.delete('/private-to/:userId/:id',auth, async (req, res) => {
  const entityId = req.params.id;
  const userId = req.params.userId;
  if(!userId){
    return false
  }
  try {
    // Find the entity from the first collection (PrivatePost)
    const deletedEntity = await PrivatePost.findById(entityId);

    if (!deletedEntity) {
      return res.status(404).json({ error: 'Entity not found' });
    }

    // Create the entity in the second collection (PublicPost)
    const createdEntity = await PublicPost.create(deletedEntity.toObject());

    // Delete the entity from the first collection (PrivatePost)
    await PrivatePost.findByIdAndDelete(entityId);

    res.status(200).json(createdEntity);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});



module.exports = router;
