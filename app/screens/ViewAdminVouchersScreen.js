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
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
// Back End
import AuthApi from "../api/auth";
import db from "../api/db";

//Navigation
import routes from "../navigation/routes";
import AppActivityIndicator from "../components/AppActivityIndicator";
import ListItemSeperator from "../components/lists/ListItemSeperator";
import Icon from "../components/Icon";
const categories = [
  {
    label: "All",
    value: 0,
    backgroundColor: colors.brightred,
    icon: "storefront",
    IconType: MaterialCommunityIcons,
  },
  {
    label: "Furniture",
    value: 1,
    backgroundColor: "saddlebrown",
    icon: "table-furniture",
    IconType: MaterialCommunityIcons,
  },
  {
    label: "Clothing",
    value: 2,
    backgroundColor: "palevioletred",
    icon: "shoe-formal",
    IconType: MaterialCommunityIcons,
  },
  {
    label: "Food",
    value: 3,
    backgroundColor: "orange",
    icon: "food-fork-drink",
    IconType: MaterialCommunityIcons,
  },
  {
    label: "Games",
    value: 4,
    backgroundColor: "green",
    icon: "games",
    IconType: MaterialIcons,
  },
  {
    label: "Computer",
    value: 5,
    backgroundColor: colors.muted,
    icon: "computer",
    IconType: MaterialIcons,
  },
  {
    label: "Health",
    value: 6,
    backgroundColor: "red",
    icon: "heart-plus",
    IconType: MaterialCommunityIcons,
  },
  {
    label: "Books",
    value: 7,
    backgroundColor: "maroon",
    icon: "bookshelf",
    IconType: MaterialCommunityIcons,
  },
  {
    label: "Electronic",
    value: 8,
    backgroundColor: "skyblue",
    icon: "electrical-services",
    IconType: MaterialIcons,
  },
];
function ViewAdminVouchersScreen({ navigation }) {
  const { currentUser } = useContext(AuthApi.AuthContext);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Voucher mounted");
    setLoading(true);
    const sub = db
      .collection("vouchers")
      .orderBy("category", "asc")
      .where("category", ">=", 0)
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
          console.log(error.message);
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
          title='Create platform voucher'
          style={{ borderRadius: 0 }}
          color='teal'
          onPress={() => {
            navigation.navigate(routes.CREATEPLATFORMVOUCHERS);
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
                    <View style={{ justifyContent: "center", marginLeft: 10 }}>
                      <Icon
                        backgroundColor={
                          categories[item.category].backgroundColor
                        }
                        name={categories[item.category].icon}
                        IconType={categories[item.category].IconType}
                        size={80}
                      />
                    </View>
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
                        {"Category: " + categories[item.category].label}
                      </AppText>
                      <AppText
                        numberOfLines={1}
                        style={{
                          color: colors.muted,
                          fontSize: 15,
                          width: 250,
                        }}
                      >
                        {"Code: " + item.voucher_code}
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

export default ViewAdminVouchersScreen;
