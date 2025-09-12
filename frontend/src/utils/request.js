import axios from "axios";
const URL = import.meta.env.VITE_API_URL


export async function getRequest(route, authToken = null) {
  console.log(`${route} Getting...`)
  try {
    const response = await axios.get(`${URL}/${route}`, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    });
    console.log(response.data)
    return response.data
  } catch (error) {
    console.log("Error:", error.response?.data || error.message)
    throw error.response?.data || new Error(error.message)
  }
}

export async function postRequest(route, data, authToken = "") {
  console.log(`${route} Posting...`)
  try {
    const response = await axios.post(`${URL}/${route}`, data, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    });
    console.log(response)
    return response.data
  } catch (error) {
    console.error("Error:", error.response?.data || error.message)
    throw error.response?.data || new Error(error.message)
  }
}

export async function getAccessToken(route, refresh) {
  console.log(`${route} Getting Token...`)
  try {
    const response = await axios.post(`${URL}/${route}`, { refresh });
    return response.data.access;
  } catch (error) {
    console.log("Error:", error.response?.data || error.message)
    throw error.response?.data || new Error(error.message)
  }
}

export async function updateRequest(route, data, authToken = null) {
  console.log(`${route} Updating...`)
  try {
    const response = await axios.put(`${URL}/${route}`, data, {
      headers: authToken? {Authorization: `Bearer ${authToken}`} : {}
    })
    console.log(response.data)
    return response.data
  } catch (error) {
    console.log("Error:", error.response?.data || error.message)
    throw error.response?.data || new Error(error.message)
  }
}

export async function deleteRequest(route, authToken) {
  console.log(`${route} Deleting...`)
   try {
    const response = await axios.delete(`${URL}/${route}`,{
      headers: authToken? {Authorization: `Bearer ${authToken}`} : {}
    })
    console.log(response.data)
    return response.data
  } catch (error) {
    console.log("Error:", error.response?.data || error)
    throw error.response?.data || new Error(error.message)
  }
  
}





