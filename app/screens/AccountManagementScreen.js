import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import AppButton from "../components/AppButton";
import Screen from "../components/Screen";
import AppTextInput from "../components/AppTextInput";
import ListItemSeperator from "../components/lists/ListItemSeperator";
import AppText from "../components/AppText";
import colors from "../config/colors";
import ImageInput from "../components/ImageInput";

function AccountManagementScreen(props) {
  return (
    <ScrollView>
      <Screen style={{ paddingTop: 0 }}>
        {/* Profile Pic */}

        <View
          style={{
            backgroundColor: colors.orange,

            alignItems: "center",
            padding: 15,
          }}
        >
          <ImageInput />
        </View>
        {/* Email */}
        <View
          style={{
            padding: 15,
            flexDirection: "row",

            alignItems: "center",
          }}
        >
          <AppText style={{ fontWeight: "bold", fontSize: 20 }}>Email:</AppText>
          <AppText style={{ fontWeight: "bold", fontSize: 20, marginLeft: 30 }}>
            johndoe@gmail.com
          </AppText>
        </View>
        <ListItemSeperator />
        {/* Display Name */}
        <View
          style={{
            flexDirection: "row",
            padding: 15,
            alignItems: "center",
          }}
        >
          <AppText
            style={{ fontWeight: "bold", fontSize: 20, marginRight: 15 }}
          >
            Display Name:
          </AppText>
          <AppTextInput placeholder='Name' value='John Doe' width='60%' />
        </View>
        <ListItemSeperator />
        {/* Mobile Phone */}
        <View
          style={{
            flexDirection: "row",
            padding: 15,
            alignItems: "center",
          }}
        >
          <AppText
            style={{ fontWeight: "bold", fontSize: 20, marginRight: 15 }}
          >
            Mobile Phone:
          </AppText>

          <AppTextInput
            placeholder='Mobile Phone'
            value='91234567'
            width='35%'
          />
        </View>
        <ListItemSeperator />

        {/* Address */}
        <View
          style={{
            flexDirection: "row",
            padding: 15,
            alignItems: "center",
          }}
        >
          <AppText
            style={{ fontWeight: "bold", fontSize: 20, marginRight: 15 }}
          >
            Address:
          </AppText>

          <AppTextInput placeholder='Component to be replaced' width='70%' />
        </View>
        <ListItemSeperator />

        {/* Payment Info */}
        <View
          style={{
            flexDirection: "row",
            padding: 15,
            alignItems: "center",
          }}
        >
          <AppText
            style={{ fontWeight: "bold", fontSize: 20, marginRight: 15 }}
          >
            Payment Info:
          </AppText>

          <AppTextInput placeholder='Component to be replaced' width='60%' />
        </View>
        <ListItemSeperator />

        <View style={{ alignItems: "center" }}>
          <AppButton
            title='Save Changes'
            icon='content-save'
            color='cyan'
            style={{ width: "50%", marginTop: 10 }}
          />
          <AppButton
            title='Change Password'
            icon='onepassword'
            style={{ width: "70%", marginTop: 10 }}
          />

          <AppButton
            title='Change Email'
            icon='email-outline'
            style={{ width: "70%", marginTop: 10, marginBottom: 20 }}
          />
        </View>
      </Screen>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});

export default AccountManagementScreen;
