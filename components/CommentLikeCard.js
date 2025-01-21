import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { color } from "../utilities/Colors";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useSelector } from "react-redux";

const CommentLikeCard = ({ news, navigation, handleLiked }) => {
  const { user } = useSelector((state) => state.auth);

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
                color={color.fontColor}
                style={
                  news.likedBy?.includes(user?.id) ? styles.likedeButton : " "
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
                    fontSize: 16,
                    lineHeight: 19.2,
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
                    fontSize: 16,
                    lineHeight: 19.2,
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
              <EvilIcons name="comment" size={28} color={color.fontColor} />
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
                    fontSize: 16,
                    lineHeight: 19.2,
                  }}
                >
                  {news?.comments?.length}
                </Text>
                <Text
                  style={{
                    fontFamily: "Figtree-Regular",
                    fontSize: 16,
                    lineHeight: 19.2,
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
  likedeButton: {
    color: color.blue,
  },
});
export default CommentLikeCard;
