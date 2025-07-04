import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Main API route for property search and filtering.
// Forwards query params to Zillow's /propertyExtendedSearch API.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const params: Record<string, string> = {};

  // Required: location
  const location = searchParams.get("location");
  if (!location) {
    return NextResponse.json(
      { error: "Missing 'location' param" },
      { status: 400 }
    );
  }
  params["location"] = location;

  // Optional filters
  const possibleParams = [
    "status_type",
    "home_type",
    "minPrice",
    "maxPrice",
    "bedsMin",
    "bedsMax",
    "bathsMin",
    "bathsMax",
    "sqftMin",
    "sqftMax",
    "buildYearMin",
    "buildYearMax",
    // add more as needed
  ];
  for (const key of possibleParams) {
    const val = searchParams.get(key);
    if (val) params[key] = val;
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
    const response = await axios.get(url + "/propertyExtendedSearch", {
      params,
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": "zillow-com1.p.rapidapi.com",
      },
    });

    // Return the property search results
    return NextResponse.json({ data: response.data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.response?.data || "Failed to fetch properties" },
      { status: 500 }
    );
  }
}
