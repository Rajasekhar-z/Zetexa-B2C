import { fetchWithInterceptor } from './https';

export const getUsersEsimList = async (reqObj: any) => {
    const response = await fetchWithInterceptor(
        `${process.env.NEXT_PUBLIC_ORDERS_API}${process.env.NEXT_PUBLIC_API_V1}/Customer/My-Esims`,
        {
            method: 'POST',
            body: JSON.stringify(reqObj)
        }
    );
    return response;
}