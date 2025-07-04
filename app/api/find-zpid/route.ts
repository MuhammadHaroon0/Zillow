import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Given a user-selected address, search Zillow for the matching property and return its zpid.
// The frontend calls this when a user selects from autocomplete suggestions.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json(
      { error: "Missing 'address' param" },
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
    const response = await axios.get(
      url + "/propertyExtendedSearch" + "?location=" + address,
      {
        // params: { location: address },
        headers: {
          "x-rapidapi-key": apiKey,
          "x-rapidapi-host": "zillow-com1.p.rapidapi.com",
        },
      }
    );

    const zpid = response?.data?.zpid;

    if (zpid) {
      return NextResponse.json({ zpid }, { status: 200 });
    }

    // Try to find the best match (usually the first result)
    const props = response.data?.props;
    if (props && props.length > 0) {
      // Return zpid and summary fields for main card if needed
      const main = props[0];
      return NextResponse.json(
        { zpid: main.zpid, summary: main },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ error: "No property found" }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.response?.data || "Failed to find zpid" },
      { status: 500 }
    );
  }
}
