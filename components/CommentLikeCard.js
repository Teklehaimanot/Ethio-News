import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { color } from "../utilities/Colors";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useSelector } from "react-redux";
import { useContext } from "react";
import { ThemeContext } from "../utilities/ThemeProvider";

const CommentLikeCard = ({ news, navigation, handleLiked }) => {
  const { user } = useSelector((state) => state.auth);
  const { theme } = useContext(ThemeContext);

  return (
    <View style={styles.bottomCardStyle}>
      <View
        style={{
          flexDirection: "row",
          marginVertical: 3,
          paddingVertical: 7,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            marginRight: 12,
            alignItems: "center",
          }}
        >
          <View style={{ marginRight: 5 }}>
            <TouchableOpacity
              onPress={() => {
                handleLiked(news._id);
              }}
            >
              <EvilIcons
                name="like"
                size={32}
                color={theme.text}
                style={
                  news.likedBy?.includes(user?.id) ? { color: theme.icon } : " "
                }
              />
            </TouchableOpacity>
          </View>
          <View>
            {news.likes > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Figtree-Regular",
                    fontSize: 14,
                    lineHeight: 19.2,
                    color: theme.text,
                  }}
                >
                  {news.likes > 99999
                    ? news.likes / 1000000 + "m"
                    : news.likes > 999
                    ? news.likes / 1000 + "k"
                    : news.likes}
                </Text>
                <Text
                  style={{
                    fontFamily: "Figtree-Regular",
                    fontSize: 14,
                    lineHeight: 19.2,
                    color: theme.text,
                  }}
                >
                  {news.likes === 1 ? " Like " : " Likes "}
                </Text>
              </View>
            )}
          </View>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ marginRight: 5 }}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("comments", {
                  newsid: news._id,
                  comments: news.comments,
                })
              }
            >
              <EvilIcons name="comment" size={28} color={theme.text} />
            </TouchableOpacity>
          </View>
          <View>
            {news?.comments?.length > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Figtree-Regular",
                    fontSize: 14,
                    lineHeight: 19.2,
                    color: theme.text,
                  }}
                >
                  {news?.comments?.length}
                </Text>
                <Text
                  style={{
                    fontFamily: "Figtree-Regular",
                    fontSize: 14,
                    lineHeight: 19.2,
                    color: theme.text,
                  }}
                  onPress={() =>
                    navigation.navigate("comments", {
                      newsid: news._id,
                      comments: news.comments,
                    })
                  }
                >
                  {news?.comments?.length === 1 ? " Comment " : " Comments "}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  bottomCardStyle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
    marginHorizontal: 25,
  },
});
export default CommentLikeCard;
