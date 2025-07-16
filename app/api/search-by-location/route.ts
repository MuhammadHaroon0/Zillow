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
    let allHomes: any[] = [];
    let currentPage = 1;
    let hasMorePages = true;
    const maxPages = 50; // Safety limit to prevent infinite loops

    while (hasMorePages && currentPage <= maxPages) {
      console.log(`Fetching page ${currentPage}...`);

      // Build the query parameters
      let queryParams = `?location=${searchedTerm}&page=${currentPage}`;

      // Add optional parameters if they exist
      if (listingStatus) queryParams += `&status_type=${listingStatus}`;
      if (bedsMin) queryParams += `&bedsMin=${bedsMin}`;
      if (priceMin) queryParams += `&minPrice=${priceMin}`;
      if (sqftMin) queryParams += `&sqftMin=${sqftMin}`;
      if (buildYearMin) queryParams += `&buildYearMin=${buildYearMin}`;
      if (buildYearMax) queryParams += `&buildYearMax=${buildYearMax}`;
      if (lotSize) queryParams += `&lotSize=${lotSize}`;

      const response = await axios.get(
        `${url}/propertyExtendedSearch${queryParams}`,
        {
          headers: {
            "x-rapidapi-key": apiKey,
            "x-rapidapi-host": "zillow-com1.p.rapidapi.com",
          },
        }
      );

      const data = response.data;

      // Check if there are properties in this page
      if (data?.props && data.props.length > 0) {
        allHomes = allHomes.concat(data.props);
        currentPage++;
        if (currentPage === 14)
          break
        // Add a small delay to avoid hitting rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
      } else {
        // No more properties found, stop pagination
        hasMorePages = false;
        console.log(`No more properties found on page ${currentPage}`);
      }
    }

    console.log(`Total properties fetched: ${allHomes.length} across ${currentPage - 1} pages`);

    const refinedData = {
      nearbyHomes: allHomes.map((home: any) => ({
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
      totalPages: currentPage - 1,
      totalProperties: allHomes.length,
    };

    return NextResponse.json(refinedData, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching Zillow data:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch data from Zillow API", details: error.message },
      { status: 500 }
    );
  }
}