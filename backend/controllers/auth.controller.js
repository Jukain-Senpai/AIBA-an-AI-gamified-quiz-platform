const testAuth = (req, res) => {
    res.json({
        message: "Auth controller is working",
    });
};

module.exports = {
    testAuth,
};