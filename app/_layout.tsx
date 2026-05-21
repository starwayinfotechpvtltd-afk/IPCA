import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <Tabs
      initialRouteName="index"
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#ffbf00",
          tabBarInactiveTintColor: "#00344A",
          tabBarStyle: {
            height: 70,
            paddingBottom: 0,
            paddingTop: 0,
            borderTopWidth: 1,
            elevation: 0,
            position: 'absolute',
            bottom: 0,
            backgroundColor: "#eeeeee"
          }
        }}>
        <Tabs.Screen name="membership/join-ipca" options={{
          title: "Join IPCA",
          tabBarIcon: ({ color, size }) => {
            return <Ionicons name="person-add" color={color} size={size} />
          }
        }}
        />
        <Tabs.Screen name="contact/contact-us" options={{
          title: "Contact",
          tabBarIcon: ({ color, size }) => {
            return <Ionicons name="call" color={color} size={size} />
          }
        }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarLabel: "",
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  position: "absolute",
                  top: -30,
                  backgroundColor: focused ? "#ffbf00" : "#fff",
                  borderRadius: 40,
                  width: 70,
                  height: 70,
                  alignItems: "center",
                  justifyContent: "center",
                  elevation: 20,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 50,
                }}
              >
                <Ionicons
                  name="home"
                  size={32}
                  color="#00344A"
                />
              </View>
            )
          }}
        />
        <Tabs.Screen name="pest-talk/news" options={{
          title: "News",
          tabBarIcon: ({ color, size }) => {
            return <Ionicons name="newspaper" color={color} size={size} />
          }
        }}
        />
        <Tabs.Screen name="pest/pest" options={{
          title: "Pest",
          tabBarIcon: ({ color, size }) => {
            return <Ionicons name="bug" color={color} size={size} />
          }
        }}
        />
      </Tabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eeeeee"
  }
});
