import React from 'react';
import { Upload } from 'lucide-react';

interface PassportStepProps {
  passportFirstpage: File | null;
  setPassportFirstPage: (file: File | null) => void;
  passportLastpage: File | null;
  setPassportLastPage: (file: File | null) => void;
  handleUploadPassport: () => void;
}

const PassportStep: React.FC<PassportStepProps> = ({
  passportFirstpage,
  setPassportFirstPage,
  passportLastpage,
  setPassportLastPage,
  handleUploadPassport,
}) => (
  <section className="bg-white rounded-xl shadow-md p-8 flex flex-col md:flex-row items-center gap-8 border-l-4 border-indigo-400 relative">
    <div className="absolute -left-6 top-8 flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 border-4 border-indigo-400 shadow text-indigo-700 text-2xl font-bold">2</div>
    <div className="flex-1">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-xl font-bold text-indigo-800">Passport Upload</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-6 max-w-2xl">
        <div className="border-2 border-dashed border-indigo-200 rounded-lg p-6 text-center bg-indigo-50 cursor-pointer relative overflow-hidden">
          <h3 className="text-lg font-semibold text-indigo-900 mb-2">Passport First Page</h3>
          <p className="text-gray-600 mb-4">Upload the first page of your passport</p>
          <input 
            type="file" 
            className="absolute inset-0 opacity-0 cursor-pointer z-10" 
            onChange={e => { if (e.target.files && e.target.files[0]) setPassportFirstPage(e.target.files[0]); }}
            accept=".pdf,.jpg,.jpeg,.png"
          />
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Upload className="w-6 h-6 text-indigo-600" />
          </div>
          {passportFirstpage && (
            <p className="text-sm text-indigo-600 mt-2 truncate">
              Selected: {passportFirstpage.name}
            </p>
          )}
        </div>
        <div className="border-2 border-dashed border-indigo-200 rounded-lg p-6 text-center bg-indigo-50 cursor-pointer relative overflow-hidden">
          <h3 className="text-lg font-semibold text-indigo-900 mb-2">Passport Last Page</h3>
          <p className="text-gray-600 mb-4">Upload the last page of your passport</p>
          <input 
            type="file" 
            className="absolute inset-0 opacity-0 cursor-pointer z-10" 
            onChange={e => { if (e.target.files && e.target.files[0]) setPassportLastPage(e.target.files[0]); }}
            accept=".pdf,.jpg,.jpeg,.png"
          />
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Upload className="w-6 h-6 text-indigo-600" />
          </div>
          {passportLastpage && (
            <p className="text-sm text-indigo-600 mt-2 truncate">
              Selected: {passportLastpage.name}
            </p>
          )}
        </div>
      </div>
      <button
        className="cursor-pointer w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow mt-6 disabled:opacity-60"
        onClick={handleUploadPassport}
        disabled={!passportFirstpage && !passportLastpage}
      >
        Verify Passport
      </button>
    </div>
  </section>
);

export default PassportStep; 