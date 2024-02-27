const User = require('../models/user');

async function validateUserAdmin(param1, param2, param3) {
    if (param1.length < 4) {
        return { success: false, message: 'username must have at least 4 character' };
    }

    try {
        const existingData = await User.findOne({ param1 });
        if (existingData) {
            return { success: false, message: 'user not found' };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Validation failed' };
    }

    if (param2.length < 6) {
        return { success: false, message: 'password must have at least 6 character' };
    }

    if (param2 !== param3) {
        return { success: false, message: 'password do not matches' };
    }

    return { success: true };
}

module.exports = validateUserAdmin;