import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Alert,
  TouchableHighlight,
} from "react-native";

import ToShipListItem from "../components/lists/ToShipListItem";
import colors from "../config/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Screen from "../components/Screen";
import AppText from "../components/AppText";
import ListItemSeperator from "../components/lists/ListItemSeperator";
//BackEnd
import AuthApi from "../api/auth";
import db from "../api/db";

//Navigation
import routes from "../navigation/routes";
import AppActivityIndicator from "../components/AppActivityIndicator";

//style properties of items on page
function RefundScreen({ navigation }) {
  const { currentUser } = useContext(AuthApi.AuthContext);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    setLoading(true);
    const sub = db
      .collection("transactions")
      .where("buyer_id", "==", currentUser.uid)
      .where("status", "==", 6)
      .orderBy("orderDate", "desc")
      .onSnapshot(
        (transactions) => {
          const updatedOrders = [];
          transactions.forEach((transaction) => {
            updatedOrders.push(transaction.data());
          });
          setOrders(updatedOrders);
          setLoading(false);
        },
        (error) => {
          console.log(error.message);
          Alert.alert(
            "Fail to communicate with database",
            "Please try again later"
          );

          setLoading(false);
        }
      );
    return () => {
      sub();
    };
  }, []);

  return (
    <>
      <AppActivityIndicator visible={loading} />
      <Screen style={styles.container}>
        {orders.length > 0 ? (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.transaction_id}
            renderItem={({ item }) => (
              <>
                <ToShipListItem item={item} />
                <ListItemSeperator />
                <View
                  style={{
                    backgroundColor: colors.white,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    marginBottom: 20,
                  }}
                >
                  <TouchableHighlight
                    style={{
                      padding: 8,
                      backgroundColor: colors.darkslategrey,

                      borderRadius: 10,
                    }}
                    onPress={() =>
                      navigation.navigate(routes.RECEIPT, {
                        ...item,
                        orderDate: item.orderDate.toDate().toDateString(),
                        estimatedDeliveryTime: null,
                        confirmedDeliveryTime: null,
                      })
                    }
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <MaterialCommunityIcons
                        name='receipt'
                        size={17}
                        color={colors.white}
                        style={{ marginRight: 5 }}
                      />
                      <AppText
                        style={{
                          color: colors.white,
                          fontSize: 15,
                          fontWeight: "bold",
                          fontFamily: "sans-serif-medium",
                        }}
                      >
                        Receipt
                      </AppText>
                    </View>
                  </TouchableHighlight>
                </View>
              </>
            )}
          />
        ) : (
          <View
            style={{
              paddingHorizontal: 30,
              justifyContent: "center",
              alignItems: "center",
              marginVertical: "50%",
            }}
          >
            <Text
              style={{
                fontSize: 30,
                fontWeight: "bold",
                color: colors.grey,
              }}
            >
              No Refunded Orders
            </Text>
          </View>
        )}
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  //container properties
  container: {
    paddingTop: 0,
    backgroundColor: colors.whitegrey,
  },
});

export default RefundScreen;
