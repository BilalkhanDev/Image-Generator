const mongoose=require("mongoose")

const connectDB = () => {
  mongoose.set('strictQuery', true);
  mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('connected to mongodb'))
    .catch((err) => {
      console.error('failed to connect with mongodb');
      console.error(err);
    });
};

module.exports= connectDB;
