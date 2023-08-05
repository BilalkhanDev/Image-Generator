const mongoose=require("mongoose")
const Post = new mongoose.Schema({
  name: { type: String, required: true },
  prompt: { type: String, required: true },
  photo: { type: String, required: true },
  userId: { type: mongoose.Types.ObjectId, ref: 'User' },
});

const PublicPost = mongoose.model('Post', Post);
const PrivatePost=mongoose.model('Private',Post)
module.exports= {PrivatePost,PublicPost};
