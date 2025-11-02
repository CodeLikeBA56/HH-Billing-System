"use client";
import { v4 as uuidv4 } from "uuid";
import { createContext, useCallback, useContext, useState, ReactNode} from "react";
import { NotificationObj, NotificationType } from "@/types";

type NotificationContextProp = {
    notifications: NotificationObj[],
    removeNotification: (id: string) => void,
    pushNotification: (type: NotificationType, message: string, duration?: number) => void,
}

const NotificationContext = createContext<NotificationContextProp | undefined>(undefined);

const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [notifications, setNotifications] = useState<NotificationObj[]>([]);

    const removeNotification = useCallback((id: string) => { // Removes a notification by id
        setNotifications((prev) => prev.filter(n => n.id !== id));
    }, []);

  // Triggers a new notification
    const pushNotification = useCallback((type: NotificationType, message: string, duration: number = 4000) => {
        const id = uuidv4();
        const newNotification = { id, type, message };

        setNotifications((prev) => [...prev, newNotification]);

        // Auto remove after `duration`
        setTimeout(() => removeNotification(id), duration);
    }, [removeNotification]);

    return (
        <NotificationContext.Provider
            value={{ notifications, pushNotification, removeNotification }}
        >
        {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = (): NotificationContextProp => {
    const context = useContext(NotificationContext);
    if (!context)
        throw new Error("useNotification must be used within a NotificationProvider");
    
    return context;
}
export default NotificationProvider;