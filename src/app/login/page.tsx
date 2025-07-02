'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import OTPInput from '@/components/ui/otp-input';
import { isUserAuthenticated, sendLoginOTP, submitOTP } from '../lib/api/auth';

interface LoginFormData {
    email: string;
    otp: string;
}

export default function LoginPage() {
    const router = useRouter();
    const [step, setStep] = useState<'email' | 'otp'>('email');
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        otp: ''
    });
    const [errors, setErrors] = useState<Partial<LoginFormData>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [otpSent, setOtpSent] = useState(false);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateOTP = (otp: string): boolean => {
        return otp.length === 6 && /^\d+$/.test(otp);
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Partial<LoginFormData> = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        try {
           
            const response = await sendLoginOTP({ email: formData.email ,reseller_id: "8369ab78-e56b-41cf-b21c-a8409d3a2296"});
            setOtpSent(true);
            setStep('otp');
            setErrors({});
        } catch (error) {
            console.error('Error sending OTP:', error);
            setErrors({ email: 'Failed to send OTP. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleOTPSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Partial<LoginFormData> = {};

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
            const response = await submitOTP({ email: formData.email, otp: formData.otp });
            
            if (response?.success && response?.customer_info && response?.token) {
                // Authenticate the user
                await authenticateLogin(response);
            } else {
                throw new Error('Invalid response from server');
            }
            
        } catch (error) {
            console.error('Error verifying OTP:', error);
            setErrors({ otp: 'Invalid OTP. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const authenticateLogin = async (response: any) => {
        try {
            // Check if user is authenticated
            const authResult = await isUserAuthenticated(response.token);
            
            // Save user data to localStorage
            localStorage.setItem('customerToken', response.token);
            localStorage.setItem('customerInfo', JSON.stringify(response.customer_info));
            
            // Check for redirect to my-esim
            if (sessionStorage.getItem('redirectToMyEsim')) {
                sessionStorage.removeItem('redirectToMyEsim');
                router.push('/user-dashboard/my-esim');
            } else {
                router.push('/');
            }
            
        } catch (error) {
            console.error('Authentication error:', error);
            // Show error message (equivalent to toaster.error)
            alert(error instanceof Error ? error.message : 'Authentication failed');
        }
    };

    const handleResendOTP = async () => {
        setIsLoading(true);
        try {
            const response = await sendLoginOTP({ email: formData.email ,reseller_id: "8369ab78-e56b-41cf-b21c-a8409d3a2296"});
            
            alert('OTP resent successfully!');
        } catch (error) {
            console.error('Error resending OTP:', error);
            alert('Failed to resend OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: keyof LoginFormData, value: string) => {
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
                        {step === 'email' ? 'Sign in to your account' : 'Enter OTP'}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {step === 'email' 
                            ? 'Enter your email to receive a one-time password'
                            : `We've sent a 6-digit code to ${formData.email}`
                        }
                    </p>
                </div>

                <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
                    {step === 'email' ? (
                        <form onSubmit={handleEmailSubmit} className="space-y-6">
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
                                        'Send OTP'
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
                                    onClick={() => setStep('email')}
                                    className="cursor-pointer flex items-center text-sm text-blue-600 hover:text-blue-500"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-1" />
                                    Back to email
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
                                            Verifying...
                                        </div>
                                    ) : (
                                        'Verify OTP'
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <button
                            onClick={() => router.push('/signup')}
                            className="cursor-pointer font-medium text-blue-600 hover:text-blue-500"
                        >
                            Sign up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
} 