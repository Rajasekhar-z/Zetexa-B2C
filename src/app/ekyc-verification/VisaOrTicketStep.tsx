import React from 'react';
import { Upload } from 'lucide-react';

interface VisaOrTicketStepProps {
  selectedDocType: 'visa' | 'ticket';
  setSelectedDocType: (type: 'visa' | 'ticket') => void;
  visaFile: File | null;
  setVisaFile: (file: File | null) => void;
  ticketFile: File | null;
  setTicketFile: (file: File | null) => void;
  handleUploadVisaOrTicket: () => void;
}

const VisaOrTicketStep: React.FC<VisaOrTicketStepProps> = ({
  selectedDocType,
  setSelectedDocType,
  visaFile,
  setVisaFile,
  ticketFile,
  setTicketFile,
  handleUploadVisaOrTicket,
}) => (
  <section className="bg-white rounded-xl shadow-md p-8 flex flex-col md:flex-row items-center gap-8 border-l-4 border-purple-400 relative">
    <div className="absolute -left-6 top-8 flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 border-4 border-purple-400 shadow text-purple-700 text-2xl font-bold">3</div>
    <div className="flex-1">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-xl font-bold text-purple-800">Visa or Ticket Upload</h2>
      </div>
      <div className="mb-6 gap-8 flex justify-center">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="docType"
            value="visa"
            checked={selectedDocType === 'visa'}
            onChange={() => setSelectedDocType('visa')}
          />
          <span className="text-purple-800 font-medium">Visa</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="docType"
            value="ticket"
            checked={selectedDocType === 'ticket'}
            onChange={() => setSelectedDocType('ticket')}
          />
          <span className="text-purple-800 font-medium">Ticket</span>
        </label>
      </div>
      {selectedDocType === 'visa' && (
        <div className=" border-2 border-dashed border-purple-200 rounded-lg p-6 text-center bg-purple-50 cursor-pointer relative overflow-hidden">
          <h3 className="text-lg font-semibold text-purple-900 mb-2">Visa Upload</h3>
          <p className="text-gray-600 mb-4">Upload your Visa document</p>
          <input
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
            onChange={e => { if (e.target.files && e.target.files[0]) setVisaFile(e.target.files[0]); }}
            accept=".pdf,.jpg,.jpeg,.png"
          />
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Upload className="w-6 h-6 text-purple-600" />
          </div>
          {visaFile && (
            <p className="text-sm text-purple-600 mt-2 truncate">
              Selected: {visaFile.name}
            </p>
          )}
        </div>
      )}
      {selectedDocType === 'ticket' && (
        <div className="border-2 border-dashed border-purple-200 rounded-lg p-6 text-center bg-purple-50 cursor-pointer relative overflow-hidden">
          <h3 className="text-lg font-semibold text-purple-900 mb-2">Ticket Upload</h3>
          <p className="text-gray-600 mb-4">Upload your Ticket document</p>
          <input
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
            onChange={e => { if (e.target.files && e.target.files[0]) setTicketFile(e.target.files[0]); }}
            accept=".pdf,.jpg,.jpeg,.png"
          />
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Upload className="w-6 h-6 text-purple-600" />
          </div>
          {ticketFile && (
            <p className="text-sm text-purple-600 mt-2 truncate">
              Selected: {ticketFile.name}
            </p>
          )}
        </div>
      )}
      <button
        className="cursor-pointer w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow mt-6 disabled:opacity-60"
        onClick={handleUploadVisaOrTicket}
        disabled={
          (selectedDocType === 'visa' && !visaFile) ||
          (selectedDocType === 'ticket' && !ticketFile)
        }
      >
        Upload Document
      </button>
    </div>
  </section>
);

export default VisaOrTicketStep; 