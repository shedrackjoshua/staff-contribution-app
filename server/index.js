const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// serve frontend production build if present
const path = require('path')
const fs = require('fs')
const distPath = path.join(__dirname, '..', 'dist')
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath))
    // serve index.html for any other routes (single page app)
    app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'))
    })
}

//connect to MongoDB
mongoose.connect('mongodb+srv://Joshua:Marine234@nodetutorial.wexlxdy.mongodb.net/staffcontributionDB?appName=nodetutorial').then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Failed to connect to MongoDB', err);
});
//import staff models
const Staff = require('./models/staff');
const Contribution = require('./models/contribution');

app.get('/staffs', async (req, res) => {
    try {
        const staffs = await Staff.find();
        res.json(staffs);
    } catch (err){
        res.status(500).json({ message: err.message })
    }
});
app.post('/staffs', async (req, res) => {
    const { name, department, phone} = req.body;
    const newStaff = new Staff({ name, department, phone });
    try {
        const savedStaff = await newStaff.save();
        res.status(201).json(savedStaff);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.get('/contact', (req, res) => {
    res.send('This is contact page');
})
app.get('/staff', (req,res) => {
    res.send('This is staff page');
})

app.get('/staffs/:id', async (req,res) => {
    try {
        const staff = await Staff.findById(req.params.id);
        if (!staff) {
            return res.status(404).json({ message: 'Staff not found'})
        }
        res.json(staff);
    } catch (err) {
        res.status(500).json({ message: err.message});
    }
})

app.delete('/staffs/:id', async (req,res) => {
    try {
        const deletedStaff = await Staff.findByIdAndDelete(req.params.id);
        if (!deletedStaff) {
            return res.status(404).json({ message: 'Staff not found'});
        }
        res.json({ message: 'Staff deleted successfully'});
    } catch (err){
        res.status(500).json({ message: err.message });
    }
});

app.put('/staffs/:id', async (req,res) => {
    const staffID = req.params.id;
    const updatedData = req.body;
    await Staff.findByIdAndUpdate(staffID, updatedData);
    res.json({ success: true, message: 'Staff updated successfully'})
});

// Contribution Endpoint
app.get('/contributions', async (req, res) => {
    try {
        const contributions = await Contribution.find({}).populate('staff');
        res.json(contributions);
    } catch (err){
        res.status(500).json({ message: err.message })
    }
});
app.post('/contributions', async (req, res) => {
    const { amount, month, day, staff } = req.body;

    try {
        // check if staff exist
        const staffExists = await Staff.findById(staff);
        if (!staffExists) {
            return res.status(404).json({ message: 'Staff not found, please check the staff ID.'});
        }
        //if staff exists, create the contribution
        const newContribution = new Contribution({ amount, month, day, staff});
        const savedContribution = await newContribution.save();
        // populate the saved document before returning
        const populatedContribution = await savedContribution.populate('staff');
        res.status(201).json(populatedContribution);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//Get Contribution by Staff ID
app.get('/contributions/staff/:staffId', async (req, res) => {
    try {
        const contributions = await Contribution.find({ staff: req.params.staffId}).populate('staff');
        res.json(contributions);
    } catch (err) {
        res.json({ message: err.message });
    }
})

// Delete a contribution
app.delete('/contributions/:id', async (req, res) => {
    try {
        const deletedContribution = await Contribution.findByIdAndDelete(req.params.id);
        if (!deletedContribution){
            return res.status(404).json({ message: 'Contribution not found' })
        }
        res.json({ message: 'Contribution deleted successfully'})
    } catch (err){
        res.status(500).json({ message: err.message });
    }
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
})