import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@portfolio.com';
const FROM_EMAIL = 'Portfolio Contact <onboarding@resend.dev>';

interface ContactEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const sendContactNotificationToAdmin = async (data: ContactEmailData) => {
  try {
    const { name, email, subject, message } = data;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #6C47FF 0%, #00D4FF 100%); padding: 20px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
          </div>
          <div style="background: #13131A; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #2a2a3a;">
            <div style="margin-bottom: 20px;">
              <label style="color: #A0A0B0; font-size: 12px; text-transform: uppercase;">Name</label>
              <p style="color: white; margin: 5px 0 0 0; font-size: 18px;">${name}</p>
            </div>
            <div style="margin-bottom: 20px;">
              <label style="color: #A0A0B0; font-size: 12px; text-transform: uppercase;">Email</label>
              <p style="color: #00D4FF; margin: 5px 0 0 0; font-size: 18px;"><a href="mailto:${email}" style="color: #00D4FF;">${email}</a></p>
            </div>
            <div style="margin-bottom: 20px;">
              <label style="color: #A0A0B0; font-size: 12px; text-transform: uppercase;">Subject</label>
              <p style="color: white; margin: 5px 0 0 0; font-size: 18px;">${subject}</p>
            </div>
            <div style="margin-bottom: 20px;">
              <label style="color: #A0A0B0; font-size: 12px; text-transform: uppercase;">Message</label>
              <div style="background: #0A0A0F; padding: 15px; border-radius: 8px; margin-top: 5px;">
                <p style="color: #A0A0B0; margin: 0; white-space: pre-wrap; line-height: 1.6;">${message}</p>
              </div>
            </div>
            <div style="border-top: 1px solid #2a2a3a; padding-top: 20px; margin-top: 20px;">
              <p style="color: #6B6B7B; font-size: 12px; margin: 0;">
                This message was sent from your portfolio contact form at ${new Date().toLocaleString()}.
              </p>
            </div>
          </div>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send contact notification to admin:', error);
    return { success: false, error };
  }
};

export const sendContactEmail = async (data: ContactEmailData) => {
  return sendContactNotificationToAdmin(data);
};
