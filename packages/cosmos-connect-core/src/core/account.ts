// import { Account } from "./types.js";

// Currently just a placeholder for potential account-related utilities
export function formatShortAddress(address: string, prefixLen = 8, suffixLen = 4): string {
  if (!address) return "";
  return `${address.slice(0, prefixLen)}...${address.slice(-suffixLen)}`;
}
