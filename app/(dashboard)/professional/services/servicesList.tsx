'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

type Service = {
  id: string;
  name: string;
};

interface SetupFormProps {
  services: Service[];
}

export default function SetupForm({ services }: SetupFormProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const serviceQuery = searchParams.get('service') || '';
  const location = searchParams.get('location') || '';

  // Find main service index (case-insensitive match)
  const mainServiceIndex = services.findIndex(
    (service) => service.name.toLowerCase() === serviceQuery.toLowerCase()
  );

  // Initialize checked state: main service always checked, others unchecked
  const initialCheckedState = services.reduce<Record<string, boolean>>((acc, service, idx) => {
    acc[service.id] = idx === mainServiceIndex;
    return acc;
  }, {});

  const [checkedServices, setCheckedServices] = useState<Record<string, boolean>>(initialCheckedState);
  const [selectAll, setSelectAll] = useState(false);

  // Sync selectAll state with checkedServices
  useEffect(() => {
    if (selectAll) {
      const newChecked = { ...checkedServices };
      services.forEach((service, idx) => {
        if (idx !== mainServiceIndex) {
          newChecked[service.id] = true;
        }
      });
      setCheckedServices(newChecked);
    } else {
      const newChecked = { ...checkedServices };
      services.forEach((service, idx) => {
        if (idx !== mainServiceIndex) {
          newChecked[service.id] = false;
        }
      });
      setCheckedServices(newChecked);
    }
  }, [selectAll]);

  // Update checkbox for a service and update selectAll if needed
  function handleCheckboxChange(id: string) {
    setCheckedServices((prev) => {
      const newChecked = { ...prev, [id]: !prev[id] };
      const allChecked = services.every((service, idx) =>
        idx === mainServiceIndex ? true : newChecked[service.id]
      );
      setSelectAll(allChecked);
      return newChecked;
    });
  }

  // Handle form submit: collect selected services & location, navigate with query
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Collect names of selected services
    const selectedServices = services
      .filter((service) => checkedServices[service.id])
      .map((service) => service.name);

    const params = new URLSearchParams();

    // Append each selected service as separate "service" params
    selectedServices.forEach((serviceName) => {
      params.append('service', serviceName);
    });

    if (location) {
      params.set('location', location);
    }

    router.push(`/professional/social?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-8 bg-white space-y-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-[#0077B6] tracking-tight">Select Additional Services</h2>
        <p className="text-sm text-gray-600 max-w-md mx-auto">
          You’ll appear in search results and receive job offers for all selected services.
        </p>
      </div>

      {/* Select All Option */}
      <div className="mb-2 ">
        <label
          htmlFor="select-all"
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium select-none cursor-pointer text-gray-900 hover:bg-[#E0F2FE] focus-within:bg-[#BEE3F8] rounded"
        >
          <input
            id="select-all"
            type="checkbox"
            checked={selectAll}
            onChange={() => setSelectAll(!selectAll)}
            className="h-4 w-4 rounded-sm text-[#0077B6] accent-[#0077B6] focus:ring-2 focus:ring-[#0096C7] cursor-pointer"
          />
          <span>Select All</span>
        </label>
      </div>

      {/* Services List */}
      <ul className="space-y-2">
        {services.map((service, idx) => {
          const isMainService = idx === mainServiceIndex;

          return (
            <li key={service.id}>
              <label
                htmlFor={`service-${service.id}`}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium select-none
                  cursor-pointer
                  transition
                  ${
                    isMainService
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'text-gray-900 hover:bg-[#E0F2FE] focus-within:bg-[#BEE3F8]'
                  }
                  rounded
                `}
              >
                <input
                  id={`service-${service.id}`}
                  name="services"
                  type="checkbox"
                  value={service.name}
                  checked={checkedServices[service.id]}
                  disabled={isMainService}
                  onChange={() => handleCheckboxChange(service.id)}
                  className={`h-4 w-4 rounded-sm text-[#0077B6] accent-[#0077B6] focus:ring-2 focus:ring-[#0096C7]
                    ${isMainService ? 'cursor-not-allowed' : 'cursor-pointer'}
                  `}
                />
                <span>{service.name}</span>
              </label>
            </li>
          );
        })}
      </ul>

      {/* Selected Info */}
      <div className="bg-gray-50 p-3 rounded-md border border-dashed border-gray-300 text-sm text-gray-700 space-y-1">
        <p>
          <span className="font-semibold">Selected Service:</span>{' '}
          <span className="no-underline">{serviceQuery || 'None'}</span>
        </p>
        <p>
          <span className="font-semibold">Location:</span>{' '}
          <span className="no-underline">{location || 'None'}</span>
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-1">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="text-sm text-gray-600 hover:text-[#0077B6] transition focus:outline-none focus:ring-2 focus:ring-[#0096C7] rounded"
        >
          ← Back
        </button>
        <button
          type="submit"
          className="inline-flex items-center gap-2 bg-[#0077B6] text-white px-5 py-2 rounded-[4px] text-sm font-semibold hover:bg-[#0096C7] transition focus:outline-none focus:ring-2 focus:ring-[#0096C7]"
        >
          Continue
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </form>
  );
}
