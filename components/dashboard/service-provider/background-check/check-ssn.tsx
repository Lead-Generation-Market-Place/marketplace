"use client";

import { useState, ChangeEvent, useEffect, useActionState } from "react";
import { submitBackgroundCheck } from "@/actions/background-check/background-check";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const states = ["VA", "CA", "NY", "TX", "FL", "IL", "WA", "AZ", "MI"];

interface FormData {
  firstName: string;
  middleName: string;
  noMiddleName: boolean;
  lastName: string;
  dob: string;
  street: string;
  suite: string;
  city: string;
  state: string;
  zip: string;
  ssn: string;
  confirm: boolean;
}

interface InputFieldProps {
  name: keyof FormData;
  label?: string;
  form: FormData;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  error?: string[];
  type?: string;
  placeholder?: string;
}

export default function ConfirmIdentityForm() {
  const [form, setForm] = useState<FormData>({
    firstName: "",
    middleName: "",
    noMiddleName: false,
    lastName: "",
    dob: "",
    street: "",
    suite: "",
    city: "",
    state: "",
    zip: "",
    ssn: "",
    confirm: false,
  });

  const [formState, formAction, isPending] = useActionState(
    submitBackgroundCheck,
    null
  );

  useEffect(() => {
    if (formState?.success) {
      alert("Form submitted successfully.");
      setForm({
        firstName: "",
        middleName: "",
        noMiddleName: false,
        lastName: "",
        dob: "",
        street: "",
        suite: "",
        city: "",
        state: "",
        zip: "",
        ssn: "",
        confirm: false,
      });
    }
  }, [formState]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    const name = target.name as keyof FormData;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: target.checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: target.value }));
    }
  };

  const handleNext = () => {
    document.getElementById("backgroundCheckForm")?.dispatchEvent(
      new Event("submit", { cancelable: true, bubbles: true })
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-1xl mx-auto px-4 py-4 bg-white dark:bg-gray-900 rounded-[4px]"
    >
      <form id="backgroundCheckForm" action={formAction} className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            Submit a free background check
          </h2>
          <p className="text-[13px] text-gray-600 dark:text-gray-400">
            Your information is kept confidential and private. Make sure everything is correct before submitting.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InputField
            name="firstName"
            label="First name"
            form={form}
            onChange={handleChange}
            error={formState?.errors?.firstName}
          />
          <InputField
            name="lastName"
            label="Last name"
            form={form}
            onChange={handleChange}
            error={formState?.errors?.lastName}
          />
        </div>

        <div className="mb-3">
          <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1">
            Middle name (optional)
          </label>
          <input
            type="text"
            name="middleName"
            value={form.middleName}
            onChange={handleChange}
            disabled={form.noMiddleName}
            className="block w-full text-[13px] px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#0096C7] focus:border-transparent text-gray-800 dark:text-white dark:bg-gray-800"
          />
          <label className="flex items-center mt-1 text-[13px] text-gray-700 dark:text-gray-400 select-none">
            <input
              type="checkbox"
              name="noMiddleName"
              checked={form.noMiddleName}
              onChange={handleChange}
              className="mr-2"
            />
            I confirm I don’t have a middle name
          </label>
        </div>

        <InputField
          name="dob"
          label="Date of Birth"
          type="date"
          form={form}
          onChange={handleChange}
          error={formState?.errors?.dob}
        />
        <InputField
          name="street"
          label="Street address"
          form={form}
          onChange={handleChange}
          error={formState?.errors?.street}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <InputField
            name="suite"
            placeholder="Apt / Suite"
            form={form}
            onChange={handleChange}
          />
          <InputField
            name="city"
            placeholder="City"
            form={form}
            onChange={handleChange}
            error={formState?.errors?.city}
          />

          <div>
            <select
              name="state"
              value={form.state}
              onChange={handleChange}
              className="block w-full text-[13px] px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#0096C7] focus:border-transparent text-gray-800 dark:text-white dark:bg-gray-800"
              required
            >
              <option value="">State</option>
              {states.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
            {formState?.errors?.state && (
              <p className="text-red-500 text-xs mt-1">{formState.errors.state[0]}</p>
            )}
          </div>
        </div>

        <InputField
          name="zip"
          label="ZIP Code"
          form={form}
          onChange={handleChange}
          error={formState?.errors?.zip}
        />
        <InputField
          name="ssn"
          label="Social Security Number"
          form={form}
          onChange={handleChange}
          error={formState?.errors?.ssn}
        />

        <div className="mb-8 flex items-start gap-2 text-[13px]">
          <input
            type="checkbox"
            name="confirm"
            id="confirm"
            checked={form.confirm}
            onChange={handleChange}
            className="mt-1"
          />
          <label
            htmlFor="confirm"
            className="text-gray-700 dark:text-gray-300 select-none"
          >
            By checking this box, I authorize a background check and agree to the{" "}
            <a href="#" className="underline">
              Disclosures
            </a>
            ,{" "}
            <a href="#" className="underline">
              Privacy Policy
            </a>
            ,{" "}
            <a href="#" className="underline">
              CA Notice at Collection
            </a>
            , and{" "}
            <a href="#" className="underline">
              Do Not Sell or Share My Personal Information
            </a>
            .
            {formState?.errors?.confirm && (
              <p className="text-red-500 text-xs mt-1">{formState.errors.confirm[0]}</p>
            )}
          </label>
        </div>
      </form>

      <div className="fixed bottom-6 right-6 flex gap-4 text-[13px]">
        <button
          type="button"
          onClick={handleNext}
          disabled={isPending}
          className="mt-6 w-full text-white text-[13px] py-2 px-6 rounded-[4px] transition duration-300 flex items-center justify-center gap-2 bg-[#0077B6] hover:bg-[#005f8e] disabled:opacity-50"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          <span>Next</span>
        </button>
      </div>
    </motion.div>
  );
}

function InputField({
  name,
  label,
  form,
  onChange,
  error,
  type = "text",
  placeholder = "",
}: InputFieldProps) {
  // If checkbox, use checked instead of value
  if (type === "checkbox") {
    return (
      <div>
        {label && (
          <label
            htmlFor={name}
            className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {label}
          </label>
        )}
        <input
          id={name}
          type="checkbox"
          name={name}
          checked={form[name] as boolean}
          onChange={onChange}
          className=""
        />
        {error && <p className="text-red-500 text-xs mt-1">{error[0]}</p>}
      </div>
    );
  }

  // Otherwise use value for input
  return (
    <div>
      {label && (
        <label
          htmlFor={name}
          className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={name}
        type={type}
        name={name}
        placeholder={placeholder}
        value={(form[name] as string) || ""}
        onChange={onChange}
        className="block w-full text-[13px] px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#0096C7] focus:border-transparent text-gray-800 dark:text-white dark:bg-gray-800"
      />
      {error && <p className="text-red-500 text-xs mt-1">{error[0]}</p>}
    </div>
  );
}
