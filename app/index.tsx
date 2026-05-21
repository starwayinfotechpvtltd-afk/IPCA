import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  RefreshControl,
  Platform,
  BackHandler,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import type { WebView as WebViewType } from "react-native-webview";
import { ScrollView } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useIsFocused } from "@react-navigation/native";

export default function App() {
  const webViewRef = useRef<WebViewType>(null);
  const canGoBack = useRef(false);

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loaderShown, setLoaderShown] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [webviewKey, setWebviewKey] = useState(0);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setWebviewKey((prev) => prev + 1);
    }
  }, [isFocused]);

  // Handle Android back button
  useEffect(() => {
    if (Platform.OS === "android") {
      const onBackPress = () => {
        if (canGoBack.current && webViewRef.current) {
          webViewRef.current.goBack();
          return true;
        }
        return false;
      };
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );
      return () => subscription.remove();
    }
  }, []);

  // Handle WebView loading
  const handleLoadEnd = () => {
    setLoading(false);
    setLoaderShown(true);
    setRefreshing(false); // stop refresh on load complete
  };

  const onRefresh = useCallback(() => {
    if (isAtTop && webViewRef.current) {
      setRefreshing(true);
      webViewRef.current.reload();
    }
  }, [isAtTop]);

  // JS to inject into the WebView to detect scroll position
  const injectedScrollScript = `document.addEventListener('scroll', function () { const scrollY = window.scrollY || document.documentElement.scrollTop; if (scrollY <= 5) { window.ReactNativeWebView.postMessage("top"); } else { window.ReactNativeWebView.postMessage("not-top"); } }); true;`;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView
        style={styles.container}
        edges={["top", "bottom", "left", "right"]}
      >
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              enabled={isAtTop}
            />
          }
          scrollEnabled={false} // Disable gesture scroll outside WebView
        >
          <WebView
            key={webviewKey}
            ref={webViewRef}
            source={{ uri: "https://ipca.org.in/" }}
            style={styles.webview}
            startInLoadingState={true}
            onLoadEnd={handleLoadEnd}
            onLoadStart={() => setLoading(true)}
            javaScriptEnabled={true}
            injectedJavaScript={injectedScrollScript}
            onMessage={(event) => {
              const msg = event.nativeEvent.data;
              setIsAtTop(msg === "top");
            }}
            onNavigationStateChange={(navState) => {
              canGoBack.current = navState.canGoBack;
            }}
          />
          {loading && !loaderShown && (
            <View style={styles.loaderContainer}>
              <View style={styles.imageWrapper}>
                <Image
                  source={require("../assets/images/IPCA.png")}
                  style={styles.loaderImage}
                  resizeMode="contain"
                />
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffbf00",
    marginBottom: 20,
  },
  webview: {
    flex: 1,
  },
  loaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.8)",
    zIndex: 10,
  },
  imageWrapper: {
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
    borderRadius: 16,
  },
  loaderImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
