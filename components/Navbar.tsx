import { useState } from "react";
import { Dropdown } from "./DropDown";
import { FilterComponent } from "./FilterComponent";
import { IoIosSearch } from "react-icons/io";

const Navbar = () => {
  const [searchedTerm, setSearchedTerm] = useState("");
  return (
    <div className="w-full min-h-20 py-4 shadow-lg shadow-[#D3D3D3] border-[#D3D3D3] border-b flex md:flex-row flex-col items-center md:justify-between justify-center md:gap-0 gap-4 px-6">
      <div className="md:w-[40%] w-full h-full items-center flex md:pr-3">
        <div className="w-full border border-[#D3D3D3] rounded-md flex items-center overflow-hidden">
          <input
            value={searchedTerm}
            onChange={(e) => {
              setSearchedTerm(e.target.value);
            }}
            type="text"
            className="w-full h-12 px-4"
          />
          <div className="w-16 h-12 bg-blue-500 flex items-center justify-center">
            <IoIosSearch className="text-2xl text-white" />
          </div>
        </div>
      </div>
      <div className="md:w-[60%] w-full flex items-center flex-wrap gap-3 relative">
        <Dropdown
          title="Distance"
          items={["2.1 miles", "2.2 miles", "2.3 miles", "2.4 miles"]}
        />
        <Dropdown title="Bedrooms" items={["2", "3", "4", "5"]} />
        <Dropdown title="Price" items={["$2000", "$3000", "$4000", "$5000"]} />
        <Dropdown
          title="Size"
          items={[
            "850 Sq. Ft.",
            "3000 Sq. Ft.",
            "4000 Sq. Ft.",
            "5000 Sq. Ft.",
          ]}
        />
        <Dropdown title="Listing Status" items={["On Sale", "Sold"]} />
        <div className="flex items-center justify-center md:absolute top-0 right-0">
          <FilterComponent />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
