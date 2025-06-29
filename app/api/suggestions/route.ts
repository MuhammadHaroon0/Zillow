import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Next.js API route for "search as you type" location suggestions. 
// Proxies requests to the Zillow /locationSuggestions API using credentials in env.
// Frontend should call this endpoint with a `q` query parameter as the user types in the search box.

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Missing 'q' param" }, { status: 400 });
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
    const response = await axios.get(url + "/locationSuggestions", {
      params: { q: query },
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": "zillow-com1.p.rapidapi.com",
      },
    });

    // Return raw data, or process if you want to limit fields
    return NextResponse.json({ data: response.data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.response?.data || "Failed to fetch location suggestions" },
      { status: 500 }
    );
  }
}
