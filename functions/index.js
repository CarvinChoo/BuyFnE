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

exports.scheduledLoyaltyIntervalCheck = functions
  .region("asia-southeast2")
  .pubsub.schedule("0 0 * * *")
  .timeZone("Asia/Singapore")
  .onRun(async (context) => {
    var currentTime = admin.firestore.Timestamp.now();
    return db
      .collection("users")
      .where("loyalty_interval_end", "<=", currentTime)
      .get()
      .then((users) => {
        if (!users.empty) {
          console.log("Not Empty");
          var expiry = new Date();
          const threeMonths = 1; // change to 91
          expiry.setDate(expiry.getDate() + threeMonths);
          expiry.setHours(0, 0, 0, 0);
          var loyalty_interval_end = admin.firestore.Timestamp.fromDate(expiry);

          users.forEach((user) => {
            user.ref
              .update({
                loyalty_accumulative: Number(0),
                loyalty_interval_start: currentTime,
                loyalty_interval_end: loyalty_interval_end,
              })
              .then(() => {
                console.log("Successfully updated user loyalty program");
              })
              .catch((error) => {
                console.log(
                  "Error when updating user loyalty program: ",
                  error.message
                );
              });
          });
        } else {
          console.log("No expired loyalty program");
        }
      })
      .catch((error) => {
        console.log("Fail to retrieve users: ", error.message);
      });
  });

exports.scheduledVoucherCheck = functions
  .region("asia-southeast2")
  .pubsub.schedule("0 0 * * *")
  .timeZone("Asia/Singapore")
  .onRun(async (context) => {
    const timeNow = admin.firestore.Timestamp.now();
    return db
      .collection("vouchers")
      .where("expiry_date", "<=", timeNow)
      .get()
      .then((vouchers) => {
        if (!vouchers.empty) {
          console.log("Not Empty");
          vouchers.forEach((voucher) => {
            voucher.ref
              .delete()
              .then(() => {
                console.log("Successfully deleted expired voucher");
              })
              .catch((error) => {
                console.log(
                  "Error when deleting expired voucher: ",
                  error.message
                );
              });
          });
        } else {
          console.log("No expired vouchers");
        }
      });
  });

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
              ) {
                let promises1 = [];

                promises1.push(
                  db
                    .collection("transactions")
                    .where("product_id", "==", groupbuy.data().listingId)
                    .where("status", "==", 1)
                    .get()
                    .then((transactions) => {
                      transactions.forEach((transaction) => {
                        transaction.ref
                          .update({
                            status: 6, //refunded
                          })
                          .then(() => {
                            stripe.refunds //refund on failed group buy
                              .create({
                                charge: transaction.data().charge_id,
                              })
                              .then(() => {
                                console.log("Successfully refunded customer");
                              })
                              .catch((error) => {
                                console.log(
                                  "Error when refunding customer: ",
                                  error
                                );
                              });
                          })
                          .catch((error) => {
                            console.log(
                              "Error when setting refunded status: ",
                              error.message
                            );
                          });
                      });
                    })
                    .catch((error) => {
                      console.log(
                        "Error when setting Unsuccessful status: ",
                        error.message
                      );
                    })
                );

                Promise.all(promises1)
                  .then(() => [
                    groupbuy.ref
                      .update({
                        groupbuyStatus: "Unsuccessful",
                      })
                      .then(() => {
                        console.log("Succesfully updated Unsuccessful status");
                      })
                      .catch((error) => {
                        console.log(
                          "Error when setting Unsuccessful status: ",
                          error.message
                        );
                      }),
                  ])
                  .catch((err) => {
                    console.log("Error: some transaction failed to process");
                  });
              } else {
                let promises2 = [];
                promises2.push(
                  db
                    .collection("transactions")
                    .where("product_id", "==", groupbuy.data().listingId)
                    .where("status", "==", 1)
                    .get()
                    .then((transactions) => {
                      transactions.forEach((transaction) => {
                        transaction.ref
                          .update({
                            status: 2, //Awaiting seller confirmation
                          })
                          .then(() => {
                            console.log(
                              "Updated Awaiting seller confirmation status"
                            );
                          })
                          .catch((error) => {
                            console.log(
                              "Error when setting Awaiting seller confirmation status: ",
                              error.message
                            );
                          });
                      });
                    })
                    .catch((error) => {
                      console.log(
                        "Error when setting Awaiting seller confirmation status: ",
                        error.message
                      );
                    })
                );
                Promise.all(promises2).then(() => {
                  groupbuy.ref
                    .update({
                      groupbuyStatus: "Awaiting seller confirmation",
                    })
                    .then(() => {
                      console.log(
                        "Succesfully updated Awaiting seller confirmation status"
                      );
                    })
                    .catch((error) => {
                      console.log(
                        "Error when setting Awaiting seller confirmation status: ",
                        error.message
                      );
                    });
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
      throw new Error(error);
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
          throw new Error(error);
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
      throw new Error(error);
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
      throw new Error(error);
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
      throw new Error(error);
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
      throw new Error(error);
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
      throw new Error(error);
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
      throw new Error(error);
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
      throw new Error(error);
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
        throw new Error(error);
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
        throw new Error(error);
      });
  }
);

exports.createRefund = functions.https.onRequest((request, response) => {
  return stripe.refunds
    .create({
      charge: request.body.charge_id,
    })
    .then((refund) => {
      console.log("Successfully refunded customer");
      response.send(refund);
    })
    .catch((error) => {
      console.log("Error when refunding customer: ", error);
      throw new Error(error);
    });
});

exports.releasePaymentToSeller = functions.https.onRequest(
  (request, response) => {
    stripe.transfers
      .create({
        amount: request.body.paid,
        currency: "sgd",
        destination: request.body.stripe_id,
      })
      .then((transfer) => {
        console.log("Succesfully released payment to seller");
        response.send(transfer);
      })
      .catch((error) => {
        console.log("Error releasing payment to seller: ", error);
        throw new Error(error);
      });
  }
);

exports.releaseOnScheduleToSeller = functions
  .region("asia-southeast2")
  .pubsub.schedule("0 0 * * *")
  .timeZone("Asia/Singapore")
  .onRun(async (context) => {
    return db
      .collection("transactions")
      .where("status", "==", 4)
      .get()
      .then((transactions) => {
        var days = 14; // change to 14
        var timeNow = new Date();
        if (!transactions.empty) {
          transactions.forEach((transaction) => {
            var shippedDate = transaction.data().shippedDate.toDate();
            shippedDate.setDate(shippedDate.getDate() + days);

            if (timeNow > shippedDate) {
              //if 2 weeks after shipped date
              db.collection("users")
                .doc(transaction.data().seller_id)
                .get()
                .then((seller) => {
                  if (seller.exists) {
                    stripe.transfers
                      .create({
                        amount: Math.round(
                          ((transaction.data().paid * 100) / 100) * 100
                        ),
                        currency: "sgd",
                        destination: seller.data().stripe_id,
                      })
                      .then(() => {
                        transaction.ref
                          .update({
                            status: 5,
                            confirmedDeliveryTime: admin.firestore.Timestamp.now(),
                          })
                          .then(() => {
                            console.log(
                              "Succesfully released payment to seller"
                            );
                          })
                          .catch((error) => {
                            console.log(
                              "Updating transaction status after releasing payment: ",
                              error.message
                            );
                          });
                      })
                      .catch((error) => {
                        console.log(
                          "Error releasing payment to seller: ",
                          error.message
                        );
                      });
                  } else {
                    console.log("Error: No such seller");
                  }
                })
                .catch((err) => {
                  console.log("Fail to retrieve seller: ", err.message);
                });
            }
          });
        } else {
          console.log("No payment to be released to sellers");
        }
      });
  });

exports.retrieveStoreAddress = functions.https.onRequest(
  (request, response) => {
    return stripe.accounts
      .retrieve(request.body.stripe_id)
      .then((account) => {
        console.log("Retreived Account");
        response.send(account);
      })
      .catch((error) => {
        console.log("Error retreiving account: ", error);
        throw new Error(error);
      });
  }
);

exports.createNewExternal = functions.https.onRequest((request, response) => {
  return stripe.accounts
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
        default_for_currency: true,
      }
    )
    .then((account) => {
      console.log("Successfully created new external account");
      response.send(account);
    })
    .catch((error) => {
      console.log("Error when creating new external account : ", error);
      throw new Error(error);
    });
});

exports.deleteOldExternal = functions.https.onRequest((request, response) => {
  return stripe.accounts
    .deleteExternalAccount(
      request.body.stripe_id, //seller's stripe acct number
      request.body.old_bank_id
    )
    .then((event) => {
      console.log("Successfully deleted old external account");
      response.send(event);
    })
    .catch((error) => {
      console.log("Error when deleting old external account : ", error);
      throw new Error(error);
    });
});

exports.updateStoreAddress = functions.https.onRequest((request, response) => {
  return stripe.accounts
    .update(
      request.body.stripe_id, // seller's stripe acct number
      {
        individual: {
          address: {
            line1: request.body.store_address, // Address
            line2: request.body.store_unitno, // Unit number
            postal_code: request.body.postal_code, //Postal code
          },
        },
      }
    )
    .then((account) => {
      console.log("Successfully updated store address");
      response.send(account);
    })
    .catch((error) => {
      console.log("Error when updating store address : ", error);
      throw new Error(error);
    });
});

exports.suspendUser = functions.https.onRequest((request, response) => {
  return admin
    .auth()
    .updateUser(request.body.uid, { disabled: true })
    .then(() => {
      if (request.body.date) {
        const date = new Date(request.body.date);
        var suspended_till = admin.firestore.Timestamp.fromDate(date);
        db.collection("users")
          .doc(request.body.uid)
          .update({
            suspended: true,
            suspended_till: suspended_till,
          })
          .then(() => {
            if (request.body.isMerchant) {
              db.collection("all_listings")
                .where("seller", "==", request.body.uid)
                .get()
                .then((listings) => {
                  if (!listings.empty) {
                    var promises = [];
                    listings.forEach((listing) => {
                      promises.push(
                        listing.ref
                          .update({
                            listingStatus: "Pause",
                            groupbuyId: null,
                          })
                          .then(() => {
                            console.log("Updated listing");
                          })
                          .catch((e) => {
                            console.log(
                              "Failed to update listing: ",
                              e.message
                            );
                          })
                      );
                    });
                    Promise.all(promises).then(() => {
                      db.collection("transactions")
                        .where("seller_id", "==", request.body.uid)
                        .orderBy("status", "asc")
                        .where("status", "<", 4)
                        .get()
                        .then((trans) => {
                          if (!trans.empty) {
                            var promises2 = [];
                            trans.forEach((tran) => {
                              promises2.push(
                                tran.ref
                                  .update({
                                    status: 6, //refunded
                                  })
                                  .then(() => {
                                    stripe.refunds //refund on failed group buy
                                      .create({
                                        charge: tran.data().charge_id,
                                      })
                                      .then(() => {
                                        console.log(
                                          "Successfully refunded customer"
                                        );
                                      })
                                      .catch((error) => {
                                        console.log(
                                          "Error when refunding customer: ",
                                          error
                                        );
                                      });
                                  })
                                  .catch((error) => {
                                    console.log(
                                      "Error when setting refunded status: ",
                                      error.message
                                    );
                                  })
                              );
                            });
                            Promise.all(promises2)
                              .then(() => {
                                response.send("Success");
                              })
                              .catch((e) => {
                                console.log(
                                  "Failed to refund all customer: ",
                                  e.message
                                );
                                throw new Error(e);
                              });
                          } else {
                            console.log("Transaction Empty");
                            response.send("Success");
                          }
                        })
                        .catch((e) => {
                          console.log("Failed to update listing:", e.message);
                          throw new Error(e);
                        });
                    });
                  } else {
                  }
                });
            } else {
              console.log("Not merchant");
              response.send("Success");
            }
          })
          .catch((e) => {
            console.log("Error updating user: ", e.message);
            throw new Error(e);
          });
      } else {
        db.collection("users")
          .doc(request.body.uid)
          .update({
            suspended: true,
            suspended_till: null,
          })
          .then(() => {
            if (request.body.isMerchant) {
              db.collection("all_listings")
                .where("seller", "==", request.body.uid)
                .get()
                .then((listings) => {
                  if (!listings.empty) {
                    var promises = [];
                    listings.forEach((listing) => {
                      promises.push(
                        listing.ref
                          .update({
                            listingStatus: "Pause",
                            groupbuyId: null,
                          })
                          .then(() => {
                            console.log("Updated listing");
                          })
                          .catch((e) => {
                            console.log(
                              "Failed to update listing: ",
                              e.message
                            );
                          })
                      );
                    });
                    Promise.all(promises).then(() => {
                      db.collection("transactions")
                        .where("seller_id", "==", request.body.uid)
                        .orderBy("status", "asc")
                        .where("status", "<", 4)
                        .get()
                        .then((trans) => {
                          if (!trans.empty) {
                            var promises2 = [];
                            trans.forEach((tran) => {
                              promises2.push(
                                tran.ref
                                  .update({
                                    status: 6, //refunded
                                  })
                                  .then(() => {
                                    stripe.refunds //refund on failed group buy
                                      .create({
                                        charge: tran.data().charge_id,
                                      })
                                      .then(() => {
                                        console.log(
                                          "Successfully refunded customer"
                                        );
                                      })
                                      .catch((error) => {
                                        console.log(
                                          "Error when refunding customer: ",
                                          error
                                        );
                                      });
                                  })
                                  .catch((error) => {
                                    console.log(
                                      "Error when setting refunded status: ",
                                      error.message
                                    );
                                  })
                              );
                            });
                            Promise.all(promises2)
                              .then(() => {
                                response.send("Success");
                              })
                              .catch((e) => {
                                console.log(
                                  "Failed to refund all customers: ",
                                  e.message
                                );
                                throw new Error(e);
                              });
                          } else {
                            console.log("Transaction Empty");
                            response.send("Success");
                          }
                        });
                    });
                  } else {
                  }
                });
            } else {
              console.log("Not merchant");
              response.send("Success");
            }
          })
          .catch((e) => {
            console.log("Error updating user: ", e.message);
            throw new Error(e);
          });
      }
    });
});

exports.unsuspendUser = functions.https.onRequest((request, response) => {
  return admin
    .auth()
    .updateUser(request.body.uid, { disabled: false })
    .then(() => {
      db.collection("users")
        .doc(request.body.uid)
        .update({
          suspended: false,
          suspended_till: null,
        })
        .then(() => {
          console.log("Unsuspend user");
          response.send("Success");
        })
        .catch((e) => {
          console.log("Error when unsuspending user : ", error);
          throw new Error(error);
        });
    });
});

exports.scheduledUnsuspend = functions
  .region("asia-southeast2")
  .pubsub.schedule("0 0 * * *")
  .timeZone("Asia/Singapore")
  .onRun(async (context) => {
    var currentTime = admin.firestore.Timestamp.now();
    return db
      .collection("users")
      .where("suspended_till", "<=", currentTime)
      .get()
      .then((users) => {
        if (!users.empty) {
          users.forEach((user) => {
            user.ref
              .update({
                suspended: false,
                suspended_till: null,
              })
              .then(() => {
                console.log("Unsuspend user");
              })
              .catch((e) => {
                console.log("Error when unsuspending user : ", error);
              });
          });
        }
      })
      .catch((e) => {
        console.log("Error getting suspended users: ", e.message);
      });
  });
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
