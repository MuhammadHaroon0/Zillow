"use client";

import { useFilterStore } from "@/store/filterStates";
import { Suspense, useEffect, useState } from "react";
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
  const searchedTerm = searchParams.get("searchedTerm");
  const listingStatus = searchParams.get("listingStatus");
  const bedsMin = searchParams.get("bedsMin");
  const priceMin = searchParams.get("priceMin");
  const sqftMin = searchParams.get("sqftMin");
  const buildYearMin = searchParams.get("buildYearMin");
  const buildYearMax = searchParams.get("buildYearMax");
  const lotSize = searchParams.get("lotSize");
  const selectedState = useFilterStore((state) => state.selectedState);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  const {
    data: propertyDataByLocation,
    isLoading,
    error,
  } = useQuery({
    queryFn: async () => {
      const res = await axios.get(
        `/api/search-by-location?searchedTerm=${searchedTerm}&listingStatus=${listingStatus}&bedsMin=${bedsMin}&priceMin=${
          priceMin || "50000"
        }&sqftMin=${sqftMin}&buildYearMin=${buildYearMin}&buildYearMax=${buildYearMax}&lotSize=${lotSize}`
      );
      return res.data;
    },
    enabled: !!searchedTerm && !!listingStatus,
    queryKey: [
      "zillow",
      searchedTerm,
      "location",
      listingStatus,
      bedsMin,
      priceMin,
      sqftMin,
      buildYearMin,
      buildYearMax,
      lotSize,
    ],
    staleTime: 0,
  });

  useEffect(() => {
    if (propertyDataByLocation?.nearbyHomes?.length > 0 && !selectedProperty) {
      setSelectedProperty(propertyDataByLocation.nearbyHomes[0]);
    }

    if (propertyDataByLocation?.nearbyHomes?.length > 0) {
      setPropertyData(propertyDataByLocation);
    }

    if (propertyDataByLocation?.nearbyHomes?.length > 0) {
      const params = new URLSearchParams(searchParams.toString());
      params.set(
        "lat",
        propertyDataByLocation?.nearbyHomes[0].latitude.toString()
      );
      params.set(
        "lng",
        propertyDataByLocation?.nearbyHomes[0].longitude.toString()
      );
      router.push(`?${params.toString()}`);
    }
  }, [selectedProperty, searchedTerm, propertyDataByLocation]);

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center p-8  h-[80vh]">
        <PageLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex items-center justify-center p-8 text-red-500">
        Error loading properties
      </div>
    );
  }

  if (!propertyDataByLocation?.nearbyHomes || !selectedProperty) {
    return (
      <div className="w-full flex items-center justify-center p-8">
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
        {/* Selected Property Details */}
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
