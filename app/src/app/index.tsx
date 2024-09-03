import { 
    StyleSheet, 
    View, 
    TouchableOpacity, 
    Modal, 
    Text,
    Dimensions 
} from 'react-native';
import { style } from '../style/style';
import { 
    Camera, 
    useCameraDevice, 
    useCameraPermission, 
    useMicrophonePermission 
} from 'react-native-vision-camera';
import { useEffect, useState, useRef } from 'react';

import { Video, ResizeMode } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';

const { width: widthScreen, height: heightScreen } = Dimensions.get('screen');

export default function App () {

    const device = useCameraDevice('back');
    const { hasPermission, requestPermission } = useCameraPermission();
    const { hasPermission: hasMicPermission, requestPermission: requestMicPermission } = useMicrophonePermission();
    const [ isRecording, setIsRecording ] = useState<boolean>(false);

    const [ videoUri, setVideoUri ] = useState<string | null>(null);
    const [ modalVisible, setModalVisible ] = useState<boolean>(false);

    const [permission, setPermission] = useState<null | boolean>(null);

    const cameraRef = useRef<Camera>(null);

    useEffect(() => {
        (async () => {
            const status = await requestPermission();
            const statusMic = await requestMicPermission();

            if(status && statusMic){
                setPermission(true);
            }

            const { status: statusMediaLibrary } = await MediaLibrary.requestPermissionsAsync();
            if(statusMediaLibrary !== 'granted'){
                setPermission(false);
                return;
            }
        })()
    }, []);

    const startRecording = () => {
        if(!cameraRef.current || !device) return;
        setIsRecording(true);

        cameraRef.current.startRecording({
            onRecordingFinished: (video) => {
                setIsRecording(false);
                setVideoUri(video.path);
                setModalVisible(true);
            },
            onRecordingError: (error) => {
                console.log(error);
            }
        });
    }

    const stopRecording = async () => {
        if(cameraRef.current){
            await cameraRef.current.stopRecording();
            setIsRecording(false);
        }
    }

    const handleSaveVideo = async () => {
        if(videoUri){
            try{
                await MediaLibrary.createAssetAsync(videoUri);
            }catch(error){
                console.log(error);
            }
        }
    }

    function handleCloseModal(){
        setModalVisible(false);
    }

    if(!permission)
        return <View></View>;

    if(!device || device === null)
        return <View></View>;


    return (
        <View style={style.container}>
            <Camera
               style={StyleSheet.absoluteFill}
               ref={cameraRef}
               device={device} 
               isActive={true}
               video={true}
               audio={true}
               resizeMode='cover'
            />

            <TouchableOpacity 
                style={style.botao}
                onPressIn={startRecording}
                onPressOut={stopRecording}
            />

            {videoUri && (
                <Modal
                    animationType='slide'
                    transparent={false}
                    visible={modalVisible}
                    onRequestClose={handleCloseModal}
                >
                    <View style={style.videoContainer}>
                        <Video
                            source={{
                                uri: videoUri
                            }}
                            rate={1.0}
                            volume={1.0}
                            isMuted={false}
                            shouldPlay
                            isLooping
                            resizeMode={ResizeMode.COVER}
                            style={{ width: widthScreen, height: heightScreen }}
                        />
                        <View style={style.botaoContainer}>
                            <TouchableOpacity 
                                style={style.botaoModal}
                                onPress={handleCloseModal}
                            >
                                <Text>Fechar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={style.botaoModal} onPress={handleSaveVideo}>
                                <Text>Salvar Vídeo</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
}