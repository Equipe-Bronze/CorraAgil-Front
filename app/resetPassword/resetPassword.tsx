import { View, Text, Image, StatusBar, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { Button } from "../../src/components/Button";
import { Input } from "../../src/components/Input";
import { Ionicons } from "@expo/vector-icons";
import { useGlobalSearchParams, useRouter } from "expo-router";
import * as Yup from "yup";
import styles from "./style";

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .required("Senha é obrigatória")
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .matches(/^(?=.*[A-Z])(?=.*[@#%&$]).*$/, "A senha deve conter pelo menos uma letra maiúscula e um caractere especial (@, #, %, & ou $)"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "As senhas não coincidem")
    .required("Confirmação de senha é obrigatória"),
});

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const { token } = useGlobalSearchParams();

  const router = useRouter();

  const sendResetPassword = async () => {
    try {
      setErrors({});
      setLoading(true);

      await validationSchema.validate(
        { password, confirmPassword },
        { abortEarly: false }
      );

      const endPoint = "https://corraagil.onrender.com/saveSenha"

      const response = await fetch(endPoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          senha: password
        }),
      });

      const responseText = await response.text()

      let data

      try {
        data = responseText.startsWith("{") || responseText.startsWith("[")
          ? JSON.parse(responseText)
          : responseText;
      } catch (jsonError) {
        throw new Error("Erro ao processar a resposta como JSON: " + jsonError);
      }

      if (!response.ok) {
        if (response.status === 500) {
          Alert.alert("Erro","Erro no servidor. Tente novamente mais tarde");
          throw new Error("Erro no servidor. Tente novamente mais tarde");
        } else if (response.status === 409) {
          Alert.alert("Erro","Email ja cadastrado");
          throw new Error("Email ja cadastrado");
        } else if (response.status === 400) {
          Alert.alert("Erro","A senha deve ter no mínimo 8 caracteres, pelo menos um caractere especial (@, #, %, & ou $) e uma letra maiúscula.");
          throw new Error("Senha fora dos padroes");
        } else if (response.status === 401) {
          Alert.alert("Erro","Token inválido ou expirado");
          throw new Error("Token inválido");
        } else {
          throw new Error((data.message || response.statusText || data));
        }
      }

      router.push("../changedPassword/changedPassword")

      setPassword("");
      setConfirmPassword("");

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
  }

  return (
    <>
      <View style={styles.container}>
        <StatusBar backgroundColor="#12263A" barStyle="light-content" />
        <View style={styles.boxTitle}>

          <Image
            source={require("../../src/assets/corraAgil.png")} />

          <Text style={styles.textTitle}>Redefinir Senha</Text>

        </View>

        <View style={styles.boxMid}>

          <Text style={styles.textMid}>Dica: Deve conter 8 caracteres sendo 1 letra maiúscula e 1 caractere diferente</Text>

        </View>

        <View style={styles.boxInput}>

          <Text style={styles.textInput}>Senha</Text>

          <Input placeholder={"Senha"}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={isPasswordVisible}
            autoCapitalize="none"
            IconRigth={Ionicons}
            iconRigthName={isPasswordVisible ? "eye-off" : "eye"}
            onIconRigthPress={() => setIsPasswordVisible(!isPasswordVisible)}
          />

          {errors.password && <Text style={styles.error}>{errors.password}</Text>}

          <Text style={styles.textInput}>Confirmar nova senha</Text>

          <Input
            placeholder={"Confirmar senha"}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={isPasswordVisible}
            autoCapitalize="none"
            IconRigth={Ionicons}
            iconRigthName={isPasswordVisible ? "eye-off" : "eye"}
            onIconRigthPress={() => setIsPasswordVisible(!isPasswordVisible)}
          />

          {errors.confirmPassword && (
            <Text style={styles.error}>{errors.confirmPassword}</Text>
          )}

        </View>

        <Button title="CRIAR NOVA SENHA" variant="tertiary" onPress={() => sendResetPassword()} loading={loading} />

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

      </View>
    </>
  );
}