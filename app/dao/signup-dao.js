const AWS = require('aws-sdk');
AWS.config.setPromisesDependency(require('bluebird'));
const uniqid = require('uniqid');
const table = 'users';
const documentClient = new AWS.DynamoDB.DocumentClient();

const retrieveUserByUsername = async (username) => {
    
    const params = {
        TableName: table,
        Key: {
            username,
        }
    };
    const data = await documentClient.get(params).promise()
    //console.log(data)
    return data;

}

const retrieveUserByEmail = async (email) => {
    
    const params = {
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
    const data = await documentClient.query(params).promise()
    return data;

}

const registerUser = async (user) => {
    
    const params = {
        TableName: table,
        Item: {
            id: "BID" + uniqid(),
            username: user.username,
            email: user.email,
            password: user.password,       
            roles: ["user"],
            dateCreated: new Date().getDate().toString(),
        }
    };
    
    await documentClient.put(params).promise()
    .then(res => user);
};

module.exports = { registerUser, retrieveUserByEmail, retrieveUserByUsername}
