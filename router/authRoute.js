//POST localhost:8888/ecomm/api/v1/auth/signup
const authController = require("../controllers/authController");
const auth_mw = require("../middlewares/auth_mw");


module.exports  = (app) => {
    app.post("/ecomm/api/v1/auth/signup",[auth_mw.verifySignUpBody], authController.signup);

    app.post("/ecomm/api/v1/auth/signin",[auth_mw.verifySignInBody], authController.signin)
}
