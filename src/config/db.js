import mongoose from 'mongoose';

/**
 * Establishes a connection to the MongoDB database
 *
 * @async
 * @function
 * @param {string} [uri] - Optional MongoDB URI (defaults to process.env.MONGODB_URI)
 * @returns {Promise<void>}
 */
const connectDB = async (uri) => {
    try {
        const dbConnection = await mongoose.connect(uri || process.env.MONGODB_URI, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${dbConnection.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); // Exit the process with a failure code
    }
};

export default connectDB;