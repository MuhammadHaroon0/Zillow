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

const Navbar = () => {
  const { getQueryString, updateQuery } = useQueryState();
  const query = JSON.parse(decodeURIComponent(getQueryString()));

  const { searchedTerm, listingType, filterState } = query;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [value] = useDebounce(searchedTerm, 500);
  const [filter, setFilter] = useState({
    distance: "2.1",
    bedrooms: "2",
    price: "50000",
    size: "1000",
    listingStatus: "ForSale",
    buildYearMin: "2000",
    buildYearMax: "2025",
    lotSize: "10890",
  });

  const [draftYearBuilt, setDraftYearBuilt] = useState({
    buildYearMin: filter.buildYearMin,
    buildYearMax: filter.buildYearMax,
  });
  const router = useRouter();

  const handleSearch = () => {
    router.push(`?query=${getQueryString()}`);
    queryClient.invalidateQueries({ queryKey: ["zillow"] });
  };

  useEffect(() => {
    handleSearch();
  }, [
    listingType,
    filterState.beds.min,
    filterState.price.min,
    filterState.sqftMin.min,
    filterState.buildYear.min,
    filterState.buildYear.max,
    filterState.lotSize.min,
  ]);

  const { data: locationSuggestions, isLoading: isLoadingLocationSuggestions } =
    useQuery({
      queryFn: async () => {
        const res = await axios.get(
          `/api/get-location-suggestion?location=${value}`
        );
        return res.data;
      },
      queryKey: [query.searchedTerm],
      enabled: !!value,
    });

  return (
    <div className="w-full min-h-20 py-4 shadow-lg shadow-[#D3D3D3] border-[#D3D3D3] border-b flex md:flex-row flex-col items-center md:justify-between justify-center px-6">
      <div className="md:w-[35%] relative w-full h-full items-center flex md:pr-3">
        <div className="w-full border border-[#D3D3D3] rounded-md flex items-center overflow-hidden">
          <input
            value={searchedTerm}
            onChange={(e) => {
              updateQuery("searchedTerm", e.target.value);
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
        {dropdownOpen && locationSuggestions?.results?.length > 0 && (
          <div className="bg-white p-2 absolute top-14 z-10 left-0 w-full max-w-[510px] rounded-md shadow-md">
            <div className="flex flex-col gap-2">
              {locationSuggestions?.results?.map((suggestion: any) => (
                <div
                  key={suggestion.id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    updateQuery("searchedTerm", suggestion.display);
                    setDropdownOpen(false);
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
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="md:w-[65%] w-full flex items-center flex-wrap gap-3 relative">
        {/* todo commented for now */}
        {/* <Dropdown
          title="Distance"
          items={distance}
          value={filter.distance}
          onChange={(value) => {
            updateQuery("distance", value);
          }}
        /> */}
        <Dropdown
          title="Min Bedrooms"
          items={bedrooms}
          value={filterState.beds.min}
          onChange={(value) => {
            updateQuery("filterState.beds.min", value);
          }}
        />
        <Dropdown
          title="Price"
          items={price}
          value={filterState.price.min}
          onChange={(value) => {
            updateQuery("filterState.price.min", value);
          }}
        />
        <Dropdown
          title="Square Feet"
          items={size}
          value={filterState.sqftMin.min}
          onChange={(value) => {
            updateQuery("filterState.sqftMin.min", value);
          }}
        />
        <Dropdown
          title="Listing Status"
          items={listingStatus}
          value={listingType}
          onChange={(value) => {
            updateQuery("listingType", value);
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
        <input
          name="buildYearMin"
          type="number"
          value={draftYearBuilt.buildYearMin}
          placeholder="Min Year"
          className="w-28 h-9 border border-[#D3D3D3] rounded-md px-4 text-sm"
          onChange={(e) =>
            setDraftYearBuilt((prev) => ({
              ...prev,
              buildYearMin: e.target.value,
            }))
          }
          onBlur={() =>
            updateQuery(
              "filterState.buildYear.min",
              draftYearBuilt.buildYearMin
            )
          }
        />
        <input
          name="buildYearMax"
          type="number"
          value={draftYearBuilt.buildYearMax}
          placeholder="Max Year"
          className="w-28 h-9 border border-[#D3D3D3] rounded-md px-4 text-sm"
          onChange={(e) =>
            setDraftYearBuilt((prev) => ({
              ...prev,
              buildYearMax: e.target.value,
            }))
          }
          onBlur={() =>
            updateQuery(
              "filterState.buildYear.max",
              draftYearBuilt.buildYearMax
            )
          }
        />
        {/* <Dropdown
          title="Year Built Max"
          items={yearBuilt}
          onChange={(value) => {
            setFilter({ ...filter, buildYearMax: value });
          }}
        /> */}
        <div className="flex items-center justify-center md:absolute top-0 right-0">
          <FilterComponent />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
