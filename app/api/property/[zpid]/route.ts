import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Next.js API route to fetch full details for a single property from Zillow by zpid.
// Used for main card, detailed view, or map popup.
export async function GET(
  request: NextRequest,
  { params }: { params: { zpid: string } }
) {
  const zpid = params.zpid;

  if (!zpid) {
    return NextResponse.json({ error: "Missing 'zpid' param" }, { status: 400 });
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
    const response = await axios.get(url + "/property", {
      params: { zpid },
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": "zillow-com1.p.rapidapi.com",
      },
    });

    // Return the property details (can process or filter fields here if needed)
    return NextResponse.json({ data: response.data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.response?.data || "Failed to fetch property details" },
      { status: 500 }
    );
  }
}
