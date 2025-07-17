import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

function generateCirclePolygon(
  centerLat: number,
  centerLng: number,
  radiusMiles: number,
  numPoints: number = 20
) {
  const earthRadius = 3958.8; // miles
  const points = [];
  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * 2 * Math.PI;
    const dx = radiusMiles * Math.cos(angle);
    const dy = radiusMiles * Math.sin(angle);
    const dLat = (dy / earthRadius) * (180 / Math.PI);
    const dLng =
      (dx / (earthRadius * Math.cos((centerLat * Math.PI) / 180))) *
      (180 / Math.PI);
    points.push({
      lat: centerLat + dLat,
      lng: centerLng + dLng,
    });
  }
  points.push(points[0]);
  return points;
}

// Returns all properties within a specified radius from a given coordinate (lat/lng).
// Used for "sort by distance" or radius filter.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const latStr = searchParams.get("lat");
  const lngStr = searchParams.get("lng");
  const radiusStr = searchParams.get("radius") || "1"; // miles

  if (!latStr || !lngStr) {
    return NextResponse.json(
      { error: "Missing 'lat' or 'lng' param" },
      { status: 400 }
    );
  }

  const latitude = parseFloat(latStr);
  const longitude = parseFloat(lngStr);
  const radius = parseFloat(radiusStr);

  if (isNaN(latitude) || isNaN(longitude) || isNaN(radius)) {
    return NextResponse.json(
      { error: "Invalid lat/lng/radius values" },
      { status: 400 }
    );
  }

  const url = process.env.ZILLOW_URL as string;
  const apiKey = process.env.ZILLOW_API_KEY as string;

  if (!url || !apiKey) {
    return NextResponse.json(
      { error: "Missing environment variables" },
      { status: 500 }
    );
  }

  try {
    const polygon = generateCirclePolygon(latitude, longitude, radius);

    const polygonString = polygon
      .map((point) => `${point.lng} ${point.lat}`)
      .join(", ");

    const response = await axios.get(url + "/propertyByPolygon", {
      params: {
        polygon: polygonString,
      },
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": "zillow-com1.p.rapidapi.com",
      },
    });

    return NextResponse.json({ data: response.data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.response?.data || "Failed to fetch properties by radius",
      },
      { status: 500 }
    );
  }
}
