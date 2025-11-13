"use client"
import { NotificationObj } from '@/types';
import Notification from '../Notification/Notification';
import styles from "../Notification/Notification.module.css";
import { useNotification } from '@/contexts/NotificationProvider';

const NotificationStack: React.FC = () => {
    const { notifications, removeNotification } = useNotification();
    
    if (!notifications.length) return null;


    return (
        <div className={styles["notification-stack"]}>
            {
                notifications.map((notification: NotificationObj) => (
                    <Notification
                        key={notification.id}
                        {...notification}
                        id={notification.id}
                        onClickFn={removeNotification}
                    />
                ))
            }
        </div>
    )
};

export default NotificationStack
