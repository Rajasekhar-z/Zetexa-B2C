import { loadScript } from './utils';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: {
    [key: string]: string;
  };
  theme?: {
    color: string;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export const loadRazorpay = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

export const initializeRazorpay = async (options: RazorpayOptions): Promise<void> => {
  if (!options.key) {
    throw new Error('Razorpay key is required');
  }

  const isLoaded = await loadRazorpay();
  
  if (!isLoaded) {
    throw new Error('Razorpay SDK failed to load');
  }

  try {
    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error('Razorpay initialization error:', error);
    throw new Error('Failed to initialize Razorpay payment');
  }
}; 