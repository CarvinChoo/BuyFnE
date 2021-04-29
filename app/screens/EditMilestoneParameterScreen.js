import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import * as Yup from "yup";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

import {
  AppForm,
  AppSquareFormField,
  SubmitButton,
  Error_Message,
} from "../components/forms";
import Screen from "../components/Screen";
import colors from "../config/colors";
import AppTextInput2 from "../components/AppTextInput2";
import VoucherListItem from "../components/VoucherListItem";
// Back End
import AuthApi from "../api/auth";
import db from "../api/db";
import ListItemSeperator from "../components/lists/ListItemSeperator";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import AppActivityIndicator from "../components/AppActivityIndicator";
import { Switch } from "react-native-gesture-handler";
import AddressListItem from "../components/lists/AddressListItem";
import Icon from "../components/Icon";
const validationSchema = Yup.object().shape({
  milestone1_orders_quota: Yup.number()
    .integer()
    .label("Milestone 1 Orders quota"),
  milestone2_orders_quota: Yup.number()
    .integer()
    .label("Milestone 2 Orders quota"),
  milestone3_orders_quota: Yup.number()
    .integer()
    .label("Milestone 3 Orders quota"),
});

const categories = [
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
  {
    label: "Others",
    value: 9,
    backgroundColor: "blue",
    icon: "devices-other",
    IconType: MaterialIcons,
  },
];

function EditMilestoneParameterScreen({ route }) {
  // const [uploadVisible, setUploadVisible] = useState(false);
  // const [progress, setProgress] = useState(0);
  const listingId = route.params.listingId;
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [error1, setError1] = useState(null);
  const [error2, setError2] = useState(null);
  const [error3, setError3] = useState(null);
  const { currentUser } = useContext(AuthApi.AuthContext);
  const [loading, setLoading] = useState(false);
  const [milestone1, setMilestone1] = useState(false);
  const [milestone2, setMilestone2] = useState(false);
  const [milestone3, setMilestone3] = useState(false);
  const [reward1, setReward1] = useState(null);
  const [reward2, setReward2] = useState(null);
  const [reward3, setReward3] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const [voucherModalVisible1, setVoucherModalVisible1] = useState(false);
  const [voucherModalVisible2, setVoucherModalVisible2] = useState(false);
  const [voucherModalVisible3, setVoucherModalVisible3] = useState(false);
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

  useEffect(() => {
    console.log("Milestone mounted");
    setLoading(true);
    const sub = db
      .collection("all_listings")
      .doc(listingId)
      .onSnapshot(
        (query) => {
          setProduct(query.data());
          setMilestone1(query.data().milestone1);
          setMilestone2(query.data().milestone2);
          setMilestone3(query.data().milestone3);
          if (query.data().milestone1) {
            setReward1(query.data().milestone1_settings.reward);
          }
          if (query.data().milestone2) {
            setReward2(query.data().milestone2_settings.reward);
          }
          if (query.data().milestone3) {
            setReward3(query.data().milestone3_settings.reward);
          }
          setLoading(false);
        },
        (error) => {
          Alert.alert("Error", "Fail to retreive vouchers");
          setLoading(false);
        }
      );
    return () => {
      console.log("Milestone unmounted");
      sub();
    };
  }, []);

  //Function waits for input to POST new listing to server
  const handleSubmit = (milestones) => {
    if (milestone1) {
      if (milestones.milestone1_orders_quota <= product.minimumOrderCount) {
        setError1(
          "Must be greater than minimum group buy order quota (" +
            product.minimumOrderCount +
            ")"
        );
      } else {
        setError1(null);
        // passes minimumOrderCount
        if (milestone2) {
          // if active
          if (
            milestones.milestone2_orders_quota <=
            milestones.milestone1_orders_quota
          ) {
            setError2("Must be greater than Milestone 1 orders quota");
          } else {
            setError2(null);
            if (milestone3) {
              if (
                milestones.milestone3_orders_quota <=
                milestones.milestone2_orders_quota
              ) {
                setError3("Must be greater than Milestone 2 orders quota");
              } else {
                setError3(null);
                if (reward1) {
                  setError1(null);
                  if (reward2) {
                    setError2(null);
                    if (reward3) {
                      setError3(null);
                      updateMilestones3(milestones);
                    } else {
                      setError3("Please pick a reward for this milestone");
                    }
                  } else {
                    setError2("Please pick a reward for this milestone");
                  }
                } else {
                  setError1("Please pick a reward for this milestone");
                }
              }
            } else {
              setError2(null);

              if (reward1) {
                setError1(null);
                if (reward2) {
                  setError2(null);
                  updateMilestones2(milestones);
                } else {
                  setError2("Please pick a reward for this milestone");
                }
              } else {
                setError1("Please pick a reward for this milestone");
              }
            }
          }
        } else {
          setError1(null);

          if (reward1) {
            setError1(null);
            updateMilestones1(milestones);
          } else {
            setError1("Please pick a reward for this milestone");
          }
        }
      }
    } else {
      updateMilestones0(milestones);
    }
  };
  const updateMilestones0 = (milestones) => {
    setLoading(true);
    db.collection("all_listings")
      .doc(product.listingId)
      .update({
        milestone1: false,
        milestone2: false,
        milestone3: false,
        milestone1_settings: null,
        milestone2_settings: null,
        milestone3_settings: null,
      })
      .then(() => {
        Alert.alert("Success", "Group buy milestones updated");
        setLoading(false);
      })
      .catch((error) => {
        console.log(error.message);
        Alert.alert("Error", "Fail to update Group buy milestones");
        setLoading(false);
      });
  };
  const updateMilestones1 = (milestones) => {
    setLoading(true);
    db.collection("all_listings")
      .doc(product.listingId)
      .update({
        milestone1: true,
        milestone2: false,
        milestone3: false,
        milestone1_settings: {
          orders_quota: Number(milestones.milestone1_orders_quota),
          reward: reward1,
        },
        milestone2_settings: null,
        milestone3_settings: null,
      })
      .then(() => {
        Alert.alert("Success", "Group buy milestones updated");
        setLoading(false);
      })
      .catch((error) => {
        console.log(error.message);
        Alert.alert("Error", "Fail to update Group buy milestones");
        setLoading(false);
      });
  };
  const updateMilestones2 = (milestones) => {
    setLoading(true);
    db.collection("all_listings")
      .doc(product.listingId)
      .update({
        milestone1: true,
        milestone2: true,
        milestone3: false,
        milestone1_settings: {
          orders_quota: Number(milestones.milestone1_orders_quota),
          reward: reward1,
        },
        milestone2_settings: {
          orders_quota: Number(milestones.milestone2_orders_quota),
          reward: reward2,
        },
        milestone3_settings: null,
      })
      .then(() => {
        Alert.alert("Success", "Group buy milestones updated");
        setLoading(false);
      })
      .catch((error) => {
        console.log(error.message);
        Alert.alert("Error", "Fail to update Group buy milestones");
        setLoading(false);
      });
  };
  const updateMilestones3 = (milestones) => {
    setLoading(true);
    db.collection("all_listings")
      .doc(product.listingId)
      .update({
        milestone1: true,
        milestone2: true,
        milestone3: true,
        milestone1_settings: {
          orders_quota: Number(milestones.milestone1_orders_quota),
          reward: reward1,
        },
        milestone2_settings: {
          orders_quota: Number(milestones.milestone2_orders_quota),
          reward: reward2,
        },
        milestone3_settings: {
          orders_quota: Number(milestones.milestone3_orders_quota),
          reward: reward3,
        },
      })
      .then(() => {
        Alert.alert("Success", "Group buy milestones updated");
        setLoading(false);
      })
      .catch((error) => {
        console.log(error.message);
        Alert.alert("Error", "Fail to update Group buy milestones");
        setLoading(false);
      });
  };

  const toggleSwitch1 = () => {
    if (milestone1) {
      setMilestone1(false);
      setMilestone2(false);
      setMilestone3(false);
    } else {
      setMilestone1(true);
    }
  };
  const toggleSwitch2 = () => {
    if (milestone1) {
      if (milestone2) {
        setMilestone2(false);
        setMilestone3(false);
      } else {
        setMilestone2(true);
      }
    } else {
      Alert.alert("Milestone 1 Inactive", "You need to activate Milestone 1");
    }
  };
  const toggleSwitch3 = () => {
    if (milestone2) {
      if (milestone3) {
        setMilestone3(false);
      } else {
        setMilestone3(true);
      }
    } else {
      Alert.alert(
        "Milestone 2 Inactive",
        "You need to activate Milestone 1 and 2"
      );
    }
  };

  const selectVoucher = (voucher) => {
    if (voucherModalVisible1) {
      if (reward2) {
        // if milestone 2 is active
        if (reward2.voucher_id == voucher.voucher_id) {
          setReward1(null);
          setError1("This voucher is already applied to another milestone");
          setVoucherModalVisible1(false);
        } else {
          if (reward3) {
            if (reward3.voucher_id == voucher.voucher_id) {
              setReward1(null);
              setError1("This voucher is already applied to another milestone");
              setVoucherModalVisible1(false);
            } else {
              setError1(null);
              setReward1(voucher);
              setVoucherModalVisible1(false);
            }
          } else {
            if (reward3) {
              if (reward3.voucher_id == voucher.voucher_id) {
                setReward1(null);
                setError1(
                  "This voucher is already applied to another milestone"
                );
                setVoucherModalVisible1(false);
              } else {
                setError1(null);
                setReward1(voucher);
                setVoucherModalVisible1(false);
              }
            } else {
              setError1(null);
              setReward1(voucher);
              setVoucherModalVisible1(false);
            }
          }
        }
      } else {
        setError1(null);
        setReward1(voucher);
        setVoucherModalVisible1(false);
      }
    } else if (voucherModalVisible2) {
      if (reward1) {
        if (reward1.voucher_id == voucher.voucher_id) {
          setReward2(null);
          setError2("This voucher is already applied to another milestone");
          setVoucherModalVisible2(false);
        } else {
          if (reward3) {
            if (reward3.voucher_id == voucher.voucher_id) {
              setReward2(null);
              setError2("This voucher is already applied to another milestone");
              setVoucherModalVisible2(false);
            } else {
              setError2(null);
              setReward2(voucher);
              setVoucherModalVisible2(false);
            }
          } else {
            setError2(null);
            setReward2(voucher);
            setVoucherModalVisible2(false);
          }
        }
      } else {
        if (reward3) {
          if (reward3.voucher_id == voucher.voucher_id) {
            setReward2(null);
            setError2("This voucher is already applied to another milestone");
            setVoucherModalVisible2(false);
          } else {
            setError2(null);
            setReward2(voucher);
            setVoucherModalVisible2(false);
          }
        } else {
          setError2(null);
          setReward2(voucher);
          setVoucherModalVisible2(false);
        }
      }
    } else {
      if (reward1) {
        if (reward1.voucher_id == voucher.voucher_id) {
          setReward3(null);
          setError3("This voucher is already applied to another milestone");
          setVoucherModalVisible3(false);
        } else {
          if (reward2.voucher_id == voucher.voucher_id) {
            setReward3(null);
            setError3("This voucher is already applied to another milestone");
            setVoucherModalVisible3(false);
          } else {
            setError3(null);
            setReward3(voucher);
            setVoucherModalVisible3(false);
          }
        }
      } else {
        if (reward2.voucher_id == voucher.voucher_id) {
          setReward3(null);
          setError3("This voucher is already applied to another milestone");
          setVoucherModalVisible3(false);
        } else {
          setError3(null);
          setReward3(voucher);
          setVoucherModalVisible3(false);
        }
      }
    }
  };
  return (
    // making it scrollable so if keyboard cuts into input, it can be scrolled up
    <>
      <AppActivityIndicator visible={loading} />
      <ScrollView>
        <Screen style={styles.container}>
          {/* <UploadScreen
          onDone={() => setUploadVisible(false)}
          progress={progress}
          visible={uploadVisible}
        /> */}
          <View style={{ alignItems: "center", marginBottom: 10 }}>
            <AppText
              style={{
                fontSize: 12,
                color: colors.muted,
              }}
            >
              Toggle off all milestones and save to turn off group buy
              milestones
            </AppText>
            <AppText
              style={{
                fontSize: 12,
                color: colors.darkslategrey,
              }}
            >
              Each customer is considered 1 order.
            </AppText>
          </View>
          {product && (
            <AppForm
              initialValues={{
                milestone1_orders_quota: product.milestone1
                  ? product.milestone1_settings.orders_quota.toString()
                  : "0",
                milestone2_orders_quota: product.milestone2
                  ? product.milestone2_settings.orders_quota.toString()
                  : "0",

                milestone3_orders_quota: product.milestone3
                  ? product.milestone3_settings.orders_quota.toString()
                  : "0",
              }}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
            >
              {/* MILESTONE 1* */}
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",

                    paddingVertical: 5,
                    backgroundColor: colors.darkslategrey,
                    marginVertical: 0,
                  }}
                >
                  <AppText
                    style={{
                      fontWeight: "bold",
                      color: colors.white,
                      marginHorizontal: 15,
                    }}
                  >
                    Group Buy Milestone 1
                  </AppText>
                </View>
                <Switch onValueChange={toggleSwitch1} value={milestone1} />
              </View>
              {milestone1 && (
                <>
                  <View style={{ alignItems: "center" }}>
                    <AppText
                      style={{
                        fontSize: 12,
                        color: colors.muted,
                      }}
                    >
                      Must be greater than minimum group buy orders quota
                    </AppText>
                  </View>
                  <ListItemSeperator />
                  <AppSquareFormField
                    InputType={AppTextInput2}
                    name='milestone1_orders_quota'
                    maxLength={4}
                    keyboardType='number-pad'
                    placeholderTitle='Orders quota'
                    placeholder='No. of orders'
                  />

                  <AddressListItem
                    title='Reward Store Voucher'
                    subTitle={
                      reward1
                        ? reward1.percent
                          ? reward1.percentage_discount + "% OFF"
                          : "$" + reward1.amount_discount + " OFF"
                        : "Select"
                    }
                    IconComponent={
                      <Icon
                        name='ticket-percent'
                        backgroundColor={colors.white}
                        iconColor='black'
                        size={30}
                      />
                    }
                    onPress={() => {
                      setVoucherModalVisible1(true);
                    }}
                  />
                  <ListItemSeperator />
                  <View style={{ marginVertical: 5, paddingHorizontal: 10 }}>
                    <Error_Message error={error1} visible={error1} />
                  </View>
                </>
              )}
              {!milestone1 && <ListItemSeperator />}
              {/* MILESTONE 2* */}
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",

                    paddingVertical: 5,
                    backgroundColor: colors.darkslategrey,
                    marginTop: 10,
                  }}
                >
                  <AppText
                    style={{
                      fontWeight: "bold",
                      color: colors.white,
                      marginHorizontal: 15,
                    }}
                  >
                    Group Buy Milestone 2
                  </AppText>
                </View>
                <Switch onValueChange={toggleSwitch2} value={milestone2} />
              </View>
              {milestone2 && (
                <>
                  <View style={{ alignItems: "center" }}>
                    <AppText
                      style={{
                        fontSize: 12,
                        color: colors.muted,
                      }}
                    >
                      Must be greater than Milestone 1 orders quota
                    </AppText>
                  </View>
                  <ListItemSeperator />
                  <AppSquareFormField
                    InputType={AppTextInput2}
                    name='milestone2_orders_quota'
                    maxLength={4}
                    keyboardType='number-pad'
                    placeholderTitle='Orders quota'
                    placeholder='No. of orders'
                  />

                  <AddressListItem
                    title='Reward Store Voucher'
                    subTitle={
                      reward2
                        ? reward2.percent
                          ? reward2.percentage_discount + "% OFF"
                          : "$" + reward2.amount_discount + " OFF"
                        : "Select"
                    }
                    IconComponent={
                      <Icon
                        name='ticket-percent'
                        backgroundColor={colors.white}
                        iconColor='black'
                        size={30}
                      />
                    }
                    onPress={() => {
                      setVoucherModalVisible2(true);
                    }}
                  />
                  <ListItemSeperator />
                  <View style={{ marginVertical: 5, paddingHorizontal: 10 }}>
                    <Error_Message error={error2} visible={error2} />
                  </View>
                </>
              )}
              {!milestone2 && <ListItemSeperator />}
              {/* MILESTONE 3* */}
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",

                    paddingVertical: 5,
                    backgroundColor: colors.darkslategrey,
                    marginTop: 10,
                  }}
                >
                  <AppText
                    style={{
                      fontWeight: "bold",
                      color: colors.white,
                      marginHorizontal: 15,
                    }}
                  >
                    Group Buy Milestone 3
                  </AppText>
                </View>
                <Switch onValueChange={toggleSwitch3} value={milestone3} />
              </View>
              {milestone3 && (
                <>
                  <View style={{ alignItems: "center" }}>
                    <AppText
                      style={{
                        fontSize: 12,
                        color: colors.muted,
                      }}
                    >
                      Must be greater than Milestone 2 orders quota
                    </AppText>
                  </View>
                  <ListItemSeperator />
                  <AppSquareFormField
                    InputType={AppTextInput2}
                    name='milestone3_orders_quota'
                    maxLength={4}
                    keyboardType='number-pad'
                    placeholderTitle='Orders quota'
                    placeholder='No. of orders'
                  />

                  <AddressListItem
                    title='Reward Store Voucher'
                    subTitle={
                      reward3
                        ? reward3.percent
                          ? reward3.percentage_discount + "% OFF"
                          : "$" + reward3.amount_discount + " OFF"
                        : "Select"
                    }
                    IconComponent={
                      <Icon
                        name='ticket-percent'
                        backgroundColor={colors.white}
                        iconColor='black'
                        size={30}
                      />
                    }
                    onPress={() => {
                      setVoucherModalVisible3(true);
                    }}
                  />
                  <ListItemSeperator />
                  <View style={{ marginVertical: 5, paddingHorizontal: 10 }}>
                    <Error_Message error={error3} visible={error3} />
                  </View>
                </>
              )}
              {!milestone3 && <ListItemSeperator />}
              <View
                style={{
                  marginVertical: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <SubmitButton title='Save Changes' style={{ width: "50%" }} />
              </View>
            </AppForm>
          )}
        </Screen>
      </ScrollView>
      <Modal visible={voucherModalVisible1} animationType='slide'>
        <Screen style={{ paddingTop: 0 }}>
          <Button
            title='Close'
            onPress={() => setVoucherModalVisible1(false)}
          />
          <FlatList
            data={vouchers}
            keyExtractor={(item) => item.voucher_id}
            renderItem={({ item }) => (
              <VoucherListItem
                item={item}
                onPress={() => selectVoucher(item)}
              />
            )}
          />
        </Screen>
      </Modal>
      <Modal visible={voucherModalVisible2} animationType='slide'>
        <Screen style={{ paddingTop: 0 }}>
          <Button
            title='Close'
            onPress={() => setVoucherModalVisible2(false)}
          />
          <FlatList
            data={vouchers}
            keyExtractor={(item) => item.voucher_id}
            renderItem={({ item }) => (
              <VoucherListItem
                item={item}
                onPress={() => selectVoucher(item)}
              />
            )}
          />
        </Screen>
      </Modal>
      <Modal visible={voucherModalVisible3} animationType='slide'>
        <Screen style={{ paddingTop: 0 }}>
          <Button
            title='Close'
            onPress={() => setVoucherModalVisible3(false)}
          />
          <FlatList
            data={vouchers}
            keyExtractor={(item) => item.voucher_id}
            renderItem={({ item }) => (
              <VoucherListItem
                item={item}
                onPress={() => selectVoucher(item)}
              />
            )}
          />
        </Screen>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10, paddingTop: 0 },
  discountContainer: {
    flexDirection: "row",
  },
  discountSymbol: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default EditMilestoneParameterScreen;
