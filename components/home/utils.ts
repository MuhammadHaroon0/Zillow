export const formatAddress = (address: any) => {
  if (typeof address === "string") return address;
  if (address && typeof address === "object") {
    return `${address.streetAddress || ""}, ${address.city || ""}, ${
      address.state || ""
    } ${address.zipcode || ""}`.trim();
  }
};

export const formatPropertyValue = (property: any, columnId: string) => {
  const value = property?.[columnId];
  switch (columnId) {
    case "address":
      return formatAddress(value);
    case "bedrooms":
      return value ? `${value.toLocaleString()}` : "N/A";
    case "livingArea":
      return value ? `${value.toLocaleString()} sqft` : "N/A";
    case "bathrooms":
      return value ? value.toString() : "N/A";
    case "homeStatus":
      return value ? value.toString() : "N/A";
    case "price":
      return value ? `$${value.toLocaleString()}` : "N/A";
    case "listingStatus":
      if (value === "RECENTLY_SOLD") {
        return `Sold`;
      } else if (value === "FOR_SALE") {
        return `For Sale`;
      } else if (value === "FOR_RENT") {
        return `For Rent`;
      } else if (value === "PENDING") {
        return `Pending`;
      } else if (value === "RecentlySold") {
        return `Sold`;
      } else if (value === "OTHER") {
        return `Other`;
      }
      return value ? value?.replace("_", " ") : "N/A";

    default:
      return value;
  }
};

export const columns = [
  { id: "bedrooms", label: "Bedrooms" },
  { id: "price", label: "Price(Listed/Sold)" },
  { id: "livingArea", label: "Square Feet" },
  { id: "bathrooms", label: "Bathrooms" },
  { id: "listingStatus", label: "Status(On Sale/Sold)" },
  { id: "address", label: "Address" },
  { id: "Distance", label: "Distance" },
] as const;
