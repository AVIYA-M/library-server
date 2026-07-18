import users from '../dbUsers.js';

export const getAllUsers = (req, res) => {
    res.json(users);
};

export const signUp = (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: "נא למלא את כל שדות החובה" });
    }
    
    const userExists = users.find(u => u.email === email);
    if (userExists) {
        return res.status(400).json({ message: "משתמש זה כבר קיים" });
    }

    const newUser = {
        id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
        username,
        email,
        password,
        borrowedBooks: []
    };

    users.push(newUser);
    res.status(201).json({ message: "ההרשמה בוצעה בהצלחה!", user: newUser });
};

export const signIn = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "נא להזין אימייל וסיסמה" });
    }

    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        return res.status(401).json({ message: "אימייל או סיסמה שגויים" });
    }

    res.json({ message: "התחברת בהצלחה!", username: user.username });
};