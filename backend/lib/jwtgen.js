const jwt = require("jsonwebtoken");

const generateToken = (Id,role, res) => {
    const token = jwt.sign({ Id , role}, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
    console.log(token);

    console.log("Setting cookie...");
    if (res && res.cookie) {
        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60, // 1 hour in milliseconds
            sameSite: "strict",
        });
    } else {
        console.error("Response object is not defined or does not have a cookie method");
    }
    return token; // Return the token
};


module.exports = {
    generateToken,
};
