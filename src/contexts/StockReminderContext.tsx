import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { Bell } from 'lucide-react';

export interface StockReminder {
  id: string;
  productId: number;
  productName: string;
  userEmail: string;
  createdAt: Date;
  notified: boolean;
}

interface StockReminderContextType {
  reminders: StockReminder[];
  addReminder: (productId: number, productName: string, userEmail: string) => void;
  removeReminder: (productId: number) => void;
  hasReminder: (productId: number) => boolean;
  notifyUser: (productId: number) => void;
}

const StockReminderContext = createContext<StockReminderContextType | undefined>(undefined);

export function StockReminderProvider({ children }: { children: ReactNode }) {
  const [reminders, setReminders] = useState<StockReminder[]>(() => {
    const saved = localStorage.getItem('stockReminders');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<string[]>([]);

  const saveReminders = useCallback((newReminders: StockReminder[]) => {
    setReminders(newReminders);
    localStorage.setItem('stockReminders', JSON.stringify(newReminders));
  }, []);

  const addReminder = useCallback(
    (productId: number, productName: string, userEmail: string) => {
      const existingReminder = reminders.find((r) => r.productId === productId);
      if (existingReminder) return;

      const newReminder: StockReminder = {
        id: `remote_${productId}_${Date.now()}`,
        productId,
        productName,
        userEmail,
        createdAt: new Date(),
        notified: false,
      };

      const newReminders = [...reminders, newReminder];
      saveReminders(newReminders);

      // Show toast notification
      showNotification(`✓ Recordatorio activado para ${productName}`);
    },
    [reminders, saveReminders]
  );

  const removeReminder = useCallback(
    (productId: number) => {
      const newReminders = reminders.filter((r) => r.productId !== productId);
      saveReminders(newReminders);
    },
    [reminders, saveReminders]
  );

  const hasReminder = useCallback(
    (productId: number) => reminders.some((r) => r.productId === productId),
    [reminders]
  );

  const notifyUser = useCallback(
    (productId: number) => {
      const reminder = reminders.find((r) => r.productId === productId);
      if (reminder) {
        const updatedReminders = reminders.map((r) =>
          r.productId === productId ? { ...r, notified: true } : r
        );
        saveReminders(updatedReminders);
        showNotification(`${reminder.productName} ya está disponible!`);
      }
    },
    [reminders, saveReminders]
  );

  const showNotification = () => {
    const id = Math.random().toString();
    setNotifications((prev) => [...prev, id]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n !== id));
    }, 3000);
  };

  return (
    <StockReminderContext.Provider
      value={{
        reminders,
        addReminder,
        removeReminder,
        hasReminder,
        notifyUser,
      }}
    >
      {children}

      {/* Notification Toast */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {notifications.map((id) => (
          <div
            key={id}
            className="rounded-lg bg-primary text-white px-4 py-3 flex items-center gap-2 shadow-lg animate-in fade-in slide-in-from-bottom-4"
          >
            <Bell className="h-4 w-4" />
            <span className="text-sm font-medium">
              {notifications.includes(id) && `Recordatorio configurado`}
            </span>
          </div>
        ))}
      </div>
    </StockReminderContext.Provider>
  );
}

export function useStockReminder() {
  const context = useContext(StockReminderContext);
  if (!context) {
    throw new Error('useStockReminder debe usarse dentro de StockReminderProvider');
  }
  return context;
}
