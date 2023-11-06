import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { fetchViolations, requestViolationsUpdate } from '../../utils/violationsService';

const ViolationsComponent = ({vehicleId}) => {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedViolationId, setExpandedViolationId] = useState(null);

const toggleExpand = (id) => {
  setExpandedViolationId(expandedViolationId === id ? null : id);
};


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
      <TouchableOpacity onPress={() => toggleExpand(item._id)}>
        <View>
          <Text style={styles.violationTitle}>{item.summonsNumber}</Text>
          <Text>{new Date(item.issueDate).toLocaleDateString()}</Text>
          {expandedViolationId === item._id && (
            <View style={styles.violationDetails}>
              {/* Include all relevant details here */}
              <Text>Plate: {item.plate}</Text>
              <Text>Violation: {item.violation}</Text>
              <Text>Violation Time: {new Date(item.violationTime).toLocaleTimeString()}</Text>
              {/* ... other details ... */}
            </View>
          )}
        </View>
      </TouchableOpacity>
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
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 8,
    borderRadius: 5,
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowColor: '#000',
    shadowOffset: { height: 0, width: 0 },
    elevation: 1,
  },
  violationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  violationDetails: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    // Include any additional styling for the details section
  },
  error: {
    color: 'red',
  },
  // ... any other styles you need ...
});




export default ViolationsComponent;
