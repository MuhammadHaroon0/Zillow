"use client";

import { useState } from "react";
import { formatAddress, formatPropertyValue } from "./utils";

interface SelectedPropertyDetailsProps {
  selectedProperty: any;
  selectedState: string[];
  columns: readonly { readonly id: string; readonly label: string }[];
}

const SelectedPropertyDetails = ({
  selectedProperty,
  selectedState,
  columns,
}: SelectedPropertyDetailsProps) => {
  return (
    <div className="w-full flex flex-col mb-4 md:px-2 px-1  border-b-2 border-[#E5E5E5] overflow-x-auto scrollbar-hide">
      <div className="w-full flex items-center justify-between min-w-[300px]">
        <h3 className="text-lg font-semibold">
          {formatAddress(selectedProperty?.address)}
        </h3>
        <h3 className="text-lg font-semibold">
          {formatPropertyValue(selectedProperty, "price")}
        </h3>
      </div>
      <div className="w-full mt-2 mb-4 overflow-x-auto scrollbar-hide">
        <table className="min-w-full table-fixed">
          <thead>
            <tr>
              {selectedState.map((columnId) => (
                <th
                  key={columnId}
                  className="text-sm text-black font-medium text-center px-2 py-1 text-nowrap"
                >
                  {columns.find((col) => col.id === columnId)?.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {selectedState.map((columnId) => (
                <td
                  key={columnId}
                  className="text-sm text-center w-26 text-gray-500 px-2 py-1"
                >
                  {formatPropertyValue(selectedProperty, columnId)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SelectedPropertyDetails;
