import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ zpid: string }> }
) {
  const { zpid } = await params;

  if (!zpid) {
    return NextResponse.json(
      { error: "Missing 'zpid' param" },
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
    const response = await axios.get(`${url}/propertyComps?zpid=${zpid}`, {
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": "zillow-com1.p.rapidapi.com",
      },
    });

    const filteredData = response?.data?.comps?.map((item: any) => {
      return {
        address: item.address,
        zpid: item.zpid,
        price: item.price,
        currency: item.currency,
        bedrooms: item.bedrooms,
        homeStatus: item.hdpTypeDimension,
        bathrooms: item.bathrooms,
        livingArea: item.livingAreaValue,
        miniCardPhotos: item.miniCardPhotos,
        latitude: item.latitude,
        longitude: item.longitude,
        livingAreaUnits: item.livingAreaUnits,
      };
    });

    return NextResponse.json({ data: filteredData }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch property compare" },
      { status: 500 }
    );
  }
}
