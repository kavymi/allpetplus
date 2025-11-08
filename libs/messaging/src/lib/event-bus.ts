/**
 * Event Bus for Inter-Service Communication
 * Uses Redis Pub/Sub for event distribution
 */

import { Redis } from 'ioredis';
import { DomainEvent, EventType, EventHandler } from './events';

export class EventBus {
  private publisher: Redis;
  private subscribers: Map<EventType, EventHandler[]> = new Map();
  private subscriberClient?: Redis;

  constructor(redisUrl: string) {
    this.publisher = new Redis(redisUrl);
  }

  /**
   * Publish an event to all subscribers
   */
  async publish<T extends DomainEvent>(event: T): Promise<void> {
    const channel = event.type;
    const message = JSON.stringify(event);
    
    await this.publisher.publish(channel, message);
    console.log(`[EventBus] Published: ${event.type}`, { id: event.id });
  }

  /**
   * Subscribe to specific event types
   */
  async subscribe<T extends DomainEvent>(
    eventType: EventType,
    handler: EventHandler<T>
  ): Promise<void> {
    // Create subscriber client if not exists
    if (!this.subscriberClient) {
      this.subscriberClient = this.publisher.duplicate();
      await this.subscriberClient.subscribe(eventType);

      // Handle incoming messages
      this.subscriberClient.on('message', async (channel, message) => {
        try {
          const event = JSON.parse(message) as DomainEvent;
          const handlers = this.subscribers.get(channel as EventType) || [];
          
          // Execute all handlers for this event type
          await Promise.all(handlers.map(h => h(event)));
        } catch (error) {
          console.error(`[EventBus] Handler error for ${channel}:`, error);
        }
      });
    } else {
      await this.subscriberClient.subscribe(eventType);
    }

    // Store handler
    const handlers = this.subscribers.get(eventType) || [];
    handlers.push(handler as EventHandler);
    this.subscribers.set(eventType, handlers);

    console.log(`[EventBus] Subscribed to: ${eventType}`);
  }

  /**
   * Unsubscribe from event type
   */
  async unsubscribe(eventType: EventType): Promise<void> {
    if (this.subscriberClient) {
      await this.subscriberClient.unsubscribe(eventType);
      this.subscribers.delete(eventType);
    }
  }

  /**
   * Close all connections
   */
  async close(): Promise<void> {
    await this.publisher.quit();
    if (this.subscriberClient) {
      await this.subscriberClient.quit();
    }
  }
}

/**
 * Create event with metadata
 */
export function createEvent<T extends DomainEvent>(
  type: T['type'],
  service: string,
  data: T['data']
): T {
  return {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    service,
    type,
    data,
  } as T;
}

