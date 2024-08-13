import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { color } from "../utilities/Colors";
import { AntDesign } from "@expo/vector-icons";
import EvilIcons from "@expo/vector-icons/EvilIcons";
// import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useSelector } from "react-redux";

const CommentLikeCard = ({ news, navigation, handleLiked }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <View style={styles.bottomCardStyle}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {news.likes > 0 && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              color: color.black,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "500" }}>
              {news.likes > 99999
                ? news.likes / 1000000 + "m"
                : news.likes > 999
                ? news.likes / 1000 + "k"
                : news.likes}
            </Text>
            <Text style={{ color: color.black }}>
              {news.likes === 1 ? " Like " : " Likes "}
            </Text>
          </View>
        )}

        {news?.comments?.length > 0 && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              color: color.black,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "500" }}>
              {news?.comments?.length}
            </Text>
            <Text style={{ color: color.black }}>
              {news?.comments?.length === 1 ? " Comment " : " Comments "}
            </Text>
          </View>
        )}
      </View>
      <View
        style={{
          flexDirection: "row",
          marginVertical: 5,
          // backgroundColor: "red",
          paddingVertical: 2,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            handleLiked(news._id);
          }}
          style={{ marginRight: 20 }}
        >
          <EvilIcons
            name="like"
            size={32}
            color={color.black}
            style={news.likedBy?.includes(user?.id) ? styles.likedeButton : " "}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("comments", {
              newsid: news._id,
              comments: news.comments,
            })
          }
        >
          <EvilIcons name="comment" size={28} color={color.black} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  bottomCardStyle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
    marginVertical: 5,
    marginHorizontal: 16,
  },
  likedeButton: {
    color: color.blue,
  },
});
export default CommentLikeCard;
