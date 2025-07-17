import { create } from "zustand";

interface PropertyData {
  propertyData: any;
  priority: "search" | "distance";
  setPropertyData: (data: any) => void;
  setPriority: (priority: "search" | "distance") => void;
}

export const usePropertyData = create<PropertyData>((set) => ({
  propertyData: null,
  priority: "search",
  setPropertyData: (data) => set({ propertyData: data }),
  setPriority: (priority: "search" | "distance") => set({ priority }),
}));
