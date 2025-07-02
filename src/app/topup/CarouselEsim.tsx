import { useEffect, useState } from "react";
import { getPackageDetails, getTopUpPackages } from "../lib/api/product";

export type CarouselEsimProps = {
  esimList: any[];
  setIccid: (iccid: string) => void;
  iccid: string;
  setPackageId: (packageId: string) => void;
  packageId: string;
  orderId: string;
  setOrderId: (orderId: string) => void;
  branding: any;
  setTopUpPlans: (plans: any[]) => void;
};

const CarouselEsim = ({
  esimList,
  setIccid,
  setPackageId,
  setOrderId,
  orderId,
  packageId,
  iccid,
  branding,
  setTopUpPlans
}: CarouselEsimProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [packageDetails, setPackageDetails] = useState<any>(null);
  const [simVendorId, setSimVendor] = useState<any>(null);

  useEffect(() => {
    if (esimList.length > 0) {
      const activeEsim = esimList[activeIndex];
      setIccid(activeEsim?.iccid || "");
      setPackageId(activeEsim?.package_id || "");
      setSimVendor(activeEsim?.sim_vendor_id || "");
      setOrderId(activeEsim?.order_id || "");
      const fetchPackageDetails = async () => {
        try {
          if (activeEsim?.package_id) {
            const reqObj = {
              package_id: activeEsim.package_id,
            };
            const activePackageData = await getPackageDetails(reqObj);
            const packageInfo = activePackageData?.packageinfo?.[0];
            setPackageDetails(packageInfo);
            if (packageInfo && packageInfo.locationzoneids && packageInfo.locationzoneids[0]) {
              const reqObj2 = {
                country_or_region: '',
                country_iso2: packageInfo.locationzoneids[0].countryiso2.toUpperCase(),
                package_name: '',
                region_name: packageInfo?.package_region || '',
                reseller_id: branding.reseller_id,
                currency: branding.currency,
                sim_vendor_id: activeEsim.sim_vendor_id,
                package_id: activeEsim.package_id
              };
              if (reqObj2.region_name) reqObj2.country_or_region = 'region';
              if (reqObj2.country_iso2) reqObj2.country_or_region = 'country';
              const destinationPackages = await getTopUpPackages(reqObj2);
              setTopUpPlans(destinationPackages.data || []);
            } else {
              setTopUpPlans([]);
            }
          }
        } catch {
          setTopUpPlans([]);
          console.log('Error getting Package Details');
        }
      };
      fetchPackageDetails();
    }
  }, [activeIndex, esimList, branding, setIccid, setPackageId, setTopUpPlans]);

  if (esimList.length === 0) return null;

  const esim = esimList[activeIndex];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? esimList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === esimList.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {esim.packagename || "eSIM Plan"}
              </h3>
              <p className="text-sm text-gray-500 mt-1">ICCID: {esim.iccid}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                esim.status === "Active"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {esim.status || "Unknown"}
            </span>
          </div>

          <div className="mt-4">
            <div className="text-sm text-gray-600">
              <p>{esim.sim_type}</p>
              <p>Data : {esim.packagedata || "0 GB"}</p>
              <p>Valid Until: {esim.msisdn_expiry_date || "N/A"}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePrev}
            className="cursor-pointer m-2 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
            aria-label="Previous eSIM"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm text-gray-500">
            {activeIndex + 1} / {esimList.length}
          </span>
          <button
            onClick={handleNext}
            className="cursor-pointer m-2 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
            aria-label="Next eSIM"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarouselEsim; 