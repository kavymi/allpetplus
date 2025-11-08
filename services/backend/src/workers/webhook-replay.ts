import { Job } from 'bullmq';
import { DatabaseClient } from '../config/database.config';
import crypto from 'crypto';

interface WebhookReplayData {
  webhookId: string;
  topic: string;
  payload: Record<string, unknown>;
  attempt: number;
}

interface ReplayResult {
  success: boolean;
  webhookId: string;
  topic: string;
  processedAt: string;
  attempt: number;
}

/**
 * Webhook Replay Worker
 * 
 * Handles retry logic for failed webhook processing
 * Used for recovering from temporary failures or reprocessing webhooks
 */
export default async function webhookReplayWorker(job: Job<WebhookReplayData>): Promise<ReplayResult> {
  const { data } = job;
  const db = DatabaseClient.getInstance();

  try {
    console.log(`🔄 Replaying webhook ${data.webhookId} (attempt ${data.attempt})`);

    // Fetch webhook log from database
    const webhookLog = await db.webhookLog.findUnique({
      where: { webhookId: data.webhookId },
    });

    if (!webhookLog) {
      throw new Error(`Webhook log not found: ${data.webhookId}`);
    }

    // Update attempt count
    await db.webhookLog.update({
      where: { webhookId: data.webhookId },
      data: {
        attempts: data.attempt,
        lastAttemptAt: new Date(),
        status: 'RETRYING',
      },
    });

    // Process based on topic
    switch (data.topic) {
      case 'orders/create':
        await reprocessOrderWebhook(data, db);
        break;
      case 'orders/fulfilled':
        await reprocessFulfillmentWebhook(data, db);
        break;
      case 'orders/cancelled':
        await reprocessOrderCancellation(data, db);
        break;
      default:
        throw new Error(`Unsupported webhook topic: ${data.topic}`);
    }

    // Mark as processed
    await db.webhookLog.update({
      where: { webhookId: data.webhookId },
      data: {
        status: 'PROCESSED',
        processedAt: new Date(),
        errorMessage: null,
      },
    });

    console.log(`✅ Webhook replay ${data.webhookId} completed successfully`);
    
    return {
      success: true,
      webhookId: data.webhookId,
      topic: data.topic,
      processedAt: new Date().toISOString(),
      attempt: data.attempt,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Update webhook log with error
    await db.webhookLog.update({
      where: { webhookId: data.webhookId },
      data: {
        status: 'FAILED',
        errorMessage,
      },
    });

    console.error(`❌ Webhook replay ${data.webhookId} failed:`, error);
    throw error;
  }
}

/**
 * Reprocess order creation webhook
 */
async function reprocessOrderWebhook(data: WebhookReplayData, db: DatabaseClient) {
  const payload = data.payload as any;
  
  const orderData = {
    shopifyOrderId: String(payload.id),
    shopifyOrderNumber: String(payload.order_number),
    email: payload.email,
    emailHash: crypto.createHash('sha256').update(payload.email).digest('hex'),
    maskedId: `HH-${String(payload.order_number).slice(-4)}`,
    status: 'CONFIRMED' as const,
    statusHistory: [
      {
        status: 'confirmed',
        timestamp: payload.created_at,
        description: 'Order confirmed and payment processed',
        isComplete: true,
      },
    ],
  };

  await db.orderMeta.upsert({
    where: { shopifyOrderId: orderData.shopifyOrderId },
    update: {
      status: orderData.status,
      updatedAt: new Date(),
    },
    create: orderData,
  });

  console.log(`  📦 Order ${payload.order_number} reprocessed`);
}

/**
 * Reprocess fulfillment webhook
 */
async function reprocessFulfillmentWebhook(data: WebhookReplayData, db: DatabaseClient) {
  const payload = data.payload as any;
  const orderId = String(payload.order_id);

  const orderMeta = await db.orderMeta.findUnique({
    where: { shopifyOrderId: orderId },
  });

  if (!orderMeta) {
    throw new Error(`Order not found: ${orderId}`);
  }

  const currentTimeline = (orderMeta.statusHistory as any[]) || [];
  const updatedTimeline = [
    ...currentTimeline,
    {
      status: 'shipped',
      timestamp: payload.created_at,
      description: `Package shipped via ${payload.tracking_company || 'carrier'}`,
      isComplete: true,
    },
  ];

  await db.orderMeta.update({
    where: { shopifyOrderId: orderId },
    data: {
      status: 'SHIPPED',
      statusHistory: updatedTimeline,
      shippingInfo: {
        carrier: payload.tracking_company,
        trackingNumber: payload.tracking_number,
        trackingUrl: payload.tracking_url,
      },
      updatedAt: new Date(),
    },
  });

  console.log(`  🚚 Fulfillment for order ${orderId} reprocessed`);
}

/**
 * Reprocess order cancellation webhook
 */
async function reprocessOrderCancellation(data: WebhookReplayData, db: DatabaseClient) {
  const payload = data.payload as any;
  const orderId = String(payload.id);

  const orderMeta = await db.orderMeta.findUnique({
    where: { shopifyOrderId: orderId },
  });

  if (!orderMeta) {
    throw new Error(`Order not found: ${orderId}`);
  }

  const currentTimeline = (orderMeta.statusHistory as any[]) || [];
  const updatedTimeline = [
    ...currentTimeline,
    {
      status: 'cancelled',
      timestamp: payload.cancelled_at || new Date().toISOString(),
      description: payload.cancel_reason || 'Order cancelled',
      isComplete: true,
    },
  ];

  await db.orderMeta.update({
    where: { shopifyOrderId: orderId },
    data: {
      status: 'CANCELLED',
      statusHistory: updatedTimeline,
      updatedAt: new Date(),
    },
  });

  console.log(`  ❌ Cancellation for order ${orderId} reprocessed`);
}
