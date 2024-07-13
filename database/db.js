import mongoose from 'mongoose';

async function connectDB (uri) {
    await mongoose.connect(uri); 
    console.log('connected to the database');
}

export default connectDB;
