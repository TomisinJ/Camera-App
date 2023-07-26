import React, { useState , useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Camera , CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import Button from './src/components/Button';

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

  const takePicture = async () => {
    if(cameraRef) { // if we have areference to the camera
      try {
        const data = await cameraRef.current.takePictureAsync();
        console.log(data);
        setImage(data.uri); // we are taking the uri and saving it to our variable image, we need to reference the uri to show the image to the user
      } catch(e) { // catch error
        console.log(e);
      }
    }
  }

  const saveImage = async () => {
    if(image) { // if we have an image
      try{
        await MediaLibrary.createAssetAsync(image); // save to a specific album?
        alert('picture saved')
        setImage(null); // save the image, don't need it there again so set the camera image to null
      } catch(e) {
        console.log(e)
      }
    }
  }

  if(hasCameraPermission === false) {
    return <Text>No access to camera</Text>
  }

  return (
    <View style={styles.container}>
      { !image ? // if we dont have an image show the camera, if we have an image show the image
      <Camera
        style={styles.camera}
        type={type}
        flashMode={flash}
        ref={cameraRef}
      >
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 30
        }}>
          <Button icon ={'retweet'} onPress={() => { setType(type === CameraType.back ? CameraType.front : CameraType.back )}}/>
          <Button icon ={'flash'} color={ flash === Camera.Constants.FlashMode.off ? 'gray' : 'white'}
           onPress={() => { // is there inconsistent syntax?
            setFlash(flash === Camera.Constants.FlashMode.off 
            ? Camera.Constants.FlashMode.on 
            : Camera.Constants.FlashMode.off
            )
            }}/> 
        </View>
      </Camera>
        : 
      <Image source={{uri: image}} style={styles.camera} /> // same size of the camera to show the image
      }
      <View>
        {image ? // if we have an image, show these buttons, if not show take a picture button
        <View style={{ // inline style for now
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 50
        }}>
          <Button title={"retake"} icon ="retweet" onPress={() => setImage(null)}/>
          <Button title={"save"} icon ="check" onPress={saveImage}/>
        </View>
        :
        <Button title={'Take a picture'} icon="camera" onPress={takePicture}/>
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    paddingBottom: 70,
  },

  camera: {
   flex: 1, // using the full space of the view
   borderRadius: 50,
  }
});
