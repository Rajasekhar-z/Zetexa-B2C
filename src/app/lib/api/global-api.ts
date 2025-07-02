export const getCountries = async () => {
    try {
        const url = `${process.env.NEXT_PUBLIC_ADMIN_API}${process.env.NEXT_PUBLIC_API_V1}/allcountries`;
        const response = await fetch(url);
        
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch countries: ${response.status} ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Call Error:', error);
        throw error;
    }
}

export const getCheckout = async (reqObj: any) => {
    const url = `${process.env.NEXT_PUBLIC_ORDERS_API}${process.env.NEXT_PUBLIC_API_V1}/checkout/packages`;
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(reqObj),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.json();
}