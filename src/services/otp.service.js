import OTP from "../models/otp.model.js";
import { generateOTP, hashOTP, otpExpiry } from "../utils/otp.js";
import { otpTemplate } from "../templates/otp.template.js";
import { sendEmail } from "./email.service.js";



export const sendRegistrationOTP = async ({
    name,
    email,
    phone,
    password,
}) => {

    // Delete old OTP
    await OTP.deleteMany({
        email,
    });

    // Generate OTP
    const otp = generateOTP();

    // Save OTP
    await OTP.create({
    name,
    email,
    phone,
    password,
    otp: hashOTP(otp),
    purpose: "register",
    expiresAt: otpExpiry(),
});

    // Send Email
    await sendEmail({
        to: email,
        subject: "Verify Your Email",
        html: otpTemplate({
            name,
            otp,
        }),
    });

    return true;
};

export const sendForgotPasswordOTP = async ({
    name,
    email,
}) => {

    // Delete old OTP
    await OTP.deleteMany({
        email,
        purpose: "forgot-password",
    });

    // Generate OTP
    const otp = generateOTP();

    // Save OTP
    await OTP.create({
        name,
        email,
        otp: hashOTP(otp),
        purpose: "forgot-password",
        expiresAt: otpExpiry(),
    });

    // Send Email
    await sendEmail({
        to: email,
        subject: "Reset Your Password",
        html: otpTemplate({
            name,
            otp,
        }),
    });

    return true;
};
