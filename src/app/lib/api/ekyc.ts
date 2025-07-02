// Types for eKYC API responses
export interface OrderLine {
    id: string;
    package_name: string;
    validity: number;
    data: string;
    is_kyc_completed: boolean;
  }
  
  export interface KycDocumentsRequired {
    aadhaar_kyc_required: boolean;
    passport_kyc_required: boolean;
    packages_kyc_required: boolean;
  }
  
  export interface ApiResponse {
    success: boolean;
    order_id: string;
    orderlines: OrderLine[];
    kyc_documents_required: KycDocumentsRequired;
    order_created_on: string;
    order_status: string;
    residing_nationality: boolean;
    kyc_country: string;
    message?: string;
  }
  
  export interface OrderLineDetailsResponse {
    success: boolean;
    orderlines: OrderLine[];
    message?: string;
  }
  
  // Hardcoded reseller_id
  const RESELLER_ID = "8369ab78-e56b-41cf-b21c-a8409d3a2296";
  
  /**
   * Fetch order details from Check-Documents API
   * @param orderId - The order ID to fetch details for
   * @returns Promise with order details
   */
  export const fetchEkycDetails = async (orderId: string): Promise<ApiResponse> => {
    const response = await fetch('https://cust.ut.zetexa.com/api/v1/Customer/Check-Documents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order_id: orderId,
        reseller_id: RESELLER_ID
      })
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    const result: ApiResponse = await response.json();
  
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch order details');
    }
  
    return result;
  };
  
  /**
   * Fetch order line details from Order-Lines-Details API
   * @param orderId - The order ID to fetch line details for
   * @returns Promise with order line details
   */
  export const fetchOrderLineDetails = async (orderId: string): Promise<OrderLineDetailsResponse> => {
    const response = await fetch('https://orders.ut.zetexa.com/api/v2/Order-Lines-Details', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order_id: orderId
      })
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    const result: OrderLineDetailsResponse = await response.json();
  
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch order line details');
    }
  
    return result;
  };
  
  /**
   * Fetch both order details and order line details in parallel
   * @param orderId - The order ID to fetch details for
   * @returns Promise with both API responses
   */
  export const fetchOrderData = async (orderId: string) => {
    try {
      const [orderLineDetails] = await Promise.all([
        // fetchOrderDetails(orderId),
        fetchOrderLineDetails(orderId)
      ]);
  
      return {
        // orderDetails,
        orderLineDetails
      };
    } catch (error) {
      console.error('Error fetching order data:', error);
      throw error;
    }

  };
  
  export const requestOTPForAdhar = async (reqObj:any)=>{
    const url = `${process.env.NEXT_PUBLIC_CUSTOMER_API}${process.env.NEXT_PUBLIC_API_V1}/Customer/Aadhaar-Send-Otp`;
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(reqObj),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.json();
  }

  export const verifyOTPForAdhar = async (reqObj:any)=>{
    const url = `${process.env.NEXT_PUBLIC_CUSTOMER_API}${process.env.NEXT_PUBLIC_API_V1}/Customer/Verify-Aadhaar`;
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(reqObj),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.json();
  }

  export const uploadPassport = async (formData:FormData)=>{
    const response = await fetch(`${process.env.NEXT_PUBLIC_CUSTOMER_API}${process.env.NEXT_PUBLIC_API_V1}/Customer/Passport-Upload-Verify`,{
      method:'POST',
      body: formData,
    });
    return response.json();
  }

  export const uploadVISAOrTicket = async (formData: FormData) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_CUSTOMER_API}${process.env.NEXT_PUBLIC_API_V1}/Customer/Upload-Visa-Ticket`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  }