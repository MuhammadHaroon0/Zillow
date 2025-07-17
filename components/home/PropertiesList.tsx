"use client";

import { useFilterStore } from "@/store/filterStates";
import { Suspense, useEffect, useState, useRef } from "react";
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

const PropertiesListComponent = () => {
  const { propertyData, setPropertyData } = usePropertyData();
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = JSON.parse(
    decodeURIComponent(searchParams.get("query") || "{}")
  );

  const { searchedTerm, listingType, filterState } = query;

  const selectedState = useFilterStore((state) => state.selectedState);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  // Use refs to track if we've already set initial values
  const hasSetInitialProperty = useRef(false);
  const hasSetInitialUrl = useRef(false);

  const {
    data: propertyDataByLocation,
    isLoading,
    error,
  } = useQuery({
    queryFn: async () => {
      const res = await axios.get(
        `/api/search-by-location?searchedTerm=${searchedTerm}&listingStatus=${listingType}&bedsMin=${filterState.beds.min}&priceMin=${filterState.price.min}&sqftMin=${filterState.sqftMin.min}&buildYearMin=${filterState.buildYear.min}&buildYearMax=${filterState.buildYear.max}&lotSize=${filterState.lotSize.min}`
      );
      return res.data;
    },
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
      router.push(`?${params.toString()}`);
      hasSetInitialUrl.current = true;
    }
  }, [propertyDataByLocation?.nearbyHomes, searchParams, router]);

  // Reset refs when search term or listing type changes (new search)
  useEffect(() => {
    hasSetInitialProperty.current = false;
    hasSetInitialUrl.current = false;
    setSelectedProperty(null);
  }, [searchedTerm, listingType]);

  if (error) {
    return (
      <div className="w-full flex items-center justify-center p-8 text-red-500">
        Error loading properties
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center p-8 h-[80vh]">
        <PageLoader />
      </div>
    );
  }

  if (!propertyDataByLocation?.nearbyHomes || !selectedProperty) {
    return (
      <div className="w-full flex items-center justify-center p-8 ">
        No properties found
      </div>
    );
  }

  return (
    <div className="w-full flex md:flex-row flex-col md:gap-0 gap-4 md:px-6 px-2 py-4">
      <div className="md:w-[40%] w-full md:h-[82vh] h-[400px] overflow-hidden rounded-xl">
        <GoogleMapComponent />
      </div>
      <div className="md:w-[60%] w-full md:h-[82vh] h-[65vh] pb-4">
        <SelectedPropertyDetails
          selectedProperty={selectedProperty}
          selectedState={selectedState}
          columns={columns}
        />

        {/* Property List */}
        <PropertyList
          properties={propertyData.nearbyHomes}
          selectedState={selectedState}
          onPropertySelect={setSelectedProperty}
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