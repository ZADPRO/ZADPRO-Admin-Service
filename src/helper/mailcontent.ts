import { CurrentTime } from "./common";

export const generateSignupEmailContent = (
  username: string,
  password: string
) => {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #f4faff; padding: 30px;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden;">
        <div style="background-color: #0077cc; color: #ffffff; padding: 20px 30px;">
          <h2 style="margin: 0;">Welcome to Zadroit!</h2>
        </div>
        <div style="padding: 30px;">
          <p style="font-size: 15px;">Your admin account has been successfully created on <strong>Zadroit</strong>. Below are your login credentials:</p>
          <table style="width: 100%; font-size: 15px; margin: 20px 0;">
            <tr>
              <td style="padding: 8px 0;"><strong>Username:</strong></td>
              <td>${username}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Password:</strong></td>
              <td>${password}</td>
            </tr>
          </table>
          <p style="font-size: 15px;">If you need any help, feel free to contact our support team.</p>
          <p style="font-size: 15px;">Welcome aboard!</p>
          <p style="font-size: 15px;">Best Regards,<br/><strong>Zadroit Team</strong></p>
        </div>
        <div style="background-color: #e6f0fb; text-align: center; padding: 15px; font-size: 13px; color: #555;">
          &copy; ${CurrentTime()} Zadroit. All rights reserved.
        </div>
      </div>
    </div>
  `;
};


export const generateForgotPasswordEmailContent = (
  username: string,
  password: string
) => {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #f4faff; padding: 30px;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden;">
        <div style="background-color: #0077cc; color: #ffffff; padding: 20px 30px;">
          <h2 style="margin: 0;">Password Recovery - Zadroit</h2>
        </div>
        <div style="padding: 30px;">
          <p style="font-size: 15px;">You requested to recover your login credentials for the <strong>Zadroit</strong> platform. Below are your account details:</p>
          <table style="width: 100%; font-size: 15px; margin: 20px 0;">
            <tr>
              <td style="padding: 8px 0;"><strong>Username:</strong></td>
              <td>${username}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Password:</strong></td>
              <td>${password}</td>
            </tr>
          </table>
          <p style="font-size: 15px;">For security reasons, we recommend you log in and change your password immediately.</p>
          <p style="font-size: 15px;">If you didn’t request this, please contact our support team immediately.</p>
          <p style="font-size: 15px;">Regards,<br/><strong>Zadroit Team</strong></p>
        </div>
        <div style="background-color: #e6f0fb; text-align: center; padding: 15px; font-size: 13px; color: #555;">
          &copy; ${CurrentTime()} Zadroit. All rights reserved.
        </div>
      </div>
    </div>
  `;
};
