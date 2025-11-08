/**
 * Event Types for Inter-Service Communication
 */

export interface BaseEvent {
  id: string;
  timestamp: string;
  service: string;
}

// User Events
export interface UserCreatedEvent extends BaseEvent {
  type: 'user.created';
  data: {
    userId: string;
    email: string;
  };
}

export interface UserUpdatedEvent extends BaseEvent {
  type: 'user.updated';
  data: {
    userId: string;
    changes: Record<string, any>;
  };
}

// Builder Events
export interface DesignCreatedEvent extends BaseEvent {
  type: 'design.created';
  data: {
    designId: string;
    userId: string;
    configJson: Record<string, any>;
  };
}

export interface DesignUpdatedEvent extends BaseEvent {
  type: 'design.updated';
  data: {
    designId: string;
    userId: string;
    changes: Record<string, any>;
  };
}

export interface DesignSharedEvent extends BaseEvent {
  type: 'design.shared';
  data: {
    designId: string;
    shareToken: string;
  };
}

// Order Events
export interface OrderCreatedEvent extends BaseEvent {
  type: 'order.created';
  data: {
    orderId: string;
    shopifyOrderId: string;
    email: string;
  };
}

export interface OrderStatusChangedEvent extends BaseEvent {
  type: 'order.status_changed';
  data: {
    orderId: string;
    oldStatus: string;
    newStatus: string;
  };
}

// Webhook Events
export interface WebhookReceivedEvent extends BaseEvent {
  type: 'webhook.received';
  data: {
    topic: string;
    webhookId: string;
  };
}

// Union type of all events
export type DomainEvent =
  | UserCreatedEvent
  | UserUpdatedEvent
  | DesignCreatedEvent
  | DesignUpdatedEvent
  | DesignSharedEvent
  | OrderCreatedEvent
  | OrderStatusChangedEvent
  | WebhookReceivedEvent;

export type EventType = DomainEvent['type'];
export type EventHandler<T extends DomainEvent = DomainEvent> = (event: T) => Promise<void>;

