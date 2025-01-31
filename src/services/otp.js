export const generateOTP = () => {
    const otpLength = 8; // Increased length for complexity
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let otpCode = "";

    for (let i = 0; i < otpLength; i++) {
        otpCode += characters[Math.floor(Math.random() * characters.length)];
    }

    // Format the OTP with hyphens for readability
    const formattedOTP = otpCode.match(/.{1,2}/g).join('-');

    return formattedOTP;
};