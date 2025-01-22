import React, { useContext, useMemo } from "react";
import { Dimensions, StyleSheet, View, Text } from "react-native";
import { ThemeContext } from "../utilities/ThemeProvider";

const { width } = Dimensions.get("window");
const CommentViewCard = ({ comment }) => {
  const randomColor = useMemo(() => {
    const colors = [
      "#FFB6C1", // Light Pink
      "#ADD8E6", // Light Blue
      "#98FB98", // Pale Green
      "#FFD700", // Gold
      "#FF6347", // Tomato
      "#7B68EE", // Medium Slate Blue
      "#FF8C00", // Dark Orange
      "#D3D3D3", // Light Gray
      "#F0E68C", // Khaki
      "#E6E6FA", // Lavender
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);
  const { theme } = useContext(ThemeContext);
  return (
    <View style={styles.commentCard} key={comment.comment._id}>
      <View style={styles.name}>
        <View
          style={[
            styles.image,
            { borderColor: theme.bg, backgroundColor: randomColor },
          ]}
        >
          <Text style={[styles.text, { color: theme.text }]}>
            {comment.comment.user.name.substring(0, 1).toUpperCase()}
          </Text>
        </View>
        <Text
          style={{
            fontFamily: "Figtree-Regular",
            color: theme.text2,
            fontSize: 16,
            lineHeight: 19.2,
          }}
        >
          {comment.comment.user.name}
        </Text>
      </View>

      <View
        style={{
          width: width * 0.72,
          margin: "auto",
          paddingLeft: 10,
        }}
      >
        <Text
          style={{
            fontFamily: "Figtree-Regular",
            fontSize: 14,
            color: theme.text,
            marginBottom: 15,
          }}
        >
          {comment.comment.comment}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  commentCard: {
    flexDirection: "col",
    width: width * 1,
    // marginVertical: 5,
  },
  name: {
    flexDirection: "row",
    width: width * 0.92,
    margin: "auto",
    alignItems: "center",
  },
  image: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: (width * 0.1) / 2,
    alignItems: "center",
    justifyContent: "center",

    borderWidth: 0.5,
    marginRight: 10,
  },
  text: {
    fontFamily: "Figtree-Bold",
    fontSize: 16,
    lineHeight: 19.2,
  },
});
export default CommentViewCard;
