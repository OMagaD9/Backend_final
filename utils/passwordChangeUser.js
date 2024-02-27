const bcrypt = require('bcryptjs');
const User = require('../models/user');

async function passwordChangeUser(password1, password2, password3, id) {
    
    const user = await User.findById(id);
    const passwordMatch = await bcrypt.compare(password1, user.password);
    if (!passwordMatch) {
        return { success: false, message: 'entered old password Incorrect' };
    }
    if (password2 !== password3) {
        return { success: false, message: 'Confirm passwords do not match' };
    }
    if (password2.length < 6) {
        return { success: false, message: 'New password should be at least 6 characters long' };
    }
    return { success: true };
}

module.exports = passwordChangeUser;
