import React from 'react';
import { Share2, Copy } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const ReferralProgram = () => {
  const { user } = useAuth();
  const referralCode = user?.referralCode || user?.id?.slice(-6).toUpperCase();
  const referralLink = `${window.location.origin}/signup?ref=${referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success('Referral link copied!');
  };

  return (
    <div className="p-6 rounded-lg bg-purple-50 dark:bg-purple-900">
      <div className="flex items-center mb-4">
        <Share2 className="w-6 h-6 mr-2 text-purple-600" />
        <h3 className="text-lg font-semibold">Refer Friends</h3>
      </div>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
        Share your referral code and earn 50 loyalty points for each friend who signs up!
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          value={referralCode}
          readOnly
          className="flex-1 px-3 py-2 bg-gray-100 border rounded-lg dark:bg-gray-700"
        />
        <button
          onClick={copyToClipboard}
          className="flex items-center px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700"
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy Link
        </button>
      </div>
    </div>
  );
};

export default ReferralProgram;
