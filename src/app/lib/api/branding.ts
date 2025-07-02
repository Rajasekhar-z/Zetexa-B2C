// src/lib/api/branding.ts
export async function getBranding() {
    const domain = '.zetexa.com';
    const subdomain = 'web-stg';
    
    const url = `${process.env.NEXT_PUBLIC_CUSTOMER_API}${process.env.NEXT_PUBLIC_API_V2}/get-branding-details?domain=${domain}&subdomain=${subdomain}`;

    try {
        const res = await fetch(url, { 
            cache: 'no-store',
            headers: {
                'Accept': 'application/json'
            }
        });
  
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to fetch branding: ${res.status} ${errorText}`);
        }
  
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('API Call Error:', error);
        throw error;
    }
}
  