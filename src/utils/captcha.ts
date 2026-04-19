import axios from "axios";

export async function verifyCaptcha(token: string) {
    const secret = process.env.SECRET_KEY;

    const response = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify`,
        null,
        {
            params: {
                secret: secret,
                response: token
            }
        }
    );

    return response.data.success;
}