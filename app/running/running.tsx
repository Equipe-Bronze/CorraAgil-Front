import { Image, StatusBar, Text, View, Alert, Linking, Platform, Dimensions } from "react-native"
import { useEffect, useRef, useState } from "react";
import MapView, { Camera, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import Toast from 'react-native-toast-message';
import { useLocalSearchParams, useRouter } from "expo-router";
import { AntDesign, MaterialIcons, Octicons } from "@expo/vector-icons";
import { BlurView } from 'expo-blur';
import styles from "./style"
import { Button } from "../../src/components/Button"


export default function Running() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [customInterval, setCustomInterval] = useState<ReturnType<typeof setInterval> | null>(null);
  const [paused, setPaused] = useState(true);
  const [distance, setDistance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [previousLocation, setPreviousLocation] = useState<Location.LocationObject | null>(null);
  const [calories, setCalories] = useState(0);
  const { startNow } = useLocalSearchParams();
  const [locationGranted, setLocationGranted] = useState(false);
  const { width, height } = Dimensions.get('window');


  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const mapRef = useRef<MapView>(null);
  const defaultRegion = {
    latitude: -23.55052,
    longitude: -46.633308,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };


  // Função para calcular a distância percorrida
  const getDistanceFromLatLonInKm = (coords1: Location.LocationObjectCoords, coords2: Location.LocationObjectCoords) => {

    const toRad = (value: number) => (value * Math.PI) / 180;

    const R = 6371; // Raio da Terra em km
    const dLat = toRad(coords2.latitude - coords1.latitude);
    const dLon = toRad(coords2.longitude - coords1.longitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(coords1.latitude)) * Math.cos(toRad(coords2.latitude)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Retorna a distância em km
  };


  // Atualiza a localização do usuário em tempo real
  useEffect(() => {
    if (!locationGranted) return;

    let subscription: Location.LocationSubscription | null = null;

    (async () => {
      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 1000, // Atualiza a cada 1s
          distanceInterval: 1, // Atualiza a cada 1m
        },
        (response) => {
          if (!paused && previousLocation) {
            const newDistance = getDistanceFromLatLonInKm(previousLocation.coords, response.coords);

            setDistance(prevDistance => {
              const updatedDistance = prevDistance + newDistance;
              updateCalories(updatedDistance);
              return updatedDistance;
            });

            // setDistance(updatedDistance);
          }

          setPreviousLocation(response);
          setLocation(response);
          mapRef.current?.animateCamera({
            center: response.coords,
            zoom: 20,
          });
        }
        
      );
    })();

    return () => {
      subscription?.remove();
    };
  }, [locationGranted, paused, previousLocation]);

  useEffect(() => {
    if (startNow === 'true') {
      startTimer(); // chama sua função para iniciar corrida
    }
  }, [startNow]);

  // Atualiza o cálculo das calorias gastas com base no tempo
  // const updateCalories = (incrementalDistance: number) => {
  //   const speedKmH = (incrementalDistance * 3600) / 1; // pois location atualiza a cada 1 segundo
  //   const MET = speedKmH < 8 ? 7.0 : 9.8; // ajusta MET dependendo da velocidade
  //   const userWeight = 70; // pode ser passado como prop ou vindo de contexto/asyncStorage
  //   const caloriesPerSecond = (MET * userWeight * 3.5) / 200 / 60;

  //   setCalories(prev => parseFloat((prev + caloriesPerSecond).toFixed(2)));
  // };

  // Calculo de calorias atualizado
  const updateCalories = (incrementalDistance: number) => {
    if(distance < 0.01) return "0.00"
    const userWeight = 70;
    const MET = 8; // valor médio
    const kCalPerKm = MET * userWeight * distance;
    const newCalories = incrementalDistance * kCalPerKm;

    setCalories(prev => parseFloat((prev + newCalories).toFixed(2)));
  };

  const getPace = () => {
    if (distance < 0.01) return "00:00";
    // const totalMinutes = (hours * 60) + minutes + (seconds / 60);
    const paceMedio = 1.3;
    const pace = distance / paceMedio;
    const paceMin = Math.floor(pace);
    const paceSec = Math.round((pace - paceMin) * 60);
    return `${paceMin.toString().padStart(2, '0')}:${paceSec.toString().padStart(2, '0')}`;
  };

  // Função para solicitar permissão de localização
  async function requestLocationPermissions() {
    const { granted } = await Location.requestForegroundPermissionsAsync();

    if (!granted) {

      Alert.alert("Permissão negada", "Para utilizar o aplicativo, é necessário permitir o acesso à localização. Você pode ativar isso nas configurações do seu dispositivo.",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Abrir configurações",
            onPress: () => {
              if (Platform.OS === 'ios') {
                Linking.openURL('app-settings:');
              } else {
                Linking.openSettings();
              }
            }
          }
        ]
      );
      return;
    }

    setLocationGranted(true);
    const currentPosition = await Location.getCurrentPositionAsync();
    setLocation(currentPosition);
  }

  useEffect(() => {
    requestLocationPermissions();
  }, [])

  useEffect(() => {
    if (location) {
      mapRef.current?.animateCamera({
        center: location.coords,
        zoom: 20
      });
    }
  }, [location]);


  // Funções para controle do cronômetro
  const startTimer = () => {
    if (customInterval !== null && !paused) {
      return
    }

    const intervalId = setInterval(() => {
      changeTime();
    }, 1000);

    setCustomInterval(intervalId);
    setPaused(false);
  }

  const stopTimer = () => {
    if (customInterval) {
      clearInterval(customInterval);
      setCustomInterval(null);
      setPaused(true);
    }
  };

  const clearTimer = () => {
    stopTimer();
    setSeconds(0);
    setMinutes(0);
    setHours(0);
    setPaused(true);
  }

  const changeTime = () => {
    setSeconds((prevState) => {
      if (prevState + 1 === 60) {
        setMinutes((prevMinutes) => {
          if (prevMinutes + 1 === 60) {
            setHours((prevHours) => prevHours + 1);
            return 0;
          }
          return prevMinutes + 1;

        });

        return 0;
      }

      return prevState + 1;
    })
  }

  const confirmFinishRun = () => {
    stopTimer(); // Pausa o cronômetro

    Alert.alert(
      "Finalizar corrida",
      "Tem certeza que deseja finalizar a corrida?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Finalizar",
          onPress: () => {
            const totalTime = getTotalTimeInSeconds();
            const formattedTime = formatTime(totalTime);

            sendRace({
              time: totalTime,
              distance: distance,
              calories: calories
            });

            setDistance(0);
            setCalories(0);
            clearTimer(); // Reseta o tempo
            setPaused(true);

            Alert.alert(
              "Corrida Finalizada",
              `Tempo total da corrida: ${formattedTime}`,
              [{ text: "OK" }]
            );
          }
        }
      ]
    );
  };

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const getTotalTimeInSeconds = () => {
    const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
    console.log(totalSeconds);
    return totalSeconds;
  };

  const darkMapStyle = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#242f3e"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#746855"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#242f3e"
        }
      ]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#d59563"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#d59563"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#263c3f"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#6b9a76"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#38414e"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#212a37"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9ca5b3"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#746855"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#1f2835"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#f3d19c"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#2f3948"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#d59563"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#17263c"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#515c6d"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#17263c"
        }
      ]
    }
  ]

  const sendRace = async ({
    time,
    distance,
    calories
  }: {
    time: number;
    distance: number;
    calories: number;

  }) => {

    try {
      setLoading(true);

      const endPoint = "https://corraagil.onrender.com/corrida";

      const response = await fetch(endPoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          time,
          distance,
          calories,
          // user: idUser
        })
      });

      const responseText = await response.text()

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
          Alert.alert("Erro", "Erro no servidor. Tente novamente mais tarde")
          throw new Error("Erro no servidor. Tente novamente mais tarde");
        } else if (response.status === 400 || response.status === 401) {
          Alert.alert("Erro", "Email ou senha inválidos")
          throw new Error("Email ou senha inválidos");
        } else {
          throw new Error((data.message || response.statusText || data));
        }
      }

    } catch (err) {
      // console.error(err);
    } finally {
      // Alert.alert("Sucesso", "Corrida salva com sucesso!");
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#12263A" barStyle="light-content" />

      <View style={styles.boxTop}>
        <Image style={styles.logo} source={require("../../src/assets/corraAgil.png")} />

        <View style={styles.cronometro}>
          <Text style={styles.timer}>
            {hours < 10 ? "0" + hours : hours}:
            {minutes < 10 ? "0" + minutes : minutes}:
            {seconds < 10 ? "0" + seconds : seconds}
          </Text>
          <Text style={styles.duration}>Duração</Text>
        </View>

        <View style={styles.status}>
          <View style={styles.distance}>
            <Text style={styles.distanceKM}>{distance.toFixed(2)}</Text>
            <Text style={{ color: "#FFA500" }}>Distancia(KM)</Text>
          </View>

          <View style={styles.calories}>
            <Text style={styles.caloriesQuant}>{calories.toFixed(2)}</Text>
            <Text style={{ color: "#FFA500" }}>Calorias</Text>
          </View>

          <View style={styles.steps}>
            <Text style={styles.stepsDistance}>{getPace()}</Text>
            <Text style={{ color: "#FFA500" }}>Passos (min/km)</Text>
          </View>

        </View>
      </View>

      <View style={[styles.container, { opacity: location ? 1 : 0 }]}>
        <View style={styles.boxBottom}>

          {
            location &&

            <MapView
              ref={mapRef}
              style={styles.backgroundMap}
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                  }} /*

                location
                  ? {
                    latitude: location.coords.latitude + 0.05,
                    longitude: location.coords.longitude + 0.05,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                  }
                  :
                  defaultRegion}*/
              showsUserLocation={true}
              customMapStyle={darkMapStyle}
            />
          }

          <View style={styles.transparentView}>
            <View>
              {paused ?
                <Button
                  title="CORRER"
                  variant="primary"
                  // onPress={() => paused ? router.push('../countDown/countDown') : setPaused(false)}
                  onPress={startTimer}
                  IconCenter={AntDesign}
                  IconCenterName="caretright"
                />
                :
                <View style={styles.boxButton}>
                  <Button
                    title="Finalizar"
                    variant="primary"
                    onPress={confirmFinishRun}
                    style={styles.buttonRun}
                    loading={loading} />

                  <Button
                    title="Pausar"
                    variant="primary"
                    onPress={stopTimer}
                    style={styles.buttonRun}
                    IconCenter={MaterialIcons}
                    IconCenterName="pause" />

                </View>
              }
            </View>

            <BlurView intensity={4} style={[styles.blurView, { backgroundColor: '#12263A' }]}>

              <View style={styles.buttonMenu}>

                <View style={styles.notification}>
                  <MaterialIcons name="notifications" size={24} color="#FFA500" />
                  <Text style={styles.text}> Notificação </Text>
                </View>

                <View style={styles.run}>
                  <MaterialIcons name="directions-run" size={24} color="#FFA500" />
                  <Text style={styles.text}> Correr </Text>
                </View>

                <View style={styles.timerButton}>
                  <MaterialIcons name="timer" size={24} color="#FFA500" />
                  <Text style={styles.text}> Timer </Text>
                </View>

                <View style={styles.historical}>
                  <Octicons name="history" size={24} color="#FFA500" />
                  <Text style={styles.text}> Histórico </Text>

                </View>

              </View>

            </BlurView>
          </View>
        </View>
      </View>

    </View>
  )
}