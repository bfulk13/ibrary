const bcrypt = require('bcryptjs');

module.exports = {
    register: async (req, res) => {
    // console.log(req.body)
    const { username, password, email } = req.body;
    const { session } = req;
    const db = req.app.get('db');
    let takenUsername = await db.auth.check_username({ username });
    takenUsername = +takenUsername[0].count;
    if(takenUsername !== 0) {
        return res.sendStatus(409)
    }
    
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);
    let user = await db.auth.register({ username, password: hash, email });
    user = user[0];
    // console.log({before: session})
    session.user = user;
    // console.log({after: session})
    res.status(200).send(session.user)
    },

}