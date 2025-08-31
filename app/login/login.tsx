import { useState } from "react";
import { View, Text, Image, StatusBar, Alert } from "react-native";
import * as SecureStore from 'expo-secure-store';
import { Input } from "../../src/components/Input";
import { Button } from "../../src/components/Button";
import * as Yup from "yup";
import { router } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import styles from "./styles";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  password: Yup.string()
    .required("Senha é obrigatória")
    .min(8, "Senha deve ter no mínimo 8 caracteres"),
});

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const sendForm = async () => {

    try {
      setErrors({});
      setLoading(true);

      await validationSchema.validate(
        { email, password },
        { abortEarly: false }
      );

      const endPoint = "https://corraagil.onrender.com/login";

      const response = await fetch(endPoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          senha: password,
        })
      });

      const responseText = await response.text();

      console.log("Response Text:", responseText);
      
      const contentType = response.headers.get("Content-Type");

      let data;

      try {
        if (responseText.startsWith('{') || responseText.startsWith('[')) {
          data = JSON.parse(responseText)
        } else {
          data = responseText
        }
      } catch (jsonError) {
        throw new Error("Erro ao processar a resposta como JSON: " + jsonError)
      }

      if (!response.ok) {
        if (response.status === 500) {
          Alert.alert("Erro","Erro no servidor. Tente novamente mais tarde")
          throw new Error("Erro no servidor. Tente novamente mais tarde");
        } else if (response.status === 400 || response.status === 401) {
          Alert.alert("Erro","Email ou senha inválidos")
          throw new Error("Email ou senha inválidos");
        } else {
          // Alert.alert("Erro","Ocorreu um erro. Tente novamente mais tarde")
          throw new Error((data.message || response.statusText || data));
        }
      }


      if (data.token){
        await SecureStore.setItemAsync('token', data.token);
      } else{
        console.log("Token não encontrado na resposta"), data;
      }

      if (data.email) {
        await SecureStore.setItemAsync('email', data.email);
        setEmail(data.email);
      }

      if (data.password) {
        setPassword(data.password);
      }

      // Alert.alert("Sucesso", "Login realizado com sucesso!");
      router.push("../running/running")

    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errorMessages: { [key: string]: string } = {};
        err.inner.forEach((error) => {
          if (error.path) {
            errorMessages[error.path] = error.message;
          }
        });
        setErrors(errorMessages);

        setTimeout(() => {
          setErrors({});
        }, 5000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      
      <StatusBar backgroundColor="#12263A" barStyle="light-content" />
      
      <View style={styles.top}>
        <Image
          source={require("../../src/assets/topLogin.png")} 
          style={{maxHeight: "70%"}}
          />

        <Image
          source={require("../../src/assets/corraAgil.png")}
          style={{ marginTop: "7%" }}
        />
      </View>

      <Text style={styles.title}>Login</Text>

      <View style={styles.containerInput}>

        <Input
          placeholder={"E-mail"}
          value={email}
          autoCapitalize="none"
          keyboardType="email-address"
          autoCorrect={false}
          autoComplete="off"
          onChangeText={text => setEmail(text)}
          IconRigth={MaterialIcons}
          iconRigthName="email"
        />

        {errors.email && <Text style={styles.error}>{errors.email}</Text>}

        <Input
          placeholder={"Senha"}
          value={password}
          onChangeText={text => setPassword(text)}
          secureTextEntry={isPasswordVisible}
          autoCapitalize="none"
          IconRigth={Ionicons}
          iconRigthName={isPasswordVisible ? "eye-off" : "eye"}
          onIconRigthPress={() => setIsPasswordVisible(!isPasswordVisible)}
        />

        {errors.password && <Text style={styles.error}>{errors.password}</Text>}

      </View>

      <Text style={styles.forgetPassword} onPress={() => router.push("../forgotPassword/forgotPassword")}>ESQUECEU A SENHA?</Text>

      <View style={styles.containerButton}>
        <Button
          title="ENTRAR"
          variant="primary"
          onPress={() => { sendForm() }}
          loading={loading}
        />

        <Button title="CADASTRAR" variant="tertiary" onPress={() => router.push("../register/register")} />
        {/* <Button title="CADASTRAR" variant="tertiary" onPress={() => router.push("../running/running")} /> */}
      </View>
    </View>
  );
}