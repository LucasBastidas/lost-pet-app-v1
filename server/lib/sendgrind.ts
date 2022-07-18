import * as sendGrindEmail from "@sendgrid/mail";
export const sgMail = sendGrindEmail.setApiKey(process.env.SENDGRIND_KEY);
