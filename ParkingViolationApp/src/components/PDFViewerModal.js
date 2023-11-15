  import React from 'react';
  import { Modal, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
  import { WebView } from 'react-native-webview';
  import palette from '../styles/colorScheme';
  
  const PDFViewerModal = ({ isVisible, onClose, pdfUrl }) => {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={isVisible}
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <WebView
            source={{ uri: pdfUrl.replace("http://", "https://")}}
            style={styles.webview}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.warn('WebView error: ', nativeEvent);
            }}
          />
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };
  
  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      marginTop: 22,
    },
    webview: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    closeButton: {
      position: 'absolute',
      top: 30,
      right: 20,
      padding: 10,
      backgroundColor: palette.danger,
      borderRadius: 5,
    },
    closeButtonText: {
      color: palette.textPrimary,
      fontSize: 16,
    },
  });
  
  export default PDFViewerModal;
  