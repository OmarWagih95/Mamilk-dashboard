import mongoose from "mongoose";

export const ConnectDB = async() => {
    await mongoose.connect(`mongodb+srv://mamilkcs:${process.env.MONGO_PASSWORD}@cluster0.wwpxp.mongodb.net/mamilk?retryWrites=true&w=majority&appName=Cluster0l`
    );
    // await mongoose.connect(`mongodb+srv://anchuva1:${process.env.MONGO_PASSWORD}@cluster0.hsphc.mongodb.net/anchuva?retryWrites=true&w=majority&appName=Cluster0`
    // );
    console.log('MongoDB Connected...');
};