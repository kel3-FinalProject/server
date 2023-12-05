// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
const { User } = require("../models");
const BASE_URL = "http://103.127.97.117:3003/api";
// const secret = "rahasia";

function getAccessToken() {
    return localStorage.getItem("accessToken");
  }
  
function putAccessToken(accessToken) {
    return localStorage.setItem("accessToken", accessToken);
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

class Controller {
  static getUser(req, res) {
    User.findAll()
    .then(result => {
      res.status(200).json({User: result});
    })
    .catch(error => {
      res.status(500).json({ error: "Internal Server Error" });
    });
}

    static async register({ email, name, password }) {
        const response = await fetch(`${BASE_URL}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, name, password }),
        });
      
        const responseJson = await response.json();
      
        if (response.status >= 400) {
          alert(responseJson.msg);
          return { error: true, code: response.status };
        }
      
        return { error: false, code: response.status };
      }

    static async login({ email, password }) {
        const response = await fetch(`${BASE_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
      
        const responseJson = await response.json();
      
        if (response.status >= 400) {
          alert(responseJson.msg);
          return { error: true, code: response.status, data: null };
        }
      
        putAccessToken(responseJson?.data?.token);
        return responseJson?.data?.token;
      }
      
}

module.exports = Controller;