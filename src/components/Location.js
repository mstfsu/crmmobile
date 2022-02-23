import React, {useState, useEffect, useRef} from 'react';
import {
  Animated,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  View,
  Alert,
} from 'react-native';
import MapView, {Polyline, PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import io from 'socket.io-client/dist/socket.io';
import {Socket} from 'socket.io-client';
import Config from 'react-native-config';
import {connect, useDispatch} from 'react-redux';
import Header from './Header';
import * as geolib from 'geolib';
import {Get_Agent_Location} from '../actions';

const Location = props => {
  const [currentLongitude, setCurrentLongitude] = useState(-122.4324);
  const [currentLatitude, setCurrentLatitude] = useState(37.78825);
  const [infoMessage, setInfoMessage] = useState(true);
  const connectionConfig = {
    jsonp: false,
    reconnection: true,
    reconnectionDelay: 100,
    reconnectionAttempts: 100000,
    transports: ['websocket'],
  };
  var watchId;
  var longitudeLast = 0;
  var latitudeLast = 0;
  const dispatch = useDispatch();
  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        console.log('iOS');
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //To Check, If Permission is granted
            //getCurrentPosition();
            console.log('You can use the location');
            trackAgent();
          } else {
            console.log('Location permission denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };
    var socket = io(Config.SOCKET_URL, connectionConfig);
    socket.on('connect', function (response) {
      socket.emit('agent_mobile', props.Agent.id, 'mobile');
    });
    requestLocationPermission();
    return () => {
      console.log('unmount');
      Geolocation.clearWatch(watchId);
      Geolocation.stopObserving();
    };
  }, []);

  const getCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      position => {
        console.log(position);
        setCurrentLatitude(position.coords.latitude);
        setCurrentLongitude(position.coords.longitude);
        console.log(position.coords);
        console.log(typeof position.coords.longitude);
      },
      error => {
        console.log(error);
      },
      {
        showLocationDialog: true,
        enableHighAccuracy: true,
        timeout: 5000,
      },
    );
  };
  const changeInfoMessage = () => {
    if (infoMessage) {
      let message =
        'Hi! Your location informations will send to our server. Please dont stop the app. App can work on background. This red mark show your current location';
      return message;
    } else {
      return 'Please control your internet connection, we can not your location correctly.';
    }
  };
  const AlertInfo = message => {
    Alert.alert('error', message, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
  };
  const trackAgent = async () => {
    await getLastLocation();
    watchId = Geolocation.watchPosition(
      position => {
        // setCoordinates(old => [
        //   ...old,
        //   {
        //     latitude: position.coords.latitude,
        //     longitude: position.coords.longitude,
        //   },
        // ]);
        var distance = geolib.getDistance(
          {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          {
            latitude: latitudeLast,
            longitude: longitudeLast,
          },
        );
        if (distance > 3) {
          dispatch(
            Get_Agent_Location({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }),
          );
        }

        if (position.coords.accuracy < 30 && distance > 100) {
          axios
            .post(Config.BASE_URL + 'Agent/create_map_info', {
              longitude: position.coords.longitude,
              latitude: position.coords.latitude,
              altitude: position.coords.altitude.toString(),
              accuracy: position.coords.accuracy.toString(),
              speed: position.coords.speed.toString(),
              agent_id: props.Agent.id,
              api_token: props.AgentToken,
            })
            .then(function (response) {
              console.log(response.data);
              longitudeLast = position.coords.longitude;
              latitudeLast = position.coords.latitude;
              if (response.data.success === false) {
                AlertInfo('Location can not send. Please contact with admin.');
              }
            })
            .catch(function (error) {
              console.log(error);
              AlertInfo('There is error. Please contact with admin.');
            });
          setCurrentLatitude(position.coords.latitude);
          setCurrentLongitude(position.coords.longitude);
          setInfoMessage(true);
        } else if (position.coords.accuracy > 30) {
          setInfoMessage(false);
        }
      },
      error => {
        console.log(error);
      },
      {
        showLocationDialog: true,
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
        distanceFilter: 0,
      },
    );
  };
  const getLastLocation = async () => {
    await axios
      .get(
        Config.BASE_URL +
          'Agent/get_agent_last_location?api_token=' +
          props.AgentToken +
          '&agent_id=' +
          props.Agent.id,
      )
      .then(function (response) {
        if (response.data.success === true) {
          latitudeLast = response.data.location.latitude;
          longitudeLast = response.data.location.longitude;
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  return (
    <Animated.View style={styles.container}>
      <View style={{flex: 1}}>
        <Header>{changeInfoMessage()}</Header>
      </View>
      <MapView
        provider={PROVIDER_GOOGLE}
        // eslint-disable-next-line react-native/no-inline-styles
        style={{flex: 2}}
        region={{
          latitude: currentLatitude,
          longitude: currentLongitude,
          latitudeDelta: 0.00322,
          longitudeDelta: 0.00421,
        }}>
        <Marker
          coordinate={{
            latitude: currentLatitude,
            longitude: currentLongitude,
          }}
        />
      </MapView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});


const mapStateToProps = ({GetAgentTokenReducer, Get_Agent_Info}) => {
  const {AgentToken} = GetAgentTokenReducer;
  const {Agent} = Get_Agent_Info;
  return {
    AgentToken,
    Agent,
  };
};
export default connect(mapStateToProps)(Location);
