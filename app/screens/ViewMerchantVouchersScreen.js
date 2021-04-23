import React, { useContext, useEffect, useState } from "react";
import { FlatList } from "react-native";
import { Image } from "react-native";
import { StyleSheet, View } from "react-native";
import AppText from "../components/AppText";
import Screen from "../components/Screen";
import colors from "../config/colors";
import ListItemDeleteAction from "../components/lists/ListItemDeleteAction";
import { Alert } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import AppButton from "../components/AppButton";

// Back End
import AuthApi from "../api/auth";
import db from "../api/db";

//Navigation
import routes from "../navigation/routes";
import AppActivityIndicator from "../components/AppActivityIndicator";
import ListItemSeperator from "../components/lists/ListItemSeperator";

function ViewMerchantVouchersScreen({ navigation }) {
  const { currentUser } = useContext(AuthApi.AuthContext);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Voucher mounted");
    setLoading(true);
    const sub = db
      .collection("vouchers")
      .where("seller_id", "==", currentUser.uid)
      .orderBy("created_at", "desc")
      .onSnapshot(
        (query) => {
          if (query.empty) {
            setVouchers([]);
            setLoading(false);
          } else {
            var voucherlist = [];
            query.forEach((e) => {
              voucherlist.push({
                ...e.data(),
              });
            });
            setVouchers(voucherlist);
            setLoading(false);
          }
        },
        (error) => {
          Alert.alert("Error", "Fail to retreive vouchers");
          setLoading(false);
        }
      );
    return () => {
      console.log("Voucher unMounted");
      sub();
    };
  }, []);

  const handleDelete = (item) => {
    setLoading(true);
    db.collection("vouchers")
      .doc(item.voucher_id)
      .delete()
      .then(() => {
        Alert.alert("Success", "Voucher removed");
      })
      .catch((error) => {
        Alert.alert("Error", "Failed to remove voucher");
        setLoading(false);
      });
  };
  const renderHeader = () => {
    return (
      <>
        <AppButton
          title='Create store voucher'
          style={{ borderRadius: 0 }}
          color='teal'
          onPress={() => {
            navigation.navigate(routes.CREATEMERVOUCHER);
          }}
        />

        {vouchers.length != 0 && (
          <View style={styles.instruction}>
            <AppText style={{ color: colors.white, fontSize: 15 }}>
              Swipe left to remove voucher
            </AppText>
          </View>
        )}
      </>
    );
  };
  return (
    <>
      <AppActivityIndicator visible={loading} />
      <Screen style={{ backgroundColor: colors.whitegrey, paddingTop: 0 }}>
        <FlatList
          data={vouchers}
          keyExtractor={(item) => item.voucher_id}
          ListHeaderComponent={renderHeader}
          renderItem={({ item }) => (
            <>
              <Swipeable
                renderRightActions={() => (
                  <ListItemDeleteAction onPress={() => handleDelete(item)} />
                )}
              >
                <View style={styles.container}>
                  <View style={{ flexDirection: "row" }}>
                    <Image
                      style={styles.image}
                      source={{ uri: item.store_logo }}
                    />

                    <View
                      style={{
                        flexDirection: "column",
                        justifyContent: "center",
                        padding: 20,
                      }}
                    >
                      <AppText numberOfLines={1} style={{ fontSize: 17 }}>
                        {item.percentage_discount <= 0
                          ? "$" +
                            item.amount_discount +
                            " OFF  Min. Spend $" +
                            item.minimum_spending
                          : item.percentage_discount +
                            "%" +
                            " OFF  Min. Spend $" +
                            item.minimum_spending}
                      </AppText>
                      <AppText style={{ color: colors.muted, fontSize: 15 }}>
                        {"Valid till: " + item.expiry_date_string}
                      </AppText>
                      <AppText
                        numberOfLines={1}
                        style={{
                          color: colors.muted,
                          fontSize: 15,
                          width: 250,
                        }}
                      >
                        {"Store: " + item.store_name}
                      </AppText>
                    </View>
                  </View>
                </View>
              </Swipeable>
              <ListItemSeperator />
            </>
          )}
        />
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.white },
  image: { height: 110, width: 110, resizeMode: "center" },
  instruction: {
    backgroundColor: "#000000aa",
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ViewMerchantVouchersScreen;
