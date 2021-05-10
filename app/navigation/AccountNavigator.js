import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import AccountScreen from "../screens/AccountScreen";
import MessagesScreen from "../screens/MessagesScreen";
import ChatMessagesScreen from "../screens/ChatMessagesScreen";
import ChatScreen from "../screens/ChatScreen";
import MessagesInProgressScreen from "../screens/MessagesInProgressScreen";
import TicketScreen from "../screens/TicketScreen";
import ViewVouchersScreen from "../screens/ViewVouchersScreen";
import ViewMerchantVouchersScreen from "../screens/ViewMerchantVouchersScreen";
import ViewAdminVouchersScreen from "../screens/ViewAdminVouchersScreen";
import CreateAdminVoucherScreen from "../screens/CreateAdminVoucherScreen";
import CreateMerchantVoucherScreen from "../screens/CreateMerchantVoucherScreen";
import ListingsHistoryScreen from "../screens/ListingsHistoryScreen";
import EditListingParameterScreen from "../screens/EditListingParameterScreen";
import EditMilestoneParameterScreen from "../screens/EditMilestoneParameterScreen";
import AccountManagementScreen from "../screens/AccountManagementScreen";
import OrderHistoryNavigator from "../navigation/OrderHistoryNavigator";
import MerchantOrdersNavigator from "../navigation/MerchantOrdersNavigator";
import PersonalGroupBuysScreen from "../screens/PersonalGroupBuysScreen";
import WatchlistScreen from "../screens/WatchlistScreen";
import ListingDetailsScreen from "../screens/ListingDetailsScreen";
import ReviewsScreen from "../screens/ReviewsScreen";
import MerchantRegisterScreen from "../screens/MerchantRegisterScreen";
import CardDetailsScreen from "../screens/CardDetailsScreen";
import LoyaltyProgramScreen from "../screens/LoyaltyProgramScreen";
import ShippingAddressesScreen from "../screens/ShippingAddressesScreen";
import FaqScreen from "../screens/FaqScreen";
import ReceiptScreen from "../screens/ReceiptScreen";
import GroupBuyCheckoutScreen from "../screens/GroupBuyCheckoutScreen";
import GroupBuyOrderConfirmedScreen from "../screens/GroupBuyOrderConfirmedScreen";
import SuspendUsersScreen from "../screens/SuspendUsersScreen";
import routes from "./routes";
const Stack = createStackNavigator();

// Stack navigator between AccountScreen and MessagesScreen
const AccountNavigator = () => (
  <Stack.Navigator
    mode='card'
    screenOptions={{
      headerTitleAlign: "center",
      headerBackTitleVisible: false,
    }}
  >
    <Stack.Screen name={routes.ACCOUNT} component={AccountScreen} />
    {/* Add Stack Screen for Profile
    Add Stack Screen for myListings
    Add Stack Screen for Order History */}
    <Stack.Screen
      name={routes.MERCHANTREGISTER}
      component={MerchantRegisterScreen}
    />
    {/* GroupBuys Section */}
    <Stack.Screen
      name={routes.MYGROUPBUYS}
      component={PersonalGroupBuysScreen}
    />
    <Stack.Screen
      name={routes.LISTING_DETAILS}
      component={ListingDetailsScreen}
      options={{ headerTitle: false }}
    />
    <Stack.Screen
      name={routes.REVIEWS}
      component={ReviewsScreen}
      options={{ backHeaderTitle: false }}
    />
    {/* GroupBuys Section End*/}
    {/* Watchlist Section */}
    <Stack.Screen name={routes.RECEIPT} component={ReceiptScreen} />
    {/* Buyer Order section */}
    <Stack.Screen
      name={routes.ORDERHISTORY}
      component={OrderHistoryNavigator}
    />
    <Stack.Screen name={routes.WATCHLIST} component={WatchlistScreen} />
    <Stack.Screen
      name={routes.GBCHECKOUT}
      component={GroupBuyCheckoutScreen}
      options={{ headerBackTitleVisible: false }}
    />
    <Stack.Screen
      name={routes.GBORDERCONFIRMED}
      component={GroupBuyOrderConfirmedScreen}
      options={{ headerShown: false }}
    />
    {/* Voucher Section */}
    <Stack.Screen
      name={routes.VIEWMERVOUCHER}
      component={ViewMerchantVouchersScreen}
    />
    <Stack.Screen
      name={routes.PLATFORMVOUCHERS}
      component={ViewAdminVouchersScreen}
    />
    <Stack.Screen
      name={routes.CREATEPLATFORMVOUCHERS}
      component={CreateAdminVoucherScreen}
    />
    <Stack.Screen name={routes.VIEWVOUCHER} component={ViewVouchersScreen} />
    <Stack.Screen
      name={routes.CREATEMERVOUCHER}
      component={CreateMerchantVoucherScreen}
    />
    {/* Listing History and Merchant Orders section */}
    <Stack.Screen
      name={routes.LISTINGSHISTORY}
      component={ListingsHistoryScreen}
    />
    <Stack.Screen
      name={routes.MerchantOrdersNav}
      component={MerchantOrdersNavigator}
      options={{
        headerStyle: {
          height: 50,
        },
      }}
    />
    <Stack.Screen
      name={routes.EDITLISTING}
      component={EditListingParameterScreen}
    />
    <Stack.Screen
      name={routes.EDITMILESTONE}
      component={EditMilestoneParameterScreen}
    />
    {/* Account Management Section */}
    <Stack.Screen
      name={routes.ACCOUNTMANAGEMENT}
      component={AccountManagementScreen}
    />
    <Stack.Screen name={routes.PAYMENTDETAILS} component={CardDetailsScreen} />
    <Stack.Screen
      name={routes.SHIPPINGADDRESSES}
      component={ShippingAddressesScreen}
    />

    {/* Account Management Section End */}
    <Stack.Screen name={routes.LOYALTY} component={LoyaltyProgramScreen} />
    {/* Add Stack Screen for FAQ */}
    <Stack.Screen name={routes.FAQ} component={FaqScreen} />
    {/* Messages section */}
    <Stack.Screen name={routes.MESSAGES} component={MessagesScreen} />
    <Stack.Screen name={routes.PENDINGMESSAGES} component={MessagesScreen} />
    <Stack.Screen
      name={routes.MESSAGESINPROGRESS}
      component={MessagesInProgressScreen}
    />
    <Stack.Screen name={routes.CHAT} component={ChatMessagesScreen} />
    <Stack.Screen name={routes.CHATROOM} component={ChatScreen} />
    <Stack.Screen name={routes.SUPPORTTICKET} component={TicketScreen} />
    <Stack.Screen name={routes.SUSPEND} component={SuspendUsersScreen} />
  </Stack.Navigator>
);

export default AccountNavigator;
