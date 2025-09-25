"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useBranding } from "@/context/branding-context";
import { getPopularDestinations, getRegionsForReseller } from "../lib/api/home";
import { getCountries } from "../lib/api/global-api";
import FeaturesMarqueeRibbon from "./featuresMarqueeRibbon";

export default function HomeContent() {
    const router = useRouter();
    const branding = useBranding();
    const [locationType, setLocationType] = useState<"countries" | "regions">("countries");
    const [countries, setCountries] = useState([]);
    const [popularCountries, setPopularCountries] = useState([]);
    const [regions, setRegions] = useState([]);

    // Function to fetch popular destinations and regions using the API
    const fetchPopularDestinations = useCallback(async () => {
        if (!branding?.reseller_id || !branding?.currency) return;
        try {
            const [popularCounties, regionsData] = await Promise.all([
                getPopularDestinations(branding.reseller_id, branding.currency),
                getRegionsForReseller(branding.reseller_id)
            ]);
            setPopularCountries(popularCounties.data.countries_ids);
            setRegions(regionsData.data);
        } catch (error) {
            console.error("Failed to fetch popular destinations or regions:", error);
        }
    }, [branding?.reseller_id, branding?.currency]);

    useEffect(() => {
        getCountries().then((data) => {
            setCountries(data);
        });
        fetchPopularDestinations();
    }, []);

    return (

  <>

<div className="flex flex-col items-center justify-center w-full px-4 md:px-12 lg:px-32">
            <div className="flex flex-col lg:flex-row justify-center w-full gap-12 mt-8">
                <div className="flex flex-col gap-6 items-center lg:items-start w-full max-w-xl justify-center h-full mt-8">
                    <div
                        className="border border-gray-200 flex items-center gap-3 rounded-full px-5 py-3 bg-white w-auto mt-8"
                        role="status"
                        aria-label="App rating: Rated 4.7 out of 5 with over 500,000 downloads"
                    >
                        <img
                            src="https://zetexa-dev-media-files.s3.ap-south-1.amazonaws.com/b2c_revamp/Landing_Product_Page/Banner/Star+Ratings.png"
                            alt="Star Ratings"
                            className="h-6 w-auto"
                            style={{ width: "120px" }}
                        />
                        <p className="text-sm">Rated 4.7/5 with 500K+ Downloads</p>
                    </div>
                    <div className="text-center lg:text-left w-full">
                        <h1 className="text-5xl md:text-7xl font-bold">
                            <span>Global </span>
                            <span
                                style={{
                                    color: "var(--brand-primary-color)",
                                    display: "inline-block",
                                    position: "relative",
                                    height: "1em",
                                    overflow: "hidden",
                                    lineHeight: ".8em",
                                    verticalAlign: "middle",
                                }}
                                aria-live="polite"
                                aria-atomic="true"
                            >
                                <span
                                    style={{
                                        display: "block",
                                        animation: "verticalSwap 4s infinite cubic-bezier(0.4,0,0.2,1)",
                                    }}
                                >
                                    <span style={{ display: "block", height: "1em" }}>eSIM</span>
                                    <span style={{ display: "block", height: "1em" }}>pSIM</span>
                                    <span style={{ display: "block", height: "1em" }}>eSIM</span>
                                </span>
                                <style>
                                    {`
                                        @keyframes verticalSwap {
                                        0% { transform: translateY(0); }
                                        50% { transform: translateY(-1em); }
                                        100% { transform: translateY(-2em); }
                                        }
                                    `}
                                </style>
                            </span>
                        </h1>
                        <h2 className="text-5xl md:text-7xl font-semibold mt-2" tabIndex={0}>
                            for Lifetime
                        </h2>
                        <p className="text-xl mt-4 text-gray-600" tabIndex={0}>
                            Data + Voice | Magic SIM available
                        </p>
                    </div>
                </div>

                <div className="relative w-full max-w-xl mt-6">
                    {/* Phone image */}
                    <img
                        src="https://zetexa-dev-media-files.s3.ap-south-1.amazonaws.com/b2c_revamp/Landing_Product_Page/phone+mockup.png"
                        alt="Phone mockup showing eSIM app"
                        className="w-80 md:w-100 mx-auto block object-cover h-90 md:h-[550px]"
                        style={{ objectPosition: "top" }}
                        loading="eager"
                        aria-hidden="true"
                    />

                    {/* Overlay content */}
                    <div className="absolute top-1/8 left-1/2 transform -translate-x-1/2 w-9/11 text-center">
                        {/* Radio button */}
                        <fieldset className="flex flex-row justify-center items-center gap-18 mt-4" aria-label="Choose location type">
                            <legend className="sr-only">Choose location type</legend>
                            <label className="flex items-center space-x-2 cursor-pointer" htmlFor="locationType-countries">
                                <input
                                    id="locationType-countries"
                                    type="radio"
                                    name="locationType"
                                    value="countries"
                                    checked={locationType === "countries"}
                                    onChange={() => setLocationType("countries")}
                                    style={{
                                        accentColor: "var(--brand-primary-color)",
                                        width: "1.2em",
                                        height: "1.2em",
                                        cursor: "pointer"
                                    }}
                                    className="min-w-[1.2em] min-h-[1.2em]"
                                    aria-checked={locationType === "countries"}
                                    aria-label="Show popular countries"
                                />
                                <span className="text-base font-medium">Countries</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer" htmlFor="locationType-regions">
                                <input
                                    id="locationType-regions"
                                    type="radio"
                                    name="locationType"
                                    value="regions"
                                    checked={locationType === "regions"}
                                    onChange={() => setLocationType("regions")}
                                    style={{
                                        accentColor: "var(--brand-primary-color)",
                                        width: "1.2em",
                                        height: "1.2em",
                                        cursor: "pointer"
                                    }}
                                    className="min-w-[1.2em] min-h-[1.2em]"
                                    aria-checked={locationType === "regions"}
                                    aria-label="Show popular regions"
                                />
                                <span className="text-base font-medium">Regions</span>
                            </label>
                        </fieldset>
                        {/* Destination Search bar */}
                        <form
                            className="relative w-full flex justify-center mt-6 border-beam"
                            role="search"
                            aria-label="Destination search"
                            onSubmit={e => e.preventDefault()}
                        >
                            <div className="relative w-full border rounded-full group transition-shadow duration-200 hover:shadow-lg hover:border-[var(--brand-primary-color)]">
                                <label htmlFor="destination-search" className="sr-only">
                                    Search for a country or region
                                </label>
                                <input
                                    id="destination-search"
                                    type="text"
                                    placeholder="Search for"
                                    className="relative z-10 w-full pl-12 pr-14 py-3 rounded-full border-none outline-none bg-white text-lg font-medium shadow-md focus:ring-2 focus:ring-[var(--brand-primary-color)] transition duration-200 group-hover:shadow-lg"
                                    style={{
                                        boxShadow: "0 2px 12px 0 rgba(149,100,248,0.08)",
                                    }}
                                    aria-label="Search for a country or region"
                                    autoComplete="off"
                                />
                                
                                {/* Location icon */}
                                <span
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 text-[var(--brand-primary-color)]"
                                    aria-hidden="true"
                                >
                                    <svg width="30" height="30" fill="none" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 6.12 12.16 6.39 12.44.37.39.95.39 1.32 0C12.88 21.16 19 14.25 19 9c0-3.87-3.13-7-7-7zm0 16.88C10.14 16.09 7 12.39 7 9a5 5 0 1110 0c0 3.39-3.14 7.09-5 9.88z"></path>
                                        <circle cx="12" cy="9" r="2.5" fill="currentColor"/>
                                    </svg>
                                </span>
                                {/* Search icon button */}
                                <button
                                    type="submit"
                                    className="cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2 bg-[var(--brand-primary-color)] hover:bg-[var(--brand-primary-color-hover)] transition-colors text-white rounded-full w-10 h-10 flex items-center justify-center shadow z-20"
                                    style={{
                                        boxShadow: "0 2px 8px 0 rgba(149,100,248,0.12)",
                                    }}
                                    aria-label="Submit search"
                                    title="Search"
                                >
                                    <svg
                                        width="22"
                                        height="22"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        role="img"
                                        aria-hidden="true"
                                        focusable="false"
                                    >
                                        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
                                        <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M20 20l-3.5-3.5"/>
                                    </svg>
                                </button>
                            </div>
                        </form>
                        {/* {Popular Destinations section} */}
                        <section
                            className="relative flex flex-col justify-center mt-6 mx-10"
                            aria-labelledby="popular-destinations-heading"
                        >
                            <h2
                                id="popular-destinations-heading"
                                className="text-xl mb-6"
                                tabIndex={0}
                            >
                                {locationType === "countries" ? "Popular Destinations" : "Popular Regions"}
                            </h2>
                            <div className="flex flex-wrap justify-center  gap-4">
                                {locationType === "countries" ? (
                                    popularCountries && popularCountries.length > 0 ? (
                                        popularCountries.slice(0, 3).map((country: any, idx: number) => (
                                            <button
                                                key={country.id || idx}
                                                className="bg-white shadow flex flex-col items-center transition-all duration-300 w-[100px] hover:shadow-lg rounded-t-sm over:shadow-2xl hover:-translate-y-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary-color)]"
                                                tabIndex={0}
                                                aria-label={`View details for ${country.country_name}`}
                                                type="button"
                                                onClick={() => router.push(`/destinations/${country.id}`)}
                                               
                                            >
                                                {country.country_flag_url && (
                                                    <img
                                                        src={country.country_flag_url}
                                                        alt={`Flag of ${country.country_name}`}
                                                        className="w-full h-12 rounded-t-sm"
                                                    />
                                                )}
                                                <div className="flex items-center justify-center text-xs p-1 bg-black text-white w-full h-full rounded-b-sm">
                                                    <p className="text-center w-full">{country.country_name}</p>
                                                </div>
                                            </button>
                                        ))
                                    ) : (
                                        <span className="text-gray-500" role="status" aria-live="polite">No popular destinations found.</span>
                                    )
                                ) : (
                                    regions && regions.length > 0 ? (
                                        regions.map((region: any, idx: number) => (
                                            <button
                                                key={region.id || idx}
                                                className="bg-white shadow cursor-pointer transition-all duration-300 flex flex-col items-center w-[100px] hover:shadow-2xl hover:-translate-y-2 rounded-t-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary-color)]"
                                                tabIndex={0}
                                                aria-label={`View details for ${region.regions_name}`}
                                                type="button"
                                                onClick={() => router.push(`/destinations/region/${region.id}`)}
                                               
                                            >
                                                {region.region_flag_url && (
                                                    <img
                                                        src={region.region_flag_url}
                                                        alt={`Flag of ${region.regions_name}`}
                                                        className="w-full h-12 rounded-t-sm"
                                                    />
                                                )}
                                                <div className="text-xs p-1 text-center bg-black text-white w-full h-full rounded-b-sm">
                                                    <p>{region.regions_name}</p>
                                                </div>
                                            </button>
                                        ))
                                    ) : (
                                        <span className="text-gray-500" role="status" aria-live="polite">No popular regions found.</span>
                                    )
                                )}
                            </div>
                        </section>

                        <div className="flex justify-center mt-6">
                            <button
                                className="bg-[var(--brand-primary-color)] cursor-pointer text-white w-80 py-3 rounded-lg font-semibold hover:bg-[var(--brand-primary-color-hover,#1a202c)] transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--brand-primary-color)] focus:ring-offset-white"
                                style={{
                                    // Fallback for insufficient contrast: use black text if brand color is too light
                                    color: "var(--brand-primary-foreground-color, #fff)",
                                    backgroundColor: "var(--brand-primary-color, #1a202c)",
                                }}
                                onClick={() => {
                                    router.push("/destinations");
                                }}
                                aria-label="View all destinations"
                                type="button"
                            >
                                View All Destinations
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            
        </div>

        <FeaturesMarqueeRibbon/>
  </>
        
    );
}