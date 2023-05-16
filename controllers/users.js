var usersModel = require('../models/users')
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

function saveUser(user) {
   return usersModel.create(user)
}

function getAllUsers() {
   return usersModel.find()

}


async function login(req, res) {
   var user = req.body
   var savedUser = await usersModel.findOne({ name: user.name })
   if (savedUser) {
      var valid = bcrypt.compareSync(user.password, savedUser.password)
      if (valid) {
       var token=  jwt.sign({
            data: {
               userName:savedUser.name,
               userId:savedUser._id
            }
          }, process.env.SECRET, { expiresIn: '2h' }); 

          res.status(200).json(token)

      } else {
         res.status(400).json({ message: "Invalid password" })
      }


   } else {
      res.status(400).json({ message: "Invalid userName" })
   }

}

module.exports = { saveUser, getAllUsers, login }