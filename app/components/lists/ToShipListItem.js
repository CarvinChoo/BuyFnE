import React from "react";
import { StyleSheet, View, Image } from "react-native";
import colors from "../../config/colors";
import AppText from "../AppText";
import ListItemSeperator from "./ListItemSeperator";

function ToShipListItem({ item }) {
  return (
    <>
      <View
        style={{
          backgroundColor: colors.white,
          flexDirection: "row",
          paddingHorizontal: 20,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 5,
          }}
        >
          <Image
            style={{
              height: 30,
              width: 30,
              borderRadius: 15,
              borderWidth: 1,
              overflow: "hidden",
              borderColor: colors.black,
              marginRight: 10,
            }}
            source={{ uri: item.store_logo }}
          />
          <AppText style={{ color: colors.muted, fontSize: 15 }}>
            {item.store_name}
          </AppText>
        </View>
        <AppText
          style={{ color: colors.red, fontSize: 15, fontWeight: "bold" }}
        >
          {item.status == 3
            ? "To Ship"
            : item.status == 4
            ? "Shipped"
            : item.status == 5
            ? "Delivered"
            : item.status == 6
            ? "Refunded"
            : "Error"}
        </AppText>
      </View>
      <ListItemSeperator />
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 10,
          backgroundColor: colors.white,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Image
          style={{
            width: 60,
            height: 60,
            resizeMode: "contain",
            backgroundColor: colors.white,
            borderWidth: 1,
            borderColor: colors.black,
            marginRight: 10,
          }}
          source={{ uri: item.image }}
        />
        <View style={{ flex: 1 }}>
          <AppText style={{ fontSize: 15, fontWeight: "bold" }}>
            {item.product_title}
          </AppText>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <AppText style={{ fontSize: 14, color: colors.muted }}>
              {"Quantity:"}
            </AppText>
            <AppText style={{ fontSize: 14, color: colors.muted }}>
              {"x " + item.count}
            </AppText>
          </View>
          {item.groupbuy && (
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <AppText style={{ fontSize: 14, color: colors.muted }}>
                {"Type:"}
              </AppText>
              <AppText style={{ fontSize: 14, color: colors.muted }}>
                {"GroupBuy"}
              </AppText>
            </View>
          )}
        </View>
      </View>
      {item.status == 6 ? (
        <></>
      ) : item.confirmedDeliveryTime ? (
        <>
          <ListItemSeperator />
          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              backgroundColor: colors.white,
              flexDirection: "row",
            }}
          >
            <View
              style={{
                flex: 1,
              }}
            >
              <AppText
                style={{
                  fontSize: 13,
                  color: colors.muted,
                  fontWeight: "bold",
                }}
              >
                {"Delivered Time:"}
              </AppText>
              <AppText style={{ fontSize: 13, color: colors.muted }}>
                {item.confirmedDeliveryTime.toDate().toDateString()}
              </AppText>
            </View>
          </View>
        </>
      ) : (
        <>
          <ListItemSeperator />
          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              backgroundColor: colors.white,
              flexDirection: "row",
            }}
          >
            <View
              style={{
                flex: 1,
              }}
            >
              <AppText
                style={{
                  fontSize: 13,
                  color: colors.muted,
                  fontWeight: "bold",
                }}
              >
                {"Estimated Arrival Time:"}
              </AppText>
              <AppText style={{ fontSize: 13, color: colors.muted }}>
                {item.estimatedDeliveryTime.toDate().toDateString()}
              </AppText>
            </View>
          </View>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  //properties of list
  listItem: {
    margin: 10,
    padding: 10,
    width: "90%",
    flex: 1,
    alignSelf: "center",
    flexDirection: "row",
    borderRadius: 5,
  },
});

export default ToShipListItem;
