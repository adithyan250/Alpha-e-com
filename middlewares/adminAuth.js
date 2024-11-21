const isLogin = async(req, res, next) => {
    try {
        if(req.session.user_id){ 
              console.log("logined")
        }else{
            res.redirect('/admin/admin_login');
        }
        next();
    } catch (error) {
        console.log(error.message);
    }
}

const isLogout = async(req, res, next) => {
    try {
        if(req.session.user_id){
            res.redirect('/admin/admin_panel');
        }else{
            console.log("logout");
        }
        next();
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    isLogin,
    isLogout
}