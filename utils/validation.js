const bcrypt = require('bcryptjs');
const User = require('../models/user');


async function validateRegistration(username, password, password2) {
    if (username.length < 4) {
        return { success: false, message: 'The username must consist of a minimum of 4 characters.' };
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return { success: false, message: 'Username already exists' };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error checking existing user' };
    }
    if (password.length < 6) {
        return { success: false, message: 'The password must contain a minimum of 6 characters.' };
    }


    if (password !== password2) {
        return { success: false, message: 'Passwords do not match' };
    }



    return { success: true };
}
async function validateLogin(username, password) {
    const user = await User.findOne({ username });

    if (!user) {
        return { success: false, message: 'User not found' };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        return { success: false, message: 'Incorrect password' };
    }

    return { success: true, user };
}
async function validatePasswordChange(oldPassword, newPassword, confirmNewPassword, id) {
    // Проверка на совпадение нового пароля и его подтверждения
    
    const user = await User.findById(id);
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
        return { success: false, message: 'entered old password Incorrect' };
    }
    if (newPassword !== confirmNewPassword) {
        return { success: false, message: 'Confirm passwords do not match' };
    }
    // Проверка на минимальную длину нового пароля
    if (newPassword.length < 6) {
        return { success: false, message: 'New password should be at least 6 characters long' };
    }



    return { success: true };
}

module.exports = { validateLogin, validateRegistration, validatePasswordChange };
