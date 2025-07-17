import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFullAddress(address: any) {
  return (
    address?.streetAddress +
    ", " +
    address?.city +
    ", " +
    address?.state +
    " " +
    address?.zipcode
  );
}

export const addressRegex = (address: string) => {
  const regex =
    /^\s*(\d+)\s+([\w\s\.]+?),?\s+([\w\s]+?),\s+([A-Z]{2})\s+(\d{5})(?:\s+([\w\s]+))?\s*$/i;

  return regex.test(address);
};
