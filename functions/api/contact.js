/**
 * Cloudflare Pages Function - Contact Form Handler
 * Handles form submissions and sends email via Brevo SMTP
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle OPTIONS request for CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Debug logging
    console.log('Environment check:', {
      hasBrevoKey: !!env.BREVO_API_KEY,
      keyLength: env.BREVO_API_KEY ? env.BREVO_API_KEY.length : 0,
      keyPrefix: env.BREVO_API_KEY ? env.BREVO_API_KEY.substring(0, 10) : 'MISSING'
    });
    
    // Check if API key is configured
    if (!env.BREVO_API_KEY) {
      console.error('BREVO_API_KEY not configured');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Email service not configured. Please email us directly at contact@1889dev.com' 
        }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Parse form data
    const formData = await request.json();
    const { name, email, company, service, message } = formData;

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Name, email, and message are required' 
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid email address' 
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Prepare email content
    const serviceText = service ? `\nService Interest: ${service}` : '';
    const companyText = company ? `\nCompany: ${company}` : '';
    
    const emailBody = `
New Contact Form Submission - 1889 Development

From: ${name}
Email: ${email}${companyText}${serviceText}

Message:
${message}

---
Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} EST
    `.trim();

    // Send email via Brevo SMTP
    console.log('Attempting to send email via Brevo...');
    
    const smtpResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': env.BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: '1889 Development',
          email: 'contact@1889dev.com'
        },
        to: [
          {
            email: 'contact@1889dev.com',
            name: '1889 Development'
          }
        ],
        replyTo: {
          email: email,
          name: name
        },
        subject: `New Inquiry: ${name}${service ? ' - ' + service : ''}`,
        textContent: emailBody,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
            <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #FF2D55; margin-top: 0;">New Contact Form Submission</h2>
              <div style="margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-left: 3px solid #FF2D55;">
                <p style="margin: 5px 0;"><strong>From:</strong> ${name}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #FF2D55;">${email}</a></p>
                ${company ? `<p style="margin: 5px 0;"><strong>Company:</strong> ${company}</p>` : ''}
                ${service ? `<p style="margin: 5px 0;"><strong>Service Interest:</strong> ${service}</p>` : ''}
              </div>
              <div style="margin: 20px 0;">
                <h3 style="color: #333; font-size: 16px;">Message:</h3>
                <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${message}</p>
              </div>
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
                <p>Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} EST</p>
              </div>
            </div>
          </div>
        `
      })
    });

    if (!smtpResponse.ok) {
      const errorData = await smtpResponse.text();
      console.error('Brevo API Error Response:', errorData);
      console.error('Brevo API Status:', smtpResponse.status);
      throw new Error(`Brevo API returned status ${smtpResponse.status}`);
    }

    const responseData = await smtpResponse.json();
    console.log('Email sent successfully:', responseData);

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Thank you for your inquiry! We\'ll get back to you within 24 hours.' 
      }),
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    console.error('Error details:', error.message, error.stack);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to send message. Please email us directly at contact@1889dev.com' 
      }),
      { status: 500, headers: corsHeaders }
    );
  }
}
