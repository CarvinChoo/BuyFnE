import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Modal } from "react-native";

import Screen from "../components/Screen";
import colors from "../config/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppText from "../components/AppText";
import * as Progress from "expo-progress";
import color from "color";
import ListItemSeperator from "../components/lists/ListItemSeperator";

// BackEnd
import AuthApi from "../api/auth";
function LoyaltyProgramScreen(props) {
  const [loyaltyThreshold1, setLoyaltyThreshold1] = useState(150);
  const [loyaltyThreshold2, setLoyaltyThreshold2] = useState(500);
  const [loyaltyThreshold3, setLoyaltyThreshold3] = useState(1000);
  const [currentThreshold, setCurrentThreshold] = useState(150);
  const [previousThreshold, setPreviousThreshold] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [right, setRight] = useState(false);
  const { currentUser } = useContext(AuthApi.AuthContext);
  useEffect(() => {
    if (currentUser.loyalty_accumulative >= 1000) {
      setCurrentThreshold(1000);
      setPreviousThreshold(500);
      setProgress(currentUser.loyalty_accumulative / 1000);
    } else if (currentUser.loyalty_accumulative >= 500) {
      setCurrentThreshold(1000);
      setPreviousThreshold(500);
      setProgress(currentUser.loyalty_accumulative / 1000);
    } else if (currentUser.loyalty_accumulative >= 150) {
      setCurrentThreshold(500);
      setPreviousThreshold(150);
      setProgress(currentUser.loyalty_accumulative / 500);
    } else {
      setCurrentThreshold(150);
      setPreviousThreshold(0);
      setProgress(currentUser.loyalty_accumulative / 150);
    }
  }, [currentUser]);
  return (
    <>
      <Screen style={styles.container}>
        <View>
          <View
            style={{
              marginLeft: 10,
              marginBottom: 5,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialCommunityIcons
              size={30}
              name='medal-outline'
              style={{ marginRight: 5 }}
            />
            <AppText style={{ color: colors.darkgray, fontWeight: "bold" }}>
              Group Buy Loyalty Program
            </AppText>
          </View>
          <View
            style={{
              backgroundColor: colors.white,
              padding: 20,
              borderRadius: 15,
              alignItems: "center",
            }}
          >
            <View style={{ flexDirection: "row", marginBottom: 10 }}>
              <AppText style={{ fontWeight: "bold" }}>
                You are currently in
              </AppText>
              <AppText
                style={{
                  color:
                    currentThreshold == loyaltyThreshold1
                      ? colors.sienna
                      : currentThreshold == loyaltyThreshold2
                      ? colors.grey
                      : progress < 1
                      ? colors.darkkhaki
                      : colors.lsblue,

                  fontWeight: "bold",
                }}
              >
                {currentThreshold == loyaltyThreshold1
                  ? " Bronze "
                  : currentThreshold == loyaltyThreshold2
                  ? " Silver "
                  : progress < 1
                  ? " Gold "
                  : " Platinum "}
              </AppText>
              <AppText style={{ fontWeight: "bold" }}>tier</AppText>
            </View>
            <AppText
              style={{
                fontWeight: "bold",
                marginBottom: 10,
                fontSize: 13,
                color: colors.muted,
              }}
            >
              Resets on{" "}
              {currentUser.loyalty_interval_end.toDate().toDateString()}
            </AppText>
            <View
              style={{
                justifyContent: "flex-start",
                width: "100%",
                marginBottom: 5,
              }}
            >
              <AppText style={{ fontWeight: "bold", fontSize: 15 }}>
                Current tier:
              </AppText>
            </View>
            <View
              style={{
                borderWidth: 2,
                padding: 10,
                borderRadius: 5,
                marginBottom: 20,
                backgroundColor: colors.white,
                width: "100%",
              }}
            >
              <AppText
                style={{
                  color:
                    currentThreshold == loyaltyThreshold1
                      ? colors.sienna
                      : currentThreshold == loyaltyThreshold2
                      ? colors.grey
                      : progress < 1
                      ? colors.darkkhaki
                      : colors.lsblue,
                  fontWeight: "bold",
                  fontSize: 15,
                }}
              >
                {currentThreshold == loyaltyThreshold1
                  ? "No Reward"
                  : currentThreshold == loyaltyThreshold2
                  ? "Reward: 3% OFF ALL GROUPBUYS"
                  : progress < 1
                  ? "Reward: 5% OFF ALL GROUPBUYS"
                  : "Reward: 7% OFF ALL GROUPBUYS"}
              </AppText>
            </View>
            {progress < 1 && (
              <>
                <View
                  style={{
                    justifyContent: "flex-start",
                    width: "100%",
                    marginBottom: 5,
                  }}
                >
                  <AppText style={{ fontWeight: "bold", fontSize: 15 }}>
                    Next tier:
                  </AppText>
                </View>

                <View
                  style={{
                    borderWidth: 2,
                    padding: 10,
                    borderRadius: 5,
                    marginBottom: 20,
                    backgroundColor: colors.white,
                    width: "100%",
                  }}
                >
                  <AppText
                    style={{
                      color:
                        currentThreshold == loyaltyThreshold1
                          ? colors.grey
                          : currentThreshold == loyaltyThreshold2
                          ? colors.darkkhaki
                          : progress < 1 && colors.lsblue,

                      fontWeight: "bold",
                      fontSize: 15,
                    }}
                  >
                    {currentThreshold == loyaltyThreshold1
                      ? "Reward: 3% OFF ALL GROUPBUYS"
                      : currentThreshold == loyaltyThreshold2
                      ? "Reward: 5% OFF ALL GROUPBUYS"
                      : progress < 1 && "Reward: 7% OFF ALL GROUPBUYS"}
                  </AppText>
                </View>
              </>
            )}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                marginBottom: 5,
              }}
            >
              <AppText
                style={{
                  color: colors.muted,
                  fontSize: 15,
                  fontWeight: "bold",
                }}
              >
                ${previousThreshold.toFixed(2)}
              </AppText>
              <AppText
                style={{
                  color: colors.muted,
                  fontSize: 15,
                  fontWeight: "bold",
                }}
              >
                ${currentThreshold.toFixed(2)}
              </AppText>
            </View>
            <Progress.Bar
              progress={progress}
              height={15}
              color={colors.firebrick}
              trackColor={colors.whitegrey}
              borderRadius={5}
              style={{ borderColor: colors.black }}
              isAnimated={true}
            />
            <AppText
              style={{
                color: colors.muted,
                fontSize: 15,
                fontWeight: "bold",
                marginTop: 5,
                marginBottom: 10,
              }}
            >
              {currentUser.loyalty_accumulative > currentThreshold
                ? "You've reached the final tier."
                : "$" +
                  (currentThreshold - currentUser.loyalty_accumulative).toFixed(
                    2
                  ) +
                  " more to go!"}
            </AppText>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() => {
                setModalVisible(true);
              }}
            >
              <AppText
                style={{
                  color: colors.black,
                  fontSize: 15,
                  fontWeight: "bold",
                }}
              >
                More on the loyalty program
              </AppText>
              <MaterialCommunityIcons size={15} name='chevron-double-right' />
            </TouchableOpacity>
          </View>

          <AppText
            style={{
              fontSize: 13,
              color: colors.muted,
              paddingHorizontal: 10,
              marginTop: 10,
              marginBottom: 5,
            }}
          >
            Spend more by group buying items in order to move up to the next
            tier.
          </AppText>
          <AppText
            style={{ fontSize: 13, color: colors.muted, paddingHorizontal: 10 }}
          >
            The loyalty program refreshes every 3 months.
          </AppText>
        </View>
        <Modal transparent={true} visible={modalVisible}>
          <View style={styles.modal}>
            <View style={styles.modalBoxContainer}>
              <View
                style={{
                  height: 25,
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "flex-end",
                  paddingRight: 5,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                  }}
                >
                  <MaterialCommunityIcons
                    size={25}
                    name='close'
                    color={colors.muted}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={{ width: "50%", alignItems: "center" }}
                  onPress={() => {
                    setRight(false);
                  }}
                >
                  <AppText
                    style={{
                      marginBottom: 5,
                      fontWeight: "bold",
                      color: !right ? colors.black : colors.muted,
                    }}
                  >
                    Rewards
                  </AppText>
                  <View
                    style={{
                      borderColor: !right ? colors.brightred : colors.muted,
                      borderWidth: 1,
                      width: "100%",
                    }}
                    onPress={() => set}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ width: "50%", alignItems: "center" }}
                  onPress={() => {
                    setRight(true);
                  }}
                >
                  <AppText
                    style={{
                      marginBottom: 5,
                      fontWeight: "bold",
                      color: right ? colors.black : colors.muted,
                    }}
                  >
                    About Each Tier
                  </AppText>
                  <View
                    style={{
                      borderColor: right ? colors.brightred : colors.muted,
                      borderWidth: 1,
                      width: "100%",
                    }}
                  />
                </TouchableOpacity>
              </View>
              {!right && (
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 10,
                    }}
                  >
                    <View
                      style={{
                        width: "40%",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <MaterialCommunityIcons
                        name='medal'
                        size={30}
                        color={colors.lsblue}
                      />
                      <AppText
                        style={{
                          color: colors.lsblue,
                          fontSize: 15,
                          fontWeight: "bold",
                        }}
                      >
                        Platinum
                      </AppText>
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <MaterialCommunityIcons
                        name='checkbox-blank-circle'
                        size={5}
                        color={colors.black}
                        style={{ marginRight: 10 }}
                      />
                      <AppText style={{ color: colors.muted, fontSize: 15 }}>
                        7% Off All Group Buys
                      </AppText>
                    </View>
                  </View>
                  <ListItemSeperator />
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 10,
                    }}
                  >
                    <View
                      style={{
                        width: "40%",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <MaterialCommunityIcons
                        name='medal'
                        size={30}
                        color={colors.darkkhaki}
                      />
                      <AppText
                        style={{
                          color: colors.darkkhaki,
                          fontSize: 15,
                          fontWeight: "bold",
                        }}
                      >
                        Gold
                      </AppText>
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <MaterialCommunityIcons
                        name='checkbox-blank-circle'
                        size={5}
                        color={colors.black}
                        style={{ marginRight: 10 }}
                      />
                      <AppText style={{ color: colors.muted, fontSize: 15 }}>
                        5% Off All Group Buys
                      </AppText>
                    </View>
                  </View>
                  <ListItemSeperator />
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 10,
                    }}
                  >
                    <View
                      style={{
                        width: "40%",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <MaterialCommunityIcons
                        name='medal'
                        size={30}
                        color={colors.grey}
                      />
                      <AppText
                        style={{
                          color: colors.grey,
                          fontSize: 15,
                          fontWeight: "bold",
                        }}
                      >
                        Silver
                      </AppText>
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <MaterialCommunityIcons
                        name='checkbox-blank-circle'
                        size={5}
                        color={colors.black}
                        style={{ marginRight: 10 }}
                      />
                      <AppText style={{ color: colors.muted, fontSize: 15 }}>
                        5% Off All Group Buys
                      </AppText>
                    </View>
                  </View>
                  <ListItemSeperator />
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 10,
                    }}
                  >
                    <View
                      style={{
                        width: "40%",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <MaterialCommunityIcons
                        name='medal'
                        size={30}
                        color={colors.sienna}
                      />
                      <AppText
                        style={{
                          color: colors.sienna,
                          fontSize: 15,
                          fontWeight: "bold",
                        }}
                      >
                        Bronze
                      </AppText>
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <MaterialCommunityIcons
                        name='checkbox-blank-circle'
                        size={5}
                        color={colors.black}
                        style={{ marginRight: 10 }}
                      />
                      <AppText style={{ color: colors.muted, fontSize: 15 }}>
                        No Rewards
                      </AppText>
                    </View>
                  </View>
                </View>
              )}
              {right && (
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 10,
                    }}
                  >
                    <View
                      style={{
                        width: "40%",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <MaterialCommunityIcons
                        name='medal'
                        size={30}
                        color={colors.lsblue}
                      />
                      <AppText
                        style={{
                          color: colors.lsblue,
                          fontSize: 15,
                          fontWeight: "bold",
                        }}
                      >
                        Platinum
                      </AppText>
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <MaterialCommunityIcons
                        name='checkbox-blank-circle'
                        size={5}
                        color={colors.black}
                        style={{ marginRight: 10 }}
                      />
                      <AppText
                        style={{
                          color: colors.muted,
                          fontSize: 15,
                          width: "70%",
                        }}
                      >
                        Spend minimum of $1000 by group buying
                      </AppText>
                    </View>
                  </View>
                  <ListItemSeperator />
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 10,
                    }}
                  >
                    <View
                      style={{
                        width: "40%",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <MaterialCommunityIcons
                        name='medal'
                        size={30}
                        color={colors.darkkhaki}
                      />
                      <AppText
                        style={{
                          color: colors.darkkhaki,
                          fontSize: 15,
                          fontWeight: "bold",
                        }}
                      >
                        Gold
                      </AppText>
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <MaterialCommunityIcons
                        name='checkbox-blank-circle'
                        size={5}
                        color={colors.black}
                        style={{ marginRight: 10 }}
                      />
                      <AppText
                        style={{
                          color: colors.muted,
                          fontSize: 15,
                          width: "70%",
                        }}
                      >
                        Spend minimum of $500 by group buying
                      </AppText>
                    </View>
                  </View>
                  <ListItemSeperator />
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 10,
                    }}
                  >
                    <View
                      style={{
                        width: "40%",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <MaterialCommunityIcons
                        name='medal'
                        size={30}
                        color={colors.grey}
                      />
                      <AppText
                        style={{
                          color: colors.grey,
                          fontSize: 15,
                          fontWeight: "bold",
                        }}
                      >
                        Silver
                      </AppText>
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <MaterialCommunityIcons
                        name='checkbox-blank-circle'
                        size={5}
                        color={colors.black}
                        style={{ marginRight: 10 }}
                      />
                      <AppText
                        style={{
                          color: colors.muted,
                          fontSize: 15,
                          width: "70%",
                        }}
                      >
                        Spend minimum of $150 by group buying
                      </AppText>
                    </View>
                  </View>
                  <ListItemSeperator />
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 10,
                    }}
                  >
                    <View
                      style={{
                        width: "40%",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <MaterialCommunityIcons
                        name='medal'
                        size={30}
                        color={colors.sienna}
                      />
                      <AppText
                        style={{
                          color: colors.sienna,
                          fontSize: 15,
                          fontWeight: "bold",
                        }}
                      >
                        Bronze
                      </AppText>
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <MaterialCommunityIcons
                        name='checkbox-blank-circle'
                        size={5}
                        color={colors.black}
                        style={{ marginRight: 10 }}
                      />
                      <AppText
                        style={{
                          color: colors.muted,
                          fontSize: 15,
                          width: "70%",
                        }}
                      >
                        Spend minimum of $0 by group buying
                      </AppText>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>
        </Modal>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.whitegrey, paddingHorizontal: 20 },

  modal: {
    backgroundColor: "#000000aa",
    flex: 1,
  },
  modalBoxContainer: {
    backgroundColor: colors.white,
    marginHorizontal: 30,
    marginTop: 100,
    borderRadius: 5,
  },
});

export default LoyaltyProgramScreen;
