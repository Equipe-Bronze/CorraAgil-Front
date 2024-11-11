import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#12263A",
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        marginBottom: 58
    },
    boxMid: {
        width: 362,
        gap: 20
    },
    textMid: {
        color: "#FFF",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 27,
        marginBottom: 58
    },
    boxBottom: {
        width: 362
    },
    textBottom: {
        color: "#FFF",
        textAlign: "center",
        fontSize: 13,
    },
    backButton: {
        position: "absolute",
        bottom: 20,
        left: 20,
    }
});

export default styles;