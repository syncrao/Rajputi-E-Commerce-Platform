import axios from "axios";
const URL = import.meta.env.VITE_API_URL;

export async function getRequest(route, authToken = null) {
  console.log(`${route} Getting...`);
  try {
    const response = await axios.get(`${URL}/${route}`, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    const errData = error.response?.data || error.message;
    if (
      errData?.code === "token_not_valid" ||
      errData?.detail?.includes("Token is invalid") ||
      errData?.detail?.includes("Token is expired")
    ) {
      console.warn("Access token expired — logging out user.");
      localStorage.removeItem("authToken");
      localStorage.removeItem("userInfo");
      window.location.href = "/login";
    }

    console.log("Error:", errData);
    throw errData;
  }
}

export async function postRequest(route, data, authToken = "") {
  console.log(`${route} Posting...`);
  try {
    const response = await axios.post(`${URL}/${route}`, data, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    });
    console.log(response);
    return response.data;
  } catch (error) {
     const errData = error.response?.data || error.message;
    if (
      errData?.code === "token_not_valid" ||
      errData?.detail?.includes("Token is invalid") ||
      errData?.detail?.includes("Token is expired")
    ) {
      console.warn("Access token expired — logging out user.");
      localStorage.removeItem("authToken");
      localStorage.removeItem("userInfo");
      window.location.href = "/login";
    }

    console.log("Error:", errData);
    throw errData;
  }
}

export async function getAccessToken(route, refresh) {
  console.log(`${route} Getting Token...`);
  try {
    const response = await axios.post(`${URL}/${route}`, { refresh });
    return response.data.access;
  } catch (error) {
    console.log("Error:", error.response?.data || error.message);
    throw error.response?.data || new Error(error.message);
  }
}

export async function putRequest(route, data, authToken = null) {
  console.log(`${route} Updating...`);
  try {
    const response = await axios.put(`${URL}/${route}`, data, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
     const errData = error.response?.data || error.message;
    if (
      errData?.code === "token_not_valid" ||
      errData?.detail?.includes("Token is invalid") ||
      errData?.detail?.includes("Token is expired")
    ) {
      console.warn("Access token expired — logging out user.");
      localStorage.removeItem("authToken");
      localStorage.removeItem("userInfo");
      window.location.href = "/login";
    }

    console.log("Error:", errData);
    throw errData;
  }
}

export async function patchRequest(
  route,
  data,
  authToken = null,
  isMultipart = false
) {
  console.log(`${route} Updating...`);

  try {
    const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};

    if (isMultipart) {
      headers["Content-Type"] = "multipart/form-data";
    }

    const response = await axios.patch(`${URL}/${route}`, data, { headers });
    console.log(response.data);
    return response.data;
  } catch (error) {
     const errData = error.response?.data || error.message;
    if (
      errData?.code === "token_not_valid" ||
      errData?.detail?.includes("Token is invalid") ||
      errData?.detail?.includes("Token is expired")
    ) {
      console.warn("Access token expired — logging out user.");
      localStorage.removeItem("authToken");
      localStorage.removeItem("userInfo");
      window.location.href = "/login";
    }

    console.log("Error:", errData);
    throw errData;
  }
}

export async function deleteRequest(route, authToken) {
  console.log(`${route} Deleting...`);
  try {
    const response = await axios.delete(`${URL}/${route}`, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
     const errData = error.response?.data || error.message;
    if (
      errData?.code === "token_not_valid" ||
      errData?.detail?.includes("Token is invalid") ||
      errData?.detail?.includes("Token is expired")
    ) {
      console.warn("Access token expired — logging out user.");
      localStorage.removeItem("authToken");
      localStorage.removeItem("userInfo");
      window.location.href = "/login";
    }

    console.log("Error:", errData);
    throw errData;
  }
}
