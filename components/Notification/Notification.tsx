"use client";
import React from 'react';
import { MessageTypeProp } from '@/types';
import styles from './Notification.module.css';

interface NotificationProps {
  id: string,
  type: "success" | "error" | "warning" | "info",
  message: string,
  onClickFn: (id: string) => void
}

const Notification: React.FC<NotificationProps> = React.memo(({ id, type = "info", message = "", onClickFn = () => {} }) => {

  const messageTypeStyling: MessageTypeProp = {
    success: { icon: 'check_circle', className: 'notification--success' },
    error: { icon: 'cancel', className: 'notification--failure' },
    warning: { icon: 'warning', className: 'notification--warning' },
    info: { icon: 'info', className: 'notification--info' },
  };

  const { icon, className } = messageTypeStyling[type] || {};

  return (
    <div className={`${styles['alert-container']} ${styles[className]}`}>
      <div className={`${styles['notification-content']}`}>
        <span className="material-symbols-outlined">{icon}</span>
        <p>{message}</p>
        <button className={`w-[20px] ${styles["close-notification-btn"]}`} onClick={() => onClickFn(id)}>
          <span className='material-symbols-outlined'>close</span>
        </button>
      </div>
      <div className={`${styles['notification-progress']} ${styles[className]}`}></div>
    </div>
  );
});

Notification.displayName = "Notification";
export default Notification;