"use client";
import { v4 as uuidv4 } from "uuid";
import React, { useState, useCallback } from "react";
import Notification from "../components/Notification/Notification";
import styles from "../components/Notification/Notification.module.css";

const useNotification = () => {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback(id => { // Removes a notification by id
    setNotifications((prev) => prev.filter(n => n.id !== id));
  }, []);

  // Triggers a new notification
  const pushNotification = useCallback((type, message, duration = 4000) => {
    console.log(type, message, duration)
    const id = uuidv4();
    const newNotification = { id, type, message };

    setNotifications((prev) => [...prev, newNotification]);

    // Auto remove after `duration`
    setTimeout(() => removeNotification(id), duration);
  }, [removeNotification]);

  const NotificationStack = notifications.length > 0 && (
    <div className={styles["notification-stack"]}>
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          {...notification}
          onClickFn={removeNotification}
        />
      ))}
    </div>
  );

  console.log(NotificationStack);

  return { NotificationStack, pushNotification };
};

export default useNotification;