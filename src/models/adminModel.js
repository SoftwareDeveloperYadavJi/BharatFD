import mongoose from "mongoose";

// Define the schema
const adminSchema = new mongoose.Schema(
    {
        username: { type: String, required: true },
        password: { type: String, required: true },
        email: { type: String, required: true },
        role: { type: String, required: true },
        isActive: { type: Boolean, default: true },
        isvefified: { type: Boolean, default: false },
        otp: { type: String, required: true },
    },
    { timestamps: true }
);


const Admin = mongoose.model("Admin", adminSchema);
export default Admin;


