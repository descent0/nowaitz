const express = require("express");
const employeeRouter = express.Router();
const { 
    deleteEmployee, 
    updateEmployee, 
    getEmployeesByShopId, 
    getEmployeeById, 
    getEmployees, 
    createEmployee 
} = require("../controller/employee.controller");
const { protectShop } = require("../middleware/protectShop");
const { protect } = require("../middleware/protect");

// Make sure all routes are defined correctly
employeeRouter.post("/",protectShop, createEmployee);
employeeRouter.get("/", getEmployees);
employeeRouter.get("/shop/:shopId", getEmployeesByShopId); // Important: this route must come before /:id
employeeRouter.get("/:id", getEmployeeById);
employeeRouter.put("/:id", protectShop,updateEmployee);
employeeRouter.delete("/:id", protectShop,deleteEmployee);

module.exports = employeeRouter;
