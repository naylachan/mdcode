"use strict";

const mongoose = require('mongoose');

const connectDB = async () => {
  try {  
    mongoose.set('strictQuery', false); 
    const conn = await mongoose.connect("mongodb+srv://mdcodewebsite:mdcodewebsite@atlascluster.rxwo2px.mongodb.net/?retryWrites=true&w=majority", { 
     useNewUrlParser: true,
      useUnifiedTopology: true    
    });    
    console.log("[ INFO ] Terhubung ke database MongoDb");
  } catch (err) {
    console.log(`[ ERROR ] Db: ${err.message}`);
    process.exit(1);
  }
};
connectDB()

const userDb = require('./user.js'); 
const kuisDb = require('./kuis.js'); 

function error(a){
  console.log(a)
  return {
    status: "false",
    message: a
  }
}

async function addUser(user = "0s.whatsapp.net"){
  var doc = await userDb.findOne({ user: user });
  if (doc == null){     
    new userDb({
      user: user,    
      gold: 0, 
      star: 0,  
    }).save((error) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`[ DATABASE ] Menambahkan user ${user.split("@")[0]} ke database`);        
      }  
    })
  }
}


exports.cekUser = async (user) => { // md.cekUser(user)
  if (!user){
    return userDb.find({});
  } else {
    var doc = await userDb.findOne({ user: user });
    if (doc == null){
      addUser(user)
      doc = {
        user: user,
        gold: 0
      }
    }  
    return doc
  }
};

exports.updateUser = async (db, user, query) => { //updateUser(db, user, query)
  if (!db || !user || !query) return error("Parameter kosong");  
  var doc = await userDb.findOne({ user: user });
  
  if (doc !== null) {  
    if (db == "gold"){
      doc.gold = query;
      await doc.save();    
    }
    if (db == "star"){
      doc.star = query;
      await doc.save();    
    }
  }
}



exports.cekKuis = async (group) => { // md.cekKuis(idgrub)
  if (!group){
    return kuisDb.find({});
  } else {
    var doc = await kuisDb.findOne({ group: group });
    if (doc == null){
      doc = "false"
    }  
    return doc
  }
};

exports.cekKuisId = async (group, id) => { // md.cekKuisId(idgrub, id)
  if (!group){
    return kuisDb.find({});
  } else {
    var doc = await kuisDb.findOne({ group: group });
    if (doc == null){      
      doc = "false"
    }  
    if (doc.id == id){
      return doc
    }
    return "false"
  }
};
exports.addKuis = async (id, group, user, kuis, index, jawab) => { // md.addKuis(id, group, user, kuis, index, jawab)  
  if (!id && !group || !user || !kuis || !index) return error("Prameter kosong")   
  var doc = await kuisDb.findOne({ group: group });
  if (doc == null){ 
    new kuisDb({
      id: id,
      group: group,   
      start: user, 
      status: "false",
      join: [user],
      kuis: kuis,
      index: index,
      jawab: jawab
    }).save((error) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`[ DATABASE ] Menambahkan room kuis grub id ${group.split("@")[0]} di database`);
        return {
          status: "true"
        }
      }  
    })
  }
}

exports.removeKuis = async (group) => { // md.removeKuis(idgrub)
  if (!group) return error("Parameter kosong");    
  
  var doc = await kuisDb.deleteOne({ group: group });
  if (doc.deletedCount > 0) {
    console.log(`[ DATABASE ] Menghapus room kuis grup id ${group.split("@")[0]} dari database`);
    return {
      status: "true"
    }
  } else {
    return error(`[ DATABASE ] Data dengan grup id ${group.split("@")[0]} tidak ditemukan`);
  }  
}

exports.joinKuis = async (group, user) => { // md.joinKuis(idgrub, user)
  const doc1 = await kuisDb.findOne({ group: group });

  if (doc1 !== null) {    
    var doc = await kuisDb.findOneAndUpdate({ group: group }, { $push: { join: user } }, { new: true });
    if (doc) {
      console.log(`[ DATABASE ] ${user.split("@")[0]} bergabung ke kuis di grub ${group.split("@")[0]}`);
      return {
        status: true
      }
    } else {
      error(`Data dengan group ${group} tidak ditemukan.`);
    }
  }
}
exports.updateKuisStatus = async (group, newStatus) => { //updateKuisStatus(grub, data)
  if (!group || !newStatus) return error("Parameter kosong");

  try {
    const result = await kuisDb.findOneAndUpdate({ group: group }, { $set: { status: newStatus } }, { new: true });
    if (result) {
      console.log(`[ DATABASE ] Mengganti status room kuis grup id ${group.split("@")[0]} di database`);
      return { status: "true" };
    } else {
      error(`[ DATABASE ] Tidak ada room kuis dengan grup id ${group.split("@")[0]}`);      
    }
  } catch (error) {
    console.error(error);    
  }
}

exports.updateKuisId = async (group, newId) => { //updateKuisId(grub, data)
  if (!group || !newId) return error("Parameter kosong");

  try {
    const result = await kuisDb.findOneAndUpdate({ group: group }, { $set: { id: newId } }, { new: true });
    if (result) {
      console.log(`[ DATABASE ] Mengganti id room kuis grup id ${group.split("@")[0]} di database`);
      return { status: "true" };
    } else {
      error(`[ DATABASE ] Tidak ada room kuis dengan grup id ${group.split("@")[0]}`);      
    }
  } catch (error) {
    console.error(error);    
  }
}
exports.updateKuisJawab = async (group, newJawab) => { //updateKuisJawab(grub, data)
  if (!group || !newJawab) return error("Parameter kosong");

  try {
    const result = await kuisDb.findOneAndUpdate({ group: group }, { $set: { jawab: newJawab } }, { new: true });
    if (result) {
      console.log(`[ DATABASE ] Mengganti jawab room kuis grup jawab ${group.split("@")[0]} di database`);
      return { status: "true" };
    } else {
      error(`[ DATABASE ] Tidak ada room kuis dengan grup jawab ${group.split("@")[0]}`);      
    }
  } catch (error) {
    console.error(error);    
  }
}


