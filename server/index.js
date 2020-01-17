var express = require('express');
var bodyParser = require('body-parser'); 
const cors = require('cors'); 
const Mongodb = require('mongodb').MongoClient;
const base64 = require('base64url');//JWT
const admin = require('firebase-admin')
var server = express();

 //Configuration firebase
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: process.env.FireBaseLink
  });
server.use(bodyParser.urlencoded({    //obligatoire 
    limit: process.env.limit, extended: true
}));
server.use(express.json());
server.use(bodyParser.json({ limit: process.env.limit }));
server.use(cors());
var database;

Mongodb.connect(process.env.LINK_DB, { useNewUrlParser: true,useUnifiedTopology: true }, (err, client) => {
    if (err) {
        throw err;
    } else {
        database = client.db(process.env.database);
    }
});


function checkAuth(req, res, next) {
    if (req.headers.authtoken) {
const JWT_BASE64_URL = req.headers.authtoken
const jwtParts = JWT_BASE64_URL.split('.');
const payloadInBase64UrlFormat = jwtParts[1];
const decodedPayload = base64.decode(payloadInBase64UrlFormat);
 Details(decodedPayload);
res.status(202).send(process.env.succes);
    } else {
       res.status(403).send(process.envfailed)
    }
  }
server.get("/",checkAuth);
server.get(process.env.apiClose,checkSign);
server.post(process.env.apiData, (req, rep) => {
     if(req.body){
        var finder={
            parkPlus:req.body.parkPlus,
            achatPossible:req.body.achatPossible,
            parkActivation:req.body.parkActivation,
            etatStation:req.body.etatStation,
            loc: { 
                $near : {
                     $geometry: {
                          type: process.env.dataType,
                            coordinates: [ req.body.position.lat,req.body.position.lng ] }
                            , $maxDistance: req.body.distance
                        }
                 }
        } 
      
         database.collection(process.env.nameCollection).find(finder).toArray(function (err, resultat) {
            if (err) {
                throw err;
            } else {
                rep.send(resultat);
          }});
    }
   
   
});
function checkSign(){
    console.log(process.env.nouveauClient,new Date)
}
function Details(data) { 
    const obj = JSON.parse(data); 
    console.log(process.env.message+ obj.email + process.env.nextMessage , TimeStampToString(obj.exp) )     
}

 




function TimeStampToString(date){
    let dateServer = new Date(date*1000);
    return (dateServer.getHours())+" "+dateServer.getMinutes()+" "+dateServer.getSeconds();
}


 async function distance(lat1, lon1, lat2, lon2){
    
    if ((lat1 === lat2) && (lon1 === lon2)) {
      return 0;
    }
    else {
      var radlat1 = Math.PI * lat1/180;
      var radlat2 = Math.PI * lat2/180;
      var theta = lon1-lon2;
      var radtheta = Math.PI * theta/180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180/Math.PI;
      dist = dist * 60 * 1.1515;
       dist = (dist * 1.609344)*1000 
      return dist;
    }

  }

server.listen(2020,(err,res)=>{
    if(err){
        console.log(err)
    }else{
        console.log(process.env.lance)
    }
});