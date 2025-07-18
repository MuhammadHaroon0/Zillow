import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
function delay(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
}
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

function isWithinSoldMonths(dateSoldStr: string, months: number = 8) {
    if (!dateSoldStr) return false;
    const dateSold = new Date(dateSoldStr);
    const now = new Date();
    const monthsDiff =
        (now.getFullYear() - dateSold.getFullYear()) * 12 +
        (now.getMonth() - dateSold.getMonth());
    return monthsDiff <= months;
}

function haversineDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
) {
    const R = 3958.8; // miles
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

    // Required parameter
    const address = searchParams.get("address");
    if (!address) {
        return NextResponse.json(
            { error: "Missing 'address' parameter" },
            { status: 400 }
        );
    }

    const radiusMiles = parseFloat(searchParams.get("radius") || "0.5");
    const soldWithinMonths = parseInt(searchParams.get("soldWithinMonths") || "8");

    const filters = {
        status_type: searchParams.get("status_type"),
        home_type: searchParams.get("home_type"),
        minPrice: searchParams.get("minPrice"),
        maxPrice: searchParams.get("maxPrice"),
        bedsMin: searchParams.get("bedsMin"),
        bedsMax: searchParams.get("bedsMax"),
        bathsMin: searchParams.get("bathsMin"),
        bathsMax: searchParams.get("bathsMax"),
        sqftMin: searchParams.get("sqftMin"),
        sqftMax: searchParams.get("sqftMax"),
        buildYearMin: searchParams.get("buildYearMin"),
        buildYearMax: searchParams.get("buildYearMax"),
    };

    const url = process.env.ZILLOW_URL as string;
    const apiKey = process.env.ZILLOW_API_KEY as string;

    if (!url || !apiKey) {
        return NextResponse.json(
            { error: "Missing environment variables" },
            { status: 500 }
        );
    }

    try {
        const zpidResponse = await axios.get(`${url}/propertyExtendedSearch`, {
            params: { location: address },
            headers: {
                "x-rapidapi-key": apiKey,
                "x-rapidapi-host": "zillow-com1.p.rapidapi.com",
            },
        });
        await delay(600);
        let zpidData = zpidResponse.data;
        let mainProperty = null;

        if (zpidData && typeof zpidData === "object" && zpidData.zpid) {
            mainProperty = zpidData;
        } else if (Array.isArray(zpidData)) {
            const match = zpidData.find((item) => item.zpid);
            if (match) {
                mainProperty = match;
            }
        }

        if (!mainProperty || !mainProperty.zpid) {
            return NextResponse.json(
                { error: "No property found for the given address" },
                { status: 404 }
            );
        }


        let latitude = mainProperty.latitude;
        let longitude = mainProperty.longitude;

        if (!latitude || !longitude) {
            try {
                const propertyDetailResponse = await axios.get(`${url}/property?zpid=${mainProperty.zpid}`, {
                    headers: {
                        "x-rapidapi-key": apiKey,
                        "x-rapidapi-host": "zillow-com1.p.rapidapi.com",
                    },
                });

                await delay(600);
                if (propertyDetailResponse.data?.latitude && propertyDetailResponse.data?.longitude) {
                    latitude = propertyDetailResponse.data.latitude;
                    longitude = propertyDetailResponse.data.longitude;
                    // Update main property with more details
                    mainProperty = { ...mainProperty, ...propertyDetailResponse.data };
                }
            } catch (detailError) {
                console.warn("Could not fetch detailed property info:", detailError);
            }
        }

        if (!latitude || !longitude) {
            return NextResponse.json(
                { error: "Could not determine coordinates for the property" },
                { status: 400 }
            );
        }

        const polygon = generateCirclePolygon(latitude, longitude, radiusMiles);
        const polygonString = polygon
            .map((point) => `${point.lng} ${point.lat}`)
            .join(", ");

        const nearbyPropsResponse = await axios.get(`${url}/propertyByPolygon`, {
            params: {
                ...filters,
                polygon: polygonString,
                soldInLast: '12m',
                status_type: 'RecentlySold'
            },
            headers: {
                "x-rapidapi-key": apiKey,
                "x-rapidapi-host": "zillow-com1.p.rapidapi.com",
            },
        });

        let nearbyPropsRaw = nearbyPropsResponse.data?.props ?? nearbyPropsResponse.data ?? [];
        let nearbyProps: any[] = Array.isArray(nearbyPropsRaw) ? nearbyPropsRaw : [];

        let filteredProps = nearbyProps.filter((prop: any) => {
            if (prop.dateSold && !isWithinSoldMonths(prop.dateSold, soldWithinMonths)) {
                return false;
            }

            if (prop.latitude && prop.longitude) {
                const distance = haversineDistance(latitude, longitude, prop.latitude, prop.longitude);
                if (distance > radiusMiles) {
                    return false;
                }
            }

            return true;
        });



        const responseData = {
            mainProperty: {
                ...mainProperty,
                latitude,
                longitude,
            },
            nearbyProperties: filteredProps,
            searchResults: {
                totalFound: filteredProps.length,
                radiusMiles,
                soldWithinMonths,
                centerCoordinates: {
                    latitude,
                    longitude,
                },
                appliedFilters: Object.fromEntries(
                    Object.entries(filters).filter(([_, value]) => value !== null && value !== "")
                ),
            },
        };

        return NextResponse.json(responseData, { status: 200 });

    } catch (error: any) {
        console.error("Unified property search error:", error?.response?.data || error.message);
        return NextResponse.json(
            {
                error: error?.response?.data || "Failed to search properties",
                details: error.message
            },
            { status: 500 }
        );
    }
}