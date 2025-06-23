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

const Navbar = () => {
  const [searchedTerm, setSearchedTerm] = useState("vancover");

  const [filter, setFilter] = useState({
    distance: "2.1",
    bedrooms: "2",
    price: "50000",
    size: "1000",
    listingStatus: "ForSale",
    buildYearMin: "2000",
    buildYearMax: "2025",
    lotSize: "10,890",
  });

  const [draftYearBuilt, setDraftYearBuilt] = useState({
    buildYearMin: filter.buildYearMin,
    buildYearMax: filter.buildYearMax,
  });
  const router = useRouter();

  const handleSearch = () => {
    router.push(
      `?searchedTerm=${searchedTerm}&listingStatus=${filter.listingStatus}&bedsMin=${filter.bedrooms}&priceMin=${filter.price}&sqftMin=${filter.size}&buildYearMin=${filter.buildYearMin}&buildYearMax=${filter.buildYearMax}&lotSize=${filter.lotSize}`
    );
    queryClient.invalidateQueries({ queryKey: ["zillow"] });
  };

  useEffect(() => {
    router.push(
      `?searchedTerm=${searchedTerm}&listingStatus=${filter.listingStatus}&bedsMin=${filter.bedrooms}&priceMin=${filter.price}&sqftMin=${filter.size}&buildYearMin=${filter.buildYearMin}&buildYearMax=${filter.buildYearMax}&lotSize=${filter.lotSize}`
    );
    queryClient.invalidateQueries({ queryKey: ["zillow"] });
  }, [filter]);

  return (
    <div className="w-full min-h-20 py-4 shadow-lg shadow-[#D3D3D3] border-[#D3D3D3] border-b flex md:flex-row flex-col items-center md:justify-between justify-center px-6">
      <div className="md:w-[35%] w-full h-full items-center flex md:pr-3">
        <div className="w-full border border-[#D3D3D3] rounded-md flex items-center overflow-hidden">
          <input
            value={searchedTerm}
            onChange={(e) => {
              setSearchedTerm(e.target.value);
            }}
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
      </div>
      <div className="md:w-[65%] w-full flex items-center flex-wrap gap-3 relative">
        <Dropdown
          title="Distance"
          items={distance}
          onChange={(value) => {
            setFilter({ ...filter, distance: value });
          }}
        />
        <Dropdown
          title="Bedrooms"
          items={bedrooms}
          onChange={(value) => {
            setFilter({ ...filter, bedrooms: value });
          }}
        />
        <Dropdown
          title="Price"
          items={price}
          onChange={(value) => {
            setFilter({ ...filter, price: value });
          }}
        />
        <Dropdown
          title="Square Feet"
          items={size}
          onChange={(value) => {
            setFilter({ ...filter, size: value });
          }}
        />
        <Dropdown
          title="Listing Status"
          items={listingStatus}
          onChange={(value) => {
            setFilter({ ...filter, listingStatus: value });
          }}
        />
        <Dropdown
          title="Acreage"
          items={acreage}
          onChange={(value) => {
            setFilter({ ...filter, lotSize: value });
          }}
        />
        {/* <Dropdown
          title="Year Built Min"
          items={yearBuilt}
          onChange={(value) => {
            setFilter({ ...filter, buildYearMin: value });
          }}
        /> */}
        <input
          name="buildYearMin"
          type="number"
          value={draftYearBuilt.buildYearMin}
          className="w-28 h-9 border border-[#D3D3D3] rounded-md px-4 text-sm"
          onChange={(e) =>
            setDraftYearBuilt((prev) => ({
              ...prev,
              buildYearMin: e.target.value,
            }))
          }
          onBlur={() =>
            setFilter((prev) => ({
              ...prev,
              buildYearMin: draftYearBuilt.buildYearMin,
            }))
          }
        />
        <input
          name="buildYearMax"
          type="number"
          value={draftYearBuilt.buildYearMax}
          className="w-28 h-9 border border-[#D3D3D3] rounded-md px-4 text-sm"
          onChange={(e) =>
            setDraftYearBuilt((prev) => ({
              ...prev,
              buildYearMax: e.target.value,
            }))
          }
          onBlur={() =>
            setFilter((prev) => ({
              ...prev,
              buildYearMax: draftYearBuilt.buildYearMax,
            }))
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
