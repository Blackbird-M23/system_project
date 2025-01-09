import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ActivityIndicator, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList,
  Linking,
  Platform,
  RefreshControl
} from 'react-native';
import axios from 'axios';
import Header from '../components/Header';
import { MaterialIcons } from '@expo/vector-icons';
import { baseURL } from '../services/api';

const ResearchScreen = () => {
  const [researchPapers, setResearchPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchResearchPapers = async () => {
    try {
      const { data } = await axios.get(`${baseURL}/research`);
      setResearchPapers(data);
      setError('');
    } catch (err) {
      setError('Error fetching research papers.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchResearchPapers();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchResearchPapers();
  };

  const openLink = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        alert("Can't open this URL");
      }
    } catch (err) {
      alert('Error opening the link');
    }
  };

  const renderResearchPaper = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => openLink(item.link)}
    >
      <View style={styles.cardContent}>
        <View style={styles.titleContainer}>
          <MaterialIcons name="article" size={24} color="#4CAF50" />
          <Text style={styles.title}>{item.title}</Text>
        </View>
        <View style={styles.metaContainer}>
          <Text style={styles.category}>{item.category}</Text>
          <Text style={styles.date}>
            {new Date(item.publishedDate).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.linkContainer}>
          <MaterialIcons name="link" size={20} color="#666" />
          <Text style={styles.linkText} numberOfLines={1}>
            {item.link}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Research Papers" />
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={researchPapers}
          keyExtractor={(item) => item._id}
          renderItem={renderResearchPaper}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No research papers available</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: Platform.OS === "android" ? 40 : 0,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    padding: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  category: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '500',
  },
  date: {
    color: '#666',
    fontSize: 12,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 8,
    borderRadius: 4,
  },
  linkText: {
    color: '#666',
    fontSize: 12,
    marginLeft: 4,
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: '#D32F2F',
    textAlign: 'center',
    margin: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
});

export default ResearchScreen;
