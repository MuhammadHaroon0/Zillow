import { getFullAddress } from "@/lib/utils";
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

  console.log(searchedTerm, listingStatus);

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
        "&bedsMin=" +
        bedsMin +
        "&minPrice=" +
        priceMin +
        "&sqftMin=" +
        sqftMin +
        "&buildYearMin=" +
        buildYearMin +
        "&buildYearMax=" +
        buildYearMax,
        // "&lotSizeMin=" +
        // lotSize,
      {
        headers: {
          "x-rapidapi-key": apiKey,
          "x-rapidapi-host": "zillow-com1.p.rapidapi.com",
        },
      }
    );

    const data = response.data;
    //check if search is done by address and only one property is returned
    if(data && !Array.isArray(data) && typeof data === "object" && Object.keys(data).length === 1 && data.hasOwnProperty("zpid") && data.zpid){
      const response = await axios.get(
        url +
          "/property" +
          "?zpid=" + 
          data.zpid,
        {
          headers: {
            "x-rapidapi-key": apiKey,
            "x-rapidapi-host": "zillow-com1.p.rapidapi.com",
          },
        }
      );
      const property = response.data;
      const refinedData = {
        nearbyHomes:[
          {
            zpid: property.zpid,
            Address: getFullAddress(property.address),
            Price: property.price,
            LivingArea: property.livingAreaValue,
            image: property.imgSrc,
            Bedrooms: property.bedrooms,
            Bathrooms: property.bathrooms,
            YearBuilt: property.yearBuilt,
            Status: property.homeStatus,
            latitude: property.latitude,
            longitude: property.longitude,
            dateSold: property.dateSold,
            Distance: 0,
          }
        ]
      };

      return NextResponse.json(refinedData, { status: 200 });
    }
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
