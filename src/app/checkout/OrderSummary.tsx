'use client';


export default function OrderSummary({ checkoutData }: any) {
    const package_details = checkoutData.data[0].package_details[0];
    const checkout_id = checkoutData.data[0].checkout_id;
    const { currency_symbol, final_price, for_coin_value } = checkoutData.payment_data;

    return (
        <div className="bg-white rounded-xl shadow-2xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Order Summary</h2>
            <div className="space-y-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-semibold text-gray-800 text-lg">{package_details.package_ui_slug}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Validity: {package_details.perioddays} {package_details.perioddays > 1 ? 'days' : 'day'}
                        </p>
                    </div>
                </div>
                <div className="border-t border-gray-100 pt-4"> 
                    <div className="flex justify-between font-semibold text-lg">
                        <span className="text-gray-700">Total Amount</span>
                        <span className="text-gray-900">{currency_symbol} {final_price.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
} 