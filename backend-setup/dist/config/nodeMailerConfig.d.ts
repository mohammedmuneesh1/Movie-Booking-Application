import nodemailer from "nodemailer";
export declare const mailTransporter: nodemailer.Transporter<import("nodemailer/lib/smtp-transport/index.js").SentMessageInfo, import("nodemailer/lib/smtp-transport/index.js").Options>;
export declare const sendEmail: ({ to, subject, body }: any) => Promise<void>;
//# sourceMappingURL=nodeMailerConfig.d.ts.map