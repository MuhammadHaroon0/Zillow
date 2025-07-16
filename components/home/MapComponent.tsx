import { usePropertyData } from "@/store/propertyData";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  OverlayView,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useMemo, useRef, useEffect } from "react";

interface Property {
  zpid: string;
  Address: string;
  Price: number;
  LivingArea: number;
  image: string;
  Bedrooms: number;
  Bathrooms: number;
  YearBuilt: number;
  Status: string;
  latitude: number;
  longitude: number;
  dateSold?: string;
  [key: string]: any;
}

<<<<<<< HEAD
export default function GoogleMapComponent({
  showSelectedPropertyOnMap,
}: {
  showSelectedPropertyOnMap: any;
}) {
=======
function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 3958.8; // Earth's radius in miles
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function isWithin8Months(dateSoldStr: string) {
  if (!dateSoldStr) return false;
  const dateSold = new Date(dateSoldStr);
  const now = new Date();
  const monthsDiff =
    (now.getFullYear() - dateSold.getFullYear()) * 12 +
    (now.getMonth() - dateSold.getMonth());
  return monthsDiff <= 8;
}

export default function GoogleMapComponent() {
>>>>>>> fa07cb3474d6e8d758156053873eda90b2363400
  const { propertyData } = usePropertyData();
  const mapRef = useRef<google.maps.Map | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  const center = {
    lat: propertyData[0]?.latitude || 0,
    lng: propertyData[0]?.longitude || 0,
  };

  const [mapCenter, setMapCenter] = useState(center);

  // Update map center when propertyData changes
  useEffect(() => {
    if (showSelectedPropertyOnMap) {
      setMapCenter(showSelectedPropertyOnMap);
    }
  }, [showSelectedPropertyOnMap]);

  useEffect(() => {
    if (propertyData?.[0]?.latitude && propertyData?.[0]?.longitude) {
      const newCenter = {
        lat: searchParams.get("lat")
          ? parseFloat(searchParams.get("lat") || "0")
          : propertyData[0].latitude,
        lng: searchParams.get("lng")
          ? parseFloat(searchParams.get("lng") || "0")
          : propertyData[0].longitude,
      };
      setMapCenter(newCenter);
    }
  }, [propertyData, searchParams]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("lat", mapCenter.lat.toString());
    params.set("lng", mapCenter.lng.toString());
    router.push(`?${params.toString()}`);
  }, [mapCenter, propertyData]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["geometry"],
  });

  const [selected, setSelected] = useState<Property | null>(null);

  // Filter properties based on distance (0.5 mile radius) and sold within last 8 months
  const filteredProperties = useMemo(() => {
<<<<<<< HEAD
    if (!polygon || !propertyData) return propertyData || [];
=======

    if (!propertyData?.nearbyHomes || !mapCenter.lat || !mapCenter.lng) {
      return [];
    }
>>>>>>> fa07cb3474d6e8d758156053873eda90b2363400

    return propertyData?.filter((property: Property) => {
      if (!property.latitude || !property.longitude) return false;

      // Check if property is within 0.5 mile radius
      const distance = haversineDistance(
        mapCenter.lat,
        mapCenter.lng,
        property.latitude,
        property.longitude
      );
<<<<<<< HEAD
    });
  }, [polygon, propertyData]);

  const propertiesToShow =
    filteredProperties.length > 0 ? filteredProperties : propertyData || [];
=======

      if (distance > 0.5) return false;

      // Check if property was sold within last 8 months
      if (property.Status === "RecentlySold" && property.dateSold) {
        // return isWithin8Months(property.dateSold);
      }

      // Include active listings as well
      return true;
    });
  }, [propertyData?.nearbyHomes, mapCenter]);
  console.log(filteredProperties);
>>>>>>> fa07cb3474d6e8d758156053873eda90b2363400

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className="h-full w-full rounded-xl overflow-hidden">
      <GoogleMap
        center={mapCenter}
        zoom={13}
        mapContainerStyle={{ width: "100%", height: "100%" }}
        options={{ disableDefaultUI: true }}
        onLoad={(map) => {
          mapRef.current = map;
        }}
        onDragEnd={() => {
          if (mapRef.current) {
            const newCenter = mapRef.current.getCenter();
            if (newCenter) {
              setMapCenter({
                lat: newCenter.lat(),
                lng: newCenter.lng(),
              });
            }
          }
        }}
      >
        {/* Property markers */}
<<<<<<< HEAD
        {propertiesToShow.map((property: Property, index: number) => (
          <div key={index}>
=======
        {filteredProperties.map((property: Property, index: number) => (
          <div key={property.zpid + `index-${index}`}>
>>>>>>> fa07cb3474d6e8d758156053873eda90b2363400
            <Marker
              position={{ lat: property.latitude, lng: property.longitude }}
              onClick={() => setSelected(property)}
              icon={{
                url: "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2_hdpi.png",
                scaledSize: new window.google.maps.Size(0, 0),
              }}
            />

            <OverlayView
              position={{ lat: property.latitude, lng: property.longitude }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <div
                onMouseEnter={() => setSelected(property)}
                onMouseLeave={() => setSelected(null)}
                className="relative cursor-pointer transform -translate-x-1/2 -translate-y-full w-16"
              >
                <div
<<<<<<< HEAD
                  className={`px-3 py-1.5 w-full ${
                    property.listingStatus === "RECENTLY_SOLD"
                      ? "bg-red-500"
                      : "bg-green-500"
                  } hover:bg-green-400 shadow-md font-bold hover:font-normal text-center transition-all duration-200 relative text-white`}
=======
                  className={`px-3 py-1.5 w-full ${property.Status === "RecentlySold"
                    ? "bg-red-500"
                    : "bg-green-500"
                    } hover:bg-green-400 shadow-md font-bold hover:font-normal text-center transition-all duration-200 relative text-white`}
>>>>>>> fa07cb3474d6e8d758156053873eda90b2363400
                >
                  <span className="text-sm whitespace-nowrap">
                    {property.price
                      ? `$${(property.price / 1000).toFixed(0)}K`
                      : "N/A"}
                  </span>
                </div>
                <div
                  className={`w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-white hover:border-t-[#F6C002] mx-auto`}
                />
              </div>
            </OverlayView>
          </div>
        ))}

        {/* Info Window */}
        {selected && (
          <InfoWindow
            position={{ lat: selected.latitude, lng: selected.longitude }}
            options={{ pixelOffset: new window.google.maps.Size(0, -30) }}
            onCloseClick={() => setSelected(null)}
          >
            <div className={`flex flex-col gap-2 items-center w-40`}>
              <strong className="font-bold text-lg">
                ${selected.price?.toLocaleString() || "N/A"}
              </strong>
              <div className="flex items-center justify-center gap-2 text-gray-500 text-xs">
                {selected.bedrooms || 0} Beds | {selected.bathrooms || 0} Baths
                |{" "}
                {selected.livingArea
                  ? `${selected.livingArea.toLocaleString()} sqft`
                  : "N/A"}
              </div>
              <div className="flex items-center gap-1 text-sm">
                <span className="font-semibold">
                  {selected.listingStatus || "N/A"}
                </span>
                {selected.listingStatus === "RECENTLY_SOLD" &&
                  selected.dateSold && (
                    <span className="text-xs text-gray-500">
                      ({new Date(selected.dateSold).toLocaleDateString()})
                    </span>
                  )}
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}