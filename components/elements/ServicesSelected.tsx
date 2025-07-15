import { GetServices, UpdateServiceStatus } from '@/actions/professional/services/read-services'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, Loader2, CheckCircle, PlusCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export interface Service {
  id: string
  name: string
  status?: boolean
}

interface ServicesSelectedProps {
  isLoading?: boolean
}

const ServicesSelected = ({ isLoading = false }: ServicesSelectedProps) => {
  const [selectedServices, setSelectedServices] = useState<Service[]>([])
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    const fetchSelectedServices = async () => {
      try {
        setIsFetching(true)
        const servicesResult = await GetServices()
        if (servicesResult.state === 'success' && servicesResult.data) {
          setSelectedServices(servicesResult.data)
        } else {
          toast.error(servicesResult.error || 'Failed to load services')
        }
      } catch (error) {
        toast.error('An error occurred while loading services')
        console.error(error)
      } finally {
        setIsFetching(false)
      }
    }
    fetchSelectedServices()
  }, [])

  const handleToggleService = async (service: Service) => {
    try {
      setLoadingStates(prev => ({ ...prev, [service.id]: true }))
      const newStatus = !service.status
      const updateResult = await UpdateServiceStatus(service.id, newStatus)

      if (updateResult.state === 'success') {
        setSelectedServices(prev =>
          prev.map(s => (s.id === service.id ? { ...s, status: newStatus } : s))
        )
        toast.success(`Service ${newStatus ? 'activated' : 'deactivated'} successfully`)
      } else {
        toast.error(updateResult.error || 'Failed to update service status')
      }
    } catch (error) {
      toast.error('Failed to update service. Please try again.')
      console.error(error)
    } finally {
      setLoadingStates(prev => ({ ...prev, [service.id]: false }))
    }
  }

  // Loading skeleton for service items
  const ServiceSkeleton = () => (
    <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[6px] p-4 shadow-sm">
      <div className="flex items-start flex-1 min-w-0">
        <Skeleton circle width={20} height={20} className="mt-0.5 flex-shrink-0" />
        <div className="ml-3 overflow-hidden flex-1">
          <Skeleton width={150} height={20} />
          <Skeleton width={250} height={16} className="mt-1" />
        </div>
      </div>
      <Skeleton width={112} height={36} className="flex-shrink-0 self-center sm:self-auto" />
    </div>
  )

  // Empty state component
  const EmptyState = () => (
    <div className="text-center py-8">
      <PlusCircle className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No services added</h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Get started by adding a new service.
      </p>
      <div className="mt-6">
        <Link
          href="/professional"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#0077B6] hover:bg-[#005f91] focus:outline-none"
        >
          <PlusCircle className="-ml-1 mr-2 h-5 w-5" />
          Add Service
        </Link>
      </div>
    </div>
  )

  if (isLoading || isFetching) {
    return (
      <div className="space-y-4 max-w-2xl mx-auto">
        <ServiceSkeleton />
        <ServiceSkeleton />
        <ServiceSkeleton />
      </div>
    )
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {selectedServices.length === 0 ? (
        <EmptyState />
      ) : (
        selectedServices.map(service => (
          <div
            key={service.id}
            className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[6px] p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <Link
              href={`/services/${encodeURIComponent(service.name.toLowerCase())}`}
              className="flex items-start flex-1 min-w-0 group"
              aria-label={`View ${service.name} details`}
            >
              <div className="flex items-start flex-1 min-w-0">
                {service.status ? (
                  <CheckCircle className="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="text-yellow-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                )}
                <div className="ml-3 overflow-hidden">
                  <h2 className="text-base font-semibold text-gray-800 dark:text-white capitalize truncate group-hover:text-[#0077B6] dark:group-hover:text-[#005f91] transition-colors">
                    {service.name}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {service.status
                      ? 'Service is active and visible in search results'
                      : "Not set up yet. You're not showing up in search results"}
                  </p>
                </div>
              </div>
            </Link>

            <div className="flex-shrink-0 self-center sm:self-auto">
              <button
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleToggleService(service)
                }}
                disabled={loadingStates[service.id]}
                className={`w-28 px-4 py-2 rounded text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0077B6] ${
                  service.status
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white'
                    : 'bg-[#0077B6] hover:bg-[#005f91] text-white'
                }`}
                aria-label={service.status ? 'Deactivate service' : 'Activate service'}
              >
                {loadingStates[service.id] ? (
                  <Loader2 className="animate-spin w-4 h-4 mx-auto" />
                ) : service.status ? (
                  'Deactivate'
                ) : (
                  'Activate'
                )}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default ServicesSelected