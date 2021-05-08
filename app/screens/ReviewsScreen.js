import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import Screen from "../components/Screen";
import colors from "../config/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import color from "color";
import AppActivityIndicator from "../components/AppActivityIndicator";
function ReviewsScreen({ route }) {
  const listingId = route.params.listingId;
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // To set the max number of Stars
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
  useEffect(() => {
    setLoading(true);
    db.collection("reviews")
      .where("listingId", "==", listingId)
      .orderBy("date", "desc")
      .get()
      .then((reviews) => {
        if (!reviews.empty) {
          var tempReviews = [];
          reviews.forEach((review) => {
            tempReviews.push(review.data());
          });
          setReviews(tempReviews);
          setLoading(false);
        } else {
          console.log("No Reviews");
          setReviews([]);
          setLoading(false);
        }
      })
      .catch((e) => {
        setReviews([]);
        console.log(e.message);
        Alert.alert("Error", "Failed to retrieve reviews.");
        setLoading(false);
      });
  }, []);

  const renderFooter = () => {
    return <View style={{ backgroundColor: colors.whitegrey, height: 100 }} />;
  };
  return (
    <Screen style={styles.container}>
      <AppActivityIndicator visible={loading} />
      {reviews.length > 0 ? (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.review_id}
          ListFooterComponent={renderFooter}
          renderItem={({ item }) => (
            <View
              style={{
                padding: 12,
                borderTopWidth: 0.2,
                borderBottomWidth: 0.5,
                borderColor: colors.grey,
                backgroundColor: colors.white,
                marginTop: 10,
              }}
            >
              <Text style={{ fontSize: 12, color: colors.muted }}>
                {"Reviewed by:  " + item.author_name}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 5,
                }}
              >
                {maxRating.map((each, key) => {
                  return each <= item.rating ? (
                    <MaterialCommunityIcons
                      key={each}
                      color={colors.goldenrod}
                      name='star'
                      size={20}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      key={each}
                      name='star-outline'
                      size={20}
                      color={colors.muted}
                    />
                  );
                })}
              </View>
              <Text
                style={{
                  marginTop: 10,
                  fontSize: 17,
                  backgroundColor: "#ECE7E7",
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                {item.content}
              </Text>
              <Text
                style={{ marginTop: 10, fontSize: 12, color: colors.muted }}
              >
                {item.date.toDate().toDateString()}
              </Text>
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
            There is no reviews.
          </Text>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.whitegrey, paddingTop: 0 },
});

export default ReviewsScreen;
