import { StyleSheet } from 'react-native';
import palette from './colorScheme';

const ViolationsComponentStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: palette.background,
  },
  violationItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  violationSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  violationInfo: {
    flex: 1,
  },
  violationNumber: {
    fontSize: 14,
    color: palette.text,
  },
  violationDate: {
    fontSize: 12,
    color: palette.text,
  },
  violationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: palette.primary,
  },
  violationAmount: {
    fontSize: 16,
    color: palette.accent,
  },
  paymentStatus: {
    padding: 5,
    borderRadius: 5,
  },
  paidLabel: {
    fontWeight: 'bold',
    color: palette.success,
    backgroundColor: `${palette.success}20`,
    padding: 8,
    borderRadius: 16,
  },
  unpaidLabel: {
    fontWeight: 'bold',
    color: palette.danger,
    backgroundColor: `${palette.danger}20`,
    padding: 8,
    borderRadius: 16,
  },
  submitButton: {
    backgroundColor: palette.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  activityIndicatorColor: palette.primary,
  error: {
    color: palette.danger,
    padding: 10,
  },
  noViolationsText: {
    textAlign: 'center',
    color: palette.text,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: palette.text,
    fontWeight: 'bold',
  },
  detailValue: {
    fontSize: 14,
    color: palette.text,
  },
  linkText: {
    fontSize: 14,
    color: palette.primary,
    textDecorationLine: 'underline',
    paddingVertical: 4,
  },
  violationDetails: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
});

export default ViolationsComponentStyles;
