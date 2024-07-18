import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingTop: 20,
      paddingBottom: 90
    },
    Weights: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 5,
    },
    buttonDelete: {
        justifyContent: "center",
        paddingRight: 30,
    },
    TextWeight: {
        width: "75%",
        alignContent: "flex-start",
        backgroundColor: "#f5f5f5cf",
        padding: 20,
        paddingHorizontal: 20,
        borderRadius: 50,
        marginBottom: 20,
        marginLeft: 15,
        color: "#282b2db5",
    },
    buttonNew: {
        width: 60,
        height: 60,
        position: "absolute",
        bottom: 30,
        left: 20,
        backgroundColor: "#F92e6a",
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    iconButton: {
        color: "#ffffff",
        fontSize: 25,
        fontWeight: "bold",
    },
    boldWords: {
        fontWeight: "bold"
    }
});

export default styles;