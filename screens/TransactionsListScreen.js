import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SectionList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Card } from 'react-native-paper';
import { parseISO, format } from 'date-fns';
import { useThemeContext } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const styles = makeStyles(theme);
  const [selectedFilter, setSelectedFilter] = useState('Daily');
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

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
          }}>
            <Text
              style={[
                styles.filterText,
                selectedFilter === f && styles.activeFilterText,
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

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
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{title}</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={[styles.amount, { color: item.amount >= 0 ? 'green' : 'red' }]}>₹ {item.amount}</Text>
              <Text style={styles.metadata}>{item.date} • {item.card}</Text>
            </Card.Content>
          </Card>
        )}
        ListFooterComponent={() => (
          <View style={styles.pagination}>
            <Text style={styles.pageText}>Page {page}</Text>
          </View>
        )}
      />
    </View>
  );
};



const makeStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.dark ? theme.dark.background : '#fff',
    },
    filterBar: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 10,
      backgroundColor: theme.dark ? theme.dark.surface : '#f0f0f0',
    },
    filterText: {
      fontSize: 14,
      color: theme.dark ? theme.dark.onSurfaceVariant : '#555',
    },
    activeFilterText: {
      fontWeight: 'bold',
      color: theme.dark ? theme.dark.primary : '#007BFF',
    },
    sectionHeader: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      backgroundColor: theme.dark ? theme.dark.surface : '#eaeaea',
    },
    sectionHeaderText: {
      fontWeight: 'bold',
      color: theme.dark ? theme.dark.onSurface : '#333',
    },
    card: {
      marginHorizontal: 16,
      marginVertical: 4,
    },
    name: {
      fontWeight: '600',
      fontSize: 16,
      color: theme.dark ? theme.dark.onBackground : '#000',
    },
    description: {
      fontSize: 13,
      color: theme.dark ? theme.dark.onSurfaceVariant : '#555',
    },
    amount: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    metadata: {
      fontSize: 12,
      color: theme.dark ? theme.dark.outline : '#888',
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
