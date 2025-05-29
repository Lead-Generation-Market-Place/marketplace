'use client'
import { handleServiceSubmit } from './action'

const allServices = [
  { id: 'tv_mounting', label: 'TV Mounting' },
  { id: 'tv_repair', label: 'TV Repair Services' },
  { id: 'home_theater_install', label: 'Home Theater System Installation or Replacement' },
  { id: 'home_theater_repair', label: 'Home Theater System Repair or Service' },
  { id: 'satellite_dish', label: 'Satellite Dish Services' },
]

export default function SetupPage() {
  return (
    <form action={handleServiceSubmit} className="max-w-xl mx-auto p-6 space-y-6">
      <h2 className="text-xl font-semibold">Select any other services you do.</h2>
      <p className="text-sm text-gray-600">
        You’ll show up in search results and get jobs for all services you select.
      </p>

      <div className="space-y-3">
        <div className="text-gray-400">
          <input disabled type="checkbox" defaultChecked /> Home Security and Alarms Install
        </div>

        {allServices.map(service => (
          <div key={service.id}>
            <label className="inline-flex items-center space-x-2">
              <input name={service.id} type="checkbox" />
              <span>{service.label}</span>
            </label>
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          className="text-blue-600 hover:underline"
          onClick={() => window.history.back()}
        >
          &larr; Back
        </button>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Next
        </button>
      </div>
    </form>
  )
}
