'use client';

import { addToCart } from "@/app/lib/api/product";
import { useBranding } from "@/context/branding-context";
import { useRouter } from "next/navigation";
import { Clock, Wifi, Globe, CheckCircle, ShoppingCart } from "lucide-react";

interface EsimClientProps {
  readableDestination: string;
  destinationPackages: Array<{
    package_id: string;
    package_ui_slug: string;
    perioddays: number;
    currency_symbol: string;
    package_price: number;
  }>;
}

export default function EsimClient({ readableDestination, destinationPackages }: EsimClientProps) {
  const router = useRouter();
  const branding = useBranding();

  const handleBuyNow = async (plan: any) => {
    const payload = {
      agent_id: "",
      currency: branding.currency,
      package_id: plan.package_id,
      quantity: 1,
      reseller_id: branding.reseller_id,
      source_referance_name: "",
      source_reference_id: "b2c"
    };

    try {
      const response = await addToCart(payload);
      if(response.success) {
        sessionStorage.setItem('checkout_id', response.CheckoutId);
        
        router.push('/checkout');
      }
      if (!response.success) {
        console.error('Failed to add to cart:', response.message);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Globe className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Data Plans for {readableDestination}
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the perfect eSIM plan for your stay in {readableDestination}. 
            Stay connected with reliable, high-speed internet coverage.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinationPackages.map((plan, index) => (
            <div
              key={plan.package_id}
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden ${
                index === 1 ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
              }`}
            >
              {/* Popular Badge */}
              {index === 1 && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
                  Most Popular
                </div>
              )}

              {/* Card Header */}
              <div className="p-8 pb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{plan.package_ui_slug}</h2>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Wifi className="w-6 h-6 text-blue-600" />
                  </div>
                </div>

                {/* Duration */}
                <div className="flex items-center text-gray-600 mb-6">
                  <Clock className="w-5 h-5 mr-2 text-blue-500" />
                  <span className="font-medium">
                    {plan.perioddays} {plan.perioddays > 1 ? 'Days' : 'Day'} Validity
                  </span>
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Nationwide Coverage</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">High-Speed 4G/5G</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Instant Activation</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">24/7 Support</span>
                  </div>
                </div>
              </div>

              {/* Price Section */}
              <div className="bg-gray-50 px-8 py-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Total Price</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {plan.currency_symbol}{(plan.package_price).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Per Plan</p>
                    <p className="text-lg font-semibold text-blue-600">
                      {plan.currency_symbol}{(plan.package_price / plan.perioddays).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400">per day</p>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  className="cursor-pointer w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                  onClick={() => handleBuyNow(plan)}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Buy Now</span>
                </button>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent hover:border-blue-200 transition-colors duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Coverage</h3>
              <p className="text-gray-600">Stay connected in {readableDestination} with our reliable network coverage.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wifi className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">High Speed</h3>
              <p className="text-gray-600">Enjoy fast 4G/5G speeds for seamless browsing and streaming.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Setup</h3>
              <p className="text-gray-600">Get connected immediately with our instant eSIM activation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 