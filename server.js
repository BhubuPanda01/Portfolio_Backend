import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: "https://bhubaneswariportfolio.netlify.app",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

 // required to allow frontend calls

// 📌 Email Transporter (Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your Gmail
    pass: process.env.EMAIL_PASS, // your app password
  },
});

// 📌 Contact API
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.TARGET_EMAIL,
      subject: `Contact from Portfolio`,
      html: `
        <div style="
    max-width: 520px;
    margin: 30px auto;
    font-family: 'Segoe UI', Roboto, sans-serif;
    color: #333;
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0px 12px 28px rgba(0,0,0,0.18);
    background: #ffffff;
    display: flex;
    flex-direction: row;
">

  <!-- Side Accent -->
  <div style="
      width: 10px;
      background: linear-gradient(180deg, #00c6ff, #0072ff);
  "></div>

  <!-- Main Content -->
  <div style="flex: 1; padding: 25px 30px;">

    <!-- Header -->
    <div style="
        background: linear-gradient(135deg, #00c6ff, #0072ff);
        color: #fff;
        padding: 18px 20px;
        border-radius: 14px;
        text-align: center;
        font-size: 22px;
        font-weight: 700;
        box-shadow: 0px 6px 12px rgba(0,0,0,0.12);
        margin-bottom: 20px;
        letter-spacing: 0.5px;
    ">
      ✨ New Contact Request
    </div>

    <p style="font-size: 15px; line-height: 1.6; color: #555; margin-bottom: 18px;">
      Someone has reached out through your website.  
      Here are the details provided:
    </p>

    <!-- Info Card -->
    <div style="
        background: #f5faff;
        padding: 18px 20px;
        border-radius: 14px;
        box-shadow: inset 0px 3px 8px rgba(0,0,0,0.05);
    ">
      <p style="margin-bottom: 12px; font-size: 16px;">
        <strong style="color: #0072ff;">👤 Name:</strong> <span>${name}</span>
      </p>
      <p style="margin-bottom: 12px; font-size: 16px;">
        <strong style="color: #0072ff;">📧 Email:</strong> <span>${email}</span>
      </p>
      <p style="margin-bottom: 6px; font-size: 16px;">
        <strong style="color: #0072ff;">💬 Message:</strong>
      </p>
      <div style="
          background: #ffffff;
          padding: 12px 14px;
          border-radius: 12px;
          font-size: 15px;
          line-height: 1.6;
          color: #444;
          box-shadow: inset 0px 2px 5px rgba(0,0,0,0.04);
      ">
        ${message}
      </div>
    </div>

    <p style="
        margin-top: 20px;
        font-size: 13px;
        color: #888;
        text-align: center;
    ">
      ✦ This message was automatically generated from your website ✦
    </p>
  </div>
</div>

      `,
    });

    res.json({ success: true, message: "Email delivered successfully" });

  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
