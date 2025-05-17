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

// Make sure all routes are defined correctly
employeeRouter.post("/", createEmployee);
employeeRouter.get("/", getEmployees);
employeeRouter.get("/shop/:shopId", getEmployeesByShopId); // Important: this route must come before /:id
employeeRouter.get("/:id", getEmployeeById);
employeeRouter.put("/:id", updateEmployee);
employeeRouter.delete("/:id", deleteEmployee);

module.exports = employeeRouter;
