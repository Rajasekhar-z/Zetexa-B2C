import React from 'react';
import { CheckCircle } from 'lucide-react';

const EkycCompleted: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[300px] bg-green-50 rounded-xl shadow-md p-8 border-l-4 border-green-400">
    <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
    <h2 className="text-2xl font-bold text-green-700 mb-2">eKYC Completed!</h2>
    <p className="text-green-800 text-lg">Thank you. Your identity has been verified and your SIM will be activated soon.</p>
  </div>
);

export default EkycCompleted; 