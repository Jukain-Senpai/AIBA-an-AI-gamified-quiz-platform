const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

const fakeUser = new User({
    id: 1,
    username: "jukain",
    email: "jukain@test.com",
    password: bcrypt.hashSync("123456", 10),
});

const registerUser = async (userData) => {
    const { username, email, password } = userData;

    if (!username || !email || !password) {
        throw new Error("Missing required fields");
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    return new User({
        id: Date.now(),
        username,
        email,
        password: hashedPassword,
    });
};

const loginUser = async ({ email, password }) => {
    if (email !== fakeUser.email) {
        throw new Error("User not found");
    }

    const isMatch = bcrypt.compareSync(password, fakeUser.password);
    if (!isMatch) {
        throw new Error("Invalid Password");
    }
    return fakeUser;
};

module.exports = {
    registerUser,
    loginUser,
}