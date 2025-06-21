const express = require('express');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables at the very beginning
require('./config/passport');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { connectDB } = require('./lib/db');
const { userRouter } = require('./routes/user.route');
const passport = require('passport');
const serviceRouter = require('./routes/service.route');
const ShopRouter = require('./routes/shop.route');
const employeeRouter = require('./routes/employee.route');
const scheduleRouter = require('./routes/schedule.route');
const paymentRouter = require('./routes/payment.route');
const cron = require("node-cron");
const CategoryRouter = require('./routes/category.route');
const path = require('path');
const { initCronJobs } = require('./config/cron');
const appointmentRouter = require('./routes/appointment.route');

const app = express();

const port = process.env.PORT;
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: `${process.env.REACT_FRONTEND_API}`,  
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS','PATCH'],  // Allow specific HTTP methods
    credentials: true,  // Allow cookies to be sent
    allowedHeaders: ['Authorization', 'Content-Type'] 
}));

app.use(passport.initialize());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/auth", userRouter);
app.use("/api/shop", ShopRouter);
app.use("/api/employee",employeeRouter)
app.use("/api/sche", scheduleRouter);
app.use("/api/cate", CategoryRouter);
app.use("/api/serv", serviceRouter);
app.use("/api/razor-pay", paymentRouter);
app.use("/api/appointments", appointmentRouter);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
    });
}


app.listen(port, () => {
    console.log('Server is running at port ' + port);
    initCronJobs(); 
});