import mongoose from "mongoose";

let isConnected = false;
const connectOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
};

export const ConnectDB = async () => {
    if (isConnected) {
        console.log('Using existing database connection');
        return;
    }

    try {
        await mongoose.connect('mongodb+srv://Gopalakrishnan:Mactavishtony@cluster0.kr3dp.mongodb.net/blog-app', connectOptions);
        isConnected = true;
        console.log('Database connected successfully');

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
            isConnected = false;
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
            isConnected = false;
        });

        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed through app termination');
            process.exit(0);
        });
    } catch (error) {
        console.error('Error connecting to database:', error);
        isConnected = false;
        throw error;
    }
}