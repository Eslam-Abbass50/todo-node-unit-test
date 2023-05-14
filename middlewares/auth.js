var jwt = require("jsonwebtoken")



function auth(req, res, next) {
    if (req.headers.authorization) {
        var token = req.headers.authorization
        jwt.verify(token, process.env.SECRET, function (err, decoded) {
            if (err) {
                res.status(403).json({ message: err.message })
            } else {
                // console.log("decoded",decoded.data)
                req.user=decoded.data
                next()
            }
        })

    } else {
        res.status(403).json({ message: 'you are not authenticated to access this api' })
    }

}


module.exports={auth}