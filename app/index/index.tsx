import React, { useEffect } from "react";
import { View, Text, Image, StatusBar } from "react-native";
import * as SystemUI from 'expo-system-ui';
import { Button } from "../../src/components/Button";
import { router } from "expo-router";
import styles from "./styles";

export default function Index() {
  useEffect(() => {
    SystemUI.setBackgroundColorAsync('#12263A');
  }, []);


  return (
    <>
      <StatusBar backgroundColor="#12263A" barStyle="light-content" />

      <View style={styles.container}>
        <View style={styles.boxTop}>
          <View style={styles.background}>
            <Image source={require("../../src/assets/home.png")} />
          </View>

          <View style={styles.transparentView}>
            <Image source={require("../../src/assets/corraAgil.png")} />
            <Text style={styles.textTop}>Pronto para acelerar?</Text>
          </View>
        </View>

        <View style={styles.boxMid}>
          <Text style={styles.textMid}> Faça login e comece</Text>
          <Text style={styles.textRace}>sua corrida!</Text>

          <Button title="COMEÇAR" variant="tertiary" onPress={() => router.push("./login/login")} />
        </View>

        <View style={styles.boxBottom}>
          
          <Text style={styles.privacyText}>
            Para proteger sua privacidade e garantir a segurança de suas
            informações pessoais, ao continuar, você concorda com a:
          </Text>

          <Text style={styles.privacyPolicy}>Política de privacidade</Text>
        </View>
      </View>
    </>
  );
}