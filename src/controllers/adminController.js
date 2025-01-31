import Admin from "../models/adminModel.js";
import { generateOTP } from "../services/otp.js";



export const addAdmin = async (req, res) => {
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


export const verfiyAdmin = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        if (admin.password !== password) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate OTP and send it to the user
        const otp = generateOTP();
        await admin.updateOne({ otp }, { otp });
        res.status(200).json({ message: "OTP sent successfully", otp });
    } catch (error) {
        console.error("Error verifying admin:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



