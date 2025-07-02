import Link from "next/link";

export default function PopularDestinationSection({ destinations }: { destinations: any[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 justify-center mt-8 px-4">
            {destinations.map((destination) => (
                <Link href={`/esim/${destination.linkSlug}`} key={destination.name}>
                    <div className="flex flex-col items-center justify-center group cursor-pointer">
                        {/* Flag Circle with Enhanced Styling */}
                        <div 
                            className="relative w-27 h-27 md:w-32 md:h-32 rounded-full transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl shadow-lg border-4 border-white"
                            style={{
                                backgroundImage: `url(${destination.flagUrl})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                            }}
                        >
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                {/* <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div> */}
                            </div>
                        </div>
                        
                        {/* Destination Name with Enhanced Styling */}
                        <div className="mt-4 text-center">
                            <div className="bg-white text-gray-800 px-4 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 min-w-[180px] border border-gray-100 group-hover:border-blue-200 group-hover:bg-blue-50">
                                <p className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-200">
                                    {destination.name}
                                </p>
                                <p className="text-xs text-gray-500 mt-1 group-hover:text-blue-600 transition-colors duration-200">
                                    View eSIM Plans
                                </p>
                            </div>
                        </div>
                    </div>
                </Link>
            ))} 
        </div>
    );
}