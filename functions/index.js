const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const stripe = require("stripe")(functions.config().stripe.secret_key);
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

// exports.createStripeCheckout = functions.https.onCall(async (data, context)=> {
//     //Stripe init
//     const stripe = require("stripe")(functions.config().stripe.secret_key);
//     const session = await stripe.checkout.sessions.create({
//         payment_method_types: ["card"],
//         mode: "payment",
//         line_items: [
//             {
//                 quantity:1,
//                 price_data:{
//                     currency:"usd",
//                     unit_amount: (100)*100,// 10000=100 USD
//                     product_data:{
//                         name:"New camera"
//                     }
//                 }
//             }
//         ]

//     });
//     return{
//         id: session.id
//     };
// });

exports.scheduledGroupBuyCheck = functions
  .region("asia-southeast2")
  .pubsub.schedule("* * * * *")
  .timeZone("Asia/Singapore")
  .onRun(async (context) => {
    return db
      .collection("all_listings")
      .where("groupbuyStatus", "==", "Ongoing")
      .get()
      .then((groupbuys) => {
        if (!groupbuys.empty) {
          console.log("Not Empty");
          groupbuys.forEach((groupbuy) => {
            const timeleft =
              groupbuy.data().timeEnd.toDate() -
              admin.firestore.Timestamp.now().toDate();
            if (timeleft <= 0) {
              console.log("Updating groupbuy : ");

              if (
                groupbuy.data().currentOrderCount <
                groupbuy.data().minimumOrderCount
              )
                groupbuy.ref
                  .update({
                    groupbuyStatus: "Unsuccessful",
                  })
                  .then(() => {
                    console.log("Successfully updated Unsuccessful status");
                  })
                  .catch((error) => {
                    console.log(
                      "Error when setting Unsuccessful status: ",
                      error.message
                    );
                  });
              else {
                groupbuy.ref
                  .update({
                    groupbuyStatus: "Awaiting seller confirmation",
                  })
                  .then(() => {
                    console.log(
                      "Successfully updated Awaiting seller confirmation status"
                    );
                  })
                  .catch((error) => {
                    console.log(
                      "Error when setting Awaiting seller confirmation status: ",
                      error.message
                    );
                  });
              }
            } else {
              console.log("Not updating groupbuy");
            }
          });
        } else {
          console.log("No ongoing group buy");
        }
      });
  });

// // Step 1 - creating a Stripe account at the backend for all users
exports.createStripeAccount = functions.https.onRequest((request, response) => {
  return stripe.accounts
    .create({
      country: "SG",
      default_currency: "sgd",
      type: "custom",
      email: request.body.email,
      tos_acceptance: {
        date: Math.floor(Date.now() / 1000),
        ip: request.socket.remoteAddress,
        service_agreement: "full",
      },
      business_type: "individual",
      individual: {
        first_name: request.body.first_name,
        last_name: request.body.last_name,
        dob: {
          day: request.body.dob_day,
          month: request.body.dob_month,
          year: request.body.dob_year,
        },
        email: request.body.email,
      },
      capabilities: {
        card_payments: {
          requested: true,
        },
        transfers: {
          requested: true,
        },
      },
    })
    .then((account) => {
      console.log("Successfully created stripe account");
      response.send(account);
    })
    .catch((error) => {
      cconsole.log("Error when creating external account : ", error);
      response.status(404).send(error.message);
    });
});

// User that opt to become seller will input their bank details and payout is allowed on their account
exports.createBankAccount = functions.https.onRequest((request, response) => {
  return stripe.accounts
    .update(
      request.body.stripe_id, // seller's stripe acct number
      {
        individual: {
          address: {
            country: "SG",
            line1: request.body.store_address, // Address
            line2: request.body.store_unitno, // Unit number
            postal_code: request.body.postal_code, //Postal code
          },
        },
      }
    )
    .then(() => {
      console.log("Successfully Updated Stripe account");
      stripe.accounts
        .createExternalAccount(
          request.body.stripe_id, //seller's stripe acct number
          {
            external_account: {
              object: "bank_account",
              country: "SG",
              currency: "sgd",
              account_holder_name: request.body.account_holder_name,
              account_holder_type: "individual",
              account_number: request.body.bank_account, //"000123456"
              routing_number: "1100-000", // request.body.routing_number
            },
          }
        )
        .then((account) => {
          console.log("Successfully created external account");
          response.send(account);
        })
        .catch((error) => {
          console.log("Error when creating external account : ", error);
          response.send(error);
        });
    })
    .catch((error) => {
      console.log("Error when updating account : ", error);
      response.send(error);
    });
});

exports.retreiveBankAccount = functions.https.onRequest((request, response) => {
  return stripe.accounts
    .listExternalAccounts(request.body.stripe_id, {
      object: "bank_account",
      limit: 1,
    })
    .then((bank) => {
      console.log("Successfully retrieve bank account");
      response.send(bank);
    })
    .catch((error) => {
      console.log("Error when retrieving bank account : ", error);
      response.send(error);
    });
});

exports.createCustomer = functions.https.onRequest((request, response) => {
  return stripe.customers
    .create({
      email: request.body.email,
      name: request.body.name,
    })
    .then((customer) => {
      console.log("Successfully created customer");
      response.send(customer);
    })
    .catch((error) => {
      console.log("Error when creating customer : ", error);
      response.send(error);
    });
});

exports.addCardToSource = functions.https.onRequest((request, response) => {
  return stripe.customers
    .createSource(request.body.cust_id, { source: request.body.cardToken })
    .then((source) => {
      console.log("Successfully created source");
      response.send(source);
    })
    .catch((error) => {
      console.log("Error when creating source : ", error);
      response.send(error);
    });
});

exports.listCardSources = functions.https.onRequest((request, response) => {
  return stripe.customers
    .listSources(request.body.cust_id, { object: "card" })
    .then((sources) => {
      console.log("Successfully retrieved sources");
      response.send(sources);
    })
    .catch((error) => {
      console.log("Error when retrieving sources : ", error);
      response.send(error);
    });
});

exports.deleteCardSource = functions.https.onRequest((request, response) => {
  return stripe.customers
    .deleteSource(request.body.cust_id, request.body.card_id)
    .then((deleted) => {
      console.log("Successfully deleted source");
      response.send(deleted);
    })
    .catch((error) => {
      console.log("Error when deleting sources : ", error);
      response.send(error);
    });
});

exports.retrieveCustomer = functions.https.onRequest((request, response) => {
  return stripe.customers
    .retrieve(request.body.cust_id)
    .then((customer) => {
      console.log("Successfully retrieved customer");
      response.send(customer);
    })
    .catch((error) => {
      console.log("Error when retrieving customer : ", error);
      response.send(error);
    });
});

exports.setDefaultSource = functions.https.onRequest((request, response) => {
  return stripe.customers
    .update(request.body.cust_id, { default_source: request.body.card_id })
    .then((customer) => {
      console.log("Successfully updated customer default source");
      response.send(customer);
    })
    .catch((error) => {
      console.log("Error when updating customer default source: ", error);
      response.send(error);
    });
});

exports.completePaymentWithStripeUsingBypass = functions.https.onRequest(
  (request, response) => {
    return stripe.charges
      .create({
        amount: request.body.amount,
        currency: request.body.currency,
        customer: request.body.customer,
        source: "tok_bypassPending",
        receipt_email: request.body.receipt_email,
        description: request.body.description,
        shipping: {
          address: {
            line1: request.body.address.address,
            line2: request.body.address.unitno,
            postal_code: request.body.address.postal_code,
          },
          name: request.body.name,
        },
      })
      .then((charge) => {
        console.log("Successfully charged customer using bypass");
        response.send(charge);
      })
      .catch((error) => {
        console.log("Error when chargin customer using bypass: ", error);
        response.send(error);
      });
  }
);

exports.completePaymentWithStripe = functions.https.onRequest(
  (request, response) => {
    return stripe.charges
      .create({
        amount: request.body.amount,
        currency: request.body.currency,
        customer: request.body.customer,
        source: request.body.source,
        receipt_email: request.body.receipt_email,
        description: request.body.description,
        shipping: {
          address: {
            line1: request.body.address.address,
            line2: request.body.address.unitno,
            postal_code: request.body.address.postal_code,
          },
          name: request.body.name,
        },
      })
      .then((charge) => {
        console.log("Successfully charged customer");
        response.send(charge);
      })
      .catch((error) => {
        console.log("Error charging customer: ", error);
        response.send(error);
      });
  }
);

// exports.releasePaymentToSeller = functions.https.onRequest(
//   (request, response) => {
//     stripe.transfers
//       .create({
//         amount: 1000,
//         currency: "sgd",
//         destination: request.body.sellerAccountId,
//       })
//       .then((account) => {
//         response.send(account);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }
// );

// exports.addMessage = functions.https.onCall((data, context) => {
// const ref = db.collection(sellerTransaction).doc()
//   return .set({
//     text: sanitizedMessage,
//     author: { uid, name, picture, email },
//   }).then(() => {
//     console.log('New Message written');
//     // Returning the sanitized message to the client.
//     return { text: sanitizedMessage };
//   })
//   // [END returnMessageAsync]
//     .catch((error) => {
//     // Re-throwing the error as an HttpsError so that the client gets the error details.
//       throw new functions.https.HttpsError('unknown', error.message, error);
//     });
//   // [END_EXCLUDE]
// });
