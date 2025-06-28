import { getCompletedPlans } from "@/actions/services/service";
import { FileCheck2 } from "lucide-react";
import { useEffect, useState } from "react";


interface Plan {
  id: string;
  plan_status: string;
  created_at:string;
  user_id: string;
  service: {
    id: string;
    name: string;
  } | null;
}

const Completed = () =>{
    const [completedPlan, setCompletedPlan] = useState<Plan[]>([]);
    const [isLoading, setLoading] = useState(false);
    // Fetch customer plans on mount
      useEffect(() => {
        let ignore = false;
        async function fetchPlans() {
          setLoading(true);
          const res = await getCompletedPlans();
          if (!ignore) {
            const transformed = (res.data ?? []).map((plan) => ({
              ...plan,
              service: Array.isArray(plan.service) ? plan.service[0] : plan.service ?? null,
            }));
            setCompletedPlan(transformed);
            setLoading(false);
          }
        }
        fetchPlans();
        return () => {
          ignore = true;
        };
      }, []);

    return (
         <div className="my-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {isLoading ? (
          <p className="text-base text-gray-400 col-span-full">Loading plans...</p>
        ) : completedPlan.length > 0 ? (
          completedPlan.map((plan) => (
            <div
            key={plan.id}
            className="max-w-sm mx-auto border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 bg-white dark:bg-gray-900 transition duration-300"
            >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white capitalize">
                {plan.service?.name || 'No Service Name'}
                </h2>

                <span
                className="text-xs ml-1 font-medium px-3 py-1 rounded-full capitalize bg-green-700/25 text-green-700 dark:bg-green-800 dark:text-green-200"
                
                ><FileCheck2 className="h-3 w-3 inline mr-1"/>
                {plan.plan_status || 'Unknown'}
                </span>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400">
                Date:{' '}
                <span className="font-medium text-gray-800 dark:text-gray-200">
                {new Date(plan.created_at).toLocaleDateString()}
                </span>
            </p>
            </div>


          ))
        ) : (
          <p className="text-base text-gray-400 italic col-span-full">No plans yet.</p>
        )}
      </div>
    );
}

export default Completed;