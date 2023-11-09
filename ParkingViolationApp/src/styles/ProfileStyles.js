// src/styles/ProfileStyles.js
import { StyleSheet } from 'react-native';
import palette from './colorScheme'; // Ensure this import path is correct

const ProfileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  scrollView: {
    padding: 10,
  },
  listItemContainer: {
    backgroundColor: palette.surface,
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    shadowColor: palette.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    overflow: 'hidden',
  },
  vehicleInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vehicleTextContainer: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: palette.textPrimary,
  },
  listItemSubtitle: {
    fontSize: 14,
    color: palette.textSecondary,
  },
  listItemDetails: {
    fontSize: 12,
    color: palette.textSecondary,
  },
  viewTicketsIcon: {
    paddingRight: 10,
    color: palette.accentVariant,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: palette.danger,
    borderRadius: 8,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  backRightBtn: {
    alignItems: 'center',
    borderRadius: 8,
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnRight: {
    backgroundColor: palette.danger,
    right: 0,
  },
  backTextWhite: {
    color: palette.background, // White text on the red delete button
  },
  addVehicleButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: palette.primary,
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  addVehicleIcon: {
    color: palette.background, 
  },
  activityIndicator: {
    color: palette.primary,
  },
  errorText: {
    color: palette.danger,
    padding: 10,
  },
  listViewContentContainer: {
    flexGrow: 1,
  },
  noVehiclesText: {
    textAlign: 'center',
    color: palette.textSecondary,
    marginTop: 20,
  },
  deleteIcon: {
    color: palette.danger,
  },
  vehicleInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  vehicleDetails: {
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  vehicleDetailText: {
    fontSize: 14,
    color: palette.textSecondary,
    paddingVertical: 2, 
  },
});

export default ProfileStyles;
