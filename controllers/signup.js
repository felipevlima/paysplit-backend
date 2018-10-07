/*******************************************
 *      Check Please
 *      Signup Router File
 ******************************************/
const models = require('../db/models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const auth = require('../auth.js');

 module.exports = function(app){

     /****************************************************
      *  SIGNUP ROUTES
      ***************************************************/
      var sessionChecker = (req, res, next) => {
        if (req.session.user && req.cookies.user_id) {
          res.redirect('/');
        } else {
          next();
        }
      }

     app.get('/signup', sessionChecker, function (req, res) {
        res.send("SIGNUP PAGE")
         //res.render('signup', {});
     });

     app.post('/signup', (req, res) => {
        // hash the password
        //console.log(req.body);
        bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
            //console.log("hash " + hash);
            var newUser = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
                password: hash
            };
            // const user = new User(req.body)
            models.User.create(newUser, {w:1}).then((savedUser)=>{
                //console.log(savedUser.dataValues.id)
                console.log("saved", savedUser.firstName)
                // test = auth.setUserIDCookie(savedUser, res);
                var token = jwt.sign({_id: newUser._id }, process.env.SECRETKEY, { expiresIn: "60 days" });
                console.log(token)
                  res.cookie('nToken', token, { maxAge: 900000, httpOnly: true })
                  res.status(200).json({ message: "Created user successfully.", userRecoveryToken: `${savedUser.userRecoveryToken}`, token})
            }).catch((err)=>{
                res.json(err)
                console.log("User Creation error:", err.message);
            })
            })
        });
    });

    /****************************************************
     *  LOGIN ROUTES
     ***************************************************/
    app.get('/login', sessionChecker,  function(req, res) {
        res.send("LOGIN")
         //res.render('login');
     });

    // Compares if password given is correct in the database
    app.post('/login', (req, res) => {
        console.log("email", req.body.email)
         models.User.findOne({where:{email: req.body.email}}).then(function(data) {
                    // console.log("Returned Data", data)
                    //  console.log("db email", data.email)
                    //  console.log("DB User Password", data.password)
                   //console.log("client email", req.body.email)
                  //console.log("client submitted passwd", req.body.password)
           bcrypt.compare(req.body.password, data.password, function(err, result) {
                if(err) {
                     res.status(400)
                     console.log(err)
                }
                if(result){
                    //Set authentication cookie
                    console.log("resulting result", result)
                    //auth.setUserIDCookie(data, res);
                    var token = jwt.sign({ _id: models.User._id }, process.env.SECRETKEY,{ expiresIn: "60 days" });
                    res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
                    //req.session.user = user.dataValues
                    console.log(token)
                    return res.status(200).send({ message: 'user logged in successfully', token, userRecoveryToken: `${data.userRecoveryToken}` });
                }else{
                    console.log('wrong username or password')
                }
            });
    });
});

/****************************************************
 *  LOGOUT ROUTE
 ***************************************************/
 app.get('/logout', function(req, res) {
   res.clearCookie('jwtToken');
   res.redirect('/')
 });

}
