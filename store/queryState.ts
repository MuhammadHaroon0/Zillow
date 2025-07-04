import { create } from "zustand";

interface MapBounds {
  lat: string;
  lng: string;
}

interface FilterState {
  price: string;
  beds: string;
  buildYear: { min: string; max: string };
  sqft: string;
  distance: string;
}

interface QueryState {
  mapBounds: MapBounds;
  filterState: FilterState;
  searchedTerm: string;
  listingType: string;
  regionId?: string;
  updateQuery: (key: string, value: any) => void;
  getQueryString: () => string;
}

const initialState: Omit<QueryState, "updateQuery" | "getQueryString"> = {
  mapBounds: {
    lat: "",
    lng: "",
  },
  filterState: {
    price: "",
    beds: "",
    buildYear: { min: "", max: "" },
    sqft: "",
    distance: "",
  },
  listingType: "",
  searchedTerm: "",
  regionId: "",
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
