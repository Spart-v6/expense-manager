import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  SectionList,
  StyleSheet,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import { Card, Text } from 'react-native-paper';
import { parseISO, format } from 'date-fns';
import { useThemeContext } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatCurrency } from '../helper/formatCurrency';
import currencyObj from '../helper/currencyObj';
import { useFocusEffect } from '@react-navigation/native';

const filters = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

const groupTransactions = (transactions, filter) => {
  const grouped = {};

  transactions.forEach(txn => {
    let key;
    const date = parseISO(txn.date);
    switch (filter) {
      case 'Daily':
        key = format(date, 'EEE dd MMM');
        break;
      case 'Weekly':
        key = `Week ${format(date, 'I')} ${format(date, 'yyyy')}`;
        break;
      case 'Monthly':
        key = format(date, 'MMMM yyyy');
        break;
      case 'Yearly':
        key = format(date, 'yyyy');
        break;
    }
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(txn);
  });

  return Object.entries(grouped).map(([key, txns]) => {
    const total = txns.reduce((sum, txn) => sum + txn.amount, 0);
    return {
      title: `${key} - Total: ${total}`,
      data: txns,
    };
  });
};

const TransactionsListScreen = () => {
  const { theme } = useThemeContext();
  const colorScheme = useColorScheme();
  const styles = makeStyles(theme, colorScheme);
  const [selectedFilter, setSelectedFilter] = useState('Daily');
  const [transactions, setTransactions] = useState([]);
  const [cards, setCards] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedCurrencyId, setSelectedCurrencyId] = useState(currencyObj[0].id);

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
  }, []));

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await AsyncStorage.getItem("transactions");
        const parsed = data ? JSON.parse(data) : [];
        setTransactions(parsed);

        const cardsData = await AsyncStorage.getItem("cards");
        const parsedCards = cardsData ? JSON.parse(cardsData) : [];
        setCards(parsedCards);
      } catch (error) {
        console.error("Failed to load transactions", error);
      }
    };

    loadTransactions();
  }, []);

  // Paginate transactions BEFORE grouping
  const paginatedTransactions = useMemo(() => {
    const start = 0;
    const end = page * itemsPerPage;
    return transactions.slice(start, end);
  }, [transactions, page]);

  const groupedSections = useMemo(() => {
    return groupTransactions(paginatedTransactions, selectedFilter);
  }, [paginatedTransactions, selectedFilter]);


  return (
    <View style={styles.container}>
      <View style={styles.filterBar}>
        {filters.map(f => (
          <TouchableOpacity key={f} onPress={() => {
            setSelectedFilter(f);
            setPage(1);
          }}
          style={[{padding: 10, backgroundColor: theme[colorScheme].surfaceDim, borderRadius: 15, width: 90}, selectedFilter === f && {backgroundColor: theme[colorScheme].primaryContainer}]}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === f && styles.activeFilterText,
                {textAlign: "center"}
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
        {
        groupedSections.length === 0 ? (
          <View>
            <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 16, color: theme[colorScheme].onSurfaceVariant }}>
              No transactions found yet.
            </Text>
          </View>
        ) : (
          <SectionList
          sections={groupedSections}
          keyExtractor={(item) => item.id}
          stickySectionHeadersEnabled
          onEndReached={() => {
            if (page * itemsPerPage < transactions.length) {
            setPage(prev => prev + 1);
          }
        }}
        onEndReachedThreshold={0.5}
        renderSectionHeader={({ section: { title } }) => { 
          const parts = title.split(" - ");
          
          return (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>{parts[0]}</Text>
              <Text style={styles.sectionHeaderText}>{parts[1]}</Text>
            </View>
        )}}
        renderItem={({ item }) => { 
          const cardName = (cards.find(card => card.id === item.cardId) || {}).name || "Unknown";

          return (
            <Card style={styles.card}>
            <Card.Content style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{flex: 0.1, alignItems: 'center', justifyContent: 'center'}}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 25,
                    backgroundColor: theme[colorScheme].surfaceDisabled,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  >
                  <Text style={{ fontSize: 12, lineHeight: 14, fontWeight: "bold", color: theme[colorScheme].primary }}>
                    {format(parseISO(item.date), "d")}
                  </Text>
                  <Text style={{ fontSize: 12, lineHeight: 14, fontWeight: "bold", color: theme[colorScheme].primary }}>
                    {format(parseISO(item.date), "MMM")}
                  </Text>
                </View>
              </View>
              <View style={{flexDirection: "column", flex: 0.7}}>
                <Text style={styles.name}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
              </View>
              <View style={{flex: 0.2, alignItems: 'flex-end'}}>
                <Text style={[styles.amount, { color: item.type === "Income" ? 'green' : 'red' }]}> {/*TODO: Fix this color*/}
                  {formatCurrency(item.type === "Income" ? item.amount : -item.amount, selectedCurrencyId, theme, colorScheme, 
                  item.type !== "Income" && "#ff4d4d",
                  {
                    iconSize: 10
                  })}
                </Text>
                <Text style={styles.metadata}>{cardName}</Text>
              </View>
            </Card.Content>
          </Card>
        )}}
        ListFooterComponent={() => (
          <View style={styles.pagination}>
            <Text style={styles.pageText}>Page {page}</Text>
          </View>
        )}
        />
      )}
    </View>
  );
};



const makeStyles = (theme, colorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.dark ? theme[colorScheme].background : '#fff',
    },
    filterBar: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 10,
      marginRight: 10,
      marginLeft: 10,
    },
    filterText: {
      fontSize: 14,
      color: theme[colorScheme].onSurfaceVariant,
    },
    activeFilterText: {
      fontWeight: 'bold',
      color: theme[colorScheme].primary
    },
    sectionHeader: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
      paddingHorizontal: 16,
      backgroundColor: theme.dark ? theme[colorScheme].surface : '#eaeaea',
    },
    sectionHeaderText: {
      fontWeight: 'bold',
      color: theme.dark ? theme[colorScheme].onSurface : '#333',
    },
    card: {
      backgroundColor: theme[colorScheme].surfaceDim,
      marginLeft: 16,
      marginRight: 16,
      marginTop: 16
    },
    name: {
      fontWeight: '600',
      fontSize: 16,
      color: theme.dark ? theme[colorScheme].onBackground : '#000',
    },
    description: {
      fontSize: 13,
      color: theme.dark ? theme[colorScheme].onSurfaceVariant : '#555',
    },
    amount: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    metadata: {
      fontSize: 12,
      color: theme.dark ? theme[colorScheme].outline : '#888',
      marginTop: 4,
    },
    pagination: {
      alignItems: 'center',
      paddingVertical: 12,
    },
    pageText: {
      fontSize: 13,
      color: '#888',
    },
  });


export default TransactionsListScreen;
