export const getPaymentMethods = async () => {
    try {
        const url = `${process.env.NEXT_PUBLIC_PAYMENT_API}${process.env.NEXT_PUBLIC_API_V1}/paymentmethods?device=web`;
        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch payment methods: ${response.status} ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Call Error:', error);
        throw error;
    }
}

export const proceedToPayment = async (reqObj: any) => {
    const url = `${process.env.NEXT_PUBLIC_ORDERS_API}${process.env.NEXT_PUBLIC_API_V1}/External/Guest-Order`;
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(reqObj),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.json();
}
