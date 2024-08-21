// components/GPSDevice.tsx
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';

interface GPSDeviceProps {}

const GPSDevice: React.FC<GPSDeviceProps> = () => {
  const [serialNumber, setSerialNumber] = useState<string>('');
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMessage('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const handleUpdateLocation = async () => {
    try {
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      
      // Send the location to the backend
      await sendLocationToBackend(serialNumber, location.coords.latitude, location.coords.longitude);
    } catch (error) {
      console.error(error);
      setErrorMessage('Error updating location');
    }
  };

  const sendLocationToBackend = async (serialNumber: string, latitude: number, longitude: number) => {
    try {
      const response = await axios.post('http://your-backend-url/api/gps/update-location', {
        serialNumber,
        latitude,
        longitude,
      });

      console.log('Location updated successfully:', response.data.message);
    } catch (error) {
      console.error('Error sending location to backend:', error);
      setErrorMessage('Failed to send location to backend');
    }
  };

  return (
    <View style={styles.container}>
      <Text>GPS Device Simulator</Text>
      <View style={styles.inputContainer}>
        <Text>Serial Number:</Text>
        <TextInput
          style={styles.input}
          onChangeText={setSerialNumber}
          value={serialNumber}
          placeholder="Enter serial number"
        />
      </View>
      {location && (
        <View style={styles.locationContainer}>
          <Text>Current Location:</Text>
          <Text>Latitude: {location.coords.latitude}</Text>
          <Text>Longitude: {location.coords.longitude}</Text>
        </View>
      )}
      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
      <Button title="Update Location" onPress={handleUpdateLocation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    marginLeft: 10,
  },
  locationContainer: {
    marginVertical: 10,
  },
  error: {
    color: 'red',
    marginVertical: 10,
  },
});

export default GPSDevice;
