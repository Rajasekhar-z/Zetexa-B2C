'use client'

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchOrderData, fetchEkycDetails, requestOTPForAdhar, verifyOTPForAdhar, uploadPassport, uploadVISAOrTicket } from '../lib/api/ekyc';
import { Upload } from 'lucide-react';
import AadhaarStep from './AadhaarStep';
import PassportStep from './PassportStep';
import VisaOrTicketStep from './VisaOrTicketStep';
import EkycCompleted from './EkycCompleted';

export default function EkycVerificationPage() {
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aadharNumber, setAadharNumber] = useState('');
  const [otp, setAadharOtp] = useState('');
  const [aadharData, setAadharData] = useState<any>(null);
  const [passportFirstpage, setPassportFirstPage] = useState<any>(null);
  const [passportLastpage, setPassportLastPage] = useState<any>(null);
  const [visaFile, setVisaFile] = useState<any>(null);
  const [ticketFile, setTicketFile] = useState<any>(null);
  const [selectedDocType, setSelectedDocType] = useState<'visa' | 'ticket'>('visa');
  const [customerEkycStatus, setCustomerEkycStatus] = useState<string>('')
  const [isKycDone, setIsKycDone] = useState<boolean>(false)
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState('');

  useEffect(() => {
    const orderIdFromParams = searchParams.get('orderid');
    if (orderIdFromParams) {
      const loadOrderData = async () => {
        try {
          setLoading(true);
          setError(null);

          const [orderDataResult, ekycDetailsResult] = await Promise.all([
            fetchOrderData(orderIdFromParams),
            fetchEkycDetails(orderIdFromParams)
          ]);

          // setCustomerEkycStatus(ekycDetailsResult.order_status)
         
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred while fetching order details');
          // The error is that 'err' is of type 'unknown', so you cannot access 'err.message' directly.
          // You must first check or assert its type before accessing properties.
          // For example:
          if (err instanceof Error && err.message === 'Order Completed'){
            setIsKycDone(true)
          }
        } finally {
          setLoading(false);
        }
      };
      loadOrderData();
    } else {
      setError('Order ID is required');
      setLoading(false);
    }
  }, [searchParams]);

  const handleOTPRequestForAdhar = async () => {
    setOtpLoading(true);
    setOtpError('');
    setOtpSuccess('');
    const orderIdFromParams = searchParams.get('orderid');
    const reqObj = {
      "aadhar_number": aadharNumber,
      "order_id": orderIdFromParams,
    };
    try {
      const response = await requestOTPForAdhar(reqObj);
      setAadharData(response.data.data);
      setShowOtpSection(true);
      setOtpSuccess('OTP sent successfully!');
    } catch (err) {
      setOtpError('Failed to send OTP. Please try again.');
      setShowOtpSection(false);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTPForAdhar = async () => {
    setOtpError('');
    setOtpSuccess('');
    const orderIdFromParams = searchParams.get('orderid');
    let reqObj = {
      "order_id": orderIdFromParams,
      "client_id": aadharData ? aadharData.client_id : '',
      "otp": otp,
      "aadhar_number": aadharNumber
    }
    try {
      const response = await verifyOTPForAdhar(reqObj);
      setOtpSuccess('OTP verified successfully!');
      // Optionally, move to next step or update KYC status here
    } catch {
      setOtpError('Invalid OTP. Please try again.');
    }
  }

  const handleUploadPassport = async () => {
    const orderIdFromParams = searchParams.get('orderid');
    let formData = new FormData();
    if (passportFirstpage) formData.append('passport_front', passportFirstpage);
    if (passportLastpage) formData.append('passport_back', passportLastpage);
    formData.append('order_id', orderIdFromParams ? orderIdFromParams : '');
    try {
      const response = await uploadPassport(formData);
      // handle response if needed
    } catch {
      // handle error if needed
    }
  }

  // Handler for Visa or Ticket upload
  const handleUploadVisaOrTicket = async () => {
    const orderIdFromParams = searchParams.get('orderid');
    let formData = new FormData();
    formData.append('order_id', orderIdFromParams || '');

    if (selectedDocType === 'visa' && visaFile) {
      formData.append('orderlines[0][order_line_id]', orderIdFromParams || '');
      formData.append('orderlines[0][document_type]', 'VISA');
      formData.append('orderlines[0][document]', visaFile);
    } else if (selectedDocType === 'ticket' && ticketFile) {
      formData.append('orderlines[0][order_line_id]', orderIdFromParams || '');
      formData.append('orderlines[0][document_type]', 'TICKET');
      formData.append('orderlines[0][document]', ticketFile);
    }

    try {
      const response = await uploadVISAOrTicket(formData);
      if (response.success) {
        // Handle success
        console.log('Document uploaded successfully');
      } else {
        // Handle error
        console.error('Failed to upload document:', response.message);
      }
    } catch (error) {
      console.error('Error uploading document:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 py-10">
      <div className="max-w-3xl mx-auto px-2 md:px-0">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10 flex flex-col items-center border-b-4 border-blue-200">
          <h1 className="text-3xl font-extrabold text-blue-900 mb-2 tracking-tight">Complete your eKYC</h1>
          <p className="text-gray-500 text-lg">Follow the steps below to verify your identity and activate your SIM</p>
        </div>
        {/* Steps */}
        <div className="space-y-10">
          {isKycDone ? (
            <EkycCompleted />
          ) : (
            <>
              <AadhaarStep
                aadharNumber={aadharNumber}
                setAadharNumber={setAadharNumber}
                otp={otp}
                setAadharOtp={setAadharOtp}
                handleOTPRequestForAdhar={handleOTPRequestForAdhar}
                handleVerifyOTPForAdhar={handleVerifyOTPForAdhar}
                showOtpSection={showOtpSection}
                otpLoading={otpLoading}
                otpError={otpError}
                otpSuccess={otpSuccess}
              />
              <PassportStep
                passportFirstpage={passportFirstpage}
                setPassportFirstPage={setPassportFirstPage}
                passportLastpage={passportLastpage}
                setPassportLastPage={setPassportLastPage}
                handleUploadPassport={handleUploadPassport}
              />
              <VisaOrTicketStep
                selectedDocType={selectedDocType}
                setSelectedDocType={setSelectedDocType}
                visaFile={visaFile}
                setVisaFile={setVisaFile}
                ticketFile={ticketFile}
                setTicketFile={setTicketFile}
                handleUploadVisaOrTicket={handleUploadVisaOrTicket}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
