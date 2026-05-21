import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Platform, BackHandler } from 'react-native';
import type { WebView as WebViewType } from 'react-native-webview';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';

export default function PestID() {

  const isFocused = useIsFocused();

  // Force WebView remount on tab focus
  const [webViewKey, setWebViewKey] = useState(0);

  useEffect(() => {
    if (isFocused) {
      setWebViewKey(prev => prev + 1);
    }
  }, [isFocused]);


  const webViewRef = useRef<WebViewType>(null);
  const canGoBack = useRef(false);

  useEffect(() => {
    if (Platform.OS === 'android') {
      const onBackPress = () => {
        if (canGoBack.current && webViewRef.current) {
          webViewRef.current.goBack();
          return true;
        }
        return false;
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => {
        subscription.remove();
      };
    }
  }, []);
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <WebView
      key={webViewKey}
        source={{ uri: 'https://ipca.org.in/rescources/pest-id/' }}
        style={styles.webview}
        ref={webViewRef}
        startInLoadingState={true}
        onNavigationStateChange={navState => {
          canGoBack.current = navState.canGoBack;
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffbf00",
    marginBottom: 20
  },
  webview: {
    flex: 1,
    width: "100%",
    height: "100%"
  }
}); 