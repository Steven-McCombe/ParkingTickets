import React, { useContext, useEffect, useState, useRef} from 'react';
import { Linking, View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { fetchViolations, requestViolationsUpdate } from '../../utils/violationsService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REACT_APP_SERVER_URL } from '../config';
import ViolationsComponentStyles from '../styles/ViolationsComponentStyles';
import palette from '../styles/colorScheme';
import Icon from 'react-native-vector-icons/FontAwesome';
import PDFViewerModal from './PDFViewerModal'; 
import { AuthContext } from '../contexts/AuthContext';

const ViolationsComponent = ({ vehicleId }) => {
  const { user, token, loading: authLoading } = useContext(AuthContext);
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedViolationId, setExpandedViolationId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const flatListRef = useRef();

  const totalTickets = violations.length;
  const totalPaid = violations.reduce((acc, violation) => acc + (violation.amountDue === 0 ? violation.fineAmount : 0), 0);
  const totalUnpaid = violations.reduce((acc, violation) => acc + (violation.amountDue > 0 ? violation.amountDue : 0), 0);
  let sortedViolations = [...violations].sort((a, b) => new Date(a.issueDate) - new Date(b.issueDate));
  let firstTicketDate = sortedViolations.length > 0 ? new Date(sortedViolations[0].issueDate).toLocaleDateString() : 'N/A';
  let mostRecentTicketDate = sortedViolations.length > 0 ? new Date(sortedViolations[sortedViolations.length - 1].issueDate).toLocaleDateString() : 'N/A';
  const plate = violations.length > 0 ? violations[0].plate : 'N/A';

  const markTicketAsPaid = async (violationId) => {
    const violationToPay = violations.find(violation => violation._id === violationId);
    const totalDue = violationToPay ? (violationToPay.fineAmount - violationToPay.reductionAmount) : 0;
  
    const updatedViolationData = {
      paymentAmount: totalDue,
      amountDue: 0,
      manuallyUpdated: true,
      updatedAt: new Date().toISOString(),
    };
  
    // Update local state
    const updatedViolations = violations.map(violation => {
      if (violation._id === violationId) {
        return { ...violation, ...updatedViolationData };
      }
      return violation;
    });
  
    setViolations(updatedViolations);
  
    // Update server
    try {
      const response = await fetch(`${REACT_APP_SERVER_URL}/violations/updateViolationStatus/${violationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedViolationData),
      });
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error updating violation status');
      }
    } catch (error) {
      console.error('Error updating violation status:', error);
      // Optionally, revert the local state update in case of an error
    }
  };
  
  const undoMarkAsPaid = async (violationId) => {
    try {
      const response = await fetch(`${REACT_APP_SERVER_URL}/violations/undoMarkAsPaid/${violationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error undoing mark as paid');
      }

      // Update local state to reflect the change
      const updatedViolations = violations.map(violation => 
        violation._id === violationId ? { ...violation, amountDue: violation.paymentAmount, paymentAmount: 0, manuallyUpdated: false } : violation
      );

      setViolations(updatedViolations);
    } catch (error) {
      console.error('Error undoing mark as paid:', error);
    }
  };


  const redirectToStatePaymentSite = (violation) => {
    const paymentUrl = `https://a836-citypay.nyc.gov/citypay/Parking#!/by-plate-form`;
    Linking.openURL(paymentUrl).catch(err => console.error('An error occurred', err));
  };
  


  const viewTicket = (url) => {
    if (url) {
      setPdfUrl(url);
      setIsModalVisible(true);
    } else {
      console.log("No ticket link available for this violation.");
    }
  };
  

  const toggleExpand = (id, index) => {
    setExpandedViolationId(expandedViolationId === id ? null : id);
    if (expandedViolationId !== id) {
      // Scroll to the top of the list to make the expanded item visible
      flatListRef.current.scrollToIndex({ animated: true, index: index, viewPosition: 0 });
    }
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
      let data = await fetchViolations(vehicleId, userId);
      if (data) {
        // Sort the violations by issueDate in descending order
        data.sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate));
      }
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

  const renderSummary = () => {
    if (violations.length === 0) {
      return null;
    }
  
    return (
      <View style={ViolationsComponentStyles.summaryContainer}>
        <Text style={ViolationsComponentStyles.summaryHeading}>Summary for {plate}</Text>
        <DetailRow icon="ticket" label="Tickets" value={totalTickets.toString()} />
        <DetailRow icon="dollar" label="Paid" value={`$${totalPaid.toFixed(2)}`} />
        <DetailRow icon="exclamation-triangle" label="Unpaid" value={`$${totalUnpaid.toFixed(2)}`} />
        <DetailRow icon="calendar-o" label="First Issued" value={firstTicketDate} />
        <DetailRow icon="calendar" label="Recent" value={mostRecentTicketDate} />
      </View>
    );
  };
  
  const DetailRow = ({ icon, label, value }) => (
    <View style={ViolationsComponentStyles.summaryInfo}>
      {icon !== "" && <Icon name={icon} size={16} color={palette.primary} style={ViolationsComponentStyles.summaryIcon} />}
      <Text style={ViolationsComponentStyles.summaryLabel}>{label}:</Text>
      <Text style={ViolationsComponentStyles.summaryValue}>{value}</Text>
    </View>
  );

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={ViolationsComponentStyles.violationItem}
      onPress={() => toggleExpand(item._id, index)}
    >
    <View style={ViolationsComponentStyles.violationSummary}>
      <View style={ViolationsComponentStyles.violationInfo}>
        <Text style={ViolationsComponentStyles.violationDate}>
          {new Date(item.issueDate).toLocaleDateString()} {item.violationTime}M
        </Text>
        <Text style={ViolationsComponentStyles.violationTitle}>{item.violation}</Text>
        <Text style={ViolationsComponentStyles.violationAmount}>${item.fineAmount}.00</Text>
        {item.manuallyUpdated && (
          <Text style={ViolationsComponentStyles.manualMarked}>
            This ticket was manually marked as paid.
          </Text>
        )}
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
          <DetailRow icon="" label="Plate" value={item.plate} />
          <DetailRow icon="" label="Summons Number" value={item.summonsNumber} />
          <DetailRow icon="" label="Violation Time" value={`${item.violationTime}M`} />
          <DetailRow icon="" label="Violation Date" value={new Date(item.issueDate).toLocaleDateString()} />
          <DetailRow icon="" label="Fine Amount" value={`$${item.fineAmount}.00`} />
          <DetailRow icon="" label="Penalty Amount" value={`$${item.penaltyAmount}.00`} />
          <DetailRow icon="" label="Interest Amount" value={`$${item.interestAmount}.00`} />
          <DetailRow icon="" label="Reduction Amount" value={`$${item.reductionAmount}.00`} />
          <DetailRow icon="" label="Payment Amount" value={`$${item.paymentAmount}.00`} />
          <DetailRow icon="" label="Amount Due" value={`$${item.amountDue}.00`} />
          <DetailRow icon="" label="Precinct" value={item.precinct} />
          <DetailRow icon="" label="County" value={item.county} />
          <DetailRow icon="" label="Issuing Agency" value={item.issuingAgency} />
          <TouchableOpacity 
            onPress={() => viewTicket(item.summonsImage.url)}
          >
            <Text style = {ViolationsComponentStyles.viewTicket}>View Ticket</Text>
          </TouchableOpacity>

          {item.amountDue > 0 && (
          <>
            <Text style={ViolationsComponentStyles.clarifyText}>Due to stale data from New York City Open Data, This ticket may have already been paid. Click mark as paid to update it manually. This will have no effect on official payment status of a ticket.</Text>
            <TouchableOpacity
              style={ViolationsComponentStyles.markButton}
              onPress={() => markTicketAsPaid(item._id)}
            >
              <Text style={ViolationsComponentStyles.markButtonText}>Mark as Paid</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={ViolationsComponentStyles.payButton}
              onPress={() => redirectToStatePaymentSite(item)}
            >
              <Text style={ViolationsComponentStyles.payButtonText}>Pay Online</Text>
            </TouchableOpacity>
          </>
        )}
        {item.manuallyUpdated && (
      <TouchableOpacity
        style={ViolationsComponentStyles.undoButton}
        onPress={() => undoMarkAsPaid(item._id)}
      >
        <Text style={ViolationsComponentStyles.undoButtonText}>Undo Mark as Paid</Text>
      </TouchableOpacity>
    )}

      </View>
    )}
  </TouchableOpacity>
);
  return (
    <View style={ViolationsComponentStyles.container}>
      {loading && <ActivityIndicator size="large" color={ViolationsComponentStyles.activityIndicatorColor} />}
      {error && <Text style={ViolationsComponentStyles.error}>{error}</Text>}
      {!loading && !violations.length && <Text style={ViolationsComponentStyles.noViolationsText}>No violations found. Please check the license plate.</Text>}
      <FlatList
  ref={flatListRef}
  data={violations}
  renderItem={renderItem}
  keyExtractor={(item) => item._id}
  ListHeaderComponent={renderSummary}
/>
      {pdfUrl && (
        <PDFViewerModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          pdfUrl={pdfUrl}
        />
        )}
    </View>
  );
};

export default ViolationsComponent;