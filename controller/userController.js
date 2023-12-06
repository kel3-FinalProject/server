const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const secret = "rahasia";

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

static async register(req, res) {
  const { name, email, password, confirmPassword } = req.body;

  try {
      console.log("Received registration request:", { name, email, password, confirmPassword });
      const existingUser = await User.findOne({ where: { email } });
      console.log("Existing user:", existingUser);

      if (existingUser) {
          return res.status(400).json({ message: "Email is already registered. Please use a different email address." });
      }
      if (password !== confirmPassword) {
          return res.status(400).json({ message: "Password and confirm password do not match" });
      }
      const user = await User.create({
          name,
          email,
          password,
      });

      res.status(201).json({ message: "Akun berhasil dibuat, silahkan login", user });
  } catch (error) {
      console.error(error);
      res.status(500).json(error);
  }
}

static async login(req, res, next) {
    try {
      const { email, password } = req.body;
  
      const users = await User.findOne({
        where: {
          email,
        },
      });

      if (users) {
        const validation = bcrypt.compareSync(password, users.password);
  
        if (validation) {
          const token = jwt.sign(
            {
              id: users.id,
              email: users.email,
              isAdmin: users.isAdmin,
            },
            secret
          );
  
          res.status(200).json({ message: "Berhasil login!", token });
        } else {
          next(new Error("SALAH EMAIL/PASSWORD"));
        } 
    } else {
        next(new Error("SALAH EMAIL/PASSWORD"));
      }
    } catch (error) {
      next(error);
    }
  }
      
}

module.exports = Controller;