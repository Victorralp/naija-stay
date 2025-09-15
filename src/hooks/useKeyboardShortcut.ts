import { useEffect } from 'react';

/**
 * Custom hook for handling keyboard shortcuts
 * @param key - The key to listen for (e.g., 'k', 'Enter', 'Escape')
 * @param callback - Function to call when the key is pressed
 * @param ctrlKey - Whether Ctrl key is required (default: false)
 * @param shiftKey - Whether Shift key is required (default: false)
 * @param altKey - Whether Alt key is required (default: false)
 * @param disabled - Whether the shortcut is disabled (default: false)
 */
export const useKeyboardShortcut = (
  key: string,
  callback: () => void,
  {
    ctrlKey = false,
    shiftKey = false,
    altKey = false,
    disabled = false,
  }: {
    ctrlKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    disabled?: boolean;
  } = {}
) => {
  useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === key &&
        event.ctrlKey === ctrlKey &&
        event.shiftKey === shiftKey &&
        event.altKey === altKey
      ) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [key, callback, ctrlKey, shiftKey, altKey, disabled]);
};