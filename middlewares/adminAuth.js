const isLogin = async(req, res, next) => {
    try {
        if(req.session.admin){ 
              console.log("logined", req.session)
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
        if(req.session.admin){
           res.redirect('/admin/admin_panel');
        }else{
            console.log("logout", req.session);
        }
        next();
    } catch (error) {
        console.log(error.message);
    }
}

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()||req.session.admin) {
      return next()
    }
  
    res.redirect('/admin/admin_login')
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }

  function authenticated (req, res, next) {
    next()
  }
  
module.exports = {
    authenticated,
    checkNotAuthenticated,
    checkAuthenticated,
    isLogin,
    isLogout
}