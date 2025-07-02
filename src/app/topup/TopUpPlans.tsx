import React from "react";

export type TopUpPlansProps = {
  topUpPlans: any[];
  onTopUp: (plan: any) => void;
  isLoading?: boolean;
};

const TopUpPlans: React.FC<TopUpPlansProps> = ({ topUpPlans, onTopUp, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (!topUpPlans.length) return null;
  return (
    <div className="mt-8 max-w-20xl mx-auto">
      <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">Available Top-Up Plans</h3>
      <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-6">
        {topUpPlans.map((plan, idx) => (
          <div
            key={plan.id || idx}
            className="flex flex-col justify-between bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <div>
              <div className="font-semibold text-lg text-blue-700 mb-2">
                {plan.package_ui_slug || plan.package_ui_slug || 'Plan'}
              </div>
              <div className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Data:</span> {plan.package_data || 'N/A'}
              </div>
              <div className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Validity:</span> {plan.perioddays ||  'N/A'} days
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="text-xl font-bold text-green-700">
                {plan.currency_symbol || ''} {plan.package_price.toFixed(2)}
              </div>
              <button
                onClick={() => onTopUp(plan)}
                className="cursor-pointer ml-2 px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              >
                Top Up
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopUpPlans; 