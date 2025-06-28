"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import {
  createCustomerPlan,
  fetchServiceIdea,
  getCustomerPlans,
  markPlanAsCompleted,
  removePlan,
  SearchServiceSuggestions,
} from "@/actions/services/service";
import { getUSASeason } from "@/utils/usaSeason";
import PlanCard from "./planCard";
import { useRouter } from "next/navigation";

interface ServiceSuggestion {
  id: string;
  name: string;
  description: string;
}

interface Plan {
  id: string;
  plan_status: string;
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
  const [idea, setIdea] = useState<ServiceSuggestion[]>([]);
  const [season, setSeason] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const router = useRouter();
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

  useEffect(() => {
    async function fetchServices() {
      setLoading(true);
      const res = await fetchServiceIdea();
      setIdea(res && res.length ? res : []);
      setLoading(false);
    }
    fetchServices();
  }, []);

  useEffect(() => {
    const currentSeason = getUSASeason();
    setSeason(currentSeason);
  }, []);

  const handleFetchService = (e: React.ChangeEvent<HTMLInputElement>) => {
    setService(e.target.value);
    if (ignoreServiceSuggestionFetch && e.target.value !== service) {
      setIgnoreServiceSuggestionFetch(false);
    }
  };

  const handleServiceSuggestionClick = async (item: ServiceSuggestion) => {
    const plan_status = "todo";
    const service_id = item.id;

    const result = await createCustomerPlan(service_id, plan_status);

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

  async function handlePlanRemove(planId: string) {
    const { error } = await removePlan(planId);

    if (error) {
      console.error("Failed to remove plan:", error.message);
    } else {
      setCustomerPlans((prevPlans) =>
        prevPlans.filter((plan) => plan.id !== planId)
      );
    }
  }
  
 const markItDone = async (planId:string) => {
    try {
      setIsCompleting(true);
      console.log("plan id: ", planId)
      await markPlanAsCompleted(planId);
      setCustomerPlans((prevPlans) =>
      prevPlans.filter((plan) => plan.id !== planId)
    );
      alert('Plan marked as completed!');
      // optionally, re-fetch or update local state here
    } catch (err) {
      alert('Failed to mark as done: ' + err);
    } finally {
      setIsCompleting(false);
    }
  };
  
  const getItDone = (serviceId: string | undefined) => {
    router.push(`/service?serviceId=${serviceId}`);
  }
  return (
    <div className="container mx-auto px-2 sm:px-4 md:px-8 max-w-5xl">
      <div className="pt-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Your To-Do&apos;s</h1>
        <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400">Add your next project</p>
      </div>

      {/* Input and suggestions */}
      <div className="relative rounded-md mt-6 mb-2">
        <input
          placeholder="What is on your list?"
          className="w-full pl-10 pr-4 py-3 outline-none border border-gray-200 dark:border-gray-600 rounded-lg text-base sm:text-lg focus:border-sky-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 transition-colors"
          onChange={handleFetchService}
          value={service}
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
          <Search className="w-5 h-5" />
        </span>

        {showServiceSuggestions && (
          <ul className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-[4px] max-h-56 overflow-y-auto shadow-lg">
            {serviceSuggestions.length > 0 ? (
              serviceSuggestions.map((item) => (
                <li
                  key={item.id}
                  className="px-4 py-2 text-base cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => handleServiceSuggestionClick(item)}
                >
                  {item.name}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-base text-gray-500 dark:text-gray-400 italic select-none">
                No suggestions
              </li>
            )}
          </ul>
        )}
      </div>

      {/* Show customer plans */}
      <div className="my-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {isLoading ? (
          <p className="text-base text-gray-400 col-span-full">Loading plans...</p>
        ) : customerPlans.length > 0 ? (
          customerPlans.map((plan) => (
            <PlanCard
              key={plan.id}
              title={plan.service?.name ?? "Unknown"}
              isCompleting={isCompleting}
              onMarkDone={() => markItDone(plan.id)}
              onGetItDone={() => getItDone(plan.service?.id)}
              onRemove={() => handlePlanRemove(plan.id)}
            />
          ))
        ) : (
          <p className="text-base text-gray-400 italic col-span-full">No plans yet.</p>
        )}
      </div>
      <hr className="border-gray-200 dark:border-gray-700" />
      <div className="py-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Inspiration for your home
        </h1>
        
      </div>
      <div className="my-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {isLoading ? (
          <p className="text-base text-gray-400 dark:text-gray-400 col-span-full">Loading ideas...</p>
        ) : idea.length > 0 ? (
          idea.map((plan) => (
            <PlanCard
              key={plan.id}
              title={plan.name}
              description={plan.description}
              showBadge
              badgeText={season ? `${season} Home Care` : undefined}
              onMarkDone={() => alert("Mark done functionality coming soon")}
              onGetItDone={() => alert("Mark done functionality coming soon")}
              onRemove={() => handlePlanRemove(plan.id)}
              className="min-h-[170px]"
            />
          ))
        ) : (
          <p className="text-base text-gray-400 italic dark:text-gray-500 col-span-full">No plans yet.</p>
        )}
      </div>
    </div>
  );
};

export default Todos;