import React, { useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { color } from "../utilities/Colors";
import { AntDesign } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import {
  useDislikeNewsByIdMutation,
  useLikeNewsByIdMutation,
} from "../services";

const CommentLikeCard = ({ news, navigation, handleLiked, handleDisliked }) => {
  const { user } = useSelector((state) => state.auth);
  const [likeNews] = useLikeNewsByIdMutation();
  const [dislikeNews] = useDislikeNewsByIdMutation();

  const formatDateToYYYYMMDD = (date) => {
    const dateObject = new Date(date);
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const day = String(dateObject.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  //   useEffect(() => {
  //     setNews();
  //   }, [likeNews]);

  //   const handleLiked = (newsid) => {
  //     console.log(newsid);
  //     try {
  //       if (user) {
  //         likeNews(newsid);
  //         setNews({
  //           ...news,
  //           likes: news.likedBy.includes(user.id) ? news.likes : news.likes + 1,
  //           dislikes: news.dislikedBy.includes(user.id)
  //             ? news.dislikes - 1
  //             : news.dislikes,
  //           likedBy: [...news.likedBy, user.id],
  //           dislikedBy: news.dislikedBy.filter((eachDislike) => {
  //             return eachDislike !== user.id;
  //           }),
  //         });
  //       } else navigation.navigate("login");
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   const handleDisliked = (newsid) => {
  //     try {
  //       if (user) {
  //         dislikeNews(newsid);
  //         setNews({
  //           ...news,
  //           dislikes: news.dislikedBy.includes(user.id)
  //             ? news.dislikes
  //             : news.dislikes + 1,
  //           likes: news.dislikedBy.includes(user.id)
  //             ? news.likes
  //             : news.likes - 1,
  //           dislikedBy: [...news.dislikedBy, user.id],
  //           likedBy: news.likedBy.filter((eachlike) => {
  //             return eachlike !== user.id;
  //           }),
  //         });
  //       } else navigation.navigate("login");
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
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
          color={color.blue}
          style={news.likedBy?.includes(user?.id) ? styles.likedeButton : " "}
        />
        <Text style={{ textAlign: "center" }}>{news.likes}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          handleDisliked(news._id);
        }}
        style={styles.likeButtonStyle}
      >
        <AntDesign
          name="dislike2"
          size={18}
          color={color.blue}
          style={
            news.dislikedBy?.includes(user?.id) ? styles.likedeButton : " "
          }
        />
        <Text style={{ textAlign: "center" }}>{news.dislikes}</Text>
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
        <Text style={{ color: color.blue }}>comments</Text>
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
export default CommentLikeCard;
