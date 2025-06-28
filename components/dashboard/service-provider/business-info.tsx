import { useState, useCallback, useTransition, FormEvent } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { ImagePlus, Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { businessInfo } from '@/app/(dashboard)/professional/business-info/actions'
import { z } from 'zod'
import { toast } from 'sonner'

// Define a Zod schema for all the text‐based fields we collect.
// (FormData always yields strings for text/number inputs, so we validate “as string.”)
const currentYear = new Date().getFullYear()
const BusinessFormSchema = z.object({
  businessName: z.string().min(1, { message: 'Business Name is required' }),

  // Founded year is optional, but if given must be between 1800 and today
  founded: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true
        const num = Number(val)
        return !isNaN(num) && num >= 1800 && num <= currentYear
      },
      {
        message: `Founded year must be between 1800 and ${currentYear}`,
      }
    ),

  // Number of employees is optional, but if given must be ≥ 0
  employees: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true
        const num = Number(val)
        return !isNaN(num) && num >= 0
      },
      { message: 'Employees must be a non-negative number' }
    ),

  businessType: z.enum(['company', 'handyman']),

  // All address fields are optional strings
  streetAddress: z.string().optional(),
  suite: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),

  // "about" is optional, but if provided must be at least 40 characters
  about: z
    .string()
    .min(40, { message: 'Please enter at least 40 characters in the About section.' })
    .optional(),
})

type BusinessFormFields = z.infer<typeof BusinessFormSchema>

const DEFAULT_LOGO = '/service_profile.jpg'

// Maximum file‐size allowed for the logo (in bytes). Example: 2 MB = 2 * 1024 * 1024.
const MAX_LOGO_SIZE = 2 * 1024 * 1024

const BusinessInfo = () => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Pull query params from URL
  const locationQuery = searchParams.get('location') || ''
  const email = searchParams.get('email') || ''
  const phone = searchParams.get('phone') || ''
  const initialBusinessName = searchParams.get('businessName') || ''
  const initialLocation = searchParams.get('location') || ''

  // Track selected businessType in local state (default to "company")
  const [businessType, setBusinessType] = useState<'company' | 'handyman'>('company')

  // Local state for Dropzone: the chosen File and its preview URL
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  // Track field‐level errors for both text fields (Zod) and the image
  // We add a possible "image" key here for logo‐related errors.
  type FormErrors = Partial<Record<keyof BusinessFormFields | 'image', string>>
  const [errors, setErrors] = useState<FormErrors>({})

  // Dropzone callback: store the File and generate a preview URL
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return
    const file = acceptedFiles[0]
    setLogoFile(file)
    setPreview(URL.createObjectURL(file))
    // Clear any previous image errors when a new file is dropped
    setErrors((prev) => ({ ...prev, image: undefined }))
  }, [])

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
    noClick: true,
    noKeyboard: true,
  })

  const handleRemove = () => {
    setLogoFile(null)
    setPreview(null)
    setErrors((prev) => ({ ...prev, image: undefined }))
  }

  const handleBusiness = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({}) // clear all old errors

    // Extract all values from the form
    const form = e.currentTarget
    const fd = new FormData(form)

    // Build a plain object of only the text‐based fields for Zod validation
    const dataForValidation: Record<string, string> = {
      businessName: (fd.get('businessName') as string) || '',
      founded: (fd.get('founded') as string) || '',
      employees: (fd.get('employees') as string) || '',
      businessType: (fd.get('businessType') as string) || 'company',
      streetAddress: (fd.get('streetAddress') as string) || '',
      suite: (fd.get('suite') as string) || '',
      state: (fd.get('state') as string) || '',
      postalCode: (fd.get('postalCode') as string) || '',
      about: (fd.get('about') as string) || '',
    }

    // First, run Zod validation on text fields
    const parsed = BusinessFormSchema.safeParse(dataForValidation)
    if (!parsed.success) {
      // Collect Zod errors into state so we can show them inline
      const fieldErrors: FormErrors = {}
      parsed.error.errors.forEach((err) => {
        const key = err.path[0] as keyof BusinessFormFields
        fieldErrors[key] = err.message
      })
      setErrors(fieldErrors)
      return
    }

    // Next, validate the logoFile itself:
    if (!logoFile) {
      // If no file was selected, set an error under "image"
      setErrors({ image: 'Please upload a business logo image.' })
      return
    }

    // Check file type (ensure it’s an image). Dropzone’s accept already does this,
    // but we double-check in case someone bypasses it.
    if (!logoFile.type.startsWith('image/')) {
      setErrors({ image: 'Uploaded file must be an image.' })
      return
    }

    // (Optional) Check file size ≤ MAX_LOGO_SIZE
    if (logoFile.size > MAX_LOGO_SIZE) {
      setErrors({
        image: `Image is too large (max ${(MAX_LOGO_SIZE / 1024 / 1024).toFixed(
          1
        )} MB).`,
      })
      return
    }

    // If validation succeeded for both text and image, append the logoFile into FormData
    fd.set('image', logoFile)

    // Call your existing businessInfo action
    const result = await businessInfo(fd)
    if (result.status === 'success') {
        toast.error("Business Profile Successfully added.")
      // Build query params (preserving values from URL + newly‐entered businessName)
      const businessName = fd.get('businessName') as string
      const params = new URLSearchParams()
      if (businessName) params.set('businessName', businessName)
      if (locationQuery) params.set('location', locationQuery)
      if (email) params.set('email', email)
      if (phone) params.set('phone', phone)

      startTransition(() => {
        window.location.href = `/professional/ask-reviews?${params.toString()}`
      })
    }
    else {
      if (
        result.message &&
        result.message.includes("duplicate key value violates unique constraint") &&
        result.message.includes("service_providers_businessname_key")
      ) {
        toast.error("This business name is already taken. Please choose another.")
      } else {
        toast.error("Failed to save business info. Please try again.")
      }
    }
  }


return (
  <form onSubmit={handleBusiness} className="mx-6">
    <section className="border-b border-gray-200 dark:border-gray-700 pb-12">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Business Profile Setup
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        This information is visible to customers looking for services.
      </p>

      {/* Logo Upload */}
      <div className="sm:col-span-1 mt-6">
        <label
          htmlFor="logoUpload"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Business Profile (Logo)
        </label>

        <div
          {...getRootProps()}
          id="logoUpload"
          className={`
              relative w-36 h-36 border-2 border-dashed rounded-full bg-gray-50 dark:bg-gray-800
              flex items-center justify-center cursor-pointer transition-colors
              ${isDragActive
              ? 'border-blue-500 bg-blue-100 dark:bg-blue-900'
              : 'border-gray-300 dark:border-gray-600 hover:border-[#0077B6]'
            }`}
        >
          {/* name="image" so FormData picks it up */}
          <input
            {...getInputProps({ name: 'image', id: 'logoUpload' })}
            aria-label="Upload business logo"
          />

          <Image
            src={preview || DEFAULT_LOGO}
            alt="Logo Preview"
            fill
            className="object-cover rounded-full shadow-sm"
            sizes="144px"
          />

          <div className="absolute inset-0 rounded-full bg-black bg-opacity-40 opacity-0 hover:opacity-100 flex flex-col items-center justify-center space-y-2 transition-opacity">
            {logoFile && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove()
                }}
                className="text-white bg-red-600 px-3 py-1 rounded text-xs font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Remove
              </button>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                open()
              }}
              className="flex items-center gap-1 text-white bg-[#0077B6] px-3 py-1 rounded text-xs font-semibold hover:bg-[#004fb6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ImagePlus className="w-4 h-4" />
              {logoFile ? 'Change' : 'Upload'}
            </button>
          </div>
        </div>

        {/* Show image‐related errors here */}
        {errors.image && (
          <p className="mt-1 text-red-600 text-[12px]">{errors.image}</p>
        )}
      </div>

      {/* Form Fields */}
      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 text-[13px]">
        {/* Business Name */}
        <div className="sm:col-span-3">
          <label
            htmlFor="business-name"
            className="block text-sm font-medium text-gray-900 dark:text-gray-200"
          >
            Business Name
          </label>
          <input
            id="business-name"
            name="businessName"
            type="text"
            autoComplete="organization"
            placeholder="Enter your business name"
            defaultValue={initialBusinessName}
            className="mt-2 block w-full rounded-[4px] bg-white dark:bg-gray-900 px-3 py-1.5 text-base text-gray-900 dark:text-white placeholder:text-[13px] dark:placeholder-gray-500 outline-1 outline-gray-300 dark:outline-gray-600 focus:outline-1 focus:outline-[#0077B6] focus:outline-offset-2 sm:text-sm"
          />
          {errors.businessName && (
            <p className="mt-1 text-red-600 text-[12px]">
              {errors.businessName}
            </p>
          )}
        </div>

        {/* Founded Year */}
        <div className="sm:col-span-3">
          <label
            htmlFor="founded"
            className="block text-sm font-medium text-gray-900 dark:text-gray-200"
          >
            Founded Year
          </label>
          <input
            id="founded"
            name="founded"
            type="number"
            min={1800}
            max={currentYear}
            placeholder="Ex: 2014"
            className="mt-2 block w-full rounded-[4px] bg-white dark:bg-gray-900 px-3 py-1.5 text-base text-gray-900 dark:text-white placeholder:text-[13px] dark:placeholder-gray-500 outline-1 outline-gray-300 dark:outline-gray-600 focus:outline-1 focus:outline-[#0077B6] focus:outline-offset-2 sm:text-sm"
          />
          {errors.founded && (
            <p className="mt-1 text-red-600 text-[12px]">{errors.founded}</p>
          )}
        </div>

        {/* Business Type */}
        <div className="sm:col-span-3">
          <label
            htmlFor="business-type"
            className="block text-sm font-medium text-gray-900 dark:text-gray-200"
          >
            Business Type
          </label>
          <select
            id="business-type"
            name="businessType"
            value={businessType}
            onChange={(e) =>
              setBusinessType(e.target.value as 'company' | 'handyman')
            }
            className="mt-2 block w-full appearance-none rounded-[4px] bg-white dark:bg-gray-900 py-1.5 pl-3 pr-8 text-base text-gray-900 dark:text-white placeholder:text-[13px] dark:placeholder-gray-500 outline-1 outline-gray-300 dark:outline-gray-600 focus:outline-1 focus:outline-[#0077B6] focus:outline-offset-2 sm:text-sm"
          >
            <option value="company">Company</option>
            <option value="handyman">Handyman</option>
          </select>
          {errors.businessType && (
            <p className="mt-1 text-red-600 text-[12px]">
              {errors.businessType}
            </p>
          )}
        </div>

        {/* Conditionally render “Number of Employees” only if businessType === "company" */}
        {businessType === 'company' && (
          <div className="sm:col-span-3">
            <label
              htmlFor="employees"
              className="block text-sm font-medium text-gray-900 dark:text-gray-200"
            >
              Number of Employees
            </label>
            <input
              id="employees"
              name="employees"
              type="number"
              min={0}
              placeholder="Ex: 14"
              className="mt-2 block w-full rounded-[4px] bg-white dark:bg-gray-900 px-3 py-1.5 text-base text-gray-900 dark:text-white placeholder:text-[13px] dark:placeholder-gray-500 outline-1 outline-gray-300 dark:outline-gray-600 focus:outline-1 focus:outline-[#0077B6] focus:outline-offset-2 sm:text-sm"
            />
            {errors.employees && (
              <p className="mt-1 text-red-600 text-[12px]">
                {errors.employees}
              </p>
            )}
          </div>
        )}

        {/* Main Business Location (Optional) */}
        <div className="sm:col-span-6">
          <h3 className="font-bold py-3 text-gray-900 dark:text-gray-200">
            Main Business Location (Optional):
          </h3>

          <label
            htmlFor="street-address"
            className="block text-sm font-medium text-gray-900 dark:text-gray-200"
          >
            Street Name
          </label>
          <input
            id="street-address"
            name="streetAddress"
            type="text"
            autoComplete="street-address"
            placeholder="Street name"
            className="mt-2 block w-full rounded-[4px] bg-white dark:bg-gray-900 px-3 py-1.5 text-base text-gray-900 dark:text-white placeholder:text-[13px] dark:placeholder-gray-500 outline-1 outline-gray-300 dark:outline-gray-600 focus:outline-1 focus:outline-[#0077B6] focus:outline-offset-2 sm:text-sm"
          />
          {errors.streetAddress && (
            <p className="mt-1 text-red-600 text-[12px]">
              {errors.streetAddress}
            </p>
          )}

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-6 gap-x-6 gap-y-8">
            <div className="sm:col-span-2">
              <label
                htmlFor="suite"
                className="block text-sm font-medium text-gray-900 dark:text-gray-200"
              >
                Suite or Unit
              </label>
              <input
                id="suite"
                name="suite"
                type="text"
                autoComplete="address-line2"
                placeholder="Suite"
                className="mt-2 block w-full rounded-[4px] bg-white dark:bg-gray-900 px-3 py-1.5 text-base text-gray-900 dark:text-white placeholder:text-[13px] dark:placeholder-gray-500 outline-1 outline-gray-300 dark:outline-gray-600 focus:outline-1 focus:outline-[#0077B6] focus:outline-offset-2 sm:text-sm"
              />
              {errors.suite && (
                <p className="mt-1 text-red-600 text-[12px]">{errors.suite}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="state"
                className="block text-sm font-medium text-gray-900 dark:text-gray-200"
              >
                State
              </label>
              <input
                id="state"
                name="state"
                defaultValue={initialLocation}
                type="text"
                autoComplete="address-level1"
                placeholder="State"
                className="mt-2 block w-full rounded-[4px] bg-white dark:bg-gray-900 px-3 py-1.5 text-base text-gray-900 dark:text-white placeholder:text-[13px] dark:placeholder-gray-500 outline-1 outline-gray-300 dark:outline-gray-600 focus:outline-1 focus:outline-[#0077B6] focus:outline-offset-2 sm:text-sm"
              />
              {errors.state && (
                <p className="mt-1 text-red-600 text-[12px]">{errors.state}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="postal-code"
                className="block text-sm font-medium text-gray-900 dark:text-gray-200"
              >
                ZIP Code
              </label>
              <input
                id="postal-code"
                name="postalCode"
                type="text"
                autoComplete="postal-code"
                placeholder="ZIP"
                className="mt-2 block w-full rounded-[4px] bg-white dark:bg-gray-900 px-3 py-1.5 text-base text-gray-900 dark:text-white placeholder:text-[13px] dark:placeholder-gray-500 outline-1 outline-gray-300 dark:outline-gray-600 focus:outline-1 focus:outline-[#0077B6] focus:outline-offset-2 sm:text-sm"
              />
              {errors.postalCode && (
                <p className="mt-1 text-red-600 text-[12px]">{errors.postalCode}</p>
              )}
            </div>
          </div>
        </div>

        {/* Why Hire Section */}
        <div className="sm:col-span-6 mt-6">
          <label
            htmlFor="why-hire"
            className="block text-sm font-medium text-gray-900 dark:text-gray-200 text-[13px]"
          >
            Why should customers hire you?
          </label>
          <textarea
            id="why-hire"
            name="about"
            rows={4}
            placeholder="Explain what makes your business stand out and why you'll do a great job."
            className="mt-2 block w-full rounded-[4px] bg-white dark:bg-gray-900 px-3 py-1.5 text-[13px] text-gray-900 dark:text-white placeholder:text-[13px] dark:placeholder-gray-500 outline-1 outline-gray-300 dark:outline-gray-600 focus:outline-1 focus:outline-[#0077B6] focus:outline-offset-1"
          />
          {errors.about && (
            <p className="mt-1 text-red-600 text-[12px]">{errors.about}</p>
          )}
          <div className="mt-2 text-gray-600 dark:text-gray-400 text-[13px]">
            <p>You can mention:</p>
            <ul className="list-disc list-inside ml-4 mt-1">
              <li>Years in business</li>
              <li>What you are passionate about</li>
              <li>Special skills or equipment</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    {/* Form Actions */}
    <div className="fixed bottom-6 right-6 flex gap-4 text-[13px] ">
      <button
        type="button"
        onClick={() => router.back()}
        className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white text-[13px] py-2 px-5 rounded-[4px] font-medium hover:bg-gray-400 dark:hover:bg-gray-600 transition"
      >
        Back
      </button>
      <button
        type="submit"
        disabled={isPending}
        className={`
            text-white text-[13px] py-2 px-6 rounded-[4px]
            transition duration-300 flex items-center justify-center gap-2
            ${isPending ? 'bg-[#0077B6]/70 cursor-not-allowed' : 'bg-[#0077B6] hover:bg-[#005f8e]'}
          `}
      >
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        <span>Next</span>
      </button>
    </div>
  </form>
)
}

export default BusinessInfo
