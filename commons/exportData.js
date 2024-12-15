import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import RNFS from "react-native-fs";

export const exportExpenseData = async () => {
  const res = await AsyncStorage.getItem("ALL_EXPENSES");
  let expenses = JSON.parse(res);
  return expenses;
};

export const exportCardsData = async () => {
  const res = await AsyncStorage.getItem("ALL_CARDS");
  let cards = JSON.parse(res);
  return cards;
};

const generateFileName = (prefix) => {
  const timestamp = new Date().toISOString().replace(/[-:.]/g, "_"); // Unique timestamp
  return `${prefix}_${timestamp}.json`;
};

export const exportDataToFileInDownloadsDir = async (data, prefix) => {
  try {
    const fileName = generateFileName(prefix);
    const filePath = await moveFileToDownloads(data, fileName);
    console.log(`File exported successfully to: ${filePath}`);
    return filePath; // Return the file path for confirmation or future use
  } catch (error) {
    console.error(`Error exporting ${prefix} data:`, error);
    throw error;
  }
};

export const moveFileToDownloads = async (data, fileName) => {
  try {
    const path = `${RNFS.DownloadDirectoryPath}/${fileName}`;
    await RNFS.writeFile(path, JSON.stringify(data), "utf8");
    console.log(`File saved to Downloads: ${path}`);
    return path;
  } catch (error) {
    console.error("Error saving file:", error);
    throw error;
  }
};
