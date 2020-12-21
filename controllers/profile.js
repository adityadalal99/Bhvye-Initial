const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const {getUserProfile} = require('../promises/prm') 


//Get User Profile Object
exports.getUserProfile = asyncHandler(async (req,res,next) => {
    try
    {
        const userObj = await getUserProfile(req.params.username);
        userObj['message'] = "User Profile imported Succesfully";
        res.status(200).json(userObj);
    }
    catch(err)
    {
        return next(new ErrorResponse('Could Not Fetch user',401));
    } 
});