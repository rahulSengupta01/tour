// tour-app/src/screens/PlaceDetailsScreen.js

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { getPlaceById } from "../api/placesService";

export default function PlaceDetailsScreen({ route, navigation }) {
  const { placeId, external } = route.params; 
  // placeId can be null → external-only place
  const [place, setPlace] = useState(null);

  useEffect(() => {
    if (placeId) {
      loadPlaceFromDB();
    }
  }, []);

  const loadPlaceFromDB = async () => {
    const data = await getPlaceById(placeId);
    setPlace(data);
  };

  const isManaged = place !== null;
  const canBook =
    isManaged &&
    place.authorized &&
    place.passInfo?.available === true;

  return (
    <ScrollView style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>
        {isManaged ? place.name : external.name}
      </Text>

      {/* Images */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.imageRow}
      >
        {isManaged && place.images?.length > 0 ? (
          place.images.map((img, index) => (
            <Image key={index} source={{ uri: img }} style={styles.image} />
          ))
        ) : (
          <Image
            source={{
              uri:
                external?.image ||
                "https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png",
            }}
            style={styles.image}
          />
        )}
      </ScrollView>

      {/* Description */}
      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.descText}>
        {isManaged
          ? place.description || "No description added."
          : "No description available for this place."}
      </Text>

      {/* Address */}
      <Text style={styles.sectionTitle}>Address</Text>
      <Text style={styles.descText}>
        {external?.address || "Address not available"}
      </Text>

      {/* Pass Info (DB managed only) */}
      {isManaged && (
        <View style={styles.passCard}>
          <Text style={styles.sectionTitle}>Pass Information</Text>

          {place.passInfo?.available ? (
            <>
              <Text style={styles.passText}>
                Price: ₹{place.passInfo.price}
              </Text>
              <Text style={styles.passText}>
                Validity: {place.passInfo.validity}
              </Text>
              <Text style={styles.passText}>
                Details: {place.passInfo.details}
              </Text>
            </>
          ) : (
            <Text style={styles.passText}>Pass not available.</Text>
          )}
        </View>
      )}

      {/* Book Pass Button */}
      {canBook && (
        <TouchableOpacity
          style={styles.bookBtn}
          onPress={() => navigation.navigate("BookPass", { placeId })}
        >
          <Text style={styles.bookText}>Book Pass</Text>
        </TouchableOpacity>
      )}

      {/* If pass is not available but place is managed */}
      {!canBook && isManaged && (
        <View style={styles.noticeBox}>
          <Text style={styles.noticeText}>
            Pass is not available or not authorized for this place.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 15 },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },

  imageRow: { flexDirection: "row", marginBottom: 15 },
  image: {
    width: 250,
    height: 170,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: "#ccc",
  },

  sectionTitle: {
    fontSize: 20,
    marginVertical: 10,
    fontWeight: "700",
  },

  descText: {
    fontSize: 16,
    color: "#555",
  },

  passCard: {
    backgroundColor: "#f4f4f4",
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
  },

  passText: {
    fontSize: 16,
    marginTop: 5,
  },

  bookBtn: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 40,
  },
  bookText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },

  noticeBox: {
    padding: 15,
    backgroundColor: "#ffe0e0",
    borderRadius: 10,
    marginTop: 20,
  },
  noticeText: {
    fontSize: 15,
    color: "#a00",
    textAlign: "center",
  },
});
