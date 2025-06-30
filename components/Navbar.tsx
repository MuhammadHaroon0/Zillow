"use client";

import { useEffect, useState } from "react";
import { Dropdown } from "./DropDown";
import { FilterComponent } from "./FilterComponent";
import { IoIosSearch } from "react-icons/io";
import { useRouter } from "next/navigation";
import queryClient from "@/lib/queryclient";
import {
  bedrooms,
  price,
  size,
  listingStatus,
  distance,
  acreage,
} from "@/lib/filterItems";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useDebounce } from "use-debounce";
import { useQueryState } from "@/store/queryState";
import PageLoader from "./ui/PageLoader";
import { Button } from "./ui/button";
import { usePropertyData } from "@/store/propertyData";

const Navbar = () => {
  const router = useRouter();

  const { getQueryString, updateQuery } = useQueryState();
  const { setPropertyData, setPriority } = usePropertyData();
  const query = JSON.parse(decodeURIComponent(getQueryString()));
  const { searchedTerm, listingType, filterState } = query;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [inputValue, setInputValue] = useState(searchedTerm);
  const [value] = useDebounce(inputValue, 500);

  const [draftYearBuilt, setDraftYearBuilt] = useState({
    buildYearMin: filterState.buildYear.min,
    buildYearMax: filterState.buildYear.max,
  });

  const handleSearch = () => {
    router.push(`?query=${getQueryString()}`);
    queryClient.invalidateQueries({ queryKey: ["zillow"] });
  };

  const {
    data: locationSuggestions,
    isLoading: isLoadingLocationSuggestions,
    refetch,
  } = useQuery({
    queryFn: async () => {
      const res = await axios.get(
        `/api/suggestions?q=${value || searchedTerm}`
      );
      return res.data;
    },
    queryKey: [value],
    enabled: !!value,
    staleTime: 0,
  });

  useEffect(() => {
    handleSearch();
  }, [
    listingType,
    filterState.beds,
    filterState.price,
    filterState.sqftMin,
    filterState.buildYear.min,
    filterState.buildYear.max,
    filterState.distance,
    filterState.lotSize,
  ]);

  const setPriorityAndSearch = (priority: "search" | "distance") => {
    setPriority(priority);
  };

  const handleClearFilters = () => {
    updateQuery("filterState", {
      beds: "",
      price: "",
      sqftMin: "",
      distance: "",
      buildYear: {
        min: "",
        max: "",
      },
    });
    updateQuery("searchedTerm", "");
    updateQuery("listingType", "");
    updateQuery("query", "");
    setDraftYearBuilt({ buildYearMin: "", buildYearMax: "" });
    setInputValue("");
    router.replace("/");
  };

  return (
    <div className="w-full min-h-20 py-4 shadow-lg shadow-[#D3D3D3] border-[#D3D3D3] border-b flex md:flex-row flex-col items-center md:justify-between justify-center px-6">
      <div className="md:w-[35%] relative w-full h-full items-center flex md:pr-3">
        <div className="w-full border border-[#D3D3D3] rounded-md flex items-center overflow-hidden">
          <input
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
            onFocus={() => setDropdownOpen(true)}
            onBlur={() => setDropdownOpen(false)}
            type="text"
            className="w-full h-12 px-4"
            placeholder="Address, City, ZIP"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <div
            onClick={handleSearch}
            className="w-16 h-12 cursor-pointer bg-blue-500 flex items-center justify-center"
          >
            <IoIosSearch className="text-2xl text-white" />
          </div>
        </div>
        {dropdownOpen && (
          <div className="bg-white p-2 absolute top-14 z-10 left-0 w-full max-w-[510px] rounded-md shadow-md">
            {isLoadingLocationSuggestions ? (
              <div className="text-sm text-gray-500 p-2 text-center flex items-center justify-center">
                <PageLoader width="w-7" height="h-7" />
              </div>
            ) : locationSuggestions?.data?.results?.length > 0 ? (
              <div className="flex flex-col gap-2">
                {locationSuggestions?.data?.results?.map(
                  (suggestion: any, index: number) => (
                    <div
                      key={index}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDropdownOpen(false);
                        setInputValue(suggestion.display);
                        updateQuery("searchedTerm", suggestion.display);
                        setTimeout(() => {
                          handleSearch();
                        }, 100);
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                      }}
                      className={`text-sm hover:bg-gray-100 p-2 cursor-pointer rounded-md`}
                    >
                      {suggestion.display}
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-500 p-2 text-center">
                {searchedTerm
                  ? "No results found"
                  : "Enter a location to get started"}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="md:w-[65%] w-full flex items-center flex-wrap gap-3 relative">
        {/* todo commented for now */}
        <Dropdown
          title="Distance"
          placeholder="Distance"
          items={distance}
          value={filterState.distance}
          onChange={(value) => {
            updateQuery("filterState.distance", value);
            setPriorityAndSearch("distance");
          }}
        />
        <Dropdown
          placeholder="Bedrooms"
          title="Bedrooms"
          items={bedrooms}
          value={filterState.beds}
          onChange={(value) => {
            updateQuery("filterState.beds", value);
            setPriorityAndSearch("search");
          }}
        />
        <Dropdown
          title="Price"
          placeholder="Price"
          items={price}
          value={filterState.price}
          onChange={(value) => {
            updateQuery("filterState.price", value);
            setPriorityAndSearch("search");
          }}
        />
        <Dropdown
          title="Square Feet"
          placeholder="Square Feet"
          items={size}
          value={filterState.sqftMin}
          onChange={(value) => {
            updateQuery("filterState.sqftMin", value);
            setPriorityAndSearch("search");
          }}
        />
        <Dropdown
          title="Listing Status"
          placeholder="Listing Status"
          items={listingStatus}
          value={listingType}
          onChange={(value) => {
            updateQuery("listingType", value);
            setPriorityAndSearch("search");
          }}
        />
        {/* todo commented for now */}
        {/* <Dropdown title="Acreage" items={acreage} onChange={() => {}} /> */}
        {/* <Dropdown
          title="Year Built Min"
          items={yearBuilt}
          onChange={(value) => {
            updateQuery("buildYearMin", value);
          }}
        /> */}
        <div className="flex items-center gap-1">
          <input
            name="buildYearMin"
            type="number"
            value={draftYearBuilt.buildYearMin}
            placeholder="Min Year"
            className="w-28 h-9 border border-[#D3D3D3] rounded-md px-4 text-sm"
            onChange={(e) => {
              setDraftYearBuilt((prev) => ({
                ...prev,
                buildYearMin: e.target.value,
              }));
              setPriorityAndSearch("search");
            }}
            onBlur={() =>
              updateQuery(
                "filterState.buildYear.min",
                draftYearBuilt.buildYearMin
              )
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateQuery(
                  "filterState.buildYear.min",
                  draftYearBuilt.buildYearMin
                );
              }
            }}
          />
          <span className="text-lg text-gray-500">-</span>
          <input
            name="buildYearMax"
            type="number"
            value={draftYearBuilt.buildYearMax}
            placeholder="Max Year"
            className="w-28 h-9 border border-[#D3D3D3] rounded-md px-4 text-sm"
            onChange={(e) => {
              setDraftYearBuilt((prev) => ({
                ...prev,
                buildYearMax: e.target.value,
              }));
              setPriorityAndSearch("search");
            }}
            onBlur={() =>
              updateQuery(
                "filterState.buildYear.max",
                draftYearBuilt.buildYearMax
              )
            }
          />
        </div>
        <div className="flex items-center justify-center">
          <Button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            onClick={handleClearFilters}
          >
            Clear Filters
          </Button>
        </div>
        <div className="flex items-center justify-center ">
          <FilterComponent />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
