import { useState, useEffect, useCallback } from 'react'
import type {
  Destination,
  Dispatch,
  Job,
  Homestay,
  ArchitecturalSpecimen,
  PriceIndexItem
} from '../types'
import {
  fetchDestinations,
  fetchHomestays,
  fetchJobs,
  fetchDispatches,
  fetchArchitecturalSpecimens,
  fetchPriceIndex,
  type DataMode
} from '../services/ecosystemService'
import { isSupabaseConfigured, getDefaultDataMode } from '../lib/supabase'

export interface EcosystemDataState {
  destinations: Destination[]
  homestays: Homestay[]
  jobs: Job[]
  dispatches: Dispatch[]
  specimens: ArchitecturalSpecimen[]
  priceIndices: PriceIndexItem[]
  isLoading: boolean
  errors: {
    destinations: string | null
    homestays: string | null
    jobs: string | null
    dispatches: string | null
    specimens: string | null
    priceIndices: string | null
  }
  dataMode: DataMode
  setDataMode: (mode: DataMode) => void
  isSupabaseConnected: boolean
  refetchAll: () => Promise<void>
}

export const useEcosystemData = (): EcosystemDataState => {
  // Read initial data mode from storage or environment
  const [dataMode, setDataModeState] = useState<DataMode>(() => {
    const saved = typeof window !== 'undefined' ? sessionStorage.getItem('mountain_data_mode') : null
    if (saved === 'production' || saved === 'preview') return saved
    return getDefaultDataMode()
  })

  const [destinations, setDestinations] = useState<Destination[]>([])
  const [homestays, setHomestays] = useState<Homestay[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [dispatches, setDispatches] = useState<Dispatch[]>([])
  const [specimens, setSpecimens] = useState<ArchitecturalSpecimen[]>([])
  const [priceIndices, setPriceIndices] = useState<PriceIndexItem[]>([])

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [errors, setErrors] = useState<EcosystemDataState['errors']>({
    destinations: null,
    homestays: null,
    jobs: null,
    dispatches: null,
    specimens: null,
    priceIndices: null
  })

  const isSupabaseConnected = isSupabaseConfigured()

  const setDataMode = useCallback((newMode: DataMode) => {
    setDataModeState(newMode)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('mountain_data_mode', newMode)
    }
  }, [])

  const loadAllData = useCallback(async () => {
    setIsLoading(true)

    // Reset error state
    setErrors({
      destinations: null,
      homestays: null,
      jobs: null,
      dispatches: null,
      specimens: null,
      priceIndices: null
    })

    try {
      // Parallel execution for optimal performance
      const [
        destResult,
        homestayResult,
        jobResult,
        dispatchResult,
        specimenResult,
        priceResult
      ] = await Promise.allSettled([
        fetchDestinations(dataMode),
        fetchHomestays(dataMode),
        fetchJobs(dataMode),
        fetchDispatches(dataMode),
        fetchArchitecturalSpecimens(dataMode),
        fetchPriceIndex(dataMode)
      ])

      // Handle Destinations
      if (destResult.status === 'fulfilled') {
        setDestinations(destResult.value)
      } else {
        setErrors((prev) => ({ ...prev, destinations: destResult.reason?.message || 'Failed' }))
      }

      // Handle Homestays
      if (homestayResult.status === 'fulfilled') {
        setHomestays(homestayResult.value)
      } else {
        setErrors((prev) => ({ ...prev, homestays: homestayResult.reason?.message || 'Failed' }))
      }

      // Handle Jobs
      if (jobResult.status === 'fulfilled') {
        setJobs(jobResult.value)
      } else {
        setErrors((prev) => ({ ...prev, jobs: jobResult.reason?.message || 'Failed' }))
      }

      // Handle Dispatches
      if (dispatchResult.status === 'fulfilled') {
        setDispatches(dispatchResult.value)
      } else {
        setErrors((prev) => ({ ...prev, dispatches: dispatchResult.reason?.message || 'Failed' }))
      }

      // Handle Specimens
      if (specimenResult.status === 'fulfilled') {
        setSpecimens(specimenResult.value)
      } else {
        setErrors((prev) => ({ ...prev, specimens: specimenResult.reason?.message || 'Failed' }))
      }

      // Handle Price Indices
      if (priceResult.status === 'fulfilled') {
        setPriceIndices(priceResult.value)
      } else {
        setErrors((prev) => ({ ...prev, priceIndices: priceResult.reason?.message || 'Failed' }))
      }
    } catch (err: unknown) {
      console.error('Unhandled error during ecosystem data load:', err)
    } finally {
      setIsLoading(false)
    }
  }, [dataMode])

  useEffect(() => {
    loadAllData()
  }, [loadAllData])

  return {
    destinations,
    homestays,
    jobs,
    dispatches,
    specimens,
    priceIndices,
    isLoading,
    errors,
    dataMode,
    setDataMode,
    isSupabaseConnected,
    refetchAll: loadAllData
  }
}
