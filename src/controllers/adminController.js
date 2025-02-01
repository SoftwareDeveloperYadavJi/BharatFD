import Admin from "../models/adminModel.js";
import { generateOTP } from "../services/otp.js";



export const adminRegistation = async (req, res) => {
    const { username, password, email, role } = req.body;

    if (!username || !password || !email || !role) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const admin = await Admin.create({ username, password, email, role });
        res.status(201).json(admin);
    } catch (error) {
        console.error("Error adding admin:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const verifyOTP = async (req, res) => {
    const { username } = req.body;
    const { otp } = req.body;
    if (!otp) {
        return res.status(400).json({ message: "OTP is required" });
    }
    try {
        const admin = await Admin.findOne({ username});
        if (!admin) return res.status(404).json({ message: "Admin not found" });
        if (admin.otp !== otp) return res.status(401).json({ message: "Invalid OTP" });
        // change isverfix status to true
        await admin.updateOne({ isVerified: true });
        res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        console.error("Error verifying admin:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const adminLogin = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    try {
        const admin = await Admin.findOne({ username, password });
        if (!admin) return res.status(401).json({ message: "Invalid credentials" });
        const token = jwt.sign({ username: admin.username }, process.env.JWT_SECRET);
        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



