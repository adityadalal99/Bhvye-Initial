const asyncHandler = require('../middleware/async');


//Get User Basic Info
exports.getBasicInfo = asyncHandler((req,res,next)=>{
    res.status(200).json({
        success : true,
        username : req.user
    })
})