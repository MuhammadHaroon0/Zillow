import { create } from "zustand";

interface MapBounds {
  lat: string;
  lng: string;
}

interface FilterState {
  price: { min: string };
  beds: { min: string };
  buildYear: { min: string; max: string };
  lotSize: { min: string };
  sqftMin: { min: string };
}

interface QueryState {
  mapBounds: MapBounds;
  filterState: FilterState;
  searchedTerm: string;
  listingType: string;
  updateQuery: (key: string, value: any) => void;
  getQueryString: () => string;
}

const initialState: Omit<QueryState, "updateQuery" | "getQueryString"> = {
  mapBounds: {
    lat: "45.672362679211",
    lng: "-122.5991175112",
  },
  filterState: {
    price: { min: "1000000" },
    beds: { min: "4" },
    buildYear: { min: "2000", max: "2025" },
    lotSize: { min: "1000" },
    sqftMin: { min: "1000" },
  },
  listingType: "ForSale",
  searchedTerm: "Vancouver", // Todo:default for now
};

export const useQueryState = create<QueryState>((set, get) => ({
  ...initialState,

  updateQuery: (key: string, value: any) => {
    const keys = key.split(".");
    if (keys.length === 1) {
      set({ [keys[0]]: value } as any);
    } else {
      set((state) => {
        const updatedState = { ...state };
        let obj: any = updatedState;
        for (let i = 0; i < keys.length - 1; i++) {
          obj[keys[i]] = { ...obj[keys[i]] };
          obj = obj[keys[i]];
        }
        obj[keys[keys.length - 1]] = value;
        return updatedState;
      });
    }
  },

  getQueryString: () => {
    const { updateQuery, ...state } = get();
    return encodeURIComponent(JSON.stringify(state));
  },
}));
