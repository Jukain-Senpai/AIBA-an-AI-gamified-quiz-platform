const User = require("../models/user.model");

const registerUser = async (userData) => {
    const { username, email, password } = userData;

    if (!username || !email || !password) {
        throw new Error("Missing required fields");
    }

    const user = new User({
        id: Date.now(),
        username,
        email,
        password, //Hash later
    });

    return user;
};

module.exports = {
    registerUser,
}