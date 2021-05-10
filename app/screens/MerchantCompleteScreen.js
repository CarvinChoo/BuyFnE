import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  View,
  FlatList,
  TouchableHighlight,
  Text,
} from "react-native";
import AppText from "../components/AppText";
import Screen from "../components/Screen";
import colors from "../config/colors";
import ListItemSeperator from "../components/lists/ListItemSeperator";
import { MaterialCommunityIcons } from "@expo/vector-icons";
//Backend
import db from "../api/db";
import AuthApi from "../api/auth"; // for context
function MerchantCompleteScreen() {
  const { listingId } = useContext(AuthApi.AuthContext);
  const [groupbuy, setGroupBuy] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sub2 = db
      .collection("transactions")
      .where("product_id", "==", listingId)
      .orderBy("status", "asc")
      .where("status", ">=", 5)
      .orderBy("orderDate", "desc")
      .onSnapshot(
        (query) => {
          var transac = [];
          query.forEach((transaction) => {
            transac.push(transaction.data());
          });
          setTransactions(transac);
        },
        (error) => {
          console.log(error.message);
          Alert.alert("Error", "Unable to retrieve transactions from database");
        }
      );
    return () => {
      sub2();
    };
  }, []);

  return (
    <Screen style={styles.container}>
      {transactions.length > 0 ? (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.transaction_id}
          renderItem={({ item }) => (
            <View
              style={{
                marginBottom: 20,
                backgroundColor: colors.white,
                paddingVertical: 10,
                width: "100%",
                alignSelf: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingHorizontal: 30,
                  marginBottom: 3,
                }}
              >
                <AppText style={{ fontWeight: "bold", fontSize: 18 }}>
                  {item.product_title}
                </AppText>
                <AppText style={{ color: colors.muted, fontSize: 15 }}>
                  {"x" + item.count}
                </AppText>
              </View>
              <ListItemSeperator />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingHorizontal: 30,
                }}
              >
                <AppText style={{ color: colors.muted, fontSize: 15 }}>
                  Paid:
                </AppText>
                <AppText style={{ color: colors.muted, fontSize: 15 }}>
                  {"$" + item.paid.toFixed(2)}
                </AppText>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingHorizontal: 30,
                }}
              >
                <AppText style={{ color: colors.muted, fontSize: 15 }}>
                  Ship to:
                </AppText>
                <AppText
                  style={{
                    color: colors.muted,
                    fontSize: 15,
                    textAlign: "right",
                  }}
                >
                  {item.buyer_name}
                </AppText>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingHorizontal: 30,
                }}
              >
                <AppText style={{ color: colors.muted, fontSize: 15 }}>
                  Shipping Address:
                </AppText>

                <AppText
                  style={{
                    color: colors.muted,
                    fontSize: 15,
                    width: 150,
                    textAlign: "right",
                  }}
                  numberOfLines={3}
                >
                  {item.shipping.address}
                </AppText>
              </View>
              <View
                style={{
                  flexDirection: "row-reverse",
                  paddingHorizontal: 30,
                }}
              >
                <AppText style={{ color: colors.muted, fontSize: 15 }}>
                  {"#" + item.shipping.unitno}
                </AppText>
              </View>
              <View
                style={{
                  flexDirection: "row-reverse",
                  paddingHorizontal: 30,
                }}
              >
                <AppText style={{ color: colors.muted, fontSize: 15 }}>
                  {item.shipping.postal_code}
                </AppText>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingHorizontal: 30,
                }}
              >
                <AppText style={{ color: colors.muted, fontSize: 15 }}>
                  Status:
                </AppText>
                <AppText
                  style={{
                    color: colors.cyan,
                    fontSize: 15,
                    fontWeight: "bold",
                  }}
                >
                  {item.status == 5 ? "Complete" : "Refunded"}
                </AppText>
              </View>
            </View>
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
            No Completed Orders
          </Text>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.whitegrey, paddingTop: 10 },
});

export default MerchantCompleteScreen;
