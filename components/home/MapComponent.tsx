import {
  GoogleMap,
  Marker,
  Polygon,
  InfoWindow,
  OverlayView,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useState, useMemo } from "react";

const center = { lat: 34.0522, lng: -118.2437 };

const allProperties = [
  {
    id: 1,
    lat: 34.0522,
    lng: -118.2437,
    price: "$720,000",
    beds: 4,
    baths: 4,
    status: "On Sale",
  },
  {
    id: 2,
    lat: 34.06,
    lng: -118.25,
    price: "$407,000",
    beds: 3,
    baths: 2,
    status: "Sold",
  },
  {
    id: 3,
    lat: 34.055,
    lng: -118.24,
    price: "$510,000",
    beds: 2,
    baths: 2,
    status: "On Sale",
  },
  {
    id: 4,
    lat: 34.045,
    lng: -118.245,
    price: "$685,000",
    beds: 3,
    baths: 3,
    status: "Pending",
  },
  {
    id: 5,
    lat: 34.048,
    lng: -118.23,
    price: "$430,000",
    beds: 2,
    baths: 1,
    status: "Sold",
  },
  {
    id: 6,
    lat: 34.038,
    lng: -118.255,
    price: "$800,000",
    beds: 4,
    baths: 3,
    status: "On Sale",
  },
  {
    id: 7,
    lat: 34.065,
    lng: -118.225,
    price: "$720,000",
    beds: 5,
    baths: 4,
    status: "New Listing",
  },
];

type Property = {
  id: number;
  lat: number;
  lng: number;
  price: string;
  beds: number;
  baths: number;
  status: string;
};

export default function GoogleMapComponent() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["geometry"],
  });

  const [selected, setSelected] = useState<Property | null>(null);

  const polygonCoords = useMemo(() => {
    return Array.from({ length: 36 }, (_, i) => {
      const angle = (i / 36) * 2 * Math.PI;
      const latOffset = 0.02 * Math.sin(angle) * (1 + 0.3 * Math.cos(angle));
      const lngOffset = 0.015 * Math.cos(angle);
      return {
        lat: center.lat + latOffset,
        lng: center.lng + lngOffset,
      };
    });
  }, []);

  if (!isLoaded) return <div>Loading map...</div>;

  // ✅ Filter properties that are inside the polygon
  const polygon = new window.google.maps.Polygon({ paths: polygonCoords });

  const filteredProperties = allProperties.filter((property) =>
    window.google.maps.geometry.poly.containsLocation(
      new window.google.maps.LatLng(property.lat, property.lng),
      polygon
    )
  );

  return (
    <div className="h-full w-full rounded-xl overflow-hidden">
      <GoogleMap
        center={center}
        zoom={13}
        mapContainerStyle={{ width: "100%", height: "100%" }}
        options={{ disableDefaultUI: true }}
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

        {/* Filtered property markers */}
        {filteredProperties.map((property) => (
          <div key={property.id}>
            <Marker
              position={{ lat: property.lat, lng: property.lng }}
              onClick={() => setSelected(property)}
              icon={{
                url: "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2_hdpi.png",
                scaledSize: new window.google.maps.Size(0, 0), // Hide default icon
              }}
            />

            <OverlayView
              position={{ lat: property.lat, lng: property.lng }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <div
                onMouseEnter={() => setSelected(property)}
                onMouseLeave={() => setSelected(null)}
                className="relative cursor-pointer transform -translate-x-1/2 -translate-y-full w-16"
              >
                <div className="px-3 py-1.5 w-full bg-white hover:bg-[#F6C002] shadow-md font-bold hover:font-normal text-center transition-all duration-200 relative">
                  <span className="text-sm text-gray-800 whitespace-nowrap">
                    {property.price.replace("$", "").replace(",000", "K")}
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
            position={{ lat: selected.lat, lng: selected.lng }}
            options={{ pixelOffset: new window.google.maps.Size(0, -30) }}
            onCloseClick={() => setSelected(null)}
          >
            <div className="text-sm flex flex-col gap-2 items-center w-32">
              <strong className="font-bold text-lg">{selected.price}</strong>
              <div className="flex items-center justify-center gap-2 text-gray-500">
                {selected.beds} Beds | {selected.baths} Baths
              </div>
              <span className="font-semibold">{selected.status}</span>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
