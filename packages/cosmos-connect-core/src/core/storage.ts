import { StorageAdapter } from "./types.js";

export const defaultStorage: StorageAdapter = {
  getItem: (key: string) => {
    if (typeof localStorage !== "undefined") {
      return localStorage.getItem(key);
    }
    return null;
  },
  setItem: (key: string, value: string) => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(key, value);
    }
  },
  removeItem: (key: string) => {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(key);
    }
  },
};
