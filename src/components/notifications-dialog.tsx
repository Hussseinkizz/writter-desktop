import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  HiBell,
  HiCheck,
  HiTrash,
  HiInformationCircle,
  HiExclamationCircle,
  HiCheckCircle,
  HiXCircle,
} from 'react-icons/hi';
import { toast } from 'sonner';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

interface NotificationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (id: string) => void;
  onClearAll: () => void;
}

const NotificationIcon = ({ type }: { type: Notification['type'] }) => {
  switch (type) {
    case 'success':
      return <HiCheckCircle className="h-5 w-5 text-green-500" />;
    case 'warning':
      return <HiExclamationCircle className="h-5 w-5 text-yellow-500" />;
    case 'error':
      return <HiXCircle className="h-5 w-5 text-red-500" />;
    default:
      return <HiInformationCircle className="h-5 w-5 text-blue-500" />;
  }
};

const NotificationItem = ({
  notification,
  onMarkAsRead,
  onDelete,
}: {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div
      className={`p-4 rounded-lg border transition-colors ${
        notification.read
          ? 'bg-neutral-800/30 border-neutral-700/50'
          : 'bg-neutral-800/50 border-neutral-600'
      }`}>
      <div className="flex items-start gap-3">
        <NotificationIcon type={notification.type} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4
              className={`font-semibold text-sm ${
                notification.read ? 'text-neutral-300' : 'text-neutral-200'
              }`}>
              {notification.title}
            </h4>
            {!notification.read && (
              <Badge
                variant="secondary"
                className="text-xs bg-violet-600/20 text-violet-300">
                New
              </Badge>
            )}
          </div>
          <p
            className={`text-sm mb-2 ${
              notification.read ? 'text-neutral-500' : 'text-neutral-400'
            }`}>
            {notification.message}
          </p>
          <span className="text-xs text-neutral-500">
            {formatTime(notification.timestamp)}
          </span>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          {!notification.read && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMarkAsRead(notification.id)}
              className="h-8 w-8 p-0 border-green-600/50 text-green-400 hover:bg-green-600/10"
              title="Mark as read">
              <HiCheck className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(notification.id)}
            className="h-8 w-8 p-0 border-red-600/50 text-red-400 hover:bg-red-600/10"
            title="Delete notification">
            <HiTrash className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export const NotificationsDialog = ({
  open,
  onOpenChange,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onClearAll,
}: NotificationsDialogProps) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllAsRead = () => {
    onMarkAllAsRead();
    toast.success('All notifications marked as read');
  };

  const handleClearAll = () => {
    onClearAll();
    toast.success('All notifications cleared');
  };

  const handleMarkAsRead = (id: string) => {
    onMarkAsRead(id);
    toast.success('Notification marked as read');
  };

  const handleDelete = (id: string) => {
    onDeleteNotification(id);
    toast.success('Notification deleted');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] bg-neutral-900 border-neutral-700">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-neutral-200 text-xl font-semibold flex items-center gap-2">
              <HiBell className="text-violet-400" />
              Notifications
              {unreadCount > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-violet-600/20 text-violet-300">
                  {unreadCount} new
                </Badge>
              )}
            </DialogTitle>
            {notifications.length > 0 && (
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                    className="border-green-600/50 text-green-400 hover:bg-green-600/10">
                    <HiCheck className="h-4 w-4 mr-1" />
                    Mark All Read
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  className="border-red-600/50 text-red-400 hover:bg-red-600/10">
                  <HiTrash className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              </div>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-160px)] pr-4">
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-neutral-400">
                <HiBell className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                <p className="text-sm">
                  You're all caught up! Notifications will appear here when you
                  have updates.
                </p>
              </div>
            ) : (
              notifications
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                .map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                    onDelete={handleDelete}
                  />
                ))
            )}
          </div>
        </ScrollArea>

        <div className="flex justify-end pt-4 border-t border-neutral-700">
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-violet-600 hover:bg-violet-700">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};