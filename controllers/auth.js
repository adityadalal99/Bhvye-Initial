const bcrypt = require('bcryptjs');
const cryptol = require('crypto');
const jwt = require('jsonwebtoken');
const pgp = require('pg-promise')();
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

const client = {
  host: `${process.env.DB_HOST}`,
  port: DB_PORT,
  user: `${process.env.DB_USER}`,
  password: `${process.env.DB_PASS}`,
};

const db = pgp(client);

//Signing Up user and returning token
exports.createUser = asyncHandler(async (req, res, next) =>{
  try
  {
    try
    {
      await db.connect();
    }catch(err)
    {
      console.error('connection error', err.stack);
    }
    var {username, password} = req.body;
    if(password.length < 8)
    {
      res.status(400).json({message:"Please Make password greater than 8 chars"});
    }
    if(password.length > 20)
    {
      res.status(400).json({message:"Please Make password lesser than 20 chars"});
    }
    if(!username || !password)
    {
        return next(new ErrorResponse('Invalide USername and Password',400));
    }
    try{
      const data = await db.any('SELECT username FROM users WHERE username = $<username>',{
        username : username
      });
      if(data.length != 0)
      {
        return next(new ErrorResponse('Username exits',401));
      }
      else
      {
        //Hashing The password
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
        try{
            await db.none('INSERT INTO users (username,password) VALUES ($<username>,$<password>)',{
            username : username,
            password : password
          });
          sendTokenResponse(username,200,res);
        }
        catch(e)
        {
          console.log(e);
          return next(new ErrorResponse('Something went wrong',401));
        }
      }
    }
    catch(e)
    {
      console.log(e);
      return next(new ErrorResponse('Something went wrong',401));
    }
  }
  catch(e)
  {
    console.log(e);
    return next(new ErrorResponse('Something went wrong',401));
  }
});

//Signing the user and returning the token
exports.signin = asyncHandler(async (req,res,next) => {
  var {username,password} = req.body;
  try
    {
      await db.connect();
    }catch(err)
    {
      console.error('connection error', err.stack);
    }
  if(!username || !password)
  {
    return next(new ErrorResponse('PAssword Or Username Empty',401));
  }
  const check = await db.any('SELECT password FROM users WHERE username = $<username>',{
    username : username
  });
  if(check.length == 0)
  {
    return next(new ErrorResponse('No Match Found', 401));
  }
  const match = await bcrypt.compare(password,check[0].password);
  if(!match)
  {
    return next(new ErrorResponse('No Match Found', 401));
  }
  sendTokenResponse(username,200,res);
});

//Signing the token with server key and setting expire time
const getSignedJwtToken = (username) => {
  return jwt.sign({ username: username }, `${process.env.JWT_SECRET}`, {
    expiresIn: `${process.env.JWT_EXPIRE}`
  });
}

const sendTokenResponse = (username, statusCode, res) => {
  // Create token
  const token = getSignedJwtToken(username);

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };
  //Adding token to user cookie
  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  });
};