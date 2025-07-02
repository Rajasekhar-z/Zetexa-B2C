'use client';

import { useState } from 'react';

interface UserDetails {
    firstName: string;
    lastName: string;
    email: string;
    nationality: string;
    confirmEmail: string;
}

interface UserDetailsFormProps {
    onSubmit: (details: UserDetails) => void;
    countries: any[];
}

export default function UserDetailsForm({ onSubmit, countries }: UserDetailsFormProps) {
    const [formData, setFormData] = useState<UserDetails>({
        firstName: '',
        lastName: '',
        email: '',
        nationality: '',
        confirmEmail: '',
    });
    const [showNationalityDropdown, setShowNationalityDropdown] = useState(false);
    const [nationalitySearch, setNationalitySearch] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const filteredCountries = countries.filter(country =>
        country.country_name.toLowerCase().includes(nationalitySearch.toLowerCase())
    );

    const handleCountrySelect = (countryName: string) => {
        setFormData(prev => ({
            ...prev,
            nationality: countryName
        }));
        setNationalitySearch('');
        setShowNationalityDropdown(false);
    };

    return (
        <div className="bg-white rounded-xl shadow-2xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Personal Details</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                            First Name*
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            placeholder='Enter First Name'
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 transition duration-200"
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name*
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            placeholder='Enter Last Name'
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 transition duration-200"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email*
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder='Enter Email'
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 transition duration-200"
                    />
                </div>

                <div>
                    <label htmlFor="confirmEmail" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Email*
                    </label>
                    <input
                        type="email"
                        id="confirmEmail"
                        name="confirmEmail"
                        value={formData.confirmEmail}
                        onChange={handleChange}
                        required
                        placeholder='Confirm Email'
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 transition duration-200"
                    />
                </div>

                <div className="relative">
                    <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-2">
                        Nationality*
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            id="nationality"
                            name="nationality"
                            value={formData.nationality}
                            onChange={handleChange}
                            onFocus={() => setShowNationalityDropdown(true)}
                            required
                            placeholder='Select Nationality'
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 transition duration-200 cursor-pointer"
                            readOnly
                        />
                    </div>
                    
                    {showNationalityDropdown && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-hidden">
                            <div className="p-3 border-b border-gray-100">
                                <input
                                    type="text"
                                    placeholder="Search countries..."
                                    value={nationalitySearch}
                                    onChange={(e) => setNationalitySearch(e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                                    autoFocus
                                />
                            </div>
                            <div className="max-h-48 overflow-y-auto">
                                {filteredCountries.length > 0 ? (
                                    filteredCountries.map((country) => (
                                        <button
                                            key={country.country_id}
                                            type="button"
                                            onClick={() => handleCountrySelect(country.iso_two)}
                                            className="cursor-pointer w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center gap-3 border-b border-gray-100 last:border-b-0 text-gray-900 transition duration-200"
                                        >
                                            <span>{country.country_name}</span>
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-gray-400 text-center">
                                        No countries found
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    
                    {showNationalityDropdown && (
                        <div 
                            className="fixed inset-0 z-40 bg-opacity-5" 
                            onClick={() => setShowNationalityDropdown(false)}
                        />
                    )}
                </div>

                <button
                    type="submit"
                    className="cursor-pointer w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white transition duration-200 transform hover:scale-[1.02]"
                >
                    Continue to Payment
                </button>
            </form>
        </div>
    );
} 