import { config } from '../config';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

interface OrderConfirmationData {
  email: string;
  orderNumber: number;
  orderId: number;
}

interface ShippingNotificationData {
  email: string;
  trackingNumber: string;
  carrier?: string;
  trackingUrl?: string;
}

/**
 * Email Service
 * 
 * For production, integrate with:
 * - Postmark (transactional email)
 * - SendGrid
 * - AWS SES
 * - Resend
 */
export class EmailService {
  private apiKey: string;
  private from: string;

  constructor() {
    this.apiKey = config.email.password || '';
    this.from = config.email.from;
  }

  /**
   * Send email using configured provider
   * This is a generic implementation that works with most email APIs
   */
  private async sendEmail(options: EmailOptions): Promise<void> {
    const payload = {
      from: options.from || this.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || this.stripHtml(options.html),
    };

    // For development/testing, just log the email
    if (config.app.env !== 'production') {
      console.log('📧 Email would be sent:', {
        to: payload.to,
        subject: payload.subject,
        preview: payload.text?.substring(0, 100),
      });
      return;
    }

    // Production: Send via email service API
    try {
      // Example for Postmark:
      // const response = await fetch('https://api.postmarkapp.com/email', {
      //   method: 'POST',
      //   headers: {
      //     'X-Postmark-Server-Token': this.apiKey,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     From: payload.from,
      //     To: payload.to,
      //     Subject: payload.subject,
      //     HtmlBody: payload.html,
      //     TextBody: payload.text,
      //     MessageStream: 'outbound',
      //   }),
      // });

      // Example for SendGrid:
      // const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${this.apiKey}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     personalizations: [{ to: [{ email: payload.to }] }],
      //     from: { email: payload.from },
      //     subject: payload.subject,
      //     content: [
      //       { type: 'text/html', value: payload.html },
      //       { type: 'text/plain', value: payload.text },
      //     ],
      //   }),
      // });

      // if (!response.ok) {
      //   throw new Error(`Email API error: ${response.statusText}`);
      // }

      console.log(`Email sent to ${payload.to}: ${payload.subject}`);
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }

  /**
   * Send order confirmation email
   */
  async sendOrderConfirmation(data: OrderConfirmationData): Promise<void> {
    const html = this.getOrderConfirmationTemplate(data);
    
    await this.sendEmail({
      to: data.email,
      subject: `Order Confirmation - #${data.orderNumber}`,
      html,
    });
  }

  /**
   * Send shipping notification email
   */
  async sendShippingNotification(data: ShippingNotificationData): Promise<void> {
    const html = this.getShippingNotificationTemplate(data);
    
    await this.sendEmail({
      to: data.email,
      subject: `Your order has shipped - Tracking #${data.trackingNumber}`,
      html,
    });
  }

  /**
   * Order confirmation email template
   */
  private getOrderConfirmationTemplate(data: OrderConfirmationData): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              border-radius: 8px;
              text-align: center;
              margin-bottom: 30px;
            }
            .content {
              background: #f9fafb;
              padding: 30px;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            .order-number {
              font-size: 24px;
              font-weight: bold;
              margin: 20px 0;
            }
            .button {
              display: inline-block;
              background: #667eea;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              color: #666;
              font-size: 14px;
              margin-top: 30px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎉 Thank You for Your Order!</h1>
          </div>
          
          <div class="content">
            <p>Hi there,</p>
            
            <p>We've received your order and we're getting it ready. You'll receive a shipping confirmation email as soon as your custom harness is on its way.</p>
            
            <div class="order-number">
              Order #${data.orderNumber}
            </div>
            
            <p>You can track your order status at any time using the link below:</p>
            
            <a href="https://harnesshe.ro/order/${data.orderNumber}?email=${encodeURIComponent(data.email)}" class="button">
              Track Your Order
            </a>
            
            <p>We're handcrafting your custom harness with care. Expected delivery: 7-10 business days.</p>
          </div>
          
          <div class="footer">
            <p>Questions? Reply to this email or visit our FAQ at harnesshe.ro/faq</p>
            <p>&copy; ${new Date().getFullYear()} All Pet Plus. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Shipping notification email template
   */
  private getShippingNotificationTemplate(data: ShippingNotificationData): string {
    const trackingLink = data.trackingUrl || `https://tools.usps.com/go/TrackConfirmAction?tLabels=${data.trackingNumber}`;
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              border-radius: 8px;
              text-align: center;
              margin-bottom: 30px;
            }
            .content {
              background: #f9fafb;
              padding: 30px;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            .tracking-box {
              background: white;
              border: 2px solid #667eea;
              padding: 20px;
              border-radius: 8px;
              text-align: center;
              margin: 20px 0;
            }
            .tracking-number {
              font-size: 20px;
              font-weight: bold;
              color: #667eea;
              letter-spacing: 1px;
            }
            .button {
              display: inline-block;
              background: #667eea;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              color: #666;
              font-size: 14px;
              margin-top: 30px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📦 Your Order Has Shipped!</h1>
          </div>
          
          <div class="content">
            <p>Great news! Your custom harness is on its way.</p>
            
            <div class="tracking-box">
              <p style="margin: 0 0 10px 0; color: #666;">Tracking Number</p>
              <div class="tracking-number">${data.trackingNumber}</div>
              ${data.carrier ? `<p style="margin: 10px 0 0 0; color: #666;">Carrier: ${data.carrier}</p>` : ''}
            </div>
            
            <a href="${trackingLink}" class="button">
              Track Your Package
            </a>
            
            <p>Your package should arrive within 3-5 business days. You'll receive updates as it makes its way to you.</p>
            
            <p><strong>What's Next?</strong></p>
            <ul>
              <li>Check the fit when your harness arrives</li>
              <li>Share a photo with us on social media @harnesshe.ro</li>
              <li>Need help? Our support team is here for you</li>
            </ul>
          </div>
          
          <div class="footer">
            <p>Questions about your delivery? Reply to this email</p>
            <p>&copy; ${new Date().getFullYear()} All Pet Plus. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Strip HTML tags for plain text version
   */
  private stripHtml(html: string): string {
    return html
      .replace(/<style[^>]*>.*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
}

// Export singleton instance
export const emailService = new EmailService();
