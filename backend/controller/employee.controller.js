const Employee = require("../model/employee.model");
const {generateEmployeeSchedule, deleteScheduleByEmployeeId} = require('../lib/autoGenSchedule');


// Create Employee
const createEmployee = async (req, res) => {
    try {
        const { email, name, shopId, phone, type, entryTime, exitTime, slotTime } = req.body;
        
        if (!email || !name || !shopId || !phone || !type || !entryTime || !exitTime || !slotTime) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const employee = new Employee({
            email,
            name,
            shopId,
            phone,
            type,
            entryTime,
            exitTime,
            slotTime: parseInt(slotTime, 10)
        });

        await employee.save();
        await generateEmployeeSchedule(employee._id, shopId, entryTime, exitTime, parseInt(slotTime, 10));
        res.status(201).json(employee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get All Employees
const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find().populate("shopId");
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Single Employee
const getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Employee ID is required" });
        }

        const employee = await Employee.findById(id).populate("shopId");
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Employees by Shop ID
const getEmployeesByShopId = async (req, res) => {
    try {
        const { shopId } = req.params;
        console.log(shopId);
        if (!shopId) {
            return res.status(400).json({ message: "Shop ID is required" });
        }

        const employees = await Employee.find({ shopId });
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Employee
const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, name, shopId, phone, type, entryTime, exitTime, slotTime } = req.body;
        
        if (!email || !name || !shopId || !phone || !type || !entryTime || !exitTime || !slotTime) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const employee = await Employee.findByIdAndUpdate(
            id,
            {
                email,
                name,
                shopId,
                phone,
                type,
                entryTime,
                exitTime,
                slotTime: parseInt(slotTime, 10)
            },
            { new: true }
        );

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        // await deleteScheduleByEmployeeId(employee._id);
        await generateEmployeeSchedule(employee._id, shopId, entryTime, exitTime, parseInt(slotTime, 10));

        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete Employee
const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Employee ID is required" });
        }

        const employee = await Employee.findByIdAndDelete(id);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        //  deleteScheduleByEmployeeId(employee._id);
        res.status(200).json({ message: "Employee deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createEmployee,
    getEmployeeById,
    getEmployeesByShopId,
    deleteEmployee,
    updateEmployee,
    getEmployees
};
