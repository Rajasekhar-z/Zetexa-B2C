"use client";

import { useBranding } from "@/context/branding-context";
import { useEffect, useState } from "react";
import { getUsersEsimList } from "../lib/api/user";
import { getPackageDetails, getTopUpPackages, proceedTopupPlanToCheckoutt } from "../lib/api/product";
import { useRouter } from "next/navigation";
import CarouselEsim from "./CarouselEsim";
import TopUpPlans from "./TopUpPlans";

export default function TopUp() {
  const [iccid, setIccid] = useState("");
  const [packageId, setPackageId] = useState("");
  const [orderId, setOrderId] = useState("");
  const [amount, setAmount] = useState("");
  const [esimList, setEsimList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [topUpPlans, setTopUpPlans] = useState<any[]>([]);

  const branding = useBranding();
  const router = useRouter();
  
  useEffect(() => {
    const fetchEsimList = async () => {
      setIsLoading(true);
      try {
        const reqObj = {
          reseller_id: branding.reseller_id
        };
        const response = await getUsersEsimList(reqObj);
        if (response.success) {
          setEsimList(response.data || []);
        }
      } catch (error) {
        console.error('Error fetching eSIM list:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (branding.reseller_id) {
      fetchEsimList();
    }
  }, [branding.reseller_id]);

  const proceedTopupPlanToCheckout = async (plan?: any) => {
    try {
      const reqObj = {
        "order_id": orderId,
        "iccid": iccid,
        "package_id": plan?.package_id || packageId,
        "sim_type": "esim",
        "reseller_id": branding.reseller_id
      }
      const response = await proceedTopupPlanToCheckoutt(reqObj);
      
      if(response.success){
        sessionStorage.setItem('checkout_id', response.checkout_id);
        router.push('/checkout')
      }
    }catch{
      console.log('Something went wrong while topup checkout!!');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Top Up Your eSIM
          </h1>
          <p className="text-base text-gray-600 mt-2">
            Select an eSIM from your collection to add more data
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : esimList.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">No eSIMs Found</h3>
            <p className="mt-2 text-gray-500">You don't have any eSIMs available for top-up.</p>
          </div>
        ) : (
          <CarouselEsim
            esimList={esimList}
            setIccid={setIccid}
            packageId={packageId}
            setPackageId={setPackageId}
            orderId={orderId}
            setOrderId={setOrderId}
            iccid={iccid}
            branding={branding}
            setTopUpPlans={setTopUpPlans}
          />
        )}

        <TopUpPlans
          topUpPlans={topUpPlans}
          onTopUp={proceedTopupPlanToCheckout}
          isLoading={false}
        />
      </div>
    </div>
  );
}
