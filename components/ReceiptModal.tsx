import React from 'react';
import { Modal } from './Modal';
import { Icon } from './Icon';
import type { DonationSubmission } from '../types';
import { ShareableImpactCard } from './ShareableImpactCard';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: DonationSubmission;
  donorName: string;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, submission, donorName }) => {
  const { items, createdAt, matchDetails, donorBenefits } = submission;
  const mainItem = items[0];

  const handlePrint = () => {
    // This is a simple print, a more robust solution would generate a PDF.
    const printableContent = document.getElementById('printable-receipt');
    if (printableContent) {
        const printWindow = window.open('', '_blank');
        printWindow?.document.write('<html><head><title>Donation Receipt</title>');
        // Basic styling for the print view
        printWindow?.document.write(`
            <style>
                body { font-family: sans-serif; line-height: 1.5; color: #333; }
                .receipt-container { width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px; }
                h1, h2 { color: #111827; }
                h1 { text-align: center; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .footer { margin-top: 30px; text-align: center; font-size: 0.8em; color: #777; }
                .no-print { display: none; }
            </style>
        `);
        printWindow?.document.write('</head><body>');
        printWindow?.document.write(printableContent.innerHTML);
        printWindow?.document.write('</body></html>');
        printWindow?.document.close();
        printWindow?.focus();
        printWindow?.print();
    }
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Donation Receipt">
      <div id="printable-receipt" className="text-gray-700 dark:text-gray-300">
        <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Official Donation Receipt</h1>
            <p className="text-sm text-gray-500">SABR Logistics Network</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div>
                <h2 className="font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">From Donor</h2>
                <p className="text-gray-800 dark:text-white font-semibold">{donorName}</p>
            </div>
            <div>
                <h2 className="font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">To Beneficiary</h2>
                <p className="text-gray-800 dark:text-white font-semibold">{matchDetails?.name || 'N/A'}</p>
            </div>
             <div>
                <h2 className="font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Donation Date</h2>
                <p className="text-gray-800 dark:text-white font-semibold">{new Date(createdAt).toLocaleDateString()}</p>
            </div>
             <div>
                <h2 className="font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Receipt ID</h2>
                <p className="text-gray-800 dark:text-white font-semibold">{submission.id}</p>
            </div>
        </div>

        <div className="my-6">
            <h2 className="font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs mb-2">Donated Items</h2>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-4 border border-gray-200 dark:border-gray-700">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left font-semibold pb-2">Item</th>
                            <th className="text-center font-semibold pb-2">Quantity</th>
                            <th className="text-right font-semibold pb-2">Est. Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="pt-2">{mainItem.name}</td>
                            <td className="text-center pt-2">{mainItem.quantity} {mainItem.unit}</td>
                            <td className="text-right pt-2">${donorBenefits?.tax_deduction_value?.toFixed(2) || '0.00'}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        
        <div className="text-center bg-gray-50 dark:bg-gray-900 p-4 rounded-lg mt-6">
            <p className="text-gray-500 dark:text-gray-400">Estimated Tax-Deductible Value</p>
            <p className="text-3xl font-bold text-green-500">${donorBenefits?.tax_deduction_value?.toFixed(2) || '0.00'}</p>
        </div>

         {donorBenefits?.social_media_shareables?.[0] && (
            <div className="no-print mt-6">
                <ShareableImpactCard shareText={donorBenefits.social_media_shareables[0]} />
            </div>
         )}

        <div className="footer text-xs text-gray-500 text-center mt-6">
            <p>Thank you for your generous donation. This receipt is for your tax purposes. No goods or services were provided in exchange for this contribution.</p>
        </div>
      </div>
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
          <button type="button" onClick={onClose} title="Close" className="py-2 px-4 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold">Close</button>
          <button type="button" onClick={handlePrint} title="Print Receipt" className="flex items-center py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold">
            <Icon icon="printer" className="w-5 h-5 mr-2" title="Print Receipt" />
            Print Receipt
          </button>
        </div>
    </Modal>
  );
};