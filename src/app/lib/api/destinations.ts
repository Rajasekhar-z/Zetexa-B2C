export const getDestinations = async (reqObj: any) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_INVENTORY_API}${process.env.NEXT_PUBLIC_API_V1}/Dashboard/Get-All-Countries?page=${reqObj.page}&page_size=${reqObj.page_size}&currency=${reqObj.currency}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching destinations:', error);
        throw error;
    }
}