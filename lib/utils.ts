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
