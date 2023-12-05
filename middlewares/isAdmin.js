const { User } = require("../models");

async function isAdmin(req, res, next){
    try {
        const userId = req.userId;
        
        const checkAdmin = await User.findOne({where: { id: userId} });

        if(checkAdmin && checkAdmin.isAdmin) {
            next();
        } else {
            throw new Error("Anda Bukan Admin!");
        }
    } catch (error) {
        next(error);
    }
}

module.exports = isAdmin;