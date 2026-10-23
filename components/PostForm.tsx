import ImageSelector from "@/components/ImageSelector";
import { PostData } from "@/utils/postData";
import { useEffect, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

type PostFormProps = {
  initialData?: PostData;
  onChange: (
    title: string,
    description: string,
    category: string,
    images: string[],
  ) => void;
};

export default function PostForm({ initialData, onChange }: PostFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? "",
  );
  const [category, setCategory] = useState(initialData?.category ?? "");

  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    onChange(title, description, category, images);
  }, [title, description, category, images, onChange]);

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Title"
        placeholderTextColor="#888"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Description"
        placeholderTextColor="#888"
        value={description}
        onChangeText={setDescription}
      />

      <TextInput
        style={styles.input}
        placeholder="Category"
        placeholderTextColor="#888"
        value={category}
        onChangeText={setCategory}
      />

      <ImageSelector images={images} onChange={setImages} />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginTop: 12,
    marginBottom: 8,
    color: "black",
  },
});
