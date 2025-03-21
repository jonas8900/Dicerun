import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, name } = req.body;

  const transporter = nodemailer.createTransport({
    host: process.env.MAILGUN_HOST,
    port: process.env.MAILGUN_PORT,
    auth: {
      user: process.env.MAILGUN_USER,
      pass: process.env.MAILGUN_PASS,
    },
  });

  try {
  
    await transporter.sendMail({
      from: `Dicerun <${process.env.MAILGUN_USER}>`,
      to: email,
      subject: "Willkommen bei MeinApp! 🎉",
      html: `<p>Hey ${name}!</p><br><p>Willkommen bei Dicerun!</p><p>Danke für deine Registrierung!</p><p>Wir freuen uns, dich dabei zu haben. 🎉</p><b></b><a></a>`,
    });

    return res.status(200).json({ success: true, message: "E-Mail wurde gesendet!" });
  } catch (error) {
    console.error("E-Mail Fehler:", error);
    return res.status(500).json({ error: "E-Mail konnte nicht gesendet werden" });
  }
}
