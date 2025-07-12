
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, subject, message }: ContactEmailRequest = await req.json();

    console.log('Received contact form submission:', { name, email, subject });

    // Send email to business
    const emailResponse = await resend.emails.send({
      from: "Namma Rides <onboarding@resend.dev>",
      to: ["seshaallamraju08@gmail.com"],
      subject: `New Contact Query from ${name}: ${subject}`,
      html: `
        <h2>New Contact Query from Namma Rides Website</h2>
        <div style="border: 1px solid #ddd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          <p><strong>Subject:</strong> ${subject}</p>
          <hr style="margin: 15px 0;">
          <p><strong>Message:</strong></p>
          <p style="background: #f5f5f5; padding: 10px; border-radius: 4px;">${message}</p>
        </div>
        <hr>
        <p style="color: #666; font-size: 12px;">This email was sent from the Namma Rides contact form at ${new Date().toLocaleString()}.</p>
      `,
    });

    console.log('Business email sent:', emailResponse);

    // Send confirmation to user
    const confirmationResponse = await resend.emails.send({
      from: "Namma Rides <onboarding@resend.dev>",
      to: [email],
      subject: "Thank you for contacting Namma Rides!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1e40af;">Thank you for reaching out, ${name}!</h1>
          <p>We have received your query about: <strong>${subject}</strong></p>
          <p>Our team will get back to you within 24 hours.</p>
          
          <div style="background: #f8fafc; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #1e293b;"><strong>Your message:</strong></p>
            <p style="margin: 10px 0 0 0; color: #475569;">${message}</p>
          </div>
          
          <p>Best regards,<br>The Namma Rides Team</p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          <p style="color: #64748b; font-size: 14px;">
            Namma Rides - Your trusted vehicle rental partner in Hyderabad<br>
            📧 seshaallamraju08@gmail.com | 📱 +91 12345 67890
          </p>
        </div>
      `,
    });

    console.log('Confirmation email sent:', confirmationResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Emails sent successfully',
      emailResponse,
      confirmationResponse 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
