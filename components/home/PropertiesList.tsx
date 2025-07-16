"use client";

import { useFilterStore } from "@/store/filterStates";
<<<<<<< HEAD
import { Suspense, useEffect, useMemo, useState } from "react";
=======
import { Suspense, useEffect, useState, useRef } from "react";
>>>>>>> fa07cb3474d6e8d758156053873eda90b2363400
import GoogleMapComponent from "./MapComponent";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import SelectedPropertyDetails from "./SelectedPropertyDetails";
import PropertyList from "./PropertyList";
import { columns } from "./utils";
import { useRouter, useSearchParams } from "next/navigation";
import PageLoader from "../ui/PageLoader";
import { usePropertyData } from "@/store/propertyData";
import { useQueryState } from "@/store/queryState";
import { addressRegex, getFullAddress } from "@/lib/utils";
import {
  IoHomeOutline,
  IoLocationOutline,
  IoSearchOutline,
} from "react-icons/io5";
import { X } from "lucide-react";

const PropertiesListComponent = () => {
  const { setPropertyData, priority } = usePropertyData();
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = JSON.parse(
    decodeURIComponent(searchParams.get("query") || "{}")
  );
  const { searchedTerm, filterState = {}, regionId, listingType } = query;
  const { price, beds, sqft, buildYear, distance } = filterState;

  const updateQuery = useQueryState((state) => state.updateQuery);

  const selectedState = useFilterStore((state) => state.selectedState);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [showSelectedPropertyOnMap, setShowSelectedPropertyOnMap] = useState({
    lat: 0,
    lng: 0,
  });

  // Use refs to track if we've already set initial values
  const hasSetInitialProperty = useRef(false);
  const hasSetInitialUrl = useRef(false);

  const {
    data: zpidId,
    isSuccess: isSuccessZpidId,
    isLoading: isLoadingZpidId,
    isError: isErrorZpidId,
  } = useQuery({
    queryFn: async () => {
      const res = await axios.get(`/api/find-zpid?address=${searchedTerm}`);
      return res.data;
    },
<<<<<<< HEAD
    queryKey: ["zillow", searchedTerm],
    enabled: !!searchedTerm,
  });

  useEffect(() => {
    if (isSuccessZpidId && zpidId?.zpid) {
      updateQuery("regionId", zpidId.zpid);

      const currentQuery = JSON.parse(
        decodeURIComponent(searchParams.get("query") || "{}")
      );
      const updatedQuery = { ...currentQuery, regionId: zpidId.zpid };
      const params = new URLSearchParams(searchParams.toString());
      params.set("query", encodeURIComponent(JSON.stringify(updatedQuery)));
=======
    enabled: !!searchedTerm && !!listingType,
    queryKey: ["zillow", searchedTerm, "location", listingType, filterState],
    staleTime: 5 * 60 * 1000, // 5 minutes cache to prevent unnecessary refetches
  });

  console.log(propertyDataByLocation?.nearbyHomes);

  // Set initial selected property only once when data loads
  useEffect(() => {
    if (
      propertyDataByLocation?.nearbyHomes?.length > 0 &&
      !hasSetInitialProperty.current
    ) {
      setSelectedProperty(propertyDataByLocation.nearbyHomes[0]);
      hasSetInitialProperty.current = true;
    }
  }, [propertyDataByLocation?.nearbyHomes]);

  // Set property data in store when data changes
  useEffect(() => {
    if (propertyDataByLocation?.nearbyHomes?.length > 0) {
      setPropertyData(propertyDataByLocation);
    }
  }, [propertyDataByLocation, setPropertyData]);

  // Update URL with coordinates only once when data loads
  useEffect(() => {
    if (
      propertyDataByLocation?.nearbyHomes?.length > 0 &&
      !hasSetInitialUrl.current
    ) {
      const firstProperty = propertyDataByLocation.nearbyHomes[0];
      const params = new URLSearchParams(searchParams.toString());
      params.set("lat", firstProperty.latitude.toString());
      params.set("lng", firstProperty.longitude.toString());
>>>>>>> fa07cb3474d6e8d758156053873eda90b2363400
      router.push(`?${params.toString()}`);
      hasSetInitialUrl.current = true;
    }
<<<<<<< HEAD
  }, [isSuccessZpidId, zpidId, router, searchedTerm]);
=======
  }, [propertyDataByLocation?.nearbyHomes, searchParams, router]);

  // Reset refs when search term or listing type changes (new search)
  useEffect(() => {
    hasSetInitialProperty.current = false;
    hasSetInitialUrl.current = false;
    setSelectedProperty(null);
  }, [searchedTerm, listingType]);
>>>>>>> fa07cb3474d6e8d758156053873eda90b2363400

  const {
    data: propertyDataByLocation,
    isLoading: isLoadingProperty,
    error: errorProperty,
  } = useQuery({
    queryFn: async () => {
      const res = await axios.get(`/api/property/${regionId}`);
      return res.data;
    },
    enabled: !!regionId,
    queryKey: ["zillow", regionId],
  });

  const {
    data: propertyDataBySimilar,
    isLoading: isLoadingSimilar,
    error: errorSimilar,
  } = useQuery({
    queryFn: async () => {
      const res = await axios.get(`/api/similar/${regionId}`);
      return res.data;
    },
    enabled: !!regionId && !addressRegex(searchedTerm),
    queryKey: ["zillow", regionId, "similar"],
  });

  const filterProperty = useQuery({
    queryFn: async () => {
      const query = new URLSearchParams();
      query.set("location", searchedTerm);
      query.set("status_type", listingType);
      query.set("minPrice", price.split("-")[0] || "");
      query.set("maxPrice", price.split("-")[1] || "");
      query.set("bedsMin", beds.split("-")[0] || "");
      query.set("bedsMax", beds.split("-")[1] || "");
      query.set("sqftMin", sqft.split("-")[0] || "");
      query.set("sqftMax", sqft.split("-")[1] || "");
      query.set("buildYearMin", buildYear.min || "");
      query.set("buildYearMax", buildYear.max || "");

      const res = await axios.get(`/api/search?${query.toString()}`);
      return res.data;
    },
    queryKey: [`zillow-search`, listingType, price, beds, sqft, buildYear],
    enabled: false,
  });

  const fetchRadius = useQuery({
    queryFn: async () => {
      const query = new URLSearchParams();
      query.set(
        "lat",
        propertyDataByLocation?.data?.latitude?.toString() || ""
      );
      query.set(
        "long",
        propertyDataByLocation?.data?.longitude?.toString() || ""
      );
      query.set("d", distance);

      const res = await axios.get(`/api/radius?${query.toString()}`);
      return res.data;
    },
    queryKey: ["zillow", regionId, "radius", distance],
    enabled:
      !!searchedTerm &&
      !!distance &&
      !!propertyDataByLocation?.data?.latitude &&
      !!propertyDataByLocation?.data?.longitude,
  });

  const {
    data: propertyCompareData,
    isLoading: isLoadingPropertyCompare,
    isError: isErrorPropertyCompare,
    isSuccess: isSuccessPropertyCompare,
  } = useQuery({
    queryFn: async () => {
      const res = await axios.get(`/api/property-compare/${regionId}`);
      return res.data;
    },
    queryKey: ["zillow", regionId, "property-compare"],
    enabled: !!regionId && addressRegex(searchedTerm),
  });

  // Check if any filters are actually applied
  const hasActiveFilters = useMemo(() => {
    return (
      listingType ||
      (price && price !== "-") ||
      (beds && beds !== "-") ||
      (sqft && sqft !== "-") ||
      (buildYear && (buildYear.min || buildYear.max))
    );
  }, [listingType, price, beds, sqft, distance, buildYear]);

  const mapProperty = (item: any) => ({
    address: item.address,
    bathrooms: item.bathrooms,
    bedrooms: item.bedrooms,
    currency: item.currency || "USD",
    listingStatus: item.listingStatus || item.homeStatus,
    latitude: item.latitude,
    livingArea: item.livingArea,
    livingAreaUnits: item.livingAreaUnits || "sqft",
    longitude: item.longitude,
    miniCardPhotos:
      item.miniCardPhotos ||
      (item.carouselPhotos ? item.carouselPhotos : [item.imgSrc]),
    price: item.lastSoldPrice || item.price,
    zpid: item.zpid,
  });

  const updatedPropertyData = useMemo(() => {
    if (!propertyDataByLocation?.data) return [];
    const mainProperty = mapProperty({
      ...propertyDataByLocation.data,
    });

    // Priority 1: Radius data
    if (priority === "distance" && distance && fetchRadius?.data?.data) {
      const radiusProps = fetchRadius.data.data.map((r: any) =>
        mapProperty({
          ...r.property,
          miniCardPhotos: [r.property.imgSrc],
        })
      );
      return [...radiusProps];
    }

    // Priority 2: Filter/Search
    if (
      priority === "search" &&
      hasActiveFilters &&
      filterProperty?.data?.data?.props
    ) {
      const filterProps = filterProperty.data.data.props.map((f: any) =>
        mapProperty({
          ...f,
          miniCardPhotos: f.carouselPhotos,
        })
      );
      return [...filterProps];
    }

    // Priority 3: Similar
    if (
      (priority === "distance" || priority === "search") &&
      propertyDataBySimilar?.data
    ) {
      if (addressRegex(searchedTerm)) {
        const similarProps = propertyDataBySimilar?.data
          ?.filter((s: any) => s.homeStatus === "RECENTLY_SOLD")
          .map((s: any) => mapProperty(s));
        return [mainProperty, ...similarProps];
      } else {
        const similarProps = propertyDataBySimilar?.data.map((s: any) =>
          mapProperty(s)
        );
        return [mainProperty, ...similarProps];
      }
    }

    if (isSuccessPropertyCompare && propertyCompareData?.data) {
      const compareProps = propertyCompareData?.data?.map((c: any) =>
        mapProperty(c)
      );
      return [mainProperty, ...compareProps];
    }

    // fallback
    return [mainProperty];
  }, [
    propertyDataByLocation?.data,
    propertyDataBySimilar?.data,
    filterProperty?.data?.data?.props,
    fetchRadius?.data?.data,
    hasActiveFilters,
    distance,
    isSuccessPropertyCompare,
    propertyCompareData?.data,
  ]);

  useEffect(() => {
    if (updatedPropertyData.length > 0) {
      setSelectedProperty(updatedPropertyData[0]);
    }

    setPropertyData(updatedPropertyData);
  }, [updatedPropertyData]);

  useEffect(() => {
    if (hasActiveFilters && regionId && searchedTerm) {
      filterProperty.refetch();
    }
  }, [
    hasActiveFilters,
    regionId,
    searchedTerm,
    listingType,
    price,
    beds,
    sqft,
    buildYear,
  ]);

  if (isErrorZpidId) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-sm border border-red-200 max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No property found
          </h3>
        </div>
      </div>
    );
  }

  if (
    errorProperty ||
    errorSimilar ||
    fetchRadius.error ||
    isErrorPropertyCompare
  ) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-sm border border-red-200 max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Error Loading Properties
          </h3>
          <p className="text-gray-600 mb-4">
            We encountered an issue while searching for properties. Please try
            again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry Search
          </button>
        </div>
      </div>
    );
  }

  if (
    isLoadingProperty ||
    isLoadingZpidId ||
    isLoadingSimilar ||
    filterProperty.isLoading ||
    fetchRadius.isLoading ||
    isLoadingPropertyCompare
  ) {
    return (
      <div className="w-full flex items-center justify-center p-8 h-[80vh]">
        <PageLoader />
      </div>
    );
  }

  // Show default page when no search term or when property data is empty/invalid
  if (updatedPropertyData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex  justify-center p-4">
        <div className="max-w-4xl mx-auto mt-10 text-center">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Find Your Perfect Home
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Search millions of properties with our advanced property finder
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="text-blue-600 text-3xl mb-4">
                <IoLocationOutline className="mx-auto" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Search by Location</h3>
              <p className="text-gray-600 text-sm">
                Find properties by city, neighborhood, ZIP code, or landmark
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="text-green-600 text-3xl mb-4">
                <IoHomeOutline className="mx-auto" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Exact Address</h3>
              <p className="text-gray-600 text-sm">
                Enter a complete address for specific property details
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="text-purple-600 text-3xl mb-4">
                <IoSearchOutline className="mx-auto" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Smart Search</h3>
              <p className="text-gray-600 text-sm">
                Try "3+ bedroom homes in Dallas TX" or school searches
              </p>
            </div>
          </div>
          <div className="mt-8 bg-blue-600 text-white p-4 rounded-xl max-w-md mx-auto">
            <h4 className="font-semibold mb-2">Property Types on Map</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                <span>For Sale</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                <span>Recently Sold</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-sm"></div>
                <span>For Rent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                <span>Your Location</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex md:flex-row flex-col md:gap-0 gap-4 md:px-6 px-2 py-4">
      <div className="md:w-[40%] w-full md:h-[82vh] h-[400px] overflow-hidden rounded-xl">
        <GoogleMapComponent
          showSelectedPropertyOnMap={showSelectedPropertyOnMap}
        />
      </div>
      <div className="md:w-[60%] w-full md:h-[82vh] h-[65vh] pb-4">
        <SelectedPropertyDetails
          selectedProperty={selectedProperty}
          selectedState={selectedState}
          columns={columns}
        />

        <PropertyList
          properties={updatedPropertyData}
          selectedState={selectedState}
          onPropertySelect={setSelectedProperty}
          setShowSelectedPropertyOnMap={setShowSelectedPropertyOnMap}
        />
      </div>
    </div>
  );
};

export default function PropertiesList() {
  return (
    <Suspense fallback={<PageLoader />}>
      <PropertiesListComponent />
    </Suspense>
  );
}