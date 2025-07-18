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

function isWithin8Months(dateSoldStr: string) {
  if (!dateSoldStr) return false;
  const dateSold = new Date(dateSoldStr);
  const now = new Date();
  const monthsDiff =
    (now.getFullYear() - dateSold.getFullYear()) * 12 +
    (now.getMonth() - dateSold.getMonth());
  return monthsDiff <= 8;
}

function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) {
  const R = 3958.8;
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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const latStr = searchParams.get("lat");
  const lngStr = searchParams.get("lng");

  if (!latStr || !lngStr) {
    return NextResponse.json(
      { error: "Missing lat/lng parameters" },
      { status: 400 }
    );
  }

  const latitude = parseFloat(latStr);
  const longitude = parseFloat(lngStr);

  if (isNaN(latitude) || isNaN(longitude)) {
    return NextResponse.json(
      { error: "Invalid lat/lng values" },
      { status: 400 }
    );
  }

  const url = process.env.ZILLOW_URL as string;
  const apiKey = process.env.ZILLOW_API_KEY as string;
  if (!url || !apiKey)
    return NextResponse.json(
      { error: "Missing environment variables" },
      { status: 500 }
    );

  try {
    // 1. Generate polygon for 0.5 mile radius
    const polygon = generateCirclePolygon(latitude, longitude, 0.5);

    // 2. Convert polygon to URL-encoded string format (lng lat pairs)
    const polygonString = polygon
      .map((point) => `${point.lng} ${point.lat}`)
      .join(", ");

    // 3. Fetch all properties within this polygon
    const propsResp = await axios.get(url + "/propertyByPolygon", {
      params: {
        polygon: polygonString,
      },
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": "zillow-com1.p.rapidapi.com",
      },
    });

    const props = propsResp.data?.props || propsResp.data || [];

    console.log(props, "props");

    // 3. Filter by dateSold and distance
    const filtered = props?.filter((p: any) => {
      console.log(p.dateSold, "dateSold");
      if (!isWithin8Months(p.dateSold)) return false;
      // if (typeof p.dateSold === "undefined") return true;
      if (haversineDistance(latitude, longitude, p.latitude, p.longitude) > 0.5)
        return false;
      return true;
    });

    return NextResponse.json({ data: filtered }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.response?.data || "Failed to fetch similar properties" },
      { status: 500 }
    );
  }
}
