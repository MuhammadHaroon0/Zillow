import { useFilterStore } from "@/store/filterStates";
import { useState } from "react";
import GoogleMapComponent from "./MapComponent";

// Define the column schema
const columns = [
  { id: "Distance", label: "Distance" },
  { id: "Bedrooms", label: "Bedrooms" },
  { id: "Price", label: "Listed For" },
  { id: "SquareFootage", label: "Square Feet" },
  { id: "Status", label: "Listing Status" },
  { id: "YearBuilt", label: "Year Built" },
  { id: "Bathrooms", label: "Bathrooms" },
] as const;

interface Property {
  title: string;
  [key: string]: string | number;
}

// Dummy data
const data: Property[] = [
  {
    title: "Fully Furnished Smart Studio Apartment",
    Distance: "1.2 km",
    Bedrooms: 3,
    Price: "$450,000",
    SquareFootage: "1,500 sqft",
    Status: "For Sale",
    YearBuilt: 1995,
    Bathrooms: 2,
  },
  {
    title: "Property 2",
    Distance: "0.5 km",
    Bedrooms: 2,
    Price: "$300,000",
    SquareFootage: "1,200 sqft",
    Status: "For Sale",
    YearBuilt: 2000,
    Bathrooms: 1,
  },
  {
    title: "Property 3",
    Distance: "0.5 km",
    Bedrooms: 2,
    Price: "$300,000",
    SquareFootage: "1,200 sqft",
    Status: "For Sale",
    YearBuilt: 2000,
    Bathrooms: 1,
  },
  {
    title: "Property 4",
    Distance: "0.5 km",
    Bedrooms: 2,
    Price: "$300,000",
    SquareFootage: "1,200 sqft",
    Status: "For Sale",
    YearBuilt: 2000,
    Bathrooms: 1,
  },
  {
    title: "Property 5",
    Distance: "0.5 km",
    Bedrooms: 2,
    Price: "$300,000",
    SquareFootage: "1,200 sqft",
    Status: "For Sale",
    YearBuilt: 2000,
    Bathrooms: 1,
  },
  {
    title: "Property 6",
    Distance: "0.5 km",
    Bedrooms: 2,
    Price: "$300,000",
    SquareFootage: "1,200 sqft",
    Status: "For Sale",
    YearBuilt: 2000,
    Bathrooms: 1,
  },
  {
    title: "Property 7",
    Distance: "0.5 km",
    Bedrooms: 2,
    Price: "$300,000",
    SquareFootage: "1,200 sqft",
    Status: "For Sale",
    YearBuilt: 2000,
    Bathrooms: 1,
  },
  {
    title: "Property 2",
    Distance: "0.5 km",
    Bedrooms: 2,
    Price: "$300,000",
    SquareFootage: "1,200 sqft",
    Status: "For Sale",
    YearBuilt: 2000,
    Bathrooms: 1,
  },
  {
    title: "Property 3",
    Distance: "0.5 km",
    Bedrooms: 2,
    Price: "$300,000",
    SquareFootage: "1,200 sqft",
    Status: "For Sale",
    YearBuilt: 2000,
    Bathrooms: 1,
  },
  {
    title: "Property 4",
    Distance: "0.5 km",
    Bedrooms: 2,
    Price: "$300,000",
    SquareFootage: "1,200 sqft",
    Status: "For Sale",
    YearBuilt: 2000,
    Bathrooms: 1,
  },
  {
    title: "Property 5",
    Distance: "0.5 km",
    Bedrooms: 2,
    Price: "$300,000",
    SquareFootage: "1,200 sqft",
    Status: "For Sale",
    YearBuilt: 2000,
    Bathrooms: 1,
  },
  {
    title: "Property 6",
    Distance: "0.5 km",
    Bedrooms: 2,
    Price: "$300,000",
    SquareFootage: "1,200 sqft",
    Status: "For Sale",
    YearBuilt: 2000,
    Bathrooms: 1,
  },
  {
    title: "Property 7",
    Distance: "0.5 km",
    Bedrooms: 2,
    Price: "$300,000",
    SquareFootage: "1,200 sqft",
    Status: "For Sale",
    YearBuilt: 2000,
    Bathrooms: 1,
  },
];

const PropertiesList = () => {
  const selectedState = useFilterStore((state) => state.selectedState);
  const [selectedProperty, setSelectedProperty] = useState<Property>(data[0]);

  return (
    <div className="w-full flex md:flex-row flex-col px-6 py-4">
      <div className="md:w-[40%] w-full md:h-[82vh] h-[400px] overflow-hidden rounded-xl">
        <GoogleMapComponent />
      </div>
      <div className="md:w-[60%] w-full md:h-[82vh] h-[65vh]">
        {/* Selected Property Details */}
        <div className="w-full flex flex-col mb-4 mx-2 h-[20%] border-b border-[#E5E5E5]">
          <div className="w-full flex items-center justify-between">
            <h3 className="text-lg font-semibold">{selectedProperty.title}</h3>
            <h3 className="text-lg font-semibold">{selectedProperty.Price}</h3>
          </div>
          <div className="w-full flex items-center justify-center mt-2 mb-4">
            <table className="w-full table-fixed">
              <thead>
                <tr>
                  {selectedState.map((columnId) => (
                    <th
                      key={columnId}
                      className="text-sm text-black font-medium text-center px-2 py-1"
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
                      className="text-sm text-center text-gray-500 px-2 py-1"
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
        <div className="w-full items-center justify-center px-2 overflow-y-scroll h-[80%]">
          {data.map((property, index) => (
            <div
              key={index}
              className="w-full py-3 border border-[#E5E5E5] rounded-lg my-2 hover:border-black cursor-default"
              onClick={() => setSelectedProperty(property)}
            >
              <table className="w-full table-fixed">
                <thead>
                  <tr>
                    {selectedState.map((columnId) => (
                      <th
                        key={columnId}
                        className="text-sm text-gray-500 font-normal text-center px-2 py-1"
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
                        className="text-sm text-center px-2 py-1"
                      >
                        {property[columnId]}
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
  );
};

export default PropertiesList;
