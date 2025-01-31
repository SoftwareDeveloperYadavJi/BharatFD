import mongoose from 'mongoose';


/**
 * Establishes a connection to the MongoDB database
 *
 * @async
 * @function
 * @returns {Promise<void>}
 */
const connectDB = async () => {
    try {
        // Use a more descriptive variable name for the connection
        const dbConnection = await mongoose.connect(process.env.MONGODB_URI, {
        });

        // Log the host of the connected database for better debugging
        console.log(`MongoDB Connected: ${dbConnection.connection.host}`);
    } catch (error) {
        // Use a more descriptive error message and exit the process on failure
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); // Exit the process with a failure code
    }
};

export default connectDB;