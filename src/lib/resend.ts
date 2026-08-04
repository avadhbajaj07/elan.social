import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY || "re_mock_key";
export const resend = new Resend(resendApiKey);

export interface SendApprovalEmailParams {
  clientEmail: string;
  clientName: string;
  postTitle: string;
  approvalUrl: string;
  scheduledTime: string;
  platforms: string[];
}

export async function sendClientApprovalEmail({
  clientEmail,
  clientName,
  postTitle,
  approvalUrl,
  scheduledTime,
  platforms,
}: SendApprovalEmailParams) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_xxx") {
    console.log(`[Mock Email] 1-Click Approval link sent to ${clientEmail}: ${approvalUrl}`);
    return { success: true, mocked: true, approvalUrl };
  }

  try {
    const formattedPlatforms = platforms.map((p) => p.toUpperCase()).join(", ");
    const { data, error } = await resend.emails.send({
      from: "SocialPulse Approvals <approvals@socialpulse.app>",
      to: [clientEmail],
      subject: `Action Required: New Social Post Pending Approval for ${clientName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0070f3;">SocialPulse Approval Request</h2>
          <p>Hello ${clientName},</p>
          <p>Your agency team has prepared a new social media post scheduled for <strong>${scheduledTime}</strong> across <strong>${formattedPlatforms}</strong>.</p>
          
          <div style="background-color: #f8fafc; padding: 16px; border-left: 4px solid #0070f3; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; font-style: italic; color: #334155;">"${postTitle}"</p>
          </div>

          <p>Click the button below to view the post preview and approve it in 1 click (no login required):</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${approvalUrl}" style="background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 6px; display: inline-block;">
              Review & Approve Post →
            </a>
          </div>

          <p style="font-size: 12px; color: #64748b;">If the button doesn't work, copy and paste this link into your browser: <br>${approvalUrl}</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Email Error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Error sending approval email:", err);
    return { success: false, error: err };
  }
}
