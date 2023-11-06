import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { fetchViolations, requestViolationsUpdate } from '../../utils/violationsService';

const ViolationsComponent = ({vehicleId}) => {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getViolationsData = async () => {
    try {
      setLoading(true);
      const data = await fetchViolations(vehicleId);
      setViolations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getViolationsData();
  }, [vehicleId]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await requestViolationsUpdate();
      await getViolationsData();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.violationItem}>
      <Text>{item.summonsNumber} - {item.issueDate}</Text> 
    </View>
  );
  
  return (
    <View style={styles.container}>
      <Button title="Update Violations" onPress={handleUpdate} />
      {loading && <ActivityIndicator />}
      {error && <Text style={styles.error}>{error}</Text>}
      {!loading && !violations.length && <Text>No violations found.</Text>}
      <FlatList
  data={violations}
  renderItem={renderItem}
  keyExtractor={(item) => item._id} // Assuming _id is unique for each violation
/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  violationItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  error: {
    color: 'red',
  },
});

export default ViolationsComponent;
