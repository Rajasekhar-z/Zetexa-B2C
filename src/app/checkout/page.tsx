import { getPaymentMethods } from "../lib/api/checkout";
import { getCountries } from "../lib/api/global-api";
import CheckoutClient from './CheckoutClient';

export default async function Checkout() {
    const [paymentMethods, countries] = await Promise.all([
        getPaymentMethods(),
        getCountries()
    ]);

    return <CheckoutClient paymentMethods={paymentMethods.data} countries={countries.data} />;
}