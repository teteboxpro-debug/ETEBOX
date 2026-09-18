/**
 * Utility helper for Telegram WebApp integration & external link handling
 */

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData?: string;
        initDataUnsafe?: Record<string, unknown>;
        ready?: () => void;
        expand?: () => void;
        close?: () => void;
        openLink?: (url: string, options?: { try_instant_view?: boolean }) => void;
        openTelegramLink?: (url: string) => void;
        HapticFeedback?: {
          impactOccurred?: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred?: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged?: () => void;
        };
        BackButton?: {
          show?: () => void;
          hide?: () => void;
          onClick?: (cb: () => void) => void;
          offClick?: (cb: () => void) => void;
        };
        themeParams?: Record<string, string>;
      };
    };
  }
}

export function initTelegramApp() {
  try {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready?.();
      window.Telegram.WebApp.expand?.();
    }
  } catch (err) {
    console.warn('Telegram WebApp init non-blocking note:', err);
  }
}

export function getTelegramWebAppUser(): { username?: string; firstName?: string; id?: string | number } | null {
  try {
    const tgUser = (window.Telegram?.WebApp?.initDataUnsafe as any)?.user;
    if (tgUser) {
      return {
        username: tgUser.username ? `@${tgUser.username.replace(/^@/, '')}` : undefined,
        firstName: tgUser.first_name,
        id: tgUser.id,
      };
    }
  } catch (err) {
    console.warn('Error reading Telegram user data:', err);
  }
  return null;
}

export function triggerHaptic(style: 'light' | 'medium' | 'heavy' = 'medium') {
  try {
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred?.(style);
    } else if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(style === 'heavy' ? 25 : 12);
    }
  } catch {
    // Ignore haptic errors on unsupported platforms
  }
}

export function triggerHapticSuccess() {
  try {
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred?.('success');
    }
  } catch {
    // Ignore
  }
}

export function triggerHapticError() {
  try {
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred?.('error');
    }
  } catch {
    // Ignore
  }
}

export function openExternalUrl(url: string) {
  triggerHaptic('medium');
  try {
    // Check if it's Telegram WebApp
    if (window.Telegram?.WebApp?.openLink && url.startsWith('http')) {
      if (url.includes('t.me/') && window.Telegram.WebApp.openTelegramLink) {
        window.Telegram.WebApp.openTelegramLink(url);
        return;
      }
      window.Telegram.WebApp.openLink(url);
      return;
    }
  } catch (err) {
    console.warn('Telegram openLink fallback:', err);
  }

  // Standard web browser fallback
  try {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch {
    window.location.href = url;
  }
}
