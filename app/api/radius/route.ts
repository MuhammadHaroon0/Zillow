import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Returns all properties within a specified radius from a given coordinate (lat/lng).
// Used for "sort by distance" or radius filter.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const long = searchParams.get("long");
  const d = searchParams.get("d") || "1"; // Default to 1 mile/km

  if (!lat || !long) {
    return NextResponse.json({ error: "Missing 'lat' or 'long' param" }, { status: 400 });
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
    const response = await axios.get(url + "/propertyByCoordinates", {
      params: { lat, long, d },
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": "zillow-com1.p.rapidapi.com",
      },
    });

    // Return properties found in the radius
    return NextResponse.json({ data: response.data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.response?.data || "Failed to fetch properties by radius" },
      { status: 500 }
    );
  }
}