'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, User, Lock, ArrowLeft, Phone } from 'lucide-react';
import OTPInput from '@/components/ui/otp-input';

interface SignupFormData {
    name: string;
    email: string;
    phone: string;
    otp: string;
}

export default function SignupPage() {
    const router = useRouter();
    const [step, setStep] = useState<'details' | 'otp'>('details');
    const [formData, setFormData] = useState<SignupFormData>({
        name: '',
        email: '',
        phone: '',
        otp: ''
    });
    const [errors, setErrors] = useState<Partial<SignupFormData>>({});
    const [isLoading, setIsLoading] = useState(false);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone: string): boolean => {
        const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
        return phoneRegex.test(phone);
    };

    const validateOTP = (otp: string): boolean => {
        return otp.length === 6 && /^\d+$/.test(otp);
    };

    const handleDetailsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Partial<SignupFormData> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.phone) {
            newErrors.phone = 'Phone number is required';
        } else if (!validatePhone(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        try {
            // Simulate API call to send OTP
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            setStep('otp');
            setErrors({});
            
            // In a real app, you would call your API here
            // const response = await fetch('/api/signup/send-otp', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ 
            //         name: formData.name,
            //         email: formData.email,
            //         phone: formData.phone 
            //     })
            // });
            
        } catch (error) {
            console.error('Error sending OTP:', error);
            setErrors({ email: 'Failed to send OTP. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleOTPSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Partial<SignupFormData> = {};

        if (!formData.otp) {
            newErrors.otp = 'OTP is required';
        } else if (!validateOTP(formData.otp)) {
            newErrors.otp = 'Please enter a valid 6-digit OTP';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        try {
            // Simulate API call to verify OTP and create account
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // In a real app, you would call your API here
            // const response = await fetch('/api/signup/verify-otp', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ 
            //         name: formData.name,
            //         email: formData.email,
            //         phone: formData.phone,
            //         otp: formData.otp 
            //     })
            // });
            
            // Redirect to login page after successful signup
            router.push('/login');
            
        } catch (error) {
            console.error('Error verifying OTP:', error);
            setErrors({ otp: 'Invalid OTP. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setIsLoading(true);
        try {
            // Simulate API call to resend OTP
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // In a real app, you would call your API here
            // const response = await fetch('/api/signup/resend-otp', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ 
            //         name: formData.name,
            //         email: formData.email,
            //         phone: formData.phone 
            //     })
            // });
            
            alert('OTP resent successfully!');
        } catch (error) {
            console.error('Error resending OTP:', error);
            alert('Failed to resend OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: keyof SignupFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        {step === 'details' ? 'Create your account' : 'Verify your email'}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {step === 'details' 
                            ? 'Enter your details to create a new account'
                            : `We've sent a 6-digit code to ${formData.email}`
                        }
                    </p>
                </div>

                <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
                    {step === 'details' ? (
                        <form onSubmit={handleDetailsSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Full Name
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        required
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className={`appearance-none relative block w-full pl-10 pr-3 py-2 border ${
                                            errors.name ? 'border-red-300' : 'border-gray-300'
                                        } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                {errors.name && (
                                    <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email address
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className={`appearance-none relative block w-full pl-10 pr-3 py-2 border ${
                                            errors.email ? 'border-red-300' : 'border-gray-300'
                                        } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                                        placeholder="Enter your email"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                    Phone Number
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        autoComplete="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        className={`appearance-none relative block w-full pl-10 pr-3 py-2 border ${
                                            errors.phone ? 'border-red-300' : 'border-gray-300'
                                        } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                                {errors.phone && (
                                    <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
                                )}
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="cursor-pointer group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Sending OTP...
                                        </div>
                                    ) : (
                                        'Create Account'
                                    )}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleOTPSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-4">
                                    One-Time Password
                                </label>
                                <OTPInput
                                    length={6}
                                    value={formData.otp}
                                    onChange={(value) => handleInputChange('otp', value)}
                                    disabled={isLoading}
                                    error={!!errors.otp}
                                />
                                {errors.otp && (
                                    <p className="mt-2 text-sm text-red-600 text-center">{errors.otp}</p>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={() => setStep('details')}
                                    className=" cursor-pointer flex items-center text-sm text-blue-600 hover:text-blue-500"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-1" />
                                    Back to details
                                </button>
                                <button
                                    type="button"
                                    onClick={handleResendOTP}
                                    disabled={isLoading}
                                    className="cursor-pointer text-sm text-blue-600 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Resend OTP
                                </button>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading || formData.otp.length !== 6}
                                    className="cursor-pointer group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Creating Account...
                                        </div>
                                    ) : (
                                        'Verify & Create Account'
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <button
                            onClick={() => router.push('/login')}
                            className="cursor-pointer font-medium text-blue-600 hover:text-blue-500"
                        >
                            Sign in
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
} 