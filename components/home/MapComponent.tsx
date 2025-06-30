import { usePropertyData } from "@/store/propertyData";
import {
  GoogleMap,
  Marker,
  Polygon,
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

export default function GoogleMapComponent({
  showSelectedPropertyOnMap,
}: {
  showSelectedPropertyOnMap: any;
}) {
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

  const polygonCoords = useMemo(() => {
    if (!mapCenter.lat || !mapCenter.lng) return [];

    return Array.from({ length: 36 }, (_, i) => {
      const angle = (i / 36) * 2 * Math.PI;
      const latOffset = 0.02 * Math.sin(angle) * (1 + 0.3 * Math.cos(angle));
      const lngOffset = 0.015 * Math.cos(angle);
      return {
        lat: mapCenter.lat + latOffset,
        lng: mapCenter.lng + lngOffset,
      };
    });
  }, [mapCenter]);

  const polygon = useMemo(() => {
    if (!isLoaded) return null;
    return new window.google.maps.Polygon({ paths: polygonCoords });
  }, [polygonCoords, isLoaded]);

  const filteredProperties = useMemo(() => {
    if (!polygon || !propertyData) return propertyData || [];

    return propertyData?.filter((property: Property) => {
      if (!property.latitude || !property.longitude) return false;

      return window.google.maps.geometry.poly.containsLocation(
        new window.google.maps.LatLng(property.latitude, property.longitude),
        polygon
      );
    });
  }, [polygon, propertyData]);

  console.log(showSelectedPropertyOnMap);

  const propertiesToShow =
    filteredProperties.length > 0 ? filteredProperties : propertyData || [];

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
        {/* Egg-shaped polygon */}
        <Polygon
          paths={polygonCoords}
          options={{
            fillColor: "#3B82F6",
            fillOpacity: 0.1,
            strokeColor: "#3B82F6",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            clickable: false,
            zIndex: 100,
          }}
        />

        {/* Property markers */}
        {propertiesToShow.map((property: Property) => (
          <div key={property.zpid}>
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
                  className={`px-3 py-1.5 w-full ${
                    property.listingStatus === "RECENTLY_SOLD"
                      ? "bg-red-500"
                      : "bg-green-500"
                  } hover:bg-green-400 shadow-md font-bold hover:font-normal text-center transition-all duration-200 relative text-white`}
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
