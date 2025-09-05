// src/services/notification-api.service.ts
import { store } from '../store/store'; // Import your store
import { ApiResponse } from '../type';

// Updated interface to use 'msg' instead of 'body' and add timestamp
interface SendNotificationRequest {
    data: {
        title: string;
        msg: string; // Changed from 'body' to 'msg'
        notification_at: string; // Added timestamp field
        [key: string]: string; // Allow additional fields
    };
}

interface SendNotificationResponse {
    success: boolean;
    message: string;
    data: {
        totalSuccess: number;
        totalFailure: number;
        totalSent: number;
        batches: number;
    };
}

// Interface for the notification tokens API response
interface NotificationTokensResponse {
    results: Array<{
        token: string;
        id: string;
    }>;
    total: number;
}

class NotificationApiService {
    private baseURL = process.env.REACT_APP_BACKEND_API_URL;

    // Helper method to get token from Redux store
    private getTokenFromStore(): string | null {
        const state = store.getState();
        return state.admin.token || null;
    }

    private async makeRequest(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<any> {
        // Get token from Redux store instead of localStorage
        const token = this.getTokenFromStore();

        const defaultHeaders: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (token) {
            defaultHeaders['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${this.baseURL}${endpoint}`, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Network error' }));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    // Helper method to generate timestamp in the desired format
    private generateTimestamp(): string {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    // Send notification to all users - Updated to use 'msg' and add timestamp
    async sendNotificationToAll(notificationData: SendNotificationRequest): Promise<SendNotificationResponse> {
        // Send the data object directly
        const requestData = {
            data: notificationData.data
        };

        return this.makeRequest('/send-notification', {
            method: 'POST',
            body: JSON.stringify(requestData),
        });
    }

    // Get all notification tokens - Updated to match your API response structure
    async getAllNotificationTokens(): Promise<NotificationTokensResponse> {
        return this.makeRequest('/notification-tokens');
    }
}

export default new NotificationApiService();