import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useRef, useState } from "react";
import {
    Alert,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

type ImageSelectorProps = {
  images: string[];
  onChange: (images: string[]) => void;
};

// Åpner bildegalleriet og lar brukeren velge flere bilder.
export default function ImageSelector({
  images,
  onChange,
}: ImageSelectorProps) {
  const [cameraVisible, setCameraVisible] = useState(false);
  const camera = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((image) => image.uri);
      onChange([...images, ...newImages]);
    }
  };

  // Sjekker om appen har tilgang til kameraet
  const openCamera = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();

      if (!result.granted) {
        Alert.alert(
          "Camera permission",
          "You need to allow camera access to take photos.",
        );
        return;
      }
    }
    setCameraVisible(true);
  };

  // Tar et bilde og legger til det i listen
  const takePhoto = async () => {
    if (!camera) return;

    const photo = await camera.current?.takePictureAsync();

    if (photo?.uri) {
      onChange([...images, photo.uri]);
      setCameraVisible(false);
    }
  };

  // Fjerner valgt bilde
  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  if (cameraVisible) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing="back" ref={camera} />

        <Pressable style={styles.button} onPress={takePhoto}>
          <Text style={styles.buttonText}>Take Photo</Text>
        </Pressable>

        <Pressable
          style={styles.button}
          onPress={() => setCameraVisible(false)}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add images</Text>

      <Pressable style={styles.button} onPress={openCamera}>
        <Text style={styles.buttonText}>Take Photo</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={pickFromGallery}>
        <Text style={styles.buttonText}>Choose from gallery</Text>
      </Pressable>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {images.map((uri, index) => (
          <View key={`${uri}-${index}`} style={styles.imageContainer}>
            <Image source={{ uri }} style={styles.image} />

            <Pressable onPress={() => removeImage(index)}>
              <Text style={styles.removeText}>Remove</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#ddddff",
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "600",
  },
  imageContainer: {
    marginRight: 12,
    alignItems: "center",
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 8,
  },
  removeText: {
    color: "red",
    marginTop: 6,
  },
  cameraContainer: {
    height: 450,
    marginTop: 20,
  },
  camera: {
    flex: 1,
    marginBottom: 12,
  },
});
