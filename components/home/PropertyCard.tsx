import { useQuery } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { formatPropertyValue } from "./utils";
import axios from "axios";
import { useState } from "react";
import PageLoader from "../ui/PageLoader";

interface PropertyCardProps {
  property: any;
  selectedState: string[];
  columns: readonly { readonly id: string; readonly label: string }[];
  onClick: () => void;
  setShowSelectedPropertyOnMap: (property: any) => void;
}

const PropertyCard = ({
  property,
  selectedState,
  columns,
  onClick,
  setShowSelectedPropertyOnMap,
}: PropertyCardProps) => {
  const [selectedPropertyZipId, setSelectedPropertyZipId] = useState("");

  const { data: propertyDetail, isLoading } = useQuery({
    queryFn: async () => {
      const res = await axios.get(
        `/api/get-property-detail?zpid=${selectedPropertyZipId}`
      );
      return res.data;
    },
    enabled: !!selectedPropertyZipId,
    queryKey: ["property-detail", selectedPropertyZipId],
  });

  const setLatLng = (property: any) => {
    if (property?.latitude && property?.longitude) {
      setShowSelectedPropertyOnMap({
        lat: Number(property?.latitude),
        lng: Number(property?.longitude),
      });
    }
  };
  return (
    <div
      className="w-fit py-3 border border-[#E5E5E5] rounded-lg my-2 hover:border-black cursor-default"
      onClick={onClick}
    >
      <table className="w-full table-fixed">
        <tbody onClick={() => setLatLng(property)}>
          <tr>
            {selectedState.map((columnId) => (
              <td key={columnId} className="text-sm text-center px-2 py-1 w-26">
                {formatPropertyValue(property, columnId)}
                {columnId === "Status" &&
                  property.Status === "RECENTLY_SOLD" &&
                  property.dateSold && (
                    <span className="text-xs text-gray-400 block">
                      {new Date(property.dateSold).toLocaleDateString()}
                    </span>
                  )}
              </td>
            ))}
            <td className="text-sm text-center px-2 py-1 w-26">
              {propertyDetail?.data ? (
                propertyDetail?.data
              ) : isLoading ? (
                <div className="flex items-center justify-center">
                  <PageLoader width="w-4" height="h-4" />
                </div>
              ) : (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPropertyZipId(property?.zpid);
                  }}
                  variant="outline"
                  className="w-full"
                >
                  View Built Year
                </Button>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PropertyCard;
