import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function for safe try operations (following coding rules)
export function safeTry<T>(fn: () => T | Promise<T>) {
  try {
    const result = fn();
    if (result instanceof Promise) {
      return result
        .then(value => ({ err: null, result: value }))
        .catch(error => ({ err: error, result: null }));
    }
    return { err: null, result };
  } catch (error) {
    return { err: error, result: null };
  }
}