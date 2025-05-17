const cron = require('node-cron');
const { updateDailySchedules } = require('../lib/autoGenSchedule');

const initCronJobs = () => {
    // Run at 00:00 (midnight) every day
    cron.schedule('0 0 * * *', async () => {
        console.log('Running daily schedule update...');
        try {
            await updateDailySchedules();
        } catch (error) {
            console.error('Failed to update daily schedules:', error);
        }
    });
};

module.exports = { initCronJobs };
