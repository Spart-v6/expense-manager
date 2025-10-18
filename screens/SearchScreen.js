import React, { useCallback, useContext, useEffect, useState } from "react";
import { View, FlatList, useColorScheme } from "react-native";
import { Card, Text } from "react-native-paper";
import { SearchContext } from "../context/SearchContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format, parseISO } from "date-fns";
import Fuse from "fuse.js"; // for fuzzy searching (can type anything and it will find matches)
import currencyObj from "../helper/currencyObj";
import { useFocusEffect } from "@react-navigation/native";
import { formatCurrency } from "../helper/formatCurrency";
import { useThemeContext } from "../context/ThemeContext";

const options = {
  keys: ["title"],   // search inside `transaction.title`
  threshold: 0.4,    // lower = stricter match, higher = fuzzier
};

const SearchScreen = ({ navigation }) => {
  const { theme } = useThemeContext();
  const colorScheme = useColorScheme();
  const { searchQuery } = useContext(SearchContext);
  const [transactions, setTransactions] = useState([]);
  const [selectedCurrencyId, setSelectedCurrencyId] = React.useState(currencyObj[0].id);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await AsyncStorage.getItem("transactions");
        const parsed = data ? JSON.parse(data) : [];
        setTransactions(parsed);
      } catch (error) {
        console.error("Failed to load transactions", error);
      }
    };
    loadTransactions();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const getCurrency = async () => {
        try {
          const storedId = await AsyncStorage.getItem("currencyId");
          if (storedId) {
            setSelectedCurrencyId(parseInt(storedId));
          }
        } catch (error) {
          console.error("Failed to load currency:", error);
        }
      };
      getCurrency();
    }, [])
  );
  

  const fuse = new Fuse(transactions, options);

  const loadFilteredTransactions = () => {
    // const filteredTransactions = transactions.filter((transaction) =>
    //   transaction.title.toLowerCase().includes(searchQuery.toLowerCase())
    // );

    const filteredTransactions = fuse.search(searchQuery).map(result => result.item);

    if (!searchQuery || searchQuery.length <= 3) {
      return (
        <View style={{ flex: 1,justifyContent: "center", alignItems: "center", padding: 20, }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", textAlign: "center"}}>
            Please enter a search query longer than 3 characters.
          </Text>
        </View>
      );
    }

    if (searchQuery.length > 3 && filteredTransactions.length === 0) {
      return (
        <View style={{ flex: 1,justifyContent: "center", alignItems: "center", padding: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            No transactions found.
          </Text>
        </View>
      );
    }

    if (searchQuery.length > 3 && filteredTransactions.length > 0) {
      return filteredTransactions.map((transaction, index) => (
          <FlatList
            data={filteredTransactions}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ padding: 15 }}
            renderItem={({ item }) => (
              <View key={index} style={{ marginVertical: 10, width: "100%" }}>
                <Card
                  style={{
                    width: "100%",
                    borderRadius: 12,
                    elevation: 3, 
                    marginVertical: 8,
                  }}
                >
                  <Card.Content>
                    <Text variant="titleLarge" style={{ fontWeight: "bold", marginBottom: 12 }} >
                      {transaction.title}
                    </Text>

                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                      <Text variant="bodyMedium" style={{ color: "#666" }}>
                        {format(new Date(transaction.date), "PPP")}
                      </Text>
                      <Text variant="titleMedium" style={{ fontWeight: "600", color: transaction.amount < 0 ? "red" : "green", }}>
                        {formatCurrency(item.type === "Income" ? item.amount : -item.amount, selectedCurrencyId, theme, colorScheme, 
                        transaction.amount < 0 && "#ff4d4d",
                        {
                          iconSize: 10
                        })}
                      </Text>
                    </View>
                  </Card.Content>
                </Card>
              </View>
            )}
          />
      ));
    }

    return null;
  }

  return (
    <>
      {loadFilteredTransactions()}
    </>
  );
};

export default SearchScreen;
