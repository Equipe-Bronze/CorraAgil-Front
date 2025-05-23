import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#12263A",
        alignItems: "center",
    },
    boxTop: {
        alignItems: "center",
    },
    background: {
        position: "relative",
    },
    transparentView: {
        justifyContent: "flex-end",
        alignItems: "center",
        position: "absolute",
        height: 535,
        width: 430,
    },
    textTop: {
        color: "#FFF",
        fontSize: 30,
        marginTop: 12,
    },
    boxMid: {
        alignItems: "center",
        marginTop: 15,
    },
    textMid: {
        color: "#FFF",
        fontSize: 32,
        fontWeight: "bold",
        paddingLeft: 15,
    },
    textRace: {
        color: "#FFF",
        fontSize: 32,
        fontWeight: "bold",
    },
    boxBottom: {
        alignItems: "center",
        marginTop: 25,
    },
    privacyText: {
        color: "#FFF",
        fontSize: 12,
        fontWeight: "bold",
        marginBottom: 8,
        marginLeft:15
    },
    privacyPolicy: {
        color: "#FFF",
        fontSize: 13,
        fontWeight: "bold",
        marginBottom: 8,
    },
});

export default styles;