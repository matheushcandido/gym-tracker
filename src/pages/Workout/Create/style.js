import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingTop: 20,
    },
    label: {
        width: "90%",
        marginTop: 20,
        marginLeft: 20,
        fontSize: 16,
        color: "#F92E6A",
    },
    inputText: {
        width: "90%",
        marginTop: 10,
        padding: 10,
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: "#F92E6A",
        marginLeft: "auto",
        marginRight: "auto",
    },
    buttonNew: {
        width: 80,
        height: 80,
        position: "absolute",
        bottom: 20,
        left: 20,
        backgroundColor: "#F92e6a",
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    iconSave: {
        color: "#ffffff",
        fontSize: 15,
        fontWeight: "bold",
    },
    buttonAddExercise: {
        width: 80,
        height: 80,
        position: "absolute",
        bottom: 20,
        right: 20,
        backgroundColor: "#000000",
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#F92e6a",
    },
    iconAddExercise: {
        color: "#ffffff",
        fontSize: 15,
        fontWeight: "bold",
    },
    exerciseItem: {
        width: "90%",
        marginTop: 10,
        padding: 10,
        height: 80,
        borderBottomWidth: 1,
        borderBottomColor: "#F92E6A",
        marginLeft: "auto",
        marginRight: "auto",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "80%",
        padding: 20,
        backgroundColor: "white",
        borderRadius: 10,
        alignItems: "center",
    },
    buttonCancel: {
        width: "48%",
        padding: 10,
        backgroundColor: "#F92e6a",
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        marginLeft: 10,
    },
    iconCancel: {
        color: "#ffffff",
        fontSize: 15,
        fontWeight: "bold",
    },
    buttonConfirmAddExercise: {
        width: "48%",
        padding: 10,
        backgroundColor: "#F92e6a",
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        marginRight: 10,
    },
    iconConfirmAddExercise: {
        color: "#ffffff",
        fontSize: 15,
        fontWeight: "bold",
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
});

export default styles;
