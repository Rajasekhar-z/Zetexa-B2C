import { fetchWithInterceptor } from "./https";

export const getDestinationPackages = async (reqObj: any) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_INVENTORY_API}${process.env.NEXT_PUBLIC_API_V2}/Dashboard/GetPackages?country_or_region=${reqObj.country_or_region}&perioddays=${reqObj.perioddays}&country_iso2=${reqObj.country_iso2}&package_name=${reqObj.package_name}&region_name=${reqObj.region_name}&reseller_id=${reqObj.reseller_id}&currency=${reqObj.currency}`);
    return response.json();
}

export const addToCart = async (reqObj: any) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_ORDERS_API}${process.env.NEXT_PUBLIC_API_V1}/Cart/Add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqObj)
    });
    return response.json();
}

export const getPackageDetails = async (reqObj:any)=>{
    const response = await fetch(`${process.env.NEXT_PUBLIC_INVENTORY_API}${process.env.NEXT_PUBLIC_API_V1}/GetPackage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqObj)
    });
    return response.json();
}

export const getTopUpPackages = async (reqObj: any) => {
  // Build query string from reqObj
  const params = new URLSearchParams();
  if (reqObj.country_or_region) params.append('country_or_region', reqObj.country_or_region);
  if (reqObj.country_iso2) params.append('country_iso2', reqObj.country_iso2);
  if (reqObj.package_name) params.append('package_name', reqObj.package_name);
  if (reqObj.region_name) params.append('region_name', reqObj.region_name);
  if (reqObj.reseller_id) params.append('reseller_id', reqObj.reseller_id);
  if (reqObj.currency) params.append('currency', reqObj.currency);
  if (reqObj.sim_vendor_id) params.append('sim_vendor_id', reqObj.sim_vendor_id);
  if (reqObj.package_id) params.append('package_id', reqObj.package_id);

  const url = `${process.env.NEXT_PUBLIC_INVENTORY_API}${process.env.NEXT_PUBLIC_API_V2}/Dashboard/Topup-GetPackages?${params.toString()}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch top-up packages');
  }
  return response.json();
};

export const proceedTopupPlanToCheckoutt = async (reqObj:any)=>{
    const response = await fetchWithInterceptor(`${process.env.NEXT_PUBLIC_ORDERS_API}${process.env.NEXT_PUBLIC_API_V1}/Esim/Topup-Plan`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqObj)
    });
    return response;
}