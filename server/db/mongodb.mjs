

import { MongoClient } from 'mongodb';







 let client = '';
 let users = '';
 let results = '';  

 export const initMongodb = async () => {
   
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URL);
    await client.connect();
     users = client.db().collection('users');
     users.createIndex({email: 1}, {unique: true});
     results = client.db().collection('results');
  }
  return client;
 
}

export const saveUsers = async (userPayload) => {

   const result = await users.insertOne(userPayload);
   return result;
   


}

export const findUserByEmail = async (email) => {
  const result = await users.findOne({
    email
  });
   return result;

}

export const saveResults = async (resultPayload) => {

  const result = await results.insertOne(resultPayload);
  return result;
  


}


