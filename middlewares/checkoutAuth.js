const Temporary = require("../models/temporaryModel");

const isLogin = async(req, res, next) => {
    try {
        console.log(req.session.order_id)
        if(req.session.order_id){
            const item = await Temporary.findOne({_id: req.session.order_id})
            console.log(item)
            if(item){

            }else{
                res.redirect('/');
            }
        }else{
            res.redirect('/');  
        }
        next();
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    isLogin
}