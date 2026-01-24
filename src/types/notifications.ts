export type NotificationType = 'like' | 'comment' | 'follow' | 'system' | 'connection_request';

export interface Notification {
    id: string;
    user_id: string;
    actor_id: string | null;
    type: NotificationType;
    title: string;
    message: string | null;
    link_url: string | null;
    is_read: boolean;
    created_at: string;
}

export interface NotificationWithActor extends Notification {
    actor?: {
        full_name: string | null;
        avatar_url: string | null;
    }
}
