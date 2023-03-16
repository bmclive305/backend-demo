const AWS = require('aws-sdk');
AWS.config.update({
    region: "us-east-1"
  });
const uniqid = require('uniqid');
const userDAO = new AWS.DynamoDB.DocumentClient()
let params;
let data;
const table = 'users';
const PRE_FIX = 'u'



// CREATE
const registerUser = async (user) => {
    
    params = {
        TableName: table,
        Item: {
            id: PRE_FIX + uniqid(),
            username: user.username,
            email: user.email,
            password: user.password,       
            roles: ["user"],
            dateCreated: new Date().getDate().toString(),
        }
    };
    
    userDAO.put(params, (err) => {
        if (err) {
            console.error(err);
            throw new Error("Database connection error");
        } else {
            return "registered user";
        }
    });
};

// READ
const retrieveUserByUsername = async (username) => {
    
    params = {
        TableName: table,
        Key: {
            username,
        }
    };
    data = await userDAO.get(params).promise()
    //console.log(data)
    return data;

}


const retrieveUserById = async (id) => {
    
    params = {
        TableName: table,
        IndexName: 'id-index',
        Limit: 1,      
        KeyConditionExpression: "#id = :id",
        ExpressionAttributeNames:{
            "#id": "id"
        },
        ExpressionAttributeValues: {
            ":id": id
        }
    };
    data = await userDAO.query(params).promise()
    return data;

}

const retrieveUserByEmail = async (email) => {
    
    params = {
        TableName: table,
        IndexName: 'email-index',
        Limit: 1,      
        KeyConditionExpression: "#email = :email",
        ExpressionAttributeNames:{
            "#email": "email"
        },
        ExpressionAttributeValues: {
            ":email":email
        }
    };
    data = await userDAO.query(params).promise()
    console.log(data)
    return data;

}


// UPDATE

function editUserInformation(username, newUsername, newEmail) {
    return userDAO.update({
        TableName: table,
        Key: {
            username
        },
        UpdateExpression: 'set#a=:value1,#b=:value2',
        ExpressionAttributeNames: {
            "#a": 'username',
            "#b": 'email',
        },
        ExpressionAttributeValues: {
            ":value1": newUsername,
            ":value2": newEmail,
        },

        ReturnValues: "UPDATED_NEW"
    }).promise();
}

// DELETE

module.exports = { registerUser, retrieveUserByEmail, retrieveUserById, retrieveUserByUsername, editUserInformation}




