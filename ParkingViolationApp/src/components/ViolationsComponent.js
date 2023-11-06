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
      <View style={styles.violationSummary}>
        <View style={styles.violationInfo}>
          <Text style={styles.violationNumber}>{item.summonsNumber}</Text>
          <Text style={styles.violationDate}>{new Date(item.issueDate).toLocaleDateString()}</Text>
          <Text style={styles.violationTitle}>{item.violation}</Text>
          <Text style={styles.violationAmount}>${item.fineAmount}.00</Text>
        </View>
        <View style={styles.paymentStatus}>
          <Text style={item.amountDue === 0 ? styles.paidLabel : styles.unpaidLabel}>
            {item.amountDue === 0 ? 'PAID' : 'UNPAID'}
          </Text>
        </View>
      </View>
      {expandedViolationId === item._id && (
        <View style={styles.violationDetails}>
              {/* Include all relevant details here */}
              <Text>Plate: {item.plate}</Text>
              <Text>Violation: {item.violation}</Text>
              <Text>Violation Time: {new Date(item.violationTime).toLocaleTimeString()}</Text>
              <Text>Violation Date: {new Date(item.violationTime).toLocaleDateString()}</Text>
              <Text>Fine Amount: ${item.fineAmount}.00</Text>
              <Text>Penalty Amount: ${item.penaltyAmount}.00</Text>
              <Text>Interest Amount: ${item.interestAmount}.00</Text>
              <Text>Reduction Amount: ${item.reductionAmount}.00</Text>
              <Text>Payment Amount: ${item.paymentAmount}.00</Text>
              <Text>Amount Due: ${item.amountDue}.00</Text>
              <Text>Precinct: {item.precinct}</Text>
              <Text>County: {item.county}</Text>
              <Text>Issuing Agency: {item.issuingAgency}</Text>
              <Text style={styles.detailText}>View Ticket: {item.summonsImage.url}</Text>
              </View>
      )}
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
  // ... other styles ...
  violationSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  violationInfo: {
    flex: 1,
  },
  violationNumber: {
    fontSize: 14,
    color: '#333',
  },
  violationDate: {
    fontSize: 12,
    color: '#666',
  },
  violationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  violationAmount: {
    fontSize: 16,
    color: '#000',
  },
  paymentStatus: {
    padding: 5,
    borderRadius: 5,
  },
  paidLabel: {
    fontWeight: 'bold',
    color: 'green',
  },
  unpaidLabel: {
    fontWeight: 'bold',
    color: 'red',
  },
  detailText: {
    fontSize: 14,
    marginVertical: 2,
  }
  // ... any other styles you need ...
});




export default ViolationsComponent;
