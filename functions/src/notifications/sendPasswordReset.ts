import { getAuth } from "firebase-admin/auth";
import { onCall, HttpsError } from "firebase-functions/https";
import { defineSecret } from "firebase-functions/params";
import sgMail from "@sendgrid/mail";
import { logger } from "firebase-functions";

const sgApiKey = defineSecret("SENDGRID_API_KEY");

export const sendPasswordReset = onCall(
  { secrets: [sgApiKey] },
  async (request) => {
    const { userEmail } = request.data;

    if (!userEmail) {
      logger.error("Email is required.");
      throw new HttpsError("invalid-argument", "Email is required.");
    }

    try {
      const link = await getAuth().generatePasswordResetLink(userEmail);

      await sendCustomPasswordResetEmail(userEmail, link, sgApiKey.value());

      return { success: true };
    } catch (error: any) {
      logger.error("Error in password reset function:", error);
      throw new HttpsError("internal", "Failed to send reset email.");
    }
  }
);

const sendCustomPasswordResetEmail = async (
  userEmail: string,
  link: string,
  apiKey: string
): Promise<void> => {
  const email = {
    to: userEmail,
    from: "wassim.radwan@drxonline.com",
    templateId: "d-ab74b757cd654cd8962ccf048a72c07f",
    dynamicTemplateData: {
      resetLink: link,
    },
  };

  sgMail.setApiKey(apiKey);
  await sgMail.send(email);
};
