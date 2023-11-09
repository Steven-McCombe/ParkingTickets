import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { fetchViolations, requestViolationsUpdate } from '../../utils/violationsService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ViolationsComponentStyles from '../styles/ViolationsComponentStyles';
import Icon from 'react-native-vector-icons/FontAwesome';

const ViolationsComponent = ({ vehicleId }) => {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedViolationId, setExpandedViolationId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedViolationId(expandedViolationId === id ? null : id);
  };

  const getViolationsData = async () => {
    const userJson = await AsyncStorage.getItem('user');
    if (!userJson) {
      console.error("User not found in AsyncStorage.");
      return;
    }

    const user = JSON.parse(userJson);
    const userId = user._id;
    try {
      setLoading(true);
      const data = await fetchViolations(vehicleId, userId);
      setViolations(data || []);
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
  const DetailRow = ({ label, value }) => (
    <View style={ViolationsComponentStyles.detailRow}>
      <Text style={ViolationsComponentStyles.detailLabel}>{label}:</Text>
      <Text style={ViolationsComponentStyles.detailValue}>{value}</Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
    style={ViolationsComponentStyles.violationItem}
    onPress={() => toggleExpand(item._id)}
  >
    <View style={ViolationsComponentStyles.violationSummary}>
      <View style={ViolationsComponentStyles.violationInfo}>
        <Text style={ViolationsComponentStyles.violationDate}>
          {new Date(item.issueDate).toLocaleDateString()} {item.violationTime}M
        </Text>
        <Text style={ViolationsComponentStyles.violationTitle}>{item.violation}</Text>
        <Text style={ViolationsComponentStyles.violationAmount}>${item.fineAmount}.00</Text>
      </View>
      <View style={ViolationsComponentStyles.paymentStatus}>
        <Text style={item.amountDue === 0 ? ViolationsComponentStyles.paidLabel : ViolationsComponentStyles.unpaidLabel}>
          {item.amountDue === 0 ? 'PAID' : 'UNPAID'}
        </Text>
      </View>
      <View style={ViolationsComponentStyles.expandIconContainer}>
        <Icon
          name={expandedViolationId === item._id ? 'chevron-up' : 'chevron-down'}
          size={16} // Slightly smaller icon size
          color="#6e6e6e" // Muted color
        />
      </View>
    </View> 
            {expandedViolationId === item._id && (
        <View style={ViolationsComponentStyles.violationDetails}>
          <DetailRow label="Plate" value={item.plate} />
          <DetailRow label="Summons Number" value={item.summonsNumber} />
          <DetailRow label="Violation Time" value={item.violationTime} />
          <DetailRow label="Violation Date" value={new Date(item.issueDate).toLocaleDateString()} />
          <DetailRow label="Fine Amount" value={`$${item.fineAmount}.00`} />
          <DetailRow label="Penalty Amount" value={`$${item.penaltyAmount}.00`} />
          <DetailRow label="Interest Amount" value={`$${item.interestAmount}.00`} />
          <DetailRow label="Reduction Amount" value={`$${item.reductionAmount}.00`} />
          <DetailRow label="Payment Amount" value={`$${item.paymentAmount}.00`} />
          <DetailRow label="Amount Due" value={`$${item.amountDue}.00`} />
          <DetailRow label="Precinct" value={item.precinct} />
          <DetailRow label="County" value={item.county} />
          <DetailRow label="Issuing Agency" value={item.issuingAgency} />
          <TouchableOpacity onPress={() => {/* handle ticket viewing */}}>
            <Text style={ViolationsComponentStyles.linkText}>View Ticket</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={ViolationsComponentStyles.container}>
      <TouchableOpacity
        style={ViolationsComponentStyles.submitButton}
        onPress={handleUpdate}
      >
        <Text style={ViolationsComponentStyles.submitButtonText}>Update Violations</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator size="large" color={ViolationsComponentStyles.activityIndicatorColor} />}
      {error && <Text style={ViolationsComponentStyles.error}>{error}</Text>}
      {!loading && !violations.length && <Text style={ViolationsComponentStyles.noViolationsText}>No violations found.</Text>}
      <FlatList
        data={violations}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

export default ViolationsComponent;