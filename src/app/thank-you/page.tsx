'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Home, Smartphone, BookOpen, Download, Globe, Wifi, Clock, UserCheck } from "lucide-react";

interface TransactionDetails {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

// API function to call on mount
const callThankYouAPI = async (transactionDetails: TransactionDetails) => {
    try {
        const url = `${process.env.NEXT_PUBLIC_ORDERS_API}${process.env.NEXT_PUBLIC_API_V1}/Order-Success-Check?razorpay_payment_link_status=paid&razorpay_order_id=${transactionDetails.razorpay_order_id}&razorpay_payment_id=${transactionDetails.razorpay_payment_id}&razorpay_signature=${transactionDetails.razorpay_signature}&reseller_id=8369ab78-e56b-41cf-b21c-a8409d3a2296&reseller_name=Zetexa`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Thank you API error:', error);
        throw error;
    }
};

export default function ThankYou() {
    const router = useRouter();
    const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | null>(null);
    const [apiResponse, setApiResponse] = useState<any>(null);
    const [apiError, setApiError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const transactionObj = sessionStorage.getItem('transactionObj');
        if (!transactionObj) {
            setLoading(false);
            return;
        }

        const details = JSON.parse(transactionObj);
        setTransactionDetails(details);
        sessionStorage.removeItem('transactionObj');

        setLoading(true);
        callThankYouAPI(details)
            .then((response) => {
                setApiResponse(response);                
                setLoading(false);
            })
            .catch((error) => {
                setApiError(error.message);
                setLoading(false);
            });

    }, []);


    const handleEkycRedirect = () => {
        if (apiResponse && apiResponse?.order_details?.[0]?.order_id) {
            router.push(`/ekyc-verification?orderid=${apiResponse?.order_details?.[0]?.order_id}`);
        }
    };

    if (loading) {
        return <div className="text-center py-20">Loading...</div>;
    }

    if (apiError) {
        return <div className="text-center py-20 text-red-600">Error: {apiError}</div>;
    }

    if (!transactionDetails) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Success Header */}
                <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Payment Successful!
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Thank you for your purchase. Your eSIM is ready for activation.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Column - Transaction Details & Actions */}
                    <div className="space-y-8">
                        {/* Transaction Details Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <div className="flex items-center mb-6">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                    <Download className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Transaction Details</h2>
                                    <p className="text-gray-600">Your payment has been processed successfully</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Payment ID</p>
                                        <p className="text-sm text-gray-900 font-mono break-all">
                                            {transactionDetails?.razorpay_payment_id}
                                        </p>
                                    </div>
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Order ID</p>
                                        <p className="text-sm text-gray-900 font-mono break-all">
                                            {transactionDetails?.razorpay_order_id}
                                        </p>
                                    </div>
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-4 h-4 text-blue-600" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">What's Next?</h3>
                            <div className="space-y-4">
                                {/* Conditional eKYC Button */}
                                {apiResponse?.ekyc_link && (
                                    <button
                                        onClick={handleEkycRedirect}
                                        className="cursor-pointer w-full flex items-center justify-between p-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <UserCheck className="w-5 h-5" />
                                            <span className="font-semibold">Complete eKYC</span>
                                        </div>
                                        <span className="text-sm opacity-90">Required for activation</span>
                                    </button>
                                   
                                )}
                                 {/* <p>apiResponse.data</p>x */}
                                <p>Here is the print {apiResponse?.ekyc_link}</p>
                                <button
                                    onClick={() => router.push('/installation-guide')}
                                    className="cursor-pointer w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                >
                                    <div className="flex items-center space-x-3">
                                        <BookOpen className="w-5 h-5" />
                                        <span className="font-semibold">Installation Guide</span>
                                    </div>
                                    <span className="text-sm opacity-90">Setup your eSIM</span>
                                </button>

                                <button
                                    onClick={() => router.push('/my-esim')}
                                    className="cursor-pointer w-full flex items-center justify-between p-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                >
                                    <div className="flex items-center space-x-3">
                                        <Smartphone className="w-5 h-5" />
                                        <span className="font-semibold">My eSIMs</span>
                                    </div>
                                    <span className="text-sm opacity-90">Manage your plans</span>
                                </button>

                                <button
                                    onClick={() => router.push('/')}
                                    className="cursor-pointer w-full flex items-center justify-between p-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 transform hover:scale-105"
                                >
                                    <div className="flex items-center space-x-3">
                                        <Home className="w-5 h-5" />
                                        <span className="font-semibold">Back to Home</span>
                                    </div>
                                    <span className="text-sm opacity-70">Browse more plans</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Plan Details */}
                    <div className="space-y-8">
                        {/* Plan Details Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <div className="flex items-center mb-6">
                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                                    <Globe className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Your eSIM Plan</h2>
                                    <p className="text-gray-600">Plan details and features</p>
                                </div>
                            </div>

                            {apiResponse?.data?.Packages?.map((plan: any, index: number) => (
                                <div key={index} className="border-2 border-purple-200 rounded-xl p-6 mb-4 bg-gradient-to-br from-purple-50 to-blue-50">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-bold text-gray-900">{plan.package_name}</h3>
                                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                            <CheckCircle className="w-4 h-4 text-purple-600" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                                            <Wifi className="w-5 h-5 text-blue-600" />
                                            <div>
                                                <p className="text-sm text-gray-500">Data</p>
                                                <p className="font-semibold text-gray-900">{plan.package_data}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                                            <Globe className="w-5 h-5 text-green-600" />
                                            <div>
                                                <p className="text-sm text-gray-500">Coverage</p>
                                                <p className="font-semibold text-gray-900">{plan.package_coverage}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                                            <Clock className="w-5 h-5 text-purple-600" />
                                            <div>
                                                <p className="text-sm text-gray-500">Validity</p>
                                                <p className="font-semibold text-gray-900">
                                                    {plan.perioddays} {plan.perioddays > 1 ? 'Days' : 'Day'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                            <div>
                                                <p className="text-sm text-gray-500">Status</p>
                                                <p className="font-semibold text-green-600">Active</p>
                                            </div>
                                        </div> */}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Support Card */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-8 text-white">
                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-4">
                                    <CheckCircle className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-bold">Need Help?</h3>
                            </div>
                            <p className="text-blue-100 mb-4">
                                Our support team is available 24/7 to help you with eSIM activation and any questions.
                            </p>
                            <div className="space-y-2 text-sm text-blue-100">
                                <p>📧 support@zetexa.com</p>
                                <p>📞 +1 (555) 123-4567</p>
                                <p>💬 Live chat available</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 