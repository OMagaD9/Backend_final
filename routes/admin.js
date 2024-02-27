const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Item = require('../models/mainPage');
const validateUserAdmin = require('../utils/validateUserAdmin');
const jwt = require('jsonwebtoken');


router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        const items = await Item.find();
        res.render('admin', { users,items });
    } catch (error) {
        console.error(error);
        res.status(500).json({ errorMessage: 'Error fetching users' });
    }
});

router.post('/users', async (req, res) => {
    const { username, password, password2, isAdmin } = req.body;
    var users = await User.find();

    const validationResult = await validateUserAdmin(username, password, password2);
    if (!validationResult.success) {
        return res.render('admin', { users, errorMessage: validationResult.message });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, isAdmin: isAdmin === 'on' });

    try {
        await user.save();
        users = await User.find();
        const items = await Item.find();

        return res.render('admin', { users ,items,successMessage:"user created"},);
    } catch (error) {
        console.error(error);
        return res.render('admin', { users, errorMessage: error.message });
    }
});

router.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { newUsername, password, isAdmin } = req.body;


    try {
        let updateData = {};
        
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        if (newUsername) {
            updateData.username = newUsername;
        }

        // If isAdmin is "true", convert it to boolean
        updateData.isAdmin = isAdmin === "true";

        await User.findByIdAndUpdate(id, updateData);
        users = await User.find();
        const items = await Item.find();
        return res.render('admin', { users,items,successMessage: 'User updated' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errorMessage: 'Error updating user' });
    }
});

router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await User.findByIdAndDelete(id);
        const users = await User.find();
        const items = await Item.find();

        return res.render('admin', { users, items ,successMessage: 'User deleted' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errorMessage: 'Error deleting user' });
    }
});

router.post('/items', async (req, res) => {
    const { nameEn, nameRus, descriptionEn, descriptionRus, imageURL1, imageURL2, imageURL3 } = req.body;

    const newItem = new Item({
        nameEn,
        nameRus,
        descriptionEn,
        descriptionRus,
        imageURL1,
        imageURL2,
        imageURL3
    });

    try {
        await newItem.save();
        const users = await User.find();
        const items = await Item.find()
        return res.render('admin', { successMessage: 'Item created', users, items});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, errorMessage: 'Error creating item' });
    }
});

router.put('/items/:id', async (req, res) => {
    const { id } = req.params;
    const { nameEn, nameRus, descriptionEn, descriptionRus, imageURL1, imageURL2, imageURL3 } = req.body;

    try {
        const updatedItem = await Item.findByIdAndUpdate(id, {
            nameEn,
            nameRus,
            descriptionEn,
            descriptionRus,
            imageURL1,
            imageURL2,
            imageURL3,
            updatedAt: Date.now() // Update the updatedAt timestamp
        }, { new: true }); // Set new: true to return the updated document

        if (!updatedItem) {
            return res.status(404).json({ success: false, errorMessage: 'Item not found' });
        }
        const users = await User.find();
        const items = await Item.find();
        res.render('admin', { successMessage: 'Item updated', users, items});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, errorMessage: 'Error updating item' });
    }
});

router.delete('/items/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedItem = await Item.findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).json({ success: false, errorMessage: 'Item not found' });
        }
        const users = await User.find();
        const items = await Item.find();
        res.render('admin', { successMessage: 'Item deleted', users, items});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, errorMessage: 'Error deleting item' });
    }
});

module.exports = router;
