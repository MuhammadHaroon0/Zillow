"use client";

import { useState } from "react";
import PropertyCard from "./PropertyCard";
import { columns } from "./utils";
import { FaCaretDown } from "react-icons/fa";

interface PropertyListProps {
  properties: any[];
  selectedState: string[];
  onPropertySelect: (property: any) => void;
  setShowSelectedPropertyOnMap: (property: any) => void;
}

const PropertyList = ({
  properties,
  selectedState,
  onPropertySelect,
  setShowSelectedPropertyOnMap,
}: PropertyListProps) => {
  const [sortField, setSortField] = useState("Distance");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const sortedData = [...properties]?.sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];

    if (sortField === "Status") {
      const rank = (status: string) => (status === "Sold" ? 0 : 1);

      const rankA = rank(String(aVal));
      const rankB = rank(String(bVal));

      // First sort by status rank (Sold vs On Sale)
      if (rankA !== rankB) {
        return sortDirection === "asc" ? rankA - rankB : rankB - rankA;
      }

      if (rankA === 0 && rankB === 0) {
        const dateA = a.dateSold ? new Date(a.dateSold).getTime() : 0;
        const dateB = b.dateSold ? new Date(b.dateSold).getTime() : 0;
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      }

      return 0;
    }

    const parseValue = (val: string | number) => {
      if (typeof val === "number") return val;
      if (typeof val === "string") {
        const num = parseFloat(val.replace(/[^\d.]/g, ""));
        return isNaN(num) ? val.toLowerCase() : num;
      }
      return val;
    };

    const valA = parseValue(aVal);
    const valB = parseValue(bVal);

    if (valA < valB) return sortDirection === "asc" ? -1 : 1;
    if (valA > valB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (columnId: string) => {
    if (sortField === columnId) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(columnId);
      setSortDirection("asc");
    }
  };

  return (
    <div className="w-full flex flex-col items-center overflow-scroll scrollbar-hide h-[75%] md:px-2 px-1">
      <div className="w-full">
        <table className="w-full table-fixed">
          <thead>
            <tr>
              {selectedState?.map((columnId, index) => (
                <th
                  key={columnId + `index-${index}`}
                  className="text-sm text-black font-medium text-center w-26"
                >
                  <div
                    className="w-full h-full flex items-center justify-center px-2 py-1 cursor-pointer"
                    onClick={() => handleSort(columnId)}
                  >
                    {columns.find((col) => col.id === columnId)?.label}

                    <FaCaretDown
                      className={`ml-1 transition-transform duration-200 ${
                        sortField === columnId && sortDirection === "desc"
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </div>
                </th>
              ))}
              <th className="text-sm text-black font-medium text-center w-26">
                View Built Year
              </th>
            </tr>
          </thead>
        </table>
      </div>
      <div className="w-full h-full">
        {sortedData?.map((property: any, index: number) => (
          <PropertyCard
            key={property.zpid + `index-${index}`}
            property={property}
            selectedState={selectedState}
            columns={columns}
            onClick={() => onPropertySelect(property)}
            setShowSelectedPropertyOnMap={setShowSelectedPropertyOnMap}
          />
        ))}
      </div>
    </div>
  );
};

export default PropertyList;
