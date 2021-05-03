import React from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { List, Colors } from "react-native-paper";
import Icon from "../components/Icon";
import Screen from "../components/Screen";
import colors from "../config/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ListItemSeperator from "../components/lists/ListItemSeperator";
const FaqScreen = () => {
  const [expanded, setExpanded] = React.useState(true);

  return (
    <ScrollView style={styles.container}>
      <Screen style={{ paddingBottom: 50, paddingTop: 5 }}>
        <View
          style={{
            backgroundColor: colors.white,
            padding: 10,
            alignItems: "center",

            borderTopWidth: 2,
            borderBottomWidth: 2,
          }}
        >
          <Text
            style={{ fontSize: 20, color: colors.muted, fontWeight: "bold" }}
          >
            Shopper Questions
          </Text>
        </View>
        <List.Section>
          <List.Accordion
            style={{
              borderWidth: 0.5,
              borderColor: colors.muted,
              backgroundColor: colors.white,
              borderRadius: 5,
            }}
            titleStyle={{
              color: "#242020",
              fontWeight: "bold",
              fontSize: 15,
            }}
            titleNumberOfLines={10}
            title='Will I be able to make a purchase as a guest?'
          >
            <List.Item
              style={{ backgroundColor: "#DCDADA" }}
              titleStyle={{
                color: colors.darkgray,
                fontWeight: "bold",
                fontSize: 14,
              }}
              titleNumberOfLines={10}
              title='No. You would not be able to make a purchase as a guest. Sign up with us only needs a few simple steps.'
            />
          </List.Accordion>

          <List.Accordion
            style={{
              borderWidth: 0.5,
              borderColor: colors.muted,
              backgroundColor: colors.white,
              borderRadius: 5,
            }}
            titleStyle={{
              color: "#242020",
              fontWeight: "bold",
              fontSize: 15,
            }}
            titleNumberOfLines={10}
            title="I can't click on any of the functions. Is it an error?"
          >
            <List.Item
              style={{ backgroundColor: "#DCDADA" }}
              titleStyle={{
                color: colors.darkgray,
                fontWeight: "bold",
                fontSize: 14,
              }}
              titleNumberOfLines={10}
              title='No. Guests are limited to only viewing the listing available. It would be better to sign up and account with use to enjoy all the great discounts and deals.'
            />
          </List.Accordion>

          <List.Accordion
            style={{
              borderWidth: 0.5,
              borderColor: colors.muted,
              backgroundColor: colors.white,
              borderRadius: 5,
            }}
            titleStyle={{
              color: "#242020",
              fontWeight: "bold",
              fontSize: 15,
            }}
            titleNumberOfLines={10}
            title='Where can I register for an account?'
          >
            <List.Item
              style={{ backgroundColor: "#DCDADA" }}
              titleStyle={{
                color: colors.darkgray,
                fontWeight: "bold",
                fontSize: 14,
              }}
              titleNumberOfLines={10}
              title='You can access the register page along with the login page on the top right hand corner of the Homepage.'
            />
          </List.Accordion>

          <List.Accordion
            style={{
              borderWidth: 0.5,
              borderColor: colors.muted,
              backgroundColor: colors.white,
              borderRadius: 5,
            }}
            titleStyle={{
              color: "#242020",
              fontWeight: "bold",
              fontSize: 15,
            }}
            titleNumberOfLines={10}
            title='Can I register for a merchant?'
          >
            <List.Item
              style={{ backgroundColor: "#DCDADA" }}
              titleStyle={{
                color: colors.darkgray,
                fontWeight: "bold",
                fontSize: 14,
              }}
              titleNumberOfLines={10}
              title='Yes. Any registered BuyFnE members can choose to sign up to be a BuyFnE merchant via the Account page.'
            />
          </List.Accordion>

          <List.Accordion
            style={{
              borderWidth: 0.5,
              borderColor: colors.muted,
              backgroundColor: colors.white,
              borderRadius: 5,
            }}
            titleStyle={{
              color: "#242020",
              fontWeight: "bold",
              fontSize: 15,
            }}
            titleNumberOfLines={10}
            title='Can I leave a group buy after I joined one?'
          >
            <List.Item
              style={{ backgroundColor: "#DCDADA" }}
              titleStyle={{
                color: colors.darkgray,
                fontWeight: "bold",
                fontSize: 14,
              }}
              titleNumberOfLines={10}
              title='No. Creating or joining a group buy finalizes the purchase unless the group buy fails in that case refunds will be issued automatically.'
            />
          </List.Accordion>
          <List.Accordion
            style={{
              borderWidth: 0.5,
              borderColor: colors.muted,
              backgroundColor: colors.white,
              borderRadius: 5,
            }}
            titleStyle={{
              color: "#242020",
              fontWeight: "bold",
              fontSize: 15,
            }}
            titleNumberOfLines={10}
            title='Can I get a refund for a cancelled order?'
          >
            <List.Item
              style={{ backgroundColor: "#DCDADA" }}
              titleStyle={{
                color: colors.darkgray,
                fontWeight: "bold",
                fontSize: 14,
              }}
              titleNumberOfLines={10}
              title='Yes. There is a 3 hours grace period after purchasing or if the item has not been shipped out by our merchants where shoppers may request for a refund. Refunds are automatically credited back into the respective payment option used to make the purchase.'
            />
          </List.Accordion>
          <List.Accordion
            style={{
              borderWidth: 0.5,
              borderColor: colors.muted,
              backgroundColor: colors.white,
              borderRadius: 5,
            }}
            titleStyle={{
              color: "#242020",
              fontWeight: "bold",
              fontSize: 15,
            }}
            titleNumberOfLines={10}
            title='Would I be able to change my personal/account details after registration?'
          >
            <List.Item
              style={{ backgroundColor: "#DCDADA" }}
              titleStyle={{
                color: colors.darkgray,
                fontWeight: "bold",
                fontSize: 14,
              }}
              titleNumberOfLines={10}
              title='Yes. After clicking on the account tab on the bottom right of the screen, next click on your display name and you will be brought to the account management page where you can change your personal/account details.'
            />
          </List.Accordion>
          <List.Accordion
            style={{
              borderWidth: 0.5,
              borderColor: colors.muted,
              backgroundColor: colors.white,
              borderRadius: 5,
            }}
            titleStyle={{
              color: "#242020",
              fontWeight: "bold",
              fontSize: 15,
            }}
            titleNumberOfLines={10}
            title='What do the different statuses for group buy means?'
          >
            <List.Item
              style={{ backgroundColor: "#DCDADA" }}
              titleStyle={{
                color: colors.darkgray,
                fontWeight: "bold",
                fontSize: 14,
              }}
              titleNumberOfLines={20}
              title={
                "INACTIVE - \nThe group buy has not been initiated\n\nONGOING - \nThere is at least 1 shopper in the participating in the groupbuy and the timer has not ended.\n\nAWAITING SELLER CONFIRMATION -\nThe groupbuy successfully reached its minimum order goal and has reached end of the timer\n\nUNSUCCESSFUL -\nThe minimum order goal was not reached by the end of the timer."
              }
            />
          </List.Accordion>
        </List.Section>

        <View
          style={{
            backgroundColor: colors.white,
            padding: 10,
            alignItems: "center",

            borderTopWidth: 2,
            borderBottomWidth: 2,
          }}
        >
          <Text
            style={{ fontSize: 20, color: colors.muted, fontWeight: "bold" }}
          >
            Merchant Questions
          </Text>
        </View>
        <List.Section>
          <List.Accordion
            style={{
              borderWidth: 0.5,
              borderColor: colors.muted,
              backgroundColor: colors.white,
              borderRadius: 5,
            }}
            titleStyle={{
              color: "#242020",
              fontWeight: "bold",
              fontSize: 15,
            }}
            titleNumberOfLines={10}
            title='How do I add a product that I want to sell on this platform?'
          >
            <List.Item
              style={{ backgroundColor: "#DCDADA" }}
              titleStyle={{
                color: colors.darkgray,
                fontWeight: "bold",
                fontSize: 14,
              }}
              titleNumberOfLines={10}
              title='After logging in and switching as a merchant through the account page, click the plus icon located at the bottom center of the screen and fill all required fields needed to add an item.'
            />
          </List.Accordion>
          <List.Accordion
            style={{
              borderWidth: 0.5,
              borderColor: colors.muted,
              backgroundColor: colors.white,
              borderRadius: 5,
            }}
            titleStyle={{
              color: "#242020",
              fontWeight: "bold",
              fontSize: 15,
            }}
            titleNumberOfLines={10}
            title='If I have an issue with my operations and I need some time to fulfil the order what can i do?'
          >
            <List.Item
              style={{ backgroundColor: "#DCDADA" }}
              titleStyle={{
                color: colors.darkgray,
                fontWeight: "bold",
                fontSize: 14,
              }}
              titleNumberOfLines={10}
              title='Our application allows for pausing of listings which removes the listing from public view while retaining its information and its statistics for reactivation.'
            />
          </List.Accordion>
          <List.Accordion
            style={{
              borderWidth: 0.5,
              borderColor: colors.muted,
              backgroundColor: colors.white,
              borderRadius: 5,
            }}
            titleStyle={{
              color: "#242020",
              fontWeight: "bold",
              fontSize: 15,
            }}
            titleNumberOfLines={10}
            title='What are the allowed range for the group buy time limit?'
          >
            <List.Item
              style={{ backgroundColor: "#DCDADA" }}
              titleStyle={{
                color: colors.darkgray,
                fontWeight: "bold",
                fontSize: 14,
              }}
              titleNumberOfLines={10}
              title={
                "Minimum limit  - 1 hour\nMaximum limit - 60 days, 23 hours and 59 minutes"
              }
            />
          </List.Accordion>
          <List.Accordion
            style={{
              borderWidth: 0.5,
              borderColor: colors.muted,
              backgroundColor: colors.white,
              borderRadius: 5,
            }}
            titleStyle={{
              color: "#242020",
              fontWeight: "bold",
              fontSize: 15,
            }}
            titleNumberOfLines={10}
            title='Is it compulsory to create the group buy settings?'
          >
            <List.Item
              style={{ backgroundColor: "#DCDADA" }}
              titleStyle={{
                color: colors.darkgray,
                fontWeight: "bold",
                fontSize: 14,
              }}
              titleNumberOfLines={10}
              title='Yes, group buy settings are compulsory when creating a new listing.'
            />
          </List.Accordion>
          <List.Accordion
            style={{
              borderWidth: 0.5,
              borderColor: colors.muted,
              backgroundColor: colors.white,
              borderRadius: 5,
            }}
            titleStyle={{
              color: "#242020",
              fontWeight: "bold",
              fontSize: 15,
            }}
            titleNumberOfLines={10}
            title='Can I add an order that I would like to purchase into the shopping cart using a merchant account?'
          >
            <List.Item
              style={{ backgroundColor: "#DCDADA" }}
              titleStyle={{
                color: colors.darkgray,
                fontWeight: "bold",
                fontSize: 14,
              }}
              titleNumberOfLines={10}
              title='No, purchasing functionality is only available to shoppers but you can switch back to be a shopper through the account page and return to being a merchant using the same method once you are done.'
            />
          </List.Accordion>
        </List.Section>
      </Screen>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.whitegrey,
  },
});

export default FaqScreen;
