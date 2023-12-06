const BASE_URL = "http://103.127.97.117:4003/";
  
  function getAccessToken() {
    return localStorage.getItem("accessToken");
  }
  
  function putAccessToken(accessToken) {
    return localStorage.setItem("accessToken", accessToken);
  }
  
  async function deleteAccesToken() {
    localStorage.clear();
  }
  
  async function fetchWithToken(url, options = {}) {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
  }
  
  async function login({ username, password }) {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
  
    const responseJson = await response.json();
    console.log(responseJson);
    if (response.status >= 400) {
      alert(responseJson.msg);
      return { error: true, code: response.status, data: null };
    }
  
    return { error: false, code: response.status, data: responseJson.data };
  }

  async function register({ username, password }) {
    const response = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
  
    const responseJson = await response.json();
  
    if (response.status >= 400) {
      alert(responseJson.msg);
      return { error: true, code: response.status };
    }
  
    return { error: false, code: response.status };
  }

  export { getAccessToken, putAccessToken, deleteAccesToken, login, register };