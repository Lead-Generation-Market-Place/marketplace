"use client";

import { CircleCheckBig, Search, X } from "lucide-react";
import { useEffect, useState} from "react";
import {
  createCustomerPlan,
  getCustomerPlans,
  SearchServiceSuggestions,
} from "@/actions/service";

interface ServiceSuggestion {
  id: string;
  name: string;
}

interface Plan {
  id: string;
  plan_type: string;
  user_id: string;
  service: {
    id: string;
    name: string;
  } | null;
}

const Todos = () => {
  const [service, setService] = useState("");
  const [serviceSuggestions, setServiceSuggestions] = useState<ServiceSuggestion[]>([]);
  const [showServiceSuggestions, setShowServiceSuggestions] = useState(false);
  const [ignoreServiceSuggestionFetch, setIgnoreServiceSuggestionFetch] = useState(false);
  const [customerPlans, setCustomerPlans] = useState<Plan[]>([]);
  const [isLoading, setLoading] = useState(false);
 


  // Fetch service suggestions as user types
  useEffect(() => {
    if (ignoreServiceSuggestionFetch) return;
    const timeout = setTimeout(async () => {
      if (service.length > 1) {
        try {
          const res = await SearchServiceSuggestions(service);
          setServiceSuggestions(res && res.length ? res : []);
          setShowServiceSuggestions(true);
        } catch {
          setServiceSuggestions([]);
          setShowServiceSuggestions(true);
        }
      } else {
        setServiceSuggestions([]);
        setShowServiceSuggestions(false);
      }
    }, 150);
    return () => clearTimeout(timeout);
  }, [service, ignoreServiceSuggestionFetch]);

  // Fetch customer plans on mount
    useEffect(() => {
    let ignore = false;
    async function fetchPlans() {
        setLoading(true);
        const res = await getCustomerPlans();
        if (!ignore) {
        const transformed = (res.data ?? []).map((plan) => ({
            ...plan,
            service: Array.isArray(plan.service) ? plan.service[0] : plan.service ?? null,
        }));
        setCustomerPlans(transformed);
        setLoading(false);
        }
    }
    fetchPlans();
    return () => {
        ignore = true;
    };
    }, []);



  const handleFetchService = (e: React.ChangeEvent<HTMLInputElement>) => {
    setService(e.target.value);
    if (ignoreServiceSuggestionFetch && e.target.value !== service) {
      setIgnoreServiceSuggestionFetch(false);
    }
  };

  // When a suggestion is clicked, create a plan and refresh list
  const handleServiceSuggestionClick = async (item: ServiceSuggestion) => {
    console.log(`${item.id} has been selected`);
    const plan_type = "todo";
    const service_id = item.id;

    const result = await createCustomerPlan(service_id, plan_type);

    if (result.success) {
    const updated = await getCustomerPlans();
    if (updated.success) {
        const transformed = (updated.data ?? []).map((plan) => ({
        ...plan,
        service: Array.isArray(plan.service) ? plan.service[0] : plan.service ?? null,
        }));
        setCustomerPlans(transformed);
    }
    }


    setShowServiceSuggestions(false);
    setIgnoreServiceSuggestionFetch(true);
    setService(item.name);
  };

  return (
    <>
      <div>
        <h1 className="text-xl font-bold">Your To-Do&apos;s</h1>
        <p className="text-sm text-gray-500">Add your next project</p>
      </div>

      {/* Input and suggestions */}
      <div className="relative rounded-md mt-4">
        <input
          placeholder="What is on your list?"
          className="w-full pl-10 pr-4 py-2 outline-none border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:border-sky-500 bg-transparent"
          onChange={handleFetchService}
          value={service}
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Search className="w-4 h-4" />
        </span>

        {showServiceSuggestions && (
          <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-[4px] max-h-48 overflow-y-auto">
            {serviceSuggestions.length > 0 ? (
              serviceSuggestions.map((item) => (
                <li
                  key={item.id}
                  className="px-4 py-2 text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700"
                  onClick={() => handleServiceSuggestionClick(item)}
                >
                  {item.name}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 italic select-none">
                No suggestions
              </li>
            )}
          </ul>
        )}
      </div>

      {/* Show customer plans */}
     <div className="mt-6 flex flex-wrap gap-4 justify-start">
        {isLoading ? (
        <p className="text-sm text-gray-400">Loading plans...</p>
        ) : customerPlans.length > 0 ? (
            customerPlans.map((plan) => (
            <div
                key={plan.id}
                className="relative w-full sm:w-[48%] md:w-[45%] lg:w-[30%] xl:w-[22%] 2xl:w-[18%] h-[120px] p-4 border border-gray-200 dark:border-gray-700 rounded shadow bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-200 flex flex-col justify-between">
                <p className="text-sky-600 dark:text-sky-400 font-semibold capitalize">
                    {plan.service?.name ?? "Unknown"}
                </p>
                <div className="mt-auto py-2 text-xs text-gray-500 dark:text-gray-400 flex justify-between items-center">
                    <button
                        className="border border-gray-200 dark:border-gray-600 rounded text-sky-500 py-2 px-4"
                        onClick={() => alert("Mark done functionality coming soon")}>
                        <CircleCheckBig className="w-4 h-4 inline mr-1"/>
                        Mark done
                    </button>
                    <button
                        className="border border-sky-500 bg-sky-500 rounded text-white px-2 py-2"
                        onClick={() => alert("Mark done functionality coming soon")}>
                        Get it Done
                    </button>
                </div>
                <span className="absolute top-3 right-3 hover:text-sky-500 cursor-pointer" title="Remove">
                    <X className="w-4 h-4" />
                </span>
            </div>
            ))
        ) : (
            <p className="text-sm text-gray-400 italic">No plans yet.</p>
        )}
        </div>

    </>
  );
};

export default Todos;
