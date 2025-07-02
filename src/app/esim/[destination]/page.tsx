// Server Component
import { getBranding } from "@/app/lib/api/branding";
import { getCountries } from "@/app/lib/api/global-api";
import {getDestinationPackages} from "@/app/lib/api/product";
import EsimClient from './EsimClient';

export default async function Esims({ params }: { params: { destination: string } }) {
  const { destination } = params;

  const readableDestination = destination
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const countries = await getCountries();
  const selectedDestination = countries.data.find(
    (country: any) => country.country_name.toLowerCase() === readableDestination.toLowerCase()
  );
  const selectedDestinationIsoTwo = selectedDestination?.iso_two;

  const branding = await getBranding();
  const destinationPackages = await getDestinationPackages({
    country_or_region: 'country',
    perioddays: '1-365',
    country_iso2: selectedDestinationIsoTwo,
    package_name: '1',
    region_name: '',
    reseller_id: branding.branding.reseller_id,
    currency: branding.branding.currency,
  });

  return (
    <EsimClient 
      readableDestination={readableDestination}
      destinationPackages={destinationPackages.data}
    />
  );
}
