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
    case "Distance":
      return value;
    case "Status":
      if (value === "RECENTLY_SOLD") {
        return `Sold`;
      } else if (value === "FOR_SALE") {
        return `For Sale`;
      } else if (value === "FOR_RENT") {
        return `For Rent`;
      } else if (value === "PENDING") {
        return `Pending`;
      }
      return value ? value?.replace("_", " ") : "N/A";
    default:
      return value;
  }
};

export const columns = [
  { id: "Bedrooms", label: "Bedrooms" },
  { id: "Price", label: "Price(Listed/Sold)" },
  { id: "LivingArea", label: "Square Feet" },
  { id: "Bathrooms", label: "Bathrooms" },
  { id: "Status", label: "Status(On Sale/Sold)" },
  { id: "Address", label: "Address" },
  { id: "Distance", label: "Distance" },
] as const;
