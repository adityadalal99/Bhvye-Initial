const pgp = require('pg-promise')();
const { as } = require('pg-promise');

const client = {
  host: `${process.env.DB_HOST}`,
  port: DB_PORT,
  user: `${process.env.DB_USER}`,
  password: `${process.env.DB_PASS}`,
};

const db2 = pgp(client);

//Method to check if userexists
exports.getUsername = (username) => {
    return new Promise(async (resolve,reject) => {
            try{
                let val = await db2.one('SELECT * FROM users WHERE username = $<username>',{
                username : username
                });
                console.log(val);
                resolve(val);
            }
            catch(err){
                reject(err);
            }
    });
}  

//Method to add skills to the particular User
exports.addUserSkills = (username, skillsA) => {
    return new Promise( async (resolve,reject ) => {
        try{
            for(let skill in skillsA)
            {
                await db2.none('INSERT INTO userskills VALUES($<username>,$<skill>)',{
                    username : username,
                    skill : skillsA[skill]
                });
                await db2.none('INSERT INTO skills VALUES($<skill>)',{
                    skill : skillsA[skill]
                });
            }
            resolve();
        }
        catch(err){
            reject(err);
        }
    })
}

//Get User Profile Object
exports.getUserProfile = (username) => {
    return new Promise(async (resolve,reject) => {
        try
        {
            const data = await db2.any('SELECT skillname FROM userskills WHERE username = $<username>',{
                username : username
            })
            if(data)
            {
                var userObject = {};
                var skills = []; 
                for(var skill in data)
                {
                    skills.push(data[skill].skillname);
                }
                userObject['skills'] = skills;
                userObject['username'] = username;
            }
            resolve(userObject);
        }
        catch(err)
        {
            reject(err);
        }
    })
}