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

interface Property {
  Title: string;
  Distance: string;
  Bedrooms: number;
  Price: string;
  Acreage: string;
  Status: string;
  YearBuilt: number;
  Bathrooms: number;
  DateSold?: Date;
  [key: string]: any;
}

const data: Property[] = [
  {
    id: 1,
    lat: 34.0522,
    lng: -118.2437,
    Title: "Modern Family Home with Garden",
    Distance: "0.8 miles",
    Bedrooms: 4,
    Price: "$620,000",
    Acreage: "20 acres",
    SquareFeet: "2,000 sqft",
    Status: "Sold",
    YearBuilt: 2012,
    Bathrooms: 3,
    DateSold: new Date("2024-11-15"),
  },
  {
    id: 2,
    lat: 34.06,
    lng: -118.25,
    Title: "Cozy Downtown Apartment",
    Distance: "1.5 miles",
    Bedrooms: 2,
    Price: "$350,000",
    Acreage: "24 acres",
    SquareFeet: "2,500 sqft",
    Status: "On Sale",
    YearBuilt: 2017,
    Bathrooms: 1,
  },
  {
    id: 3,
    lat: 34.055,
    lng: -118.24,
    Title: "Luxury Condo with Pool Access",
    Distance: "2.3 miles",
    Bedrooms: 3,
    Price: "$780,000",
    Acreage: "26 acres",
    SquareFeet: "2,900 sqft",
    Status: "Sold",
    YearBuilt: 2020,
    Bathrooms: 2,
    DateSold: new Date("2025-03-02"),
  },
  {
    id: 4,
    lat: 34.045,
    lng: -118.245,
    Title: "Spacious Suburban Bungalow",
    Distance: "0.4 miles",
    Bedrooms: 5,
    Price: "$510,000",
    Acreage: "50 acres",
    SquareFeet: "2,800 sqft",
    Status: "On Sale",
    YearBuilt: 2008,
    Bathrooms: 4,
  },
  {
    id: 5,
    lat: 34.048,
    lng: -118.23,
    Title: "Minimalist Smart Apartment",
    Distance: "1.9 miles",
    Bedrooms: 1,
    Price: "$280,000",
    Acreage: "29 acres",
    SquareFeet: "1,000 sqft",
    Status: "On Sale",
    YearBuilt: 2021,
    Bathrooms: 1,
  },
  {
    id: 6,
    lat: 34.038,
    lng: -118.255,
    Title: "Renovated Vintage Flat",
    Distance: "1.1 miles",
    Bedrooms: 2,
    Price: "$420,000",
    Acreage: "67 acres",
    SquareFeet: "2,000 sqft",
    Status: "Sold",
    YearBuilt: 1992,
    Bathrooms: 2,
    DateSold: new Date("2025-01-12"),
  },
  {
    id: 7,
    lat: 34.065,
    lng: -118.225,
    Title: "Studio Loft with Skyline View",
    Distance: "2.0 miles",
    Bedrooms: 1,
    Price: "$310,000",
    Acreage: "25 acres",
    SquareFeet: "2,000 sqft",
    Status: "On Sale",
    YearBuilt: 2019,
    Bathrooms: 1,
  },
  {
    id: 8,
    lat: 34.05,
    lng: -118.22,
    Title: "Smart Home in Green Zone",
    Distance: "0.6 miles",
    Bedrooms: 3,
    Price: "$560,000",
    Acreage: "20 acres",
    SquareFeet: "2,000 sqft",
    Status: "Sold",
    YearBuilt: 2015,
    Bathrooms: 2,
    DateSold: new Date("2024-12-25"),
  },
  {
    id: 9,
    lat: 34.058,
    lng: -118.235,
    Title: "Penthouse with Private Deck",
    Distance: "3.1 miles",
    Bedrooms: 4,
    Price: "$950,000",
    Acreage: "20 acres",
    SquareFeet: "3,000 sqft",
    Status: "On Sale",
    YearBuilt: 2018,
    Bathrooms: 3,
  },
  {
    id: 10,
    lat: 34.042,
    lng: -118.238,
    Title: "Eco-Friendly Modular House",
    Distance: "1.7 miles",
    Bedrooms: 2,
    Price: "$390,000",
    Acreage: "20 acres",
    SquareFeet: "2,000 sqft",
    Status: "On Sale",
    YearBuilt: 2022,
    Bathrooms: 2,
  },
];

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

  const filteredProperties = data.filter((property) =>
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
                <div
                  className={`px-3 py-1.5 w-full ${
                    property.Status === "Sold" ? "bg-[#F6C002]" : "bg-red-500"
                  } hover:bg-green-400 shadow-md font-bold hover:font-normal text-center transition-all duration-200 relative text-white`}
                >
                  <span className="text-sm whitespace-nowrap">
                    {property.Price.replace("$", "").replace(",000", "K")}
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
            <div className={`flex flex-col gap-2 items-center w-40`}>
              <strong className="font-bold text-lg">{selected.Price}</strong>
              <div className="flex items-center justify-center gap-2 text-gray-500 text-xs">
                {selected.Bedrooms} Beds | {selected.Bathrooms} Baths |{" "}
                {selected.SquareFeet}
              </div>
              <div className="flex items-center gap-1 text-sm">
                <span className="font-semibold">{selected.Status}</span>
                {selected.Status === "Sold" && (
                  <span>({selected.DateSold?.toLocaleDateString()})</span>
                )}
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
