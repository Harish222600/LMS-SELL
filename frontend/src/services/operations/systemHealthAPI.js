import { toast } from "react-hot-toast"
import { apiConnector } from "../apiConnector"
import { systemHealthEndpoints } from "../apis"

const { GET_SYSTEM_HEALTH_API } = systemHealthEndpoints

export const getSystemHealthMetrics = async (token) => {
  const toastId = toast.loading("Loading system health metrics...")
  let result = null
  
  try {
    const response = await apiConnector("GET", GET_SYSTEM_HEALTH_API, null, {
      Authorization: `Bearer ${token}`,
    })
    
    console.log("GET_SYSTEM_HEALTH_API Response:", response)
    
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could not fetch system health metrics")
    }
    
    result = response.data.data
    toast.success("System health metrics loaded", { id: toastId })
  } catch (error) {
    console.error("GET_SYSTEM_HEALTH_API Error:", error)
    toast.error(error?.response?.data?.message || "Failed to load system health metrics", { id: toastId })
  }
  
  return result
}

export const getSystemHealthMetricsQuiet = async (token) => {
  let result = null
  
  try {
    const response = await apiConnector("GET", GET_SYSTEM_HEALTH_API, null, {
      Authorization: `Bearer ${token}`,
    })
    
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could not fetch system health metrics")
    }
    
    result = response.data.data
  } catch (error) {
    console.error("GET_SYSTEM_HEALTH_API Error:", error)
  }
  
  return result
}
