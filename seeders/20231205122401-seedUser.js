'use strict';
const bcrypt = require("bcrypt");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const hashpass = await bcrypt.hash("admin123",10);
    await queryInterface.bulkInsert('Users', 
    [
      {
        name: "nengmutiarahma",
        email: "mutiarahma042@gmail.com",
        password: hashpass,
        isAdmin: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "ibnufaqri",
        email: "ibnu165@gmail.com",
        password: hashpass,
        isAdmin: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "rico",
        email: "rico77@gmail.com",
        password: hashpass,
        isAdmin: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "shibaazmi",
        email: "shibaa99@gmail.com",
        password: hashpass,
        isAdmin: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },
  

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
