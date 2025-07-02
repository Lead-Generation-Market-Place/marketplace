"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React from "react";

const formData = [
  {
    form_type: "checkbox",
    question: "Select your preferred contact method(s)",
    options: ["Email", "Phone", "Text Message", "WhatsApp"],
    form_group: "Contact Information",
    step: 1,
  },
  {
    form_type: "checkbox",
    question: "Which services are you interested in?",
    options: ["Cleaning", "Maintenance", "Installation", "Inspection", "Repair"],
    form_group: "Service Selection",
    step: 2,
  },
  {
    form_type: "checkbox",
    question: "Preferred days for service",
    options: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Weekend"],
    form_group: "Scheduling",
    step: 3,
  },
  {
    form_type: "checkbox",
    question: "Additional requirements",
    options: ["Eco-friendly products", "Pet-friendly service", "Same-day service", "Special equipment"],
    form_group: "Preferences",
    step: 4,
  },
];

export default function MultiChoiceServiceForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const businessName = searchParams.get("businessName");
  const location = searchParams.get("location");
  const email = searchParams.get("email");
  const phone = searchParams.get("phone");
  const timezone = searchParams.get("timezone");
  const servicesParam = searchParams.get("services") || "";
  const services = servicesParam.split(",").map(Number).filter(n => !isNaN(n));

  const handleNext = () => {
    const params = new URLSearchParams({
      businessName: businessName ?? "",
      location: location ?? "",
      email: email ?? "",
      phone: phone ?? "",
      timezone: timezone ?? "",
      services: services.join(","),
    });

    router.push(`/professional/another_step?${params.toString()}`);
  };
  return (
    <div className=" mx-auto p-4 bg-white rounded-lg ">
      <div className="mb-6 text-center">
        <h1 className="text-xl font-semibold text-gray-800">Service Request Form</h1>
        <p className="text-sm text-gray-500 mt-1">Please select all options that apply</p>
      </div>
      <div className="space-y-5">
        {formData.map((field, index) => (
          <fieldset key={index} className="space-y-3">
            <legend className="text-sm font-medium text-gray-700 mb-1 flex items-center">
              <span className="inline-flex items-center justify-center w-5 h-5 mr-2 text-xs bg-blue-100 text-blue-800 rounded-full">
                {field.step}
              </span>
              {field.form_group}
            </legend>
            
            <div className="pl-7">
              <h3 className="text-sm font-medium text-gray-800 mb-2">{field.question}</h3>
              <div className="space-y-2">
                {field.options.map((option, idx) => (
                  <div key={idx} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`${field.step}-${idx}`}
                      defaultChecked
                      className="h-3.5 w-3.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`${field.step}-${idx}`}
                      className="ml-2 text-xs text-gray-700"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </fieldset>
        ))}
      </div>

          {/* Bottom Navigation */}
      <div className="fixed bottom-6 right-6 flex gap-4 text-[13px]">
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white text-[13px] py-2 px-5 rounded-[4px] font-medium hover:bg-gray-400 dark:hover:bg-gray-600 transition"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="bg-[#0077B6] text-white text-[13px] py-2 px-6 rounded-[4px] font-medium hover:bg-[#005f8e] transition flex items-center justify-center gap-2"
        >
          <span>Next</span>
        </button>
      </div>

    </div>
  );
}