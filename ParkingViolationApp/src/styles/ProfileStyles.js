// ProfileStyles.js
import { PlatformColor, StyleSheet } from 'react-native';
import palette from './colorScheme'; // Ensure this import points to the correct file path for your color scheme

const ProfileStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: palette.background, // Using color from the scheme
    },
    boldText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: palette.text, // Using color from the scheme
        marginBottom: 20,
    },
    cardContainer: {
        marginBottom: 20,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: palette.background, // Optional: if you want cards to have the same bg as the app
    },
    regularText: {
        fontSize: 16,
        color: palette.text, // Using color from the scheme
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'flex-end',
    },
    iconButton: {
        marginLeft: 10,
    },
    addButton: {
        backgroundColor: palette.accent, // Using accent color for the button
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: palette.background, // Text color contrast with the button
        fontSize: 16,
        fontWeight: 'bold',
    },
    listItemContainer: {
        borderBottomWidth: 1,
        borderBottomColor: palette.accent, // Subtle color for the list item border
        borderLeftWidth: 4,
        borderLeftColor: palette.primary, // Highlight color for the vertical border
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: palette.background, 
        marginBottom: 2,
    },
    listItemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: palette.text, 
    },
    listItemSubtitle: {
        fontSize: 16,
        color: palette.primary, 
    },
    listItemDetails: {
        fontSize: 12,
        color: palette.accent,
    },
    deleteIcon: {
        color: palette.danger, 
    },
    addVehicleButton: {
        position: 'absolute', // Floats over the content
        right: 50, // 20 pixels from the right
        bottom: 50, // 20 pixels from the bottom
        backgroundColor: palette.success, // Using the accent color
        width: 56, // Circular button standard diameter
        height: 56, // Circular button standard diameter
        borderRadius: 28, // Half the width/height to make it perfectly round
        justifyContent: 'center', // Center the icon vertically
        alignItems: 'center', // Center the icon horizontally
        elevation: 6, // Shadow for Android
        shadowColor: '#000', // Shadow color for iOS
        shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
        shadowOpacity: 0.25, // Shadow opacity for iOS
        shadowRadius: 3.84, // Shadow radius for iOS
      },
      
      addVehicleIcon: {
        fontSize: 24,
        color: palette.background, // Icon color that contrasts with the button
      },
});

export default ProfileStyles;
