import { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function CountdownScreen() {
  const [count, setCount] = useState(3);
  const router = useRouter();

  useEffect(() => {
    if (count === 0) {
      // Redireciona para a tela da corrida com o parâmetro
      router.replace({ pathname: '../running/running', params: { startNow: 'true' } });
    } else {
      const timer = setTimeout(() => {
        setCount(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [count]);

  return (
    <View style={styles.container}>
      <Text style={styles.number}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D253F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  number: {
    fontSize: 160,
    color: '#FFA800',
    fontWeight: 'bold',
  },
});