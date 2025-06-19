const Employee = require("../model/employee.model");
const { Schedule } = require("../model/schedule.model");


// Function to generate time slots in a given time range
function generateTimeSlots(entryTime, exitTime, slotTime) {
    let slots = [];
    let lunchStart = "13:00";
    let  lunchDuration = 30;
    let [startHour, startMinute] = entryTime.split(":").map(Number);
    let [endHour, endMinute] = exitTime.split(":").map(Number);
    let [lunchHour, lunchMinute] = lunchStart.split(":").map(Number);
    
    let slotDuration = Number(slotTime);
    let currentHour = startHour;
    let currentMinute = startMinute;

    while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
        let startSlot = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
        
        let endSlotMinute = currentMinute + slotDuration;
        let endSlotHour = currentHour;
        
        if (endSlotMinute >= 60) {
            endSlotHour += Math.floor(endSlotMinute / 60);
            endSlotMinute %= 60;
        }
        
        let endSlot = `${String(endSlotHour).padStart(2, '0')}:${String(endSlotMinute).padStart(2, '0')}`;
        if (
            (currentHour === lunchHour && currentMinute < lunchMinute + lunchDuration) ||
            (endSlotHour === lunchHour && endSlotMinute > lunchMinute)
        ) {
            currentHour = lunchHour;
            currentMinute = lunchMinute + lunchDuration;
        } else {
            if (endSlotHour < endHour || (endSlotHour === endHour && endSlotMinute <= endMinute)) {
                slots.push(`${startSlot} - ${endSlot}`);
            }
            currentMinute += slotDuration;
            if (currentMinute >= 60) {
                currentHour += Math.floor(currentMinute / 60);
                currentMinute %= 60;
            }
        }
    }

    return slots;
}


// Function to generate schedules for employees
const generateEmployeeSchedule = async (employeeId,shopId,entryTime,exitTime,slotTime) => {
    const slots = generateTimeSlots(entryTime, exitTime, slotTime); 
    const currentDate = new Date();
    let schedules = [];

    // Generate schedules for the next 10 days
    for (let i = 0; i < 10; i++) {
        const scheduleDate = new Date(currentDate);
        scheduleDate.setDate(scheduleDate.getDate() + i);
        scheduleDate.setHours(0, 0, 0, 0);
        scheduleDate.setUTCHours(0, 0, 0, 0); // Ensure the time is set to midnight for each date

        // Assign the slots for this day
        slots.forEach(slot => {
            schedules.push({
                shopId, // Make sure you provide the correct shopId
                employeeId,
                date: scheduleDate,
                slot: slot
            });
        });
    }

    try {
        // Insert the generated schedules into the database
        await Schedule.insertMany(schedules);
    } catch (error) {
        console.error('Error inserting schedules:', error);
    }
};



const deleteScheduleByEmployeeId = async (employeeId) => {
    try {
        // Delete schedules from the database where the employeeId matches
        const result = await Schedule.deleteMany({ employeeId });
        
        if (result.deletedCount > 0) {
            console.log(`Successfully deleted ${result.deletedCount} schedules for employeeId: ${employeeId}`);
        } else {
            console.log(`No schedules found for employeeId: ${employeeId}`);
        }
    } catch (error) {
        console.error('Error deleting schedules:', error);
    }
};

const updateDailySchedules = async () => {
    try {
        console.log("Starting daily schedule update...");

        // Get current date and set to midnight
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        // Delete previous day's schedules
        const previousDate = new Date(currentDate);
        previousDate.setDate(previousDate.getDate() - 1);
        
        // Set target date to 10 days from now
        const targetDate = new Date(currentDate);
        targetDate.setDate(targetDate.getDate() + 10);

        // Get all employees
        const employees = await Employee.find().lean();
        let newSchedules = [];

        // Generate schedules for each employee
        for (const employee of employees) {
            const slots = generateTimeSlots(employee.entryTime, employee.exitTime, employee.slotTime);
            
            // Create schedule objects for the 10th day
            const daySchedules = slots.map(slot => ({
                shopId: employee.shopId,
                employeeId: employee._id,
                date: targetDate,
                slot: slot
            }));

            newSchedules.push(...daySchedules);
        }

        // Insert all new schedules
        if (newSchedules.length > 0) {
            await Schedule.insertMany(newSchedules);
            console.log(`Generated ${newSchedules.length} schedules for ${targetDate.toISOString().split('T')[0]}`);
        }

        console.log("Daily schedule update completed successfully.");
    } catch (error) {
        console.error("Error updating daily schedules:", error);
        throw error;
    }
};

module.exports={
    generateEmployeeSchedule,
    deleteScheduleByEmployeeId,
    updateDailySchedules
}

