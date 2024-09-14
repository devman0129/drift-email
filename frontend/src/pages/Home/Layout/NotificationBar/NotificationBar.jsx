import React from 'react';
import './NotificationBar.scss';

const NotificationBar = () => {
  return (
    <div className="notification-bar">
      <h5 className="notification-text">
        Heads up! You have a monthly limit of 2000 replies, which you have
        exceeded for over 90 days. Reach out to support@drift.com to learn more.
      </h5>
    </div>
  );
};

export default NotificationBar;
