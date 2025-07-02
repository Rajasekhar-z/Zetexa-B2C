import React from 'react';

interface AadhaarStepProps {
  aadharNumber: string;
  setAadharNumber: (val: string) => void;
  otp: string;
  setAadharOtp: (val: string) => void;
  handleOTPRequestForAdhar: () => void;
  handleVerifyOTPForAdhar: () => void;
  showOtpSection: boolean;
  otpLoading?: boolean;
  otpError?: string;
  otpSuccess?: string;
}

const AadhaarStep: React.FC<AadhaarStepProps> = ({
  aadharNumber,
  setAadharNumber,
  otp,
  setAadharOtp,
  handleOTPRequestForAdhar,
  handleVerifyOTPForAdhar,
  showOtpSection,
  otpLoading = false,
  otpError = '',
  otpSuccess = '',
}) => (
  <section className="bg-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row items-center gap-8 border-l-4 border-blue-500 relative">
    <div className="absolute -left-6 top-8 flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 border-4 border-blue-500 shadow text-blue-700 text-2xl font-bold">1</div>
    <div className="flex-1">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-2xl font-extrabold text-blue-800 tracking-tight">Aadhaar Verification</h2>
      </div>
      <div className="space-y-6 max-w-md">
        <label className="block text-sm font-semibold text-gray-700 mb-1">Aadhaar Number</label>
        <input
          type="text"
          placeholder="Enter 12-digit Aadhaar number"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-700 text-lg shadow-sm transition"
          maxLength={12}
          value={aadharNumber}
          onChange={e => setAadharNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
          disabled={showOtpSection}
        />
        <button
          className="cursor-pointer w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200 shadow disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          onClick={handleOTPRequestForAdhar}
          disabled={aadharNumber.length !== 12 || showOtpSection || otpLoading}
        >
          {otpLoading ? (
            <span className="loader border-t-2 border-white border-solid rounded-full w-5 h-5 animate-spin"></span>
          ) : (
            'Get OTP'
          )}
        </button>
        {otpError && <div className="text-red-600 text-sm font-medium mt-2">{otpError}</div>}
        {otpSuccess && <div className="text-green-600 text-sm font-medium mt-2">{otpSuccess}</div>}
        {/* OTP Section */}
        {showOtpSection && (
          <div className="pt-4 border-t border-gray-200 mt-4 animate-fade-in">
            <label className="block text-sm font-semibold text-gray-700 mb-1 mt-2">OTP</label>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest bg-gray-50 text-gray-700 shadow-sm"
              maxLength={6}
              value={otp}
              onChange={e => setAadharOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            />
            <button
              className="cursor-pointer w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200 shadow mt-3 disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleVerifyOTPForAdhar}
              disabled={otp.length !== 6}
            >
              Verify OTP
            </button>
          </div>
        )}
      </div>
    </div>
    <style>{`
      .loader {
        border-width: 2px;
        border-style: solid;
        border-color: #fff transparent transparent transparent;
        display: inline-block;
      }
      @keyframes animate-fade-in {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in {
        animation: animate-fade-in 0.4s ease;
      }
    `}</style>
  </section>
);

export default AadhaarStep; 