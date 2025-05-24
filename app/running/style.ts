import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#12263A",
        // justifyContent: "center",
        alignItems: "center",

    },
    boxTop: {
        alignItems: "center"
    },
    logo: {
        width: 104,
        height: 20,
        marginTop: 16,
        marginBottom: 18,
        alignItems: "center"
    },
    cronometro: {
        marginBottom: 22,
        alignItems: "center"
    },
    timer: {
        color: "#FFA500",
        fontWeight: 700,
        fontSize: 72
    },
    duration: {
        color: "#FFA500",
        fontWeight: 400,
        fontSize: 16
    },
    countdownContainer: {

    },
    countdownText: {

    },
    status: {
        width: 350,
        height: 67,
        flexDirection: "row",
        justifyContent: "space-between",

    },
    distance: {


    },
    distanceKM: {
        textAlign: "center",
        color: "#FFA500",
        fontWeight: 600,
        fontSize: 32
    },
    calories: {

    },
    caloriesQuant: {
        textAlign: "center",
        color: "#FFA500",
        fontWeight: 600,
        fontSize: 32
    },
    steps: {

    },
    stepsDistance: {
        textAlign: "center",
        color: "#FFA500",
        fontWeight: 600,
        fontSize: 32
    },
    boxBottom: {
        marginTop: 20
    },
    backgroundMap: {
        width: 669,
        height: 554,
        position: "relative"
    },
    transparentView: {
        position: "absolute",
        marginTop: 385,
        marginLeft: 170
    },
    boxButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 13
    },
    buttonRun: {
        width: 157,
        height: 37,
        backgroundColor: "#FFA500",
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        paddingHorizontal: 10,
        marginTop: 20,
        fontSize: 17
    },
    blurView: {
        width: 334,
        height: 66,
        marginTop: 29,
        borderRadius: 20,
        overflow: 'hidden',
    },
    buttonMenu: {
        width: 335,
        height: 66,
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingLeft: 10,
        paddingRight: 10,
    },
    text: {
        color: "#FFA500",
        fontSize: 12,
    },
    notification: {
        alignItems: "center",
        justifyContent: "flex-start"
    },
    run: {
        alignItems: "center",
        justifyContent: "flex-start"
    },
    timerButton: {
        alignItems: "center",
        justifyContent: "flex-start"
    },
    historical: {
        alignItems: "center",
        justifyContent: "flex-start"
    }
})

export default styles;