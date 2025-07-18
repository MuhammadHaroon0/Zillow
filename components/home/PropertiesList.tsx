"use client";

import { useFilterStore } from "@/store/filterStates";
import { Suspense, useEffect, useMemo, useState } from "react";
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

const PropertiesListComponent = () => {
  const { setPropertyData, priority } = usePropertyData();
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = JSON.parse(
    decodeURIComponent(searchParams.get("query") || "{}")
  );
  const {
    searchedTerm,
    filterState = {},
    regionId,
    listingType,
    mapBounds,
  } = query;
  const { price, beds, sqft, buildYear, distance } = filterState;

  const updateQuery = useQueryState((state) => state.updateQuery);
  const selectedState = useFilterStore((state) => state.selectedState);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [showSelectedPropertyOnMap, setShowSelectedPropertyOnMap] = useState({
    lat: 0,
    lng: 0,
  });

  // Build query parameters for the unified endpoint
  const buildQueryParams = useMemo(() => {
    const params = new URLSearchParams();

    if (searchedTerm) {
      params.set("address", searchedTerm);
    }

    // Set radius and sold within months
    if (distance) {
      params.set("radius", distance.toString());
    }
    params.set("soldWithinMonths", "8");

    // Apply filters
    if (listingType) {
      params.set("status_type", listingType);
    }

    if (price && price !== "-") {
      const [minPrice, maxPrice] = price.split("-");
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);
    }

    if (beds && beds !== "-") {
      const [bedsMin, bedsMax] = beds.split("-");
      if (bedsMin) params.set("bedsMin", bedsMin);
      if (bedsMax) params.set("bedsMax", bedsMax);
    }

    if (sqft && sqft !== "-") {
      const [sqftMin, sqftMax] = sqft.split("-");
      if (sqftMin) params.set("sqftMin", sqftMin);
      if (sqftMax) params.set("sqftMax", sqftMax);
    }

    if (buildYear) {
      if (buildYear.min) params.set("buildYearMin", buildYear.min);
      if (buildYear.max) params.set("buildYearMax", buildYear.max);
    }

    return params.toString();
  }, [searchedTerm, distance, listingType, price, beds, sqft, buildYear]);

  // Single unified query
  const {
    data: unifiedPropertyData,
    isLoading: isLoadingUnified,
    isError: isErrorUnified,
    error: errorUnified,
    refetch: refetchUnified,
  } = useQuery({
    queryFn: async () => {
      const res = await axios.get(`/api/find-nearest?${buildQueryParams}`);
      return res.data;
    },
    queryKey: ["find-nearest", buildQueryParams],
    enabled: !!searchedTerm,
  });

  // Update URL with coordinates when data is received
  useEffect(() => {
    if (unifiedPropertyData?.mainProperty) {
      const mainProp = unifiedPropertyData.mainProperty;

      // Update query state
      updateQuery("regionId", mainProp.zpid);
      updateQuery("mapBounds.lat", mainProp.latitude);
      updateQuery("mapBounds.lng", mainProp.longitude);

      // Update URL
      const currentQuery = JSON.parse(
        decodeURIComponent(searchParams.get("query") || "{}")
      );
      const updatedQuery = {
        ...currentQuery,
        regionId: mainProp.zpid,
        mapBounds: {
          lat: mainProp.latitude,
          lng: mainProp.longitude,
        },
      };
      const params = new URLSearchParams(searchParams.toString());
      params.set("query", encodeURIComponent(JSON.stringify(updatedQuery)));
      router.push(`?${params.toString()}`);
    }
  }, [unifiedPropertyData, router, searchParams, updateQuery]);

  // Map property data to consistent format
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
    dateSold: item.dateSold,
    yearBuilt: item.yearBuilt,
  });

  // Process property data
  const updatedPropertyData = useMemo(() => {
    if (!unifiedPropertyData) return [];

    const mainProperty = mapProperty(unifiedPropertyData.mainProperty);
    const nearbyProperties = unifiedPropertyData.nearbyProperties?.map(mapProperty) || [];

    // For exact addresses, include main property first
    if (addressRegex(searchedTerm)) {
      return [mainProperty, ...nearbyProperties];
    }

    // For location searches, return all nearby properties
    return nearbyProperties.length > 0 ? nearbyProperties : [mainProperty];
  }, [unifiedPropertyData, searchedTerm]);

  // Update selected property and property data
  useEffect(() => {
    if (updatedPropertyData.length > 0) {
      setSelectedProperty(updatedPropertyData[0]);
    }
    setPropertyData(updatedPropertyData);
  }, [updatedPropertyData, setPropertyData]);

  // Error handling
  if (isErrorUnified) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-sm border border-red-200 max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {"response" in errorUnified && (errorUnified as any).response?.status === 404
              ? "No property found"
              : "Error Loading Properties"}
          </h3>

          <p className="text-gray-600 mb-4">
            {"response" in errorUnified && (errorUnified as any).response?.status === 404
              ? "We couldn't find any properties for the given address."
              : "We encountered an issue while searching for properties. Please try again."}
          </p>

          <button
            onClick={() => refetchUnified()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry Search
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoadingUnified) {
    return (
      <div className="w-full flex items-center justify-center p-8 h-[80vh]">
        <PageLoader />
      </div>
    );
  }

  // Show default page when no search term or when property data is empty
  if (!searchedTerm || updatedPropertyData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center p-4">
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

        {/* Show search results info */}
        {unifiedPropertyData?.searchResults && (
          <div className="w-full flex items-center mt-4 justify-center">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 max-w-md">
              <p className="text-sm text-gray-600">
                Found {unifiedPropertyData.searchResults.totalFound} properties within{" "}
                {unifiedPropertyData.searchResults.radiusMiles} miles •
                Sold within {unifiedPropertyData.searchResults.soldWithinMonths} months
              </p>
            </div>
          </div>
        )}
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