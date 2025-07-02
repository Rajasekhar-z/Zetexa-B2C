import { useBranding } from "@/context/branding-context";

export async function getPopularDestinations(reseller_id: string, currency: string) {
    const url = `${process.env.NEXT_PUBLIC_INVENTORY_API}${process.env.NEXT_PUBLIC_API_V1}/Reseller/TopDestinations/Home?reseller_id=${reseller_id}&currency=${currency}`;

    try {
        const res = await fetch(url, {
            cache: 'no-store',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to fetch home data: ${res.status} ${errorText}`);
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error('API Call Error:', error);
        throw error;
    }
}

export async function getRegionsForReseller(reseller_id: string) {
    const url = `${process.env.NEXT_PUBLIC_INVENTORY_API}${process.env.NEXT_PUBLIC_API_V1}/allregions?reseller_id=${reseller_id}`;
    try {
        const res = await fetch(url, {
            cache: 'default',
            headers: {
                'Accept': 'application/json'
            }
        });
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to fetch regions: ${res.status} ${errorText}`);
        }
        return await res.json();
    } catch (error) {
        console.error('API Call Error:', error);
        throw error;
    }
}
