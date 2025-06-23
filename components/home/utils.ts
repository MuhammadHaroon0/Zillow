export const formatAddress = (address: any) => {
  if (typeof address === "string") return address;
  if (address && typeof address === "object") {
    return `${address.streetAddress || ""}, ${address.city || ""}, ${
      address.state || ""
    } ${address.zipcode || ""}`.trim();
  }
};

export const formatPropertyValue = (property: any, columnId: string) => {
  const value = property[columnId];
  console.log(property["Price"]);
  switch (columnId) {
    case "Address":
      return formatAddress(value);
    case "Price":
      return value ? `$${value.toLocaleString()}` : "N/A";
    case "LivingArea":
      return value ? `${value.toLocaleString()} sqft` : "N/A";
    case "Bedrooms":
      return value ? value.toString() : "N/A";
    case "Bathrooms":
      return value ? value.toString() : "N/A";
    case "Status":
      return value ? value?.replace("_", " ") : "N/A";
    default:
      return value;
  }
};

export const columns = [
  { id: "Bedrooms", label: "Bedrooms" },
  { id: "Price", label: "Listed For" },
  { id: "LivingArea", label: "Square Feet" },
  { id: "Bathrooms", label: "Bathrooms" },
  // { id: "YearBuilt", label: "Year Built" },
  { id: "Status", label: "Status" },
  { id: "Address", label: "Address" },
] as const;
