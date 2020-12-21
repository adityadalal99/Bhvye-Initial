const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const {addUserSkills} = require('../promises/prm');

//Add Skills of the user
exports.getBasicInfo = asyncHandler(async (req,res,next)=>{
    var skillsA = req.body.skills;
    if(skillsA < 3)
    {
        return next(new ErrorResponse('Add More Than 3 skills',401));
    }
    if(skillsA > 8)
    {
        return next(new ErrorResponse('Add Less Than 8 skills',401));
    }
    try{
         await addUserSkills(req.user.username, skillsA);
    }
    catch(err)
    {
        return next(new ErrorResponse('Skills Could not be added', 401));
    }
    res.status(200).json({
        skills: skillsA,
        sucess : true,
        message : "skills added succesfully"
    });
});