import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { color } from "../utilities/Colors";
import { AntDesign } from "@expo/vector-icons";
import { useSelector } from "react-redux";

const CommentLikeCard = ({ news, navigation, handleLiked }) => {
  const { user } = useSelector((state) => state.auth);
  const formatDateToYYYYMMDD = (date) => {
    const dateObject = new Date(date);
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const day = String(dateObject.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  return (
    <View style={styles.bottomCardStyle}>
      <View>
        <Text style={styles.dateStyle}>Date</Text>
        <Text>{formatDateToYYYYMMDD(news.date)}</Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          handleLiked(news._id);
        }}
        style={styles.likeButtonStyle}
      >
        <AntDesign
          name="like2"
          size={18}
          color={color.black}
          style={news.likedBy?.includes(user?.id) ? styles.likedeButton : " "}
        />
        <Text style={{ textAlign: "center" }}>{news.likes}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("comments", {
            newsid: news._id,
            comments: news.comments,
          })
        }
        style={{
          paddingHorizontal: 8,
          paddingVertical: 2,
        }}
      >
        <Text style={{ color: color.black }}>comments</Text>
        <Text style={{ textAlign: "center" }}>{news?.comments?.length}</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  bottomCardStyle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    // margin: 10,
    // borderTopColor: color.blueOcean,
    // borderTopWidth: 0.5,
    backgroundColor: color.gray,
    paddingTop: 1,
  },
  dateStyle: { color: color.black, textAlign: "center" },
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
export default CommentLikeCard;
