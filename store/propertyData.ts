import { create } from "zustand";

interface PropertyData {
  propertyData: any;
  setPropertyData: (data: any) => void;
}

export const usePropertyData = create<PropertyData>((set) => ({
  propertyData: null,
  setPropertyData: (data) => set({ propertyData: data }),
}));
