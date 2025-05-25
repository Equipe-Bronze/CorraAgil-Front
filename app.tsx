import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./src/appNavigator";
import Toast from "react-native-toast-message";
import { Text } from "react-native";

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.log("Erro capturado:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <Text>Erro inesperado.</Text>;
    }

    // return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppNavigator />
          <Toast />
        </NavigationContainer>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
