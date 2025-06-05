import { SearchServices } from './action';
import SetupForm from '@/components/dashboard/service-provider/serviceList';

export default async function SetupPage() {
  const result = await SearchServices();
  const services = result.data || [];

  return <SetupForm services={services} />;
}
