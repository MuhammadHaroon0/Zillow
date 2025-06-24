import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchedTerm = searchParams.get("searchedTerm");
  const listingStatus = searchParams.get("listingStatus");
  const bedsMin = searchParams.get("bedsMin");
  const priceMin = searchParams.get("priceMin");
  const sqftMin = searchParams.get("sqftMin");
  const buildYearMin = searchParams.get("buildYearMin");
  const buildYearMax = searchParams.get("buildYearMax");
  const lotSize = searchParams.get("lotSize");

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
      url +
        "/propertyExtendedSearch" +
        "?location=" +
        searchedTerm +
        "&status_type=" +
        listingStatus +
        "&home_type=Houses" +
        "&bedsMin=" +
        bedsMin +
        "&minPrice=" +
        priceMin +
        "&sqftMin=" +
        sqftMin +
        "&buildYearMin=" +
        buildYearMin +
        "&buildYearMax=" +
        buildYearMax +
        "&lotSize=" +
        lotSize,
      {
        headers: {
          "x-rapidapi-key": apiKey,
          "x-rapidapi-host": "zillow-com1.p.rapidapi.com",
        },
      }
    );

    const data = response.data;

    const refinedData = {
      nearbyHomes: data?.props?.map((home: any) => ({
        zpid: home.zpid,
        Address: home.address,
        Price: home.price,
        LivingArea: home.livingArea,
        image: home.imgSrc,
        Bedrooms: home.bedrooms,
        Bathrooms: home.bathrooms,
        YearBuilt: home.yearBuilt,
        Status: home.listingStatus,
        latitude: home.latitude,
        longitude: home.longitude,
        dateSold: home.dateSold,
        Distance: 0,
      })),
    };

    return NextResponse.json(refinedData, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch data from Zillow API", details: error.message },
      { status: 500 }
    );
  }
}
