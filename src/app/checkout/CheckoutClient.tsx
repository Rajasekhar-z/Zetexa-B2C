'use client';

import { useEffect, useState } from 'react';
import { useBranding } from "@/context/branding-context";
import { getCheckout } from "../lib/api/global-api";
import UserDetailsForm from './UserDetailsForm';
import OrderSummary from './OrderSummary';
import { proceedToPayment } from '../lib/api/checkout';
import { initializeRazorpay, RazorpayResponse } from '../lib/razorpay';
import { useRouter } from 'next/navigation';
import { CreditCard, User, CheckCircle, ArrowRight, Shield, Lock } from "lucide-react";

interface PaymentMethod {
    id: string;
    name: string;
    logo_url: string;
}

interface CheckoutClientProps {
    paymentMethods: PaymentMethod[];
    countries: any[];
}

type CheckoutStep = 'user-details' | 'payment';

export default function CheckoutClient({ paymentMethods, countries }: CheckoutClientProps) {
    const router = useRouter();
    const branding = useBranding();
    const [checkoutData, setCheckoutData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState<CheckoutStep>('user-details');
    const [userDetails, setUserDetails] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCheckoutData = async () => {
            try {
                const checkoutId = sessionStorage.getItem('checkout_id');
                if (!checkoutId) {
                    throw new Error('No checkout ID found');
                }

                const response = await getCheckout({
                    checkout_id: checkoutId,
                    reseller_id: branding.reseller_id,
                    currency: branding.currency,
                });

                setCheckoutData(response);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load checkout data');
            }
        };

        fetchCheckoutData();
    }, [branding.reseller_id, branding.currency]);

    const handleUserDetailsSubmit = (details: any) => {
        setUserDetails(details);
        setCurrentStep('payment');
    };

    const handlePaymentSuccess = (response: RazorpayResponse) => {
        sessionStorage.setItem('transactionObj', JSON.stringify(response));
        router.push('/thank-you');
    };

    const handlePaymentMethodClick = async (method: any) => {
        try {
            setLoading(true);
            const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY;
            if (!razorpayKey) {
                throw new Error('Razorpay key is not configured');
            }

            const response = await proceedToPayment({
                email: userDetails?.email,
                confirm_email: userDetails?.confirmEmail,
                first_name: userDetails?.firstName,
                last_name: userDetails?.lastName,
                nationality: userDetails?.nationality,
                payment_method: method.name,
                residing_at_nationality: false,
                checkout_id: checkoutData.data[0].checkout_id,
                agree: true,
                currency: branding.currency,
                reseller_id: branding.reseller_id,
                reseller_email: "zetexa@zetexa.com"
            });

            if (response.success) {
                const razorpayOptions = {
                    key: razorpayKey,
                    amount: response.data.OrderData.amount,
                    currency: response.data.OrderData.currency,
                    name: 'Zetexa Global',
                    description: 'eSIM Purchase',
                    image: 'https://zetexa-dev-media-files.s3.ap-south-1.amazonaws.com/zetexa-portal-media/zetexa-web-media/fav.png',
                    order_id: response.data.OrderData.id,
                    handler: handlePaymentSuccess,
                    prefill: {
                        name: `${userDetails?.firstName} ${userDetails?.lastName}`,
                        email: userDetails?.email,
                    },
                    theme: {
                        color: '#5934A4'
                    }
                };

                await initializeRazorpay(razorpayOptions);
            } else {
                setError(response.message);
            }
        } catch (err) {
            console.error('Payment Error:', err);
            setError(err instanceof Error ? err.message : 'Payment initialization failed');
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Checkout Error</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button 
                        onClick={() => router.push('/')}
                        className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
                    >
                        Return to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <span className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-blue-600" />
                        </span>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Secure Checkout
                        </h1>
                        <span className="flex items-center gap-1 ml-2 px-2 py-0.5 bg-green-50 text-green-700 text-xs font-semibold rounded">
                            <Lock className="w-4 h-4" />
                            SSL Secured
                        </span>
                    </div>
                    <p className="text-base text-gray-600 max-w-xl mx-auto">
                        Complete your eSIM purchase with our secure payment system
                    </p>
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center justify-center mb-8">
                    <div className="flex items-center space-x-4">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                            currentStep === 'user-details' 
                                ? 'bg-blue-500 border-blue-500 text-white' 
                                : 'bg-green-500 border-green-500 text-white'
                        }`}>
                            {currentStep === 'user-details' ? (
                                <span className="text-sm font-semibold">1</span>
                            ) : (
                                <CheckCircle className="w-5 h-5" />
                            )}
                        </div>
                        <div className={`flex-1 h-0.5 ${currentStep === 'payment' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                            currentStep === 'payment' 
                                ? 'bg-blue-500 border-blue-500 text-white' 
                                : 'bg-gray-100 border-gray-300 text-gray-500'
                        }`}>
                            <span className="text-sm font-semibold">2</span>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {currentStep === 'user-details' ? (
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <div className="flex items-center mb-6">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                        <User className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                                        <p className="text-gray-600">Please provide your details to continue</p>
                                    </div>
                                </div>
                                <UserDetailsForm onSubmit={handleUserDetailsSubmit} countries={countries} />
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <div className="flex items-center mb-6">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                                        <CreditCard className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>
                                        <p className="text-gray-600">Choose your preferred payment option</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    {paymentMethods.map((method) => (
                                        <div 
                                            key={method.id}
                                            className="relative border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
                                            onClick={() => !loading && handlePaymentMethodClick(method)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center p-2">
                                                        <img 
                                                            src={method.logo_url} 
                                                            alt={method.name} 
                                                            className="h-8 w-auto object-contain"
                                                        />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900 text-lg">{method.name}</h3>
                                                        <p className="text-gray-500 text-sm">Secure payment gateway</p>
                                                    </div>
                                                </div>
                                                {/* <div className="flex items-center space-x-2">
                                                    <Shield className="w-5 h-5 text-green-500" />
                                                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                                </div> */}
                                            </div>
                                            
                                            {loading && (
                                                <div className="absolute inset-0 bg-white/80 rounded-xl flex items-center justify-center">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Security Notice */}
                                <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
                                    <div className="flex items-start space-x-3">
                                        <Lock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold text-blue-900 mb-1">Secure Payment</h4>
                                            <p className="text-blue-700 text-sm">
                                                Your payment information is encrypted and secure. We use industry-standard SSL encryption to protect your data.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        {checkoutData && (
                            <div className="sticky top-20">
                                <OrderSummary checkoutData={checkoutData} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 