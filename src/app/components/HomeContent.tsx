"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useBranding } from "@/context/branding-context";
import { getPopularDestinations, getRegionsForReseller } from "../lib/api/home";
import { getCountries } from "../lib/api/global-api";
import { RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Search, ChevronDown } from "lucide-react";
import PopularDestinationSection from "./popularDestinationSection";

interface Destination {
    id: string | number;
    name: string;
    slug: string;
    country_name: string;
    country_flag_url: string;
    country_id: string;
}

interface Country {
    id: number;
    country_id:number;
    country_name: string;
    iso_two: string;
    country_logo_pic: string;
    country_flag:string;
}

export default function HomeContent() {
    const router = useRouter();
    const branding = useBranding();
    const [data, setData] = useState<{
        destinations: Destination[],
        regions: any[]
    }>({
        destinations: [],
        regions: []
    });
    const [countries, setCountries] = useState<Country[]>([]);
    const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
    const [selectedOption, setSelectedOption] = useState<"country" | "region">("country");
    const [searchTerm, setSearchTerm] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

    const fetchData = useCallback(async () => {
        try {
            const [destinationsRes, regionsRes, countriesRes] = await Promise.all([
                getPopularDestinations(branding.reseller_id, branding.currency),
                getRegionsForReseller(branding.reseller_id),
                getCountries()
            ]);
            
            setData({
                destinations: destinationsRes.data.countries_ids || [],
                regions: regionsRes.data || []
            });
            
            setCountries(countriesRes.data || []);
            setFilteredCountries(countriesRes.data || []);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, [branding.reseller_id, branding.currency]);
    
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (searchTerm === '') {
            setFilteredCountries(countries);
        } else {
            const filtered = countries.filter(country =>
                country.country_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredCountries(filtered);
        }
    }, [searchTerm, countries]);
    
    const toggleCountryRegion = (value: "country" | "region") => {
        setSelectedOption(value);
    };

    const handleCountrySelect = (country: Country) => {
        setSelectedCountry(country);
        setSearchTerm(country.country_name);
        setShowDropdown(false);
        
        // Navigate to the country's eSIM page
        const countrySlug = country.country_name.toLowerCase().replace(/\s+/g, '-');
        router.push(`/esim/${countrySlug}`);
    };

    const transformData = (item: any) => ({
        name: item[selectedOption === "country" ? "country_name" : "regions_name"],
        flagUrl: item[selectedOption === "country" ? "country_flag_url" : "region_flag_url"],
        linkSlug: item[selectedOption === "country" ? "country_name" : "regions_name"].toLowerCase().replace(/\s+/g, '-'),
    });

    const displayItems = selectedOption === "country" 
        ? data.destinations.map(transformData)
        : data.regions.map(transformData);

    return (
        <div className="flex flex-col items-center min-h-screen mt-15">
            {/* <h1 className="text-3xl font-bold mb-8">Popular Destinations</h1> */}
            <div className="flex flex-col items-center justify-center mb-5">
                <p className="text-4xl font-bold">Where would you like to Travel?</p>
                <RadioGroup defaultValue="country" className="flex flex-row gap-4 justify-center mt-2"
                    onValueChange={(value) => {
                            toggleCountryRegion(value as "country" | "region");
                    }}
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="country" id="country" className="cursor-pointer border-2 " />
                        <Label htmlFor="country">Country</Label>
                    </div>
                    <div className="flex items-center space-x-2  rounded-md p-2">
                        <RadioGroupItem value="region" id="region" className="cursor-pointer border-2 " />
                        <Label htmlFor="region">Region</Label>
                    </div>
                </RadioGroup>
            </div>
            
            {/* Country Search Dropdown */}
            <div className="w-full max-w-md mb-8">
                <div className="relative">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search for any destinations..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setShowDropdown(true);
                            }}
                            onFocus={() => setShowDropdown(true)}
                            className="w-full px-4 py-3 pl-12 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                    
                    {/* Dropdown */}
                    {showDropdown && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {filteredCountries.length > 0 ? (
                                filteredCountries.map((country) => (
                                    <button
                                        key={country.country_id}
                                        onClick={() => handleCountrySelect(country)}
                                        className="cursor-pointer w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                                    >
                                        <img 
                                            src={`${process.env.NEXT_PUBLIC_ADMIN_API}${country.country_flag}`}
                                            alt={country.country_name}
                                            className="w-6 h-4 object-cover rounded"
                                        />
                                        <span className="text-gray-800">{country.country_name}</span>
                                    </button>
                                ))
                            ) : (
                                <div className="px-4 py-3 text-gray-500 text-center">
                                    No countries found
                                </div>
                            )}
                        </div>
                    )}
                </div>
                
                {/* Overlay to close dropdown when clicking outside */}
                {showDropdown && (
                    <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowDropdown(false)}
                    />
                )}
            </div>

            {
                selectedOption === "country" && (
                    <PopularDestinationSection destinations={displayItems} />
                )
            }
            {
                selectedOption === "region" && (
                    <PopularDestinationSection destinations={displayItems} />
                )
            }
        </div>
    );
} 