'use strict';

const jwt = require('jsonwebtoken');
const User = require(__dirname + "/../../models/user");

module.exports = (req,res,next) => {

   
    if ( ! req.headers.authorization ) {
        throw new Error("You must authorize");
    }
    let token = req.headers.authorization.split('Bearer ')[1];
    if ( ! token ) {
        throw new Error("Invalid Authorization Provided");
    }

    let secret = process.env.SECRET || "changethis";
    let decodedToken = jwt.verify(token, secret);
    req.userId = decodedToken.id;
    User.findOne({_id: req.userId})
      .then(user => {
        if (!user) next({statusCode: 403, err: new Error('No user corresponds to jwt')});
        req.user = user;
        next();
      });
};