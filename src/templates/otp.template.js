export const otpTemplate = ({ name, otp }) => {
    return `
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8" />
    <title>Email Verification</title>
</head>

<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center" style="padding:40px 0;">

                <table width="600" cellpadding="0" cellspacing="0"
                    style="background:#ffffff;border-radius:10px;overflow:hidden;">

                    <!-- Header -->
                    <tr>
                        <td align="center"
                            style="background:#0f172a;color:#ffffff;padding:30px;font-size:28px;font-weight:bold;">
                            Ecommerce Platform
                        </td>
                    </tr>

                    <!-- Greeting -->
                    <tr>
                        <td style="padding:40px;color:#333333;">
                            <h2>Hello ${name},</h2>

                            <p style="font-size:16px;line-height:28px;">
                                Thank you for registering.
                                Please use the OTP below to verify your email address.
                            </p>

                            <div style="text-align:center;margin:40px 0;">
                                <span
                                    style="
                                        display:inline-block;
                                        background:#2563eb;
                                        color:#ffffff;
                                        padding:18px 45px;
                                        font-size:34px;
                                        font-weight:bold;
                                        letter-spacing:8px;
                                        border-radius:8px;">
                                    ${otp}
                                </span>
                            </div>

                            <p style="font-size:16px;">
                                This OTP is valid for
                                <strong>10 minutes.</strong>
                            </p>

                            <p style="color:#ef4444;">
                                Never share this OTP with anyone.
                            </p>

                            <hr>

                            <p style="font-size:13px;color:#888888;">
                                If you did not request this verification,
                                you can safely ignore this email.
                            </p>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center"
                            style="background:#f8f8f8;padding:20px;font-size:13px;color:#777777;">
                            © ${new Date().getFullYear()} Ecommerce Platform.
                            All Rights Reserved.
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>

</html>
`;
};