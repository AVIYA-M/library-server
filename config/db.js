import dns from 'dns';
import mongoose from 'mongoose';


dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const MONGO_URI = 'mongodb+srv://AVIYA-M:avi33095@cluster0.18udexl.mongodb.net/?appName=Cluster0';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected successfully!');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); 
    }
};

export default connectDB;