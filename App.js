import React, { useState , useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Camera , CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

export default function App() {
  // variables to keep track of the camera
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back); // set front or back camera
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off); // set flash
  const cameraRef = useRef(null);

  // this is creating/enabling the permission alert  
  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted'); // user has granted permission === true
    })();
  }, [])
  return (
    <View style={styles.container}>
  <Camera
    style={styles.camera}
    type={type}
    flashMode={flash}
    ref={cameraRef}
  >
    <Text>hello</Text>
  </Camera>
  <View>
    
  </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },

  camera: {
   flex: 1, // using the full space of the view
   borderRadius: 50,
  }
});
