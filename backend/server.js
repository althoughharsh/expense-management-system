const Expense = require("./models/Expense");
const auth = require("./middleware/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("API Running");
});
app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        name,
        email,
        password: hashedPassword
    });

    await user.save();

    res.send("User Registered Successfully");
});
app.post("/login", async (req, res) => {
    const user = await User.findOne({
        email: req.body.email
    });

    if (!user) {
        return res.status(400).send("User not found");
    }

    const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
    );

    if (!validPassword) {
        return res.status(401).send("Invalid Password");
    }

    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET
    );

    res.json({ token });
});
app.post("/expense", auth, async (req, res) => {
    const { title, amount, category } = req.body;

    const expense = new Expense({
        userId: req.user.id,
        title,
        amount,
        category
    });

    await expense.save();

    res.send("Expense Added Successfully");
});

app.get("/expenses", auth, async (req, res) => {
    const expenses = await Expense.find({
        userId: req.user.id
    });

    res.json(expenses);
});
const port = Number(process.env.PORT) || 5000;

if (!process.env.MONGO_URI) {
    console.error("Missing MONGO_URI in environment variables");
    process.exit(1);
}

if (!process.env.JWT_SECRET) {
    console.error("Missing JWT_SECRET in environment variables");
    process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");
    app.listen(port, () => {
        console.log(`Server Running on port ${port}`);
    });
})
.catch(err => console.log(err));