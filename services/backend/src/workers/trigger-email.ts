import { Job } from 'bullmq';
import { emailService } from '../utils/email-service';

interface OrderConfirmationData {
  orderId: number;
  email: string;
  orderNumber: number;
}

interface OrderShippedData {
  orderId: string;
  email: string;
  trackingNumber: string;
  carrier?: string;
  trackingUrl?: string;
}

type EmailJobData = OrderConfirmationData | OrderShippedData;

export default async function emailWorker(job: Job<EmailJobData>) {
  const { name, data } = job;

  try {
    switch (name) {
      case 'order-confirmation':
        await emailService.sendOrderConfirmation(data as OrderConfirmationData);
        break;
      case 'order-shipped':
        await emailService.sendShippingNotification(data as OrderShippedData);
        break;
      default:
        throw new Error(`Unknown email job type: ${name}`);
    }

    console.log(`✅ Email job ${name} completed for ${data.email}`);
    
    return {
      success: true,
      recipient: data.email,
      type: name,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`❌ Email job ${name} failed for ${data.email}:`, error);
    throw error;
  }
}
