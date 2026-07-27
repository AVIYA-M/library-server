import users from '../dbUsers.js';

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'שגיאה בשליפת המשתמשים', error: error.message });
    }
};

export const signUp = async(req, res) => {
    try {
        const { username, email, password, phone, borrowedBooks } = req.body;

        const newUser = new User({
            username,
            email,
            password,
            phone,
            borrowedBooks: borrowedBooks || []
        });

        await newUser.save();

        res.status(201).json({ 
            message: "ההרשמה בוצעה בהצלחה!", 
            user: { 
                id: newUser._id, 
                username: newUser.username, 
                email: newUser.email 
            } 
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "כתובת האימייל כבר קיימת במערכת" });
        }
        res.status(400).json({ message: "שגיאה בהרשמה", error: error.message });
    }
};


export const signIn =async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "נא להזין אימייל וסיסמה" });
        }

        const user = await User.findOne({ email, password });
        if (!user) {
            return res.status(401).json({ message: "אימייל או סיסמה שגויים" });
        }

        res.status(200).json({ message: "התחברת בהצלחה!", username: user.username });
    } catch (error) {
        res.status(500).json({ message: "שגיאה בהתחברות", error: error.message });
    }
};