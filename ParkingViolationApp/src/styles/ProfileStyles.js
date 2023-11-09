// ProfileStyles.js
import { PlatformColor, StyleSheet } from 'react-native';
import palette from './colorScheme'; 

const ProfileStyles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      backgroundColor: palette.background,
    },
    listItemContainer: {
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
    vehicleInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    listItemTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: palette.primary,
    },
    listItemSubtitle: {
      fontSize: 14,
      color: palette.text,
    },
    listItemDetails: {
      fontSize: 12,
      color: palette.accent,
    },
    deleteIcon: {
      color: palette.danger,
    },
    addVehicleButton: {
      position: 'absolute',
      right: 20,
      bottom: 20,
      backgroundColor: palette.primary,
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    addVehicleIcon: {
      fontSize: 24,
      color: palette.background,
    },
    noVehiclesText: {
        textAlign: 'center',
        fontSize: 16,
        color: palette.text,
        marginTop: 20,
      },
      activityIndicator: {
        color: palette.primary,
      },
    buttonGroup: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 20,
    },
    logoutButton: {
      backgroundColor: palette.danger,
    },
    mainButton: {
      backgroundColor: palette.primary,
    },
  });
  
  export default ProfileStyles;