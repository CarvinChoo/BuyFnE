const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

// Region Specification to lower latency using .region()
//https://firebase.google.com/docs/functions/locations
// exports.myStorageFunction = functions
//     .region('europe-west1')
//     .storage
//     .object()
//     .onFinalize((object) => {
//       // ...
//     });


// Possible Context properties
// **The data parameter represents the data that triggered the function
// **The context parameter provides information about the function's execution
// exports.dbWrite = functions.database.ref('/path/with/{id}').onWrite((data, context) => {
//     const authVar = context.auth; // Auth information for the user.
//     const authType = context.authType; // Permissions level for the user.
//     const pathId = context.params.id; // The ID in the Path.
//     const eventId = context.eventId; // A unique event ID.
//     const timestamp = context.timestamp; // The timestamp at which the event happened.
//     const eventType = context.eventType; // The type of the event that triggered this function.
//     const resource = context.resource; // The resource which triggered the event.
//     // ...
//   });

// Accessing previous and current data during a change in data using before and after fields
// exports.dbWrite = functions.firestore.document('/doc/path').onWrite((change, context) => {
//     const beforeData = change.before.data(); // data before the write
//     const afterData = change.after.data(); // data after the write
//   });
  

// Accessing Data that was just created when triggered by onCreate or deleted by onDelete
// exports.dbCreate = functions.firestore.document('/doc/path').onCreate((snap, context) => {
//     const createdData = snap.data(); // data that was created
//   });

// exports.dbDelete = functions.firestore.document('/doc/path').onDelete((snap, context) => {
//     const deletedData = snap.data(); // data that was deleted
//   });
  
//Firestore Timestamp 
//** are Firestore Timestamp objects
// ** This applies to snapshot.createTime, snapshot.updateTime, snapshot.readTime, and any timestamp values in snapshot.data()
// ** createTime is when it was created, updateTime is when it was last updated, readTime is when it was last accessed
// exports.dbCreate = functions.firestore.document('/doc/path').onCreate((snap, context) => {
//     //seconds of UTC time since Unix epoch
//     console.log(snap.createTime.seconds);
  
//     //fractions of a second at nanosecond resolution, 0 to 999,999,999
//     console.log(snap.createTime.nanoseconds);
//   });

// Example of trigger function that updates database
// exports.makeUppercase = functions.firestore.document('/users/{documentId}')
// .onCreate((snap, context) => {
//     // Grab the current value of what was written to Firestore.
//     const original = snap.data().displayName;

//     // Access the parameter `{documentId}` with `context.params`
//     functions.logger.log('Uppercasing', context.params.documentId, original);
    
//     const uppercase = original.toUpperCase();
    
//     // You must return a Promise when performing asynchronous tasks inside a Functions such as
//     // writing to Firestore.
//     // Setting an 'uppercase' field in Firestore document returns a Promise.
//     return snap.ref.set({uppercase}, {merge: true});
// });

// //Example of Scheduled update to database
// exports.scheduledFunction = functions.pubsub.schedule('every 5 minutes').onRun((context) => {
//    let query =  db.collection("users").where('type','==', 2)
//    query.get().then((sellers)=> sellers.forEach((seller)=>{
//        seller.ref.update({status:"seller"})
//    }))


//   });

exports.createStripeCheckout = functions.https.onCall(async (data, context)=> {
    //Stripe init
    const stripe = require("stripe")(functions.config().stripe.secret_key);
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
            {
                quantity:1,
                price_data:{
                    currency:"usd",
                    unit_amount: (100)*100,// 10000=100 USD
                    product_data:{
                        name:"New camera"
                    }
                }
            }
        ]
        
    });
    return{
        id: session.id
    };
});

exports.addMessage = functions.https.onCall((data, context) => {
    // ...
  });
  