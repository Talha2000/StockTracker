const db = require("../db")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

// const sql = require('mssql')  

const register = (req, res)=>{
    // check existing user
    const q = "SELECT * FROM users where email = ? OR username = ?";

    console.log(req.body)
    db.query(q, [req.body.email, req.body.username], (err, data)=>{
        if (err) return res.json(err)

        if (data.length) return res.status(409).json("User already exists!");

        //Hash the password and create user
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const q = "INSERT INTO users(username, email, password)" + 
                  "VALUES(?)"
        const values = [
            req.body.username,
            req.body.email,
            hash,
        ]

        db.query(q, [values], (err,data)=> {
            if (err) return res.json(err)
            return res.status(200).json("User has been created!");
        });
    });
}

const login = (req, res)=>{
    // check if user exists
    const q = "SELECT * FROM users where username = ?";
    db.query(q, [req.body.username], (err, data)=> {
        if (err) return res.json(err);
        if (data.length === 0) return res.status(404).json("User not found!")
        
        // Check password
        // Load hash from your password DB.
        const validatePassword = bcrypt.compareSync(req.body.password, data[0].password);
        
        if (!validatePassword) return res.status(400).json("Wrong username or password!")
        
        
        // const {password, ...other} = data[0];
        const {id} = data[0];
        const user = { id: id, user: req.body.username}
        const token = jwt.sign(user, process.env.ACCESS_TOKEN);
        console.log("This is the user object I want to sign " + user.id)


        res.json(token)
        // res
        // .cookie("access_token", token, {
        //     httpOnly: true,
        //     path: "/",
        // }).status(200).json(other);
    });
};

const logout = (req, res)=>{
    res.clearCookie("access_token", {
        sameSite: "none",
        secure: true
    }).status(200).json("User has been logged out.");
}

module.exports = {
    register,
    login,
    logout,
}