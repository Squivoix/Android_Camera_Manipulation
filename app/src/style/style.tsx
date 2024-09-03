import { StyleSheet } from "react-native";

export const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    botao: {
        width: 70,
        height: 70,
        borderRadius: 99,
        borderWidth: 8,
        borderColor: 'red',
        bottom: 70,
        alignSelf: 'center'
    },
    videoContainer: {
        flex: 1,
        width: '100%',
        height: '100%'
    },
    botaoContainer: {
        position: 'absolute',
        zIndex: 99,
        flexDirection: 'row',
        gap: 14
    },
    botaoModal: {
        backgroundColor: '#FFF',
        paddingLeft: 24,
        paddingRight: 24,
        paddingTop: 8,
        paddingBottom: 8,
        top: 24,
        left: 24,
        borderRadius: 4
    }
});