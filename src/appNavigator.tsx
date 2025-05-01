// AppNavigator.tsx
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { Platform } from "react-native";
import Index from "../app/index/index";
import Login from "../app/login/login";
import Register from "../app/register/register";
import ForgotPassword from "../app/forgotPassword/forgotPassword";
import TokenPassword from "../app/tokenPassword/tokenPassword";
import ResetPassword from "../app/resetPassword/resetPassword";
import ChangedPassword from "../app/changedPassword/changedPassword";
import Running from "../app/running/running";
import CountDown from "../app/countDown/countDown";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Index">
        <Stack.Screen name="Index" component={Index} options={{ title: "Página Inicial" }} />
        <Stack.Screen name="Login" component={Login} options={{ title: "Login" }} />
        <Stack.Screen name="Register" component={Register} options={{ title: "Cadastro" }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ title: "Esqueceu a Senha" }}/>
        <Stack.Screen name="TokenPassword" component={TokenPassword} options={{ title: "Token de Reset de Senha" }}/>
        <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ title: "Reset de Senha" }}/>
        <Stack.Screen name="ChangedPassword" component={ChangedPassword} options={{ title: "Senha Alterada" }}/>
        <Stack.Screen name="Running" component={Running} options={{ title: "Correr" }}/>
        <Stack.Screen name="CountDown" component={CountDown} options={{ title: "Contagem Regressiva" }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
