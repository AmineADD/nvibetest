'use strict';
const fs = require('fs');
const Mongodb = require('mongodb').MongoClient;
let jsonData = require('./csvjson.json');


var arr = jsonData.map((element,index) => {
    element._id=index;
    element.id=index;
    element.loc={
        type:"Point",
        coordinates:[element["Description station"].gps.latitude,element["Description station"].gps.longitude]
    } 
    return element;
});
/*
var jsonContent = JSON.stringify(arr);
fs.writeFile('output.json', jsonContent, 'utf8',()=>{
    console.log("finish")
});
*/
var database;
Mongodb.connect('mongodb://u0psy3dsf8dvtuazrk3a:ZVMMO2qdm9AXt5s3frUI@bcve0igsmss2d1t-mongodb.services.clever-cloud.com:27017/bcve0igsmss2d1t', { useNewUrlParser: true,useUnifiedTopology: true }, (err, client) => {
    if (err) {
        throw err;
    } else {
        console.log("connected")
        database = client.db("dbNvibe");
       /* database.collection("stations").insertMany(arr).then(function(err,res) {
            if(err){
                console.log(err)
            }
            console.log("Dazo")
        });
*/

database.collection("stations").find({}).toArray(function (err, resultat) {
    if (err) {
        throw err;
    } else {
       console.log(resultat.length);
  }});







    }
});

 
 