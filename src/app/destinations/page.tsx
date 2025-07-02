"use client";
import { useBranding } from "@/context/branding-context";
import { getDestinations } from "@/app/lib/api/destinations";
import { useEffect, useState } from "react";

export default function Destinations() {
  const branding = useBranding();
  const [allDestinations, setAllDestinations] = useState<any[]>([]); // Store original list
  const [filteredDestinations, setFilteredDestinations] = useState<any[]>([]); // Store filtered list
  
  useEffect(() => {
    getDestinations({page: 1, page_size: 250, currency: branding.currency})
      .then((res) => {
        setAllDestinations(res.data);
        setFilteredDestinations(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSearch = (searchTerm: string) => {
    if (searchTerm === '') {
      setFilteredDestinations(allDestinations);
    } else {
      const filtered = allDestinations.filter(destination =>
        destination.country_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDestinations(filtered);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Search an international
      destination</h1>
      <div className="mb-8">
        <div className="relative max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Search destinations..."
            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={(e) => handleSearch(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none bg-gray-200 rounded-full h-[50px] w-[50px]">
            <svg className="w-6 h-6 text-gray-400 m-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredDestinations.map((destination, index) => (
          <a 
            className="cursor-pointer relative" 
            style={{
              backgroundImage: `url(${process.env.NEXT_PUBLIC_ADMIN_API}${destination.country_logo_pic})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              minHeight: '300px',
              display: 'block'
            }}
            href={`/esim/${destination.country_name.toLowerCase().replace(/\s+/g, '-')}`} 
            key={index}
          >
            <div className="bg-white/70 shadow-md overflow-hidden absolute bottom-0 w-full rounded-b-lg">
              <div className="p-1">
                <h2 className="text-xl mb-2 text-center text-black">{destination.country_name}</h2>
                <p className="text-center text-sm text-black">Starts from {destination.currency_symbol}{destination.starts_at}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
