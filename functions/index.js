const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require('cors')({origin: true});;   


const serviceAccount = require("./credentials.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://tudestino-api.firebaseio.com",
  });

const db = admin.firestore(); 

//ADD PLACE
exports.addPlace = functions.https.onRequest( (req, res) => {

  cors(req, res, () => {
    const {name, description, latitude, lenghtPlace, typePlace, availability, referencePoints } = req.body;
    // ${ uid }
    // const extractor = request.params[0]
    // const id= extractor.split("/")[1]

    (async () => {
      try {
         await db.collection(`uid/destiny/places`)
         .doc()
         .create({
           name: name,
           description: description,
           latitude: latitude,
           lenghtPlace: lenghtPlace,
           typePlace: typePlace,
           availability: availability,
           referencePoints: referencePoints
         });
  
         function addReferencePoints(array) {
            array.map((row) => {
                db.collection(`uid/destiny/places/referencepoints`)
                .doc()
                .create({
                  nameRP: row.nameRP,
                  latitudeRP: row.latitudeRP,
                  lenghtRP: row.lenghtRP,
                });
            });
          }

    addReferencePoints(referencePoints)

        return res.status(200).send({ ok: true, msg: "Peticion exitosa" });
      } catch (error) {
        console.log(error);
        res.status(500).send({ ok: false, msg:"Error al registrar el lugar" });
      }
    })();

  })

});




//GET PLACE
exports.getPlaces = functions.https.onRequest( (req, res) => {
  cors(req, res, () => {
    (async () => {
        try {
          let query = db.collection("uid/destiny/places");
          const querySnapshot = await query.get();
          let docs = querySnapshot.docs;
  
          const respuestadb = docs.map((doc) =>
          (
                
              {id: doc.id,
                name: doc.data().name,
                description: doc.data().description,
                latitude: doc.data().latitude,
                lenghtPlace: doc.data().lenghtPlace,
                availability: doc.data().availability,
                typePlace: doc.data().typePlace,
                referencePoints: doc.data().referencePoints

              }
           ));
          return res.status(200).json(respuestadb);          
        
        } catch (error) {
          console.log(error);
          res.status(500).send({ ok: false, msg:"Error al obtener los lugares" });
        }
      })();
    })
  });

//GET PLACE WITH ID

  exports.getPlaceWithID = functions.https.onRequest( (req, res) => {  
    cors(req, res, () => {
    (async () => {
      // Extrae el id del path
      const extractor = req.params[0]
      // Le quita el / del inicio
      const id= extractor.split("/")[1]
      console.log(id);
        try {
          const places =  await db.collection("uid/destiny/places").doc(id).get()
  
          const respuestadb = {
            id: places.id,
            name: places.data().name,
            description: places.data().description,
            latitude: places.data().latitude,
            lenghtPlace: places.data().lenghtPlace,
            availability: places.data().availability,
            typePlace: places.data().typePlace,
            referencePoints: places.data().referencePoints
          }
        
  
          return res.status(200).json(respuestadb);          
        
        } catch (error) {
          console.log(error);
          res.status(500).send({ ok: false, msg:"Error al obtener el lugar" });
        }
      })();
    })
  });

//GET PLACE WITH NAME
exports.getPlaceWithName = functions.https.onRequest( (req, res) => {
  cors(req, res, () => {
    (async () => {
      const extractor = req.params[0]
      const name= extractor.split("/")[1]
        try {
          db.collection("uid/destiny/places").where("name", "==", name)
          .get()
          .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              const respuesta= doc.data();
              return res.status(200).json(respuesta); 
          });
      })
          
        } catch (error) {
          console.log(error);
          res.status(500).send({ ok: false, msg:"Error al obtener el lugar" });
        }
      })();
    })
  });


//GET PLACE WITH TYPE
exports.getPlaceWithType = functions.https.onRequest( (req, res) => {
  cors(req, res, () => {
    (async () => {
      const extractor = req.params[0]
      const typePlace= extractor.split("/")[1]
  
        try {
          const getPlaces =[]
          db.collection("uid/destiny/places").where("typePlace", "==", typePlace)
          .get()
          .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              getPlaces.push({
                ...doc.data()
              })
               
          });
          return res.status(200).json(getPlaces);
      })
        
        } catch (error) {
          console.log(error);
          response.status(500).send({ ok: false, msg:"Error al obtener el lugar" });
        }
      })();
    })
  });
  

//UPDATE PLACE
exports.updatePlace = functions.https.onRequest( (req, res) => {
  cors(req, res, () => {
    const extractor = req.params[0]
    const id= extractor.split("/")[1]
    const {name, description, latitude, lenghtPlace, typePlace, availability, referencePoints } = req.body;
    (async () => {
        try {
          const document = db.collection("uid/destiny/places").doc(id);
          await document.update({
            name: name,
            description: description,
            latitude: latitude,
            lenghtPlace: lenghtPlace,
            typePlace: typePlace,
            availability: availability,
            referencePoints: referencePoints

          });
        
          return res.status(200).send({ ok: true, msg:"Actualización completa" });
        } catch (error) {
          console.log(error);
          res.status(500).send({ ok: false, msg:"Error para actualizar el lugar" });
        }
      })();
    })
  });


//  DELETE PLACE
exports.deletePlace = functions.https.onRequest( (req, res) => {
  cors(req, res, () => {
    const extractor = req.params[0]
    const id= extractor.split("/")[1]
    console.log(id);
  
    (async () => {
        try {
          const doc = db.collection("uid/destiny/places").doc(id);
          await doc.delete();
          return res.status(200).send({ ok: true, msg: "El lugar ha sido eliminado" });
        } catch (error) {
          console.log(error);
          res.status(500).send({ ok: false, msg:"Error al eliminar el lugar" });
        }
      })();
    })
  });
  

