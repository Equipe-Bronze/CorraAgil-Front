import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');
const fontSizeBase = width < 360 ? 40 : 60;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#12263A",
    justifyContent: "center",
    alignItems: "center",
  },
  top: {
    width: width,
    alignItems: "center",
    // marginBottom: "5%",
  },
  title: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 32,
  },
  containerInput: {
    marginTop: "5%",
    alignItems: "center",
  },
  toggleButton: {
    padding: 10
  },
  toggleButtonText: {
    fontSize: 16
  },
  forgetPassword: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: "5%",
  },
  containerButton: {
    marginBottom: "30%",
  },
  error: {
    color: "red",
    fontSize: 14,
    margin: 5,
  },
});

export default styles;