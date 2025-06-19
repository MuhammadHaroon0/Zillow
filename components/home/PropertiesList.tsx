/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFilterStore } from "@/store/filterStates";
import { useState } from "react";
import GoogleMapComponent from "./MapComponent";
import { FaCaretDown } from "react-icons/fa6";

// Define the column schema
const columns = [
  { id: "Distance", label: "Distance" },
  { id: "Bedrooms", label: "Bedrooms" },
  { id: "Price", label: "Listed For" },
  { id: "SquareFootage", label: "Square Feet" },
  { id: "Status", label: "Listing Status" },
  { id: "YearBuilt", label: "Year Built" },
  { id: "Bathrooms", label: "Bathrooms" },
  { id: "Size", label: "Size" },
] as const;

interface Property {
  Title: string;
  Distance: string;
  Bedrooms: number;
  Price: string;
  SquareFootage: string;
  Status: string;
  YearBuilt: number;
  Bathrooms: number;
  dateSold?: Date;
  [key: string]: any;
}

const data: Property[] = [
  {
    Title: "Modern Family Home with Garden",
    Distance: "0.8 miles",
    Bedrooms: 4,
    Price: "$620,000",
    SquareFootage: "1,800 sqft",
    Size: "2,000 sqft",
    Status: "Sold",
    YearBuilt: 2012,
    Bathrooms: 3,
    dateSold: new Date("2024-11-15"),
  },
  {
    Title: "Cozy Downtown Apartment",
    Distance: "1.5 miles",
    Bedrooms: 2,
    Price: "$350,000",
    SquareFootage: "950 sqft",
    Size: "2,500 sqft",
    Status: "On Sale",
    YearBuilt: 2017,
    Bathrooms: 1,
  },
  {
    Title: "Luxury Condo with Pool Access",
    Distance: "2.3 miles",
    Bedrooms: 3,
    Price: "$780,000",
    SquareFootage: "2,100 sqft",
    Size: "2,900 sqft",
    Status: "Sold",
    YearBuilt: 2020,
    Bathrooms: 2,
    dateSold: new Date("2025-03-02"),
  },
  {
    Title: "Spacious Suburban Bungalow",
    Distance: "0.4 miles",
    Bedrooms: 5,
    Price: "$510,000",
    SquareFootage: "2,400 sqft",
    Size: "2,800 sqft",
    Status: "On Sale",
    YearBuilt: 2008,
    Bathrooms: 4,
  },
  {
    Title: "Minimalist Smart Apartment",
    Distance: "1.9 miles",
    Bedrooms: 1,
    Price: "$280,000",
    SquareFootage: "720 sqft",
    Size: "1,000 sqft",
    Status: "On Sale",
    YearBuilt: 2021,
    Bathrooms: 1,
  },
  {
    Title: "Renovated Vintage Flat",
    Distance: "1.1 miles",
    Bedrooms: 2,
    Price: "$420,000",
    SquareFootage: "1,200 sqft",
    Size: "2,000 sqft",
    Status: "Sold",
    YearBuilt: 1992,
    Bathrooms: 2,
    dateSold: new Date("2025-01-12"),
  },
  {
    Title: "Studio Loft with Skyline View",
    Distance: "2.0 miles",
    Bedrooms: 1,
    Price: "$310,000",
    SquareFootage: "680 sqft",
    Size: "2,000 sqft",
    Status: "On Sale",
    YearBuilt: 2019,
    Bathrooms: 1,
  },
  {
    Title: "Smart Home in Green Zone",
    Distance: "0.6 miles",
    Bedrooms: 3,
    Price: "$560,000",
    SquareFootage: "1,700 sqft",
    Size: "2,000 sqft",
    Status: "Sold",
    YearBuilt: 2015,
    Bathrooms: 2,
    dateSold: new Date("2024-12-25"),
  },
  {
    Title: "Penthouse with Private Deck",
    Distance: "3.1 miles",
    Bedrooms: 4,
    Price: "$950,000",
    SquareFootage: "2,800 sqft",
    Size: "3,000 sqft",
    Status: "On Sale",
    YearBuilt: 2018,
    Bathrooms: 3,
  },
  {
    Title: "Eco-Friendly Modular House",
    Distance: "1.7 miles",
    Bedrooms: 2,
    Price: "$390,000",
    SquareFootage: "1,000 sqft",
    Size: "2,000 sqft",
    Status: "On Sale",
    YearBuilt: 2022,
    Bathrooms: 2,
  },
];

const PropertiesList = () => {
  const selectedState = useFilterStore((state) => state.selectedState);
  const [selectedProperty, setSelectedProperty] = useState<Property>(data[0]);

  const [sortField, setSortField] = useState("Distance");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const sortedData = [...data].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];

    // Custom logic for Status
    if (sortField === "Status") {
      const rank = (status: string) => (status === "Sold" ? 0 : 1); // 0 = Sold, 1 = On Sale

      const rankA = rank(String(aVal));
      const rankB = rank(String(bVal));

      // First sort by status rank (Sold vs On Sale)
      if (rankA !== rankB) {
        return sortDirection === "asc" ? rankA - rankB : rankB - rankA;
      }

      // If both are Sold, sort by dateSold
      if (rankA === 0 && rankB === 0) {
        const dateA = a.dateSold ? new Date(a.dateSold).getTime() : 0;
        const dateB = b.dateSold ? new Date(b.dateSold).getTime() : 0;
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      }
      return 0; // Both are On Sale
    }
    // Generic sorting logic
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
    <div className="w-full flex md:flex-row flex-col md:gap-0 gap-4 md:px-6 px-2 py-4">
      <div className="md:w-[40%] w-full md:h-[82vh] h-[400px] overflow-hidden rounded-xl">
        <GoogleMapComponent />
      </div>
      <div className="md:w-[60%] w-full md:h-[82vh] h-[65vh] pb-4">
        {/* Selected Property Details */}
        <div className="w-full flex flex-col mb-4 md:px-2 px-1 h-[25%] border-b-2 border-[#E5E5E5] overflow-x-auto scrollbar-hide">
          <div className="w-full flex items-center justify-between min-w-[300px]">
            <h3 className="text-lg font-semibold">{selectedProperty.Title}</h3>
            <h3 className="text-lg font-semibold">{selectedProperty.Price}</h3>
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
                      className="text-sm text-center text-gray-500 px-2 py-1 "
                    >
                      {selectedProperty[columnId]}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Property List */}
        <div className="w-full flex flex-col items-center overflow-scroll scrollbar-hide h-[75%] md:px-2 px-1">
          <div className="w-full">
            <table className="w-full table-fixed">
              <thead>
                <tr>
                  {selectedState.map((columnId) => (
                    <th
                      key={columnId}
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
                </tr>
              </thead>
            </table>
          </div>
          <div className="w-full h-full">
            {sortedData.map((property, index) => (
              <div
                key={index}
                className="w-fit py-3 border border-[#E5E5E5] rounded-lg my-2 hover:border-black cursor-default"
                onClick={() => setSelectedProperty(property)}
              >
                <table className="w-full table-fixed">
                  <tbody>
                    <tr>
                      {selectedState.map((columnId) => (
                        <td
                          key={columnId}
                          className="text-sm text-center px-2 py-1 w-26"
                        >
                          {columnId === "Status" ? (
                            <div className="flex flex-col items-center justify-center">
                              <span>{property.Status}</span>
                              {property.Status === "Sold" &&
                                property.dateSold && (
                                  <span className="text-xs text-gray-400">
                                    {new Date(
                                      property.dateSold
                                    ).toLocaleDateString()}
                                  </span>
                                )}
                            </div>
                          ) : (
                            property[columnId]
                          )}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesList;
