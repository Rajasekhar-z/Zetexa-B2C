export const sendLoginOTP = async (reqObj: any) => {
    try {
        
        const url = `${process.env.NEXT_PUBLIC_CUSTOMER_API}${process.env.NEXT_PUBLIC_API_V1}/customer/loginorregistersendotp`;
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(reqObj),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to send OTP: ${response.status} ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Call Error:', error);
        throw error;
    }
}

export const submitOTP = async (reqObj:any)=>{
    try{
        const url = `${process.env.NEXT_PUBLIC_CUSTOMER_API}${process.env.NEXT_PUBLIC_API_V1}/customer/checkotp`
        const response = await fetch(url, {
            method : 'POST',
            body: JSON.stringify(reqObj),
            headers:{
                'Content-Type':'application/json'
            },
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to send OTP: ${response.status} ${errorText}`);
        }

        return await response.json();
    }catch (error){
        console.error('API Call Error:', error);
        throw error;
    }
}

export const isUserAuthenticated = async (token: string) => {
    try {
        const url = `${process.env.NEXT_PUBLIC_CUSTOMER_API}${process.env.NEXT_PUBLIC_API_V1}/is-authenticated`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Authentication check failed: ${response.status} ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Authentication Check Error:', error);
        throw error;
    }
}


