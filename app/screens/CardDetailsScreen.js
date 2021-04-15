import React, { useContext, useEffect, useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  Alert,
  Modal,
  TouchableHighlight,
} from "react-native";

//BackEnd
import AuthApi from "../api/auth";
import axios from "axios";
import { PaymentsStripe as Stripe } from "expo-payments-stripe";
//Front End
import Screen from "../components/Screen";
import AppActivityIndicator from "../components/AppActivityIndicator";
import ListItemSeperator from "../components/lists/ListItemSeperator";
import colors from "../config/colors.js";
import AppText from "../components/AppText.js";
import CardListItem from "../components/lists/CardListItem.js";
import AddressListItem from "../components/lists/AddressListItem.js";

import ListItem from "../components/lists/ListItem.js";
import Icon from "../components/Icon.js";
import ListItemDeleteAction from "../components/lists/ListItemDeleteAction.js";

function CardDetailsScreen(props) {
  const [loading, setLoading] = useState(true);
  const [fetch, setFetch] = useState(0);
  const [customer, setCustomer] = useState(null);
  const [sourceList, setSourceList] = useState([]);
  const [toBeDefault, setToBeDefault] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const mounted = useRef(true);
  const { currentUser } = useContext(AuthApi.AuthContext);
  // First and subsequent refresh Functions //////////////////////////////////////////////////////
  useEffect(() => {
    mounted.current = true;
    Stripe.setOptionsAsync({
      publishableKey:
        "pk_test_51IcPqUGtUzx3ZmTbhejEutSdJPmxgIYt8MIFJMuub6RSfRaASxU2Db9LwJNUAQdcTTsQCulLk4LU7jw2ca7jplKB00NKDHVNFh", // Your key
    });
    retrieveCustomer();

    return () => {
      mounted.current = false;
    };
  }, [fetch]);

  //Get customer details to get default source id
  const retrieveCustomer = () => {
    axios({
      method: "POST",
      url:
        "https://us-central1-buyfne-63905.cloudfunctions.net/retrieveCustomer",
      data: {
        cust_id: currentUser.cus_id, // currentUser.cus_id,
      },
    })
      .then(({ _, data }) => {
        if (mounted.current == true) {
          setCustomer(data);
          getCardSources(data);
        }
      })
      .catch((error) => {
        if (mounted.current == true) {
          console.log("Error : ", error.message);
          Alert.alert("Error", error.message);
          setLoading(false);
        }
      });
  };

  // get source list
  const getCardSources = (customer) => {
    console.log("Getting Card sources");
    axios({
      method: "POST",
      url:
        "https://us-central1-buyfne-63905.cloudfunctions.net/listCardSources",
      data: {
        cust_id: currentUser.cus_id, // currentUser.cus_id,
      },
    })
      .then(({ _, data }) => {
        // console.log(data.data[0]);
        // console.log(data.data);
        if (data.data.length != 0) {
          var sourcelist = [];
          data.data.forEach((source) => {
            // console.log(source);

            sourcelist.push({
              //(push as an object)
              id: source.id,
              last4: source.last4,
              key: source.id,
            });

            // setLoading(false);
          });
          if (mounted.current == true) {
            setSourceList(sourcelist);
            setLoading(false);
          }
        } else {
          if (mounted.current == true) {
            setSourceList([]);
            console.log("No Sources");
            setLoading(false);
          }
        }
      })
      .catch((error) => {
        if (mounted.current == true) {
          console.log("Error : ", error.message);
          Alert.alert("Error", error.message);
          setLoading(false);
        }
      });
  };
  ////////////////////////////////////////////////////////////////

  // Add Card Functions /////////////////////////////////////
  const getToken = () => {
    Stripe.paymentRequestWithCardFormAsync()
      .then((data) => {
        setLoading(true);
        console.log("created card token");
        addCardToSource(data.tokenId);
      })
      .catch((error) => {
        console.log(error.message);
        setLoading(false);
      });
  };

  const addCardToSource = (cardToken) => {
    console.log("Adding to source");
    axios({
      method: "POST",
      url:
        "https://us-central1-buyfne-63905.cloudfunctions.net/addCardToSource",
      data: {
        cust_id: currentUser.cus_id, // currentUser.cus_id,
        cardToken: cardToken,
      },
    })
      .then(({ _, data }) => {
        setFetch(fetch + 1);
      })
      .catch((error) => {
        console.log("Error : ", error.message);
        Alert.alert("Error", error.message);
        setLoading(false);
      });
  };
  ////////////////////////////////////////////////////////////////

  //Deletion Functions////////////////////////////////////////////
  const handleDelete = (item) => {
    setLoading(true);
    deleteCardSource(item);
  };

  const deleteCardSource = (card) => {
    console.log("Deleting card");
    axios({
      method: "POST",
      url:
        "https://us-central1-buyfne-63905.cloudfunctions.net/deleteCardSource",
      data: {
        cust_id: currentUser.cus_id, // currentUser.cus_id,
        card_id: card.id,
      },
    })
      .then(({ _, data }) => {
        console.log(data);
        setFetch(fetch + 1);
      })
      .catch((error) => {
        console.log("Error : ", error.message);
        Alert.alert("Error", error.message);
        setLoading(false);
      });
  };
  //////////////////////////////////////////////////////////

  // For setting card as default//////////////////////////////////
  const handleSetDefault = (card) => {
    setToBeDefault(card.id);
    setModalVisible(true);
  };

  const handleYes = () => {
    console.log(toBeDefault);
    console.log("Setting as Default");
    setLoading(true);
    setModalVisible(false);
    axios({
      method: "POST",
      url:
        "https://us-central1-buyfne-63905.cloudfunctions.net/setDefaultSource",
      data: {
        cust_id: currentUser.cus_id, // currentUser.cus_id,
        card_id: toBeDefault,
      },
    })
      .then(({ _, data }) => {
        setFetch(fetch + 1);
      })
      .catch((error) => {
        console.log("Error : ", error.message);
        Alert.alert("Error", error.message);
        setLoading(false);
      });
  };

  const handleNo = () => {
    setToBeDefault(null);
    setModalVisible(false);
  };

  //Renders footer for Flatlist/////////////////////
  const renderFooter = () => {
    return (
      sourceList.length < 5 && (
        <>
          <ListItemSeperator />
          <ListItem
            IconComponent={
              <Icon
                name='plus-thick'
                backgroundColor={colors.white}
                iconColor='black'
              />
            }
            title='Add New Card'
            onPress={getToken}
          />
        </>
      )
    );
  };
  ////////////////////////////////////////////////////////////////

  return (
    <Screen style={{ paddingTop: 0, backgroundColor: colors.whitegrey }}>
      <AppActivityIndicator visible={loading} />

      <View style={styles.instruction}>
        <AppText style={{ color: colors.white, fontSize: 15 }}>
          Tap to set as default / Swipe right to delete
        </AppText>
      </View>
      <ListItemSeperator />
      <View
        style={{
          justifyContent: "center",
          backgroundColor: colors.white,
        }}
      >
        <AppText style={{ color: colors.black, fontSize: 15, padding: 5 }}>
          Credit / Debit Cards
        </AppText>
      </View>

      <ListItemSeperator />
      <FlatList
        data={sourceList}
        // Normally needed but we already added a "key" property to each listing (above)
        // keyExtractor={(listing) => listing.key.toString()} // unqiue key is alway expected to be a string
        //!!!!!!!!! IMPLEMENT SEARCH BAR AND CATEGORIES HERE
        //ListHeaderComponent property for single render seperate components on the topp of flat list scrollable
        //https://stackoverflow.com/questions/60341135/react-native-separate-view-component-scrollable-with-flatlist
        ListFooterComponent={renderFooter}
        renderItem={({ item }) => (
          <CardListItem
            IconComponent={
              <Icon
                name='credit-card'
                backgroundColor={colors.white}
                iconColor='black'
              />
            }
            title={"***" + item.last4}
            subTitle={item.id == customer.default_source && "Default"}
            onPress={() => {
              item.id != customer.default_source && handleSetDefault(item);
            }}
            renderRightActions={() => (
              <ListItemDeleteAction onPress={() => handleDelete(item)} />
            )}
          />
        )}
        ItemSeparatorComponent={ListItemSeperator}
      />

      <Modal transparent={true} visible={modalVisible}>
        <View style={styles.modal}>
          <View style={styles.modalBoxContainer}>
            <View style={styles.switchTextContainer}>
              <AppText style={styles.switchText}>
                Set this card as default?
              </AppText>
            </View>
            <View style={styles.modalButtonContainer}>
              <TouchableHighlight
                underlayColor={colors.sienna}
                activeOpacity={0.5}
                style={styles.buttonYesContainer}
                onPress={handleYes}
              >
                <AppText style={{ color: colors.darkorange }}>Yes</AppText>
              </TouchableHighlight>
              <TouchableHighlight
                underlayColor={colors.brown}
                activeOpacity={0.5}
                style={styles.buttonNoContainer}
                onPress={handleNo}
              >
                <AppText style={{ color: colors.brightred }}>No</AppText>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  instruction: {
    backgroundColor: "#000000aa",
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  modal: {
    backgroundColor: "#000000aa",
    flex: 1,
  },
  modalBoxContainer: {
    backgroundColor: colors.white,
    margin: 50,
    marginTop: 100,
    height: "20%",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchTextContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  switchText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.muted,
  },
  buttonYesContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 2,
    borderColor: colors.whitegrey,
    width: "50%",
  },
  buttonNoContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: colors.whitegrey,
    width: "50%",
  },
  modalButtonContainer: {
    flexDirection: "row",
    width: "100%",
    height: "40%",
  },
});

export default CardDetailsScreen;
