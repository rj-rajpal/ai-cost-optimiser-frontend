/**
 * User Service
 * Handles all user-related API operations
 */

import api from '../lib/api';

/**
 * Get user profile
 */
export const getProfile = async () => {
  return await api.get('/user/profile');
};

/**
 * Update user profile
 */
export const updateProfile = async (profileData) => {
  return await api.patch('/user/profile', profileData);
};

/**
 * Change user password
 */
export const changePassword = async (passwordData) => {
  const { currentPassword, newPassword, confirmPassword } = passwordData;
  
  return await api.post('/user/change-password', {
    current_password: currentPassword,
    new_password: newPassword,
    confirm_password: confirmPassword,
  });
};

/**
 * Upload user avatar
 */
export const uploadAvatar = async (avatarFile) => {
  return await api.upload('/user/avatar', avatarFile);
};

/**
 * Get user preferences
 */
export const getPreferences = async () => {
  return await api.get('/user/preferences');
};

/**
 * Update user preferences
 */
export const updatePreferences = async (preferences) => {
  return await api.patch('/user/preferences', preferences);
};

/**
 * Get user organizations
 */
export const getOrganizations = async () => {
  return await api.get('/user/organizations');
};

/**
 * Join organization
 */
export const joinOrganization = async (inviteCode) => {
  return await api.post('/user/organizations/join', { invite_code: inviteCode });
};

/**
 * Leave organization
 */
export const leaveOrganization = async (organizationId) => {
  return await api.delete(`/user/organizations/${organizationId}/leave`);
};

/**
 * Get user activity log
 */
export const getActivityLog = async (page = 1, limit = 20) => {
  return await api.get(`/user/activity?page=${page}&limit=${limit}`);
};

/**
 * Delete user account
 */
export const deleteAccount = async (confirmationData) => {
  const { password, confirmation } = confirmationData;
  
  return await api.delete('/user/account', {
    body: {
      password,
      confirmation,
    },
  });
};

/**
 * Get user notifications
 */
export const getNotifications = async (unreadOnly = false) => {
  const params = unreadOnly ? '?unread_only=true' : '';
  return await api.get(`/user/notifications${params}`);
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (notificationId) => {
  return await api.patch(`/user/notifications/${notificationId}`, {
    read: true,
  });
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsAsRead = async () => {
  return await api.patch('/user/notifications/mark-all-read');
};

/**
 * Delete notification
 */
export const deleteNotification = async (notificationId) => {
  return await api.delete(`/user/notifications/${notificationId}`);
};

/**
 * Update notification preferences
 */
export const updateNotificationPreferences = async (preferences) => {
  return await api.patch('/user/notification-preferences', preferences);
}; 