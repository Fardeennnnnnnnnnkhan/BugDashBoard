const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/auth');
const dotenv = require('dotenv');
const adminRoutes = require('./routes/adminRoutes')
const taskRoute = require('./routes/taskRoutes')
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use('/api/auth', userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/task", taskRoute);
app.use("/",(req,res)=>{
    // console.log("Connected to backend...")
}); 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});