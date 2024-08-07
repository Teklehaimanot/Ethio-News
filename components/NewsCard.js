import React from "react";
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image,
} from "react-native";
import { color } from "../utilities/Colors";
import { AntDesign } from "@expo/vector-icons";
import { useSelector } from "react-redux";

const { width } = Dimensions.get("window");

const NewsCard = ({ item, navigation }) => {
  const basicUrl = process.env.API_KEY;
  const { user } = useSelector((state) => state.auth);

  const formatDateToYYYYMMDD = (date) => {
    const dateObject = new Date(date);
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const day = String(dateObject.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  return (
    <SafeAreaView style={styles.cardview}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Details", {
            id: item._id,
            title: item.title,
            image: basicUrl + "/" + item.image,
            description: item.description,
            comments: item.comments,
            date: item.date,
            likes: item.likes,
            dislikes: item.dislikes,
            likedBy: item.likedBy,
            dislikedBy: item.dislikedBy,
          })
        }
      >
        <View>
          <Text style={styles.titleStyle}>{item.title}</Text>
          <View style={styles.imageCard}>
            <Image
              style={styles.image}
              source={{
                uri: `${basicUrl + "/" + item.image}`,
              }}
            />
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.bottomCardStyle}>
        <View>
          <Text style={styles.dateStyle}>Date</Text>
          <Text>{formatDateToYYYYMMDD(item.date)}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            handleLiked(item._id);
          }}
          style={styles.likeButtonStyle}
        >
          <AntDesign
            name="like2"
            size={18}
            color={color.blue}
            style={item.likedBy.includes(user?.id) ? styles.likedeButton : " "}
          />
          <Text style={{ textAlign: "center" }}>{item.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            handleDisliked(item._id);
          }}
          style={styles.likeButtonStyle}
        >
          <AntDesign
            name="dislike2"
            size={18}
            color={color.blue}
            style={
              item.dislikedBy.includes(user?.id) ? styles.likedeButton : " "
            }
          />
          <Text style={{ textAlign: "center" }}>{item.dislikes}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("comments", {
              newsid: item._id,
              comments: item.comments,
            })
          }
          style={{
            paddingHorizontal: 8,
            paddingVertical: 2,
          }}
        >
          <Text style={{ color: color.blue }}>comments</Text>
          <Text style={{ textAlign: "center" }}>{item.comments.length}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  cardview: {
    backgroundColor: color.gray,
    flexDirection: "column",
    justifyContent: "space-between",
    width: width * 1,
    borderColor: color.blueGray,
    borderWidth: 0.2,
    marginTop: 4,
  },
  titleStyle: {
    marginHorizontal: 15,
    marginTop: 15,
    color: color.black,
    borderLeftWidth: 0.8,
    borderLeftColor: color.primary,
    paddingLeft: width * 0.05,
    borderRightWidth: 0.8,
    borderRightColor: color.primary,
    paddingRight: width * 0.05,
    fontSize: 16,
    fontWeight: "bold",
  },
  imageCard: {
    width: width * 1,
    height: 260,
    marginVertical: width * 0.06,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  bottomCardStyle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    margin: 10,
    borderTopColor: color.blueOcean,
    borderTopWidth: 0.5,
    backgroundColor: color.gray,
    paddingTop: 7,
  },
  dateStyle: { color: color.blue, textAlign: "center" },
  likeButtonStyle: {
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  likedeButton: {
    backgroundColor: color.blueOcean,
    color: color.white,
    width: 20,
    height: 20,
    borderRadius: 50,
  },
});

export default NewsCard;
