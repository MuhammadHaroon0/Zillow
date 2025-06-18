import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FilterState {
  selectedState: string[];
  toggleSelection: (id: string, checked: boolean) => void;
  isSelected: (id: string) => boolean;
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set, get) => ({
      selectedState: [
        "Distance",
        "Bedrooms",
        "Price",
        "SquareFootage",
        "Status",
      ],

      toggleSelection: (id, checked) => {
        set((state) => ({
          selectedState: checked
            ? [...state.selectedState, id]
            : state.selectedState.filter((field) => field !== id),
        }));
      },

      isSelected: (id) => get().selectedState.includes(id),
    }),
    {
      name: "filter-storage", // Key in localStorage
    }
  )
);
