const registerUser = async (userData) => {
    const { username, email, password } = userData;

    if (!username || !email || !password) {
        throw new Error("Missing required fields");
    }

    return {
        id: Date.now(),
        username,
        email,
        role: "user",
        xp: 0,
        level: 1,
    };
};

module.exports = {
    registerUser,
}