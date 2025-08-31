import { StyleSheet , Dimensions} from "react-native"

const { width, height } = Dimensions.get('window');
const fontSizeBase = width < 360 ? 40 : 60;

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
        width: width,
    },
    textTop: {
        color: "#FFF",
        fontSize: 30,
        // marginTop: 12,
    },
    boxMid: {
        alignItems: "center",
    },
    textMid: {
        color: "#FFF",
        fontSize: 32,
        fontWeight: "bold",
        marginLeft: "1%",
    },
    textRace: {
        color: "#FFF",
        fontSize: 32,
        fontWeight: "bold",
    },
    boxBottom: {
        alignItems: "center",
        marginTop: "5%",
    },
    privacyText: {
        color: "#FFF",
        fontSize: 12,
        fontWeight: "bold",
        marginBottom: "2%",
        marginLeft:"8%"
    },
    privacyPolicy: {
        color: "#FFF",
        fontSize: 13,
        fontWeight: "bold",
        marginBottom: "8%",
    },
});

export default styles;