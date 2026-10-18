import React, { useContext, useEffect, useMemo, useState } from "react";
import { Dimensions, StyleSheet, View, Text, Image } from "react-native";
import { ThemeContext } from "../utilities/ThemeProvider";
import { getImageUrl } from "../utilities/getImageUrl";

const { width } = Dimensions.get("window");
const DEFAULT_UPLOAD = "uploads/image-1711019085615.png";

const CommentViewCard = ({ comment }) => {
  const user = comment.comment.user;
  const rawProfileImage = user?.profileImage;
  const hasCustomImage =
    typeof rawProfileImage === "string" &&
    rawProfileImage.trim().length > 0 &&
    !rawProfileImage.includes(DEFAULT_UPLOAD);

  const avatarUri = hasCustomImage ? getImageUrl(rawProfileImage) : null;
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [avatarUri]);

  const showPhoto = !!avatarUri && !imageFailed;

  const randomColor = useMemo(() => {
    const colors = [
      "#FFB6C1",
      "#ADD8E6",
      "#98FB98",
      "#FFD700",
      "#FF6347",
      "#7B68EE",
      "#FF8C00",
      "#D3D3D3",
      "#F0E68C",
      "#E6E6FA",
    ];
    const key = String(user?._id || user?.name || "x");
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash + key.charCodeAt(i) * (i + 1)) % colors.length;
    }
    return colors[hash];
  }, [user?._id, user?.name]);

  const { theme } = useContext(ThemeContext);

  return (
    <View style={styles.commentCard} key={comment.comment._id}>
      <View style={styles.name}>
        {showPhoto ? (
          <Image
            source={{ uri: avatarUri }}
            style={[styles.image, { borderColor: theme.bg }]}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <View
            style={[
              styles.image,
              { borderColor: theme.bg, backgroundColor: randomColor },
            ]}
          >
            <Text style={[styles.text, { color: theme.text }]}>
              {(user?.name || "?").substring(0, 1).toUpperCase()}
            </Text>
          </View>
        )}
        <Text
          style={{
            fontFamily: "Figtree-Regular",
            color: theme.text2,
            fontSize: 16,
            lineHeight: 19.2,
          }}
        >
          {user?.name}
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
    resizeMode: "cover",
    borderWidth: 0.5,
    marginRight: 10,
    overflow: "hidden",
  },
  text: {
    fontFamily: "Figtree-Bold",
    fontSize: 16,
    lineHeight: 19.2,
  },
});
export default CommentViewCard;
