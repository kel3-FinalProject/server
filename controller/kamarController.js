const { Kamar } = require("../models");
const path = require("path");
const fs = require("fs");

class Controller {
  static getKamar = async (req, res) => {
    try {
      const response = await Kamar.findAll();
  
      const formattedResponse = response.map((element) => {
        if (element.fasilitas !== "" && element.fasilitas !== null) {
          const fasilitas_array = element.fasilitas.split(",");
          element.dataValues.fasilitas_array = fasilitas_array;
        }
        return element.toJSON(); // Convert Sequelize model to plain JSON object
      });
  
      res.json({ error: false, code: 200, data: formattedResponse });
    } catch (error) {
      console.log(error.message);
      res.json({ error: true, code: 500, data: null });
    }
  };
  

  static async getKamarById(req, res) {
    try {
      const response = await Kamar.findOne({
        where: {
          id: req.params.id,
        },
      });
      res.json(response);
    } catch (error) {
      console.log(error.message);
    }
  }

  static addKamar(req, res, next) {
    try {
      if (!req.files || !req.files.file) {
        throw { name: "badRequest", message: "Tidak Ada File yang Diunggah" };
      }
      const {
        nameKamar,
        harga,
        description,
        fasilitas,
        size,
        Class,
        kapasitas,
      } = req.body;
      const file = req.files.file;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      const fileName = file.md5 + ext;
      const urlImage = `${req.protocol}://${req.get(
        "host"
      )}/images/${fileName}`;
      const allowedType = [".png", ".jpg", ".jpeg"];

      if (!allowedType.includes(ext.toLowerCase())) {
        throw { name: "unprocessableEntity", message: "Invalid Images" };
      }

      if (fileSize > 5000000) {
        throw {
          name: "unprocessableEntity",
          message: "Image must be less than 5 MB",
        };
      }

      file.mv(`./public/images/${fileName}`, async (err) => {
        if (err) {
          throw { name: "internalServerError", message: err.message };
        }

        try {
          await Kamar.create({
            nameKamar,
            harga,
            description,
            fasilitas,
            size,
            Class,
            kapasitas,
            image: fileName,
            urlImage: urlImage,
          });
          res.status(201).json({ msg: "Kamar Created Successfully" });
        } catch (error) {
          console.log(error.message);
          next(error); // Teruskan error ke middleware error handling
        }
      });
    } catch (error) {
      console.log(error.message);
      next(error); // Teruskan error ke middleware error handling
    }
  }

  static async updateKamar(req, res) {
    try {
      const kamar = await Kamar.findOne({
        where: {
          id: req.params.id,
        },
      });

      if (!kamar) {
        return res.status(404).json({ msg: "No Data Found" });
      }

      let fileName = "";

      if (req.files === null) {
        fileName = kamar.image;
      } else {
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        fileName = file.md5 + ext;
        const allowedType = [".png", ".jpg", ".jpeg"];

        if (!allowedType.includes(ext.toLowerCase())) {
          return res.status(422).json({ msg: "Invalid Images" });
        }
        if (fileSize > 5000000) {
          return res.status(422).json({ msg: "Image must be less than 5 MB" });
        }

        const filepath = `./public/images/${kamar.image}`;

        // Periksa apakah file ada sebelum mencoba menghapusnya
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }

        file.mv(`./public/images/${fileName}`, (err) => {
          if (err) return res.status(500).json({ msg: err.message });
        });
      }

      const {
        nameKamar,
        harga,
        description,
        fasilitas,
        size,
        Class,
        kapasitas,
      } = req.body;
      const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

      await Kamar.update(
        {
          nameKamar,
          harga,
          description,
          fasilitas,
          size,
          Class,
          kapasitas,
          image: fileName,
          url: url,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );

      res.status(200).json({ msg: "Kamar Updated Successfully" });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async deleteKamar(req, res) {
    try {
      const kamar = await Kamar.findOne({
        where: {
          id: req.params.id,
        },
      });

      if (!kamar) {
        return res.status(404).json({ msg: "No Data Found" });
      }

      const filepath = `./public/images/${kamar.image}`;

      // Periksa apakah file ada sebelum mencoba menghapusnya
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      } else {
        console.log("File not found:", filepath);
        return res.status(404).json({ msg: "File not found" });
      }

      await Kamar.destroy({
        where: {
          id: req.params.id,
        },
      });

      res.status(200).json({ msg: "Kamar Deleted Successfully" });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = Controller;