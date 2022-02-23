import React, {Component} from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {connect, useDispatch} from 'react-redux';
import MapViewDirections from 'react-native-maps-directions';
import {
  Text,
  Card,
  Button,
  Icon,
  ListItem,
  ListItemProps,
  Switch,
} from 'react-native-elements';
import {Select} from 'native-base';
import Geolocation from 'react-native-geolocation-service';
import {Actions} from 'react-native-router-flux';
import axios from 'axios';
import Config from 'react-native-config';

const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 37.771707;
const LONGITUDE = -122.4053769;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const GOOGLE_MAPS_APIKEY = 'AIzaSyAjLKh5z-ZA23e3jIBfbf5C6uhAhOD9zx4';

class TaskFullDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settingValue: true,
      mode: 'WALKING',
      distance: 0,
      duration: 0,
      currentLocation: {
        latitude: '',
        longitude: '',
      },
      closedButton: false,
      coordinates: [
        {
          latitude: 37.3317876,
          longitude: -122.0054812,
        },
        {
          latitude: 37.7332883,
          longitude: -122.4574217,
        },
      ],
    };

    this.mapView = null;
    //this.getCurrentLocation();
  }
  // componentDidMount() {
  //   const didBlurSubscription = this.props.navigation.addListener(
  //     'willBlur',
  //     payload => {
  //       //Actions.pop(Actions.currentScene);
  //       console.debug('asdsa', payload);
  //     },
  //   );
  // }
  componentDidUpdate() {
    this.getCurrentLocation.bind(this);
  }
  onMapPress = e => {
    console.log('map event');
    // this.setState({
    //   coordinates: [...this.state.coordinates, e.nativeEvent.coordinate],
    // });
  };
  renderClosedButton = () => {
    if (this.state.closedButton) {
      return (
        <Button
          title="You closed this task"
          icon={{
            name: 'close',
            type: 'font-awesome',
            size: 15,
            color: 'white',
          }}
          titleStyle={{fontWeight: '700'}}
          buttonStyle={{
            backgroundColor: '#f9c74f',
            borderColor: 'transparent',
            borderWidth: 0,
            borderRadius: 30,
          }}
          containerStyle={{
            width: '100%',
          }}
        />
      );
    } else {
      return (
        <Button
          title="Close This Task"
          icon={{
            name: 'close',
            type: 'font-awesome',
            size: 15,
            color: 'white',
          }}
          onPress={() => this.closeTask()}
          titleStyle={{fontWeight: '700'}}
          buttonStyle={{
            backgroundColor: 'red',
            borderColor: 'transparent',
            borderWidth: 0,
            borderRadius: 30,
          }}
          containerStyle={{
            width: '100%',
          }}
        />
      );
    }
  };
  getCurrentLocation() {
    this.mapView.animateToRegion({
      latitude: this.props.AgentLocation.latitude,
      longitude: this.props.AgentLocation.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });
  }
  closeTask = () => {
    axios
      .get(
        Config.BASE_URL +
          'Agent/close_task?api_token=' +
          this.props.AgentToken +
          '&task_id=' +
          this.props.task.id,
      )
      .then(response => {
        if (response.data.success === true) {
          this.setState({closedButton: true});
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  controlSetting() {
    if (this.state.settingValue) {
    } else {
      return (
        <>
          <ScrollView style={{padding: 10, flex: 1, backgroundColor: 'white'}}>
            <View style={styles.list}>
              <ListItem bottomDivider>
                <Icon
                  name="directions-run"
                  color="#000000"
                  iconStyle={{marginRight: 10, marginTop: 5}}
                  iconSize="20"
                  type="material"
                />
                <ListItem.Content>
                  <Select
                    selectedValue={this.state.mode}
                    width="100%"
                    accessibilityLabel="Choose Mode"
                    placeholder="Choose Mode"
                    mt={1}
                    onValueChange={itemValue => {
                      this.setState({
                        mode: itemValue,
                      });
                    }}>
                    <Select.Item label="Driving" value="DRIVING" />
                    <Select.Item label="Bicycling" value="BICYCLING" />
                    <Select.Item label="Walking" value="WALKING" />
                  </Select>
                </ListItem.Content>
              </ListItem>
              <ListItem bottomDivider>
                <ListItem.Content>{this.renderClosedButton()}</ListItem.Content>
              </ListItem>
              <ListItem bottomDivider>
                <ListItem.Content>
                  <Button
                    title="Open Google Maps"
                    icon={{
                      name: 'arrow-right',
                      type: 'font-awesome',
                      size: 15,
                      color: 'white',
                    }}
                    onPress={() => this.openExternalApp()}
                    iconRight
                    iconContainerStyle={{marginLeft: 10}}
                    titleStyle={{fontWeight: '700'}}
                    buttonStyle={{
                      borderWidth: 0,
                      borderColor: 'transparent',
                      borderRadius: 20,
                    }}
                    containerStyle={{
                      width: '100%',
                    }}
                  />
                </ListItem.Content>
              </ListItem>
            </View>
          </ScrollView>
        </>
      );
    }
  }
  openExternalApp = () => {
    var url =
      'https://www.google.com/maps/dir/?api=1&origin=' +
      this.props.AgentLocation.latitude +
      ',' +
      this.props.AgentLocation.longitude +
      '&destination=' +
      parseFloat(this.props.task.ticket.customer.latitude) +
      ',' +
      parseFloat(this.props.task.ticket.customer.longitude) +
      '&travelmode=' +
      this.state.mode;
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('ERROR', 'Unable to open: ' + url, [{text: 'OK'}]);
      }
    });
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <MapView
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}
          followsUserLocation={true}
          loadingEnabled={true}
          fitToCoordinates={this.props.AgentLocation}
          toolbarEnabled={true}
          zoomTapEnabled={true}
          zoomEnabled={true}
          showsScale={true}
          rotateEnabled={true}
          userLocationAnnotationTitle="Your Location"
          style={{flex: 1}}
          zoomControlEnabled={true}
          ref={c => (this.mapView = c)}
          // region={{
          //   ...this.props.AgentLocation,
          //   latitudeDelta: 0.005,
          //   longitudeDelta: 0.005,
          // }}
          // onUserLocationChange={l =>
          //   //this.setState({currentLocation: l.nativeEvent.coordinate})
          // }
          onMapReady={() => this.getCurrentLocation.bind(this)}
          onPress={this.onMapPress}>
          {/* <MapView.Marker coordinate={this.props.AgentLocation}>
            <Icon name="map-pin" type="font-awesome" size={36} />
            <Text style={{fontWeight: 'bold'}}>You are here</Text>
          </MapView.Marker> */}
          <MapView.Marker
            coordinate={{
              latitude: parseFloat(this.props.task.ticket.customer.latitude),
              longitude: parseFloat(this.props.task.ticket.customer.longitude),
            }}>
            <Icon
              raised
              name="user"
              type="font-awesome"
              color="#f50"
              onPress={() => console.log('hello')}
            />
            <Text style={{fontWeight: 'bold'}}>Customer</Text>
          </MapView.Marker>

          <MapViewDirections
            resetOnChange={false}
            origin={this.props.AgentLocation}
            mode={this.state.mode}
            destination={{
              latitude: parseFloat(this.props.task.ticket.customer.latitude),
              longitude: parseFloat(this.props.task.ticket.customer.longitude),
            }}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={5}
            strokeColor="blue"
            optimizeWaypoints={true}
            onStart={params => {
              this.getCurrentLocation.bind(this);
              console.log(
                `Started routing between "${params.origin}" and "${params.destination}"`,
              );
            }}
            onReady={result => {
              this.getCurrentLocation.bind(this);
              console.log(`Distance: ${result.distance} km`);
              console.log(`Duration: ${result.duration} min.`);
              this.setState({
                duration: result.duration,
                distance: result.distance,
              });
              this.mapView.fitToCoordinates(result.coordinates, {
                edgePadding: {
                  right: width / 20,
                  bottom: height / 20,
                  left: width / 20,
                  top: height / 20,
                },
              });
            }}
            onError={errorMessage => {
              console.log('GOT AN ERROR', errorMessage);
            }}
          />
        </MapView>
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            position: 'absolute', //use absolute position to show button on top of the map
            top: '10%', //for center align
            alignSelf: 'flex-end', //for align to right
            flex: 1,
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            onPress={() =>
              this.setState({settingValue: !this.state.settingValue})
            }>
            <Icon
              name="settings"
              color="#000000"
              iconStyle={{marginRight: 10}}
              iconSize="50"
            />
            {/* <Icon
              name="gps-fixed"
              color="#000000"
              iconStyle={{marginRight: 10, marginTop: 5}}
              iconSize="50"
              type="material"
            /> */}
          </TouchableOpacity>
        </View>
        <View
          style={{
            position: 'absolute', //use absolute position to show button on top of the map
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            flex: 1,
          }}>
          <Text style={styles.headline}>
            Distance : {Number(this.state.distance.toFixed(1))} km
          </Text>
          <Text style={styles.headline}>
            Duration : {Number(this.state.duration.toFixed(1))} min
          </Text>
        </View>
        {this.controlSetting()}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 8,
    backgroundColor: 'aliceblue',
  },
  list: {
    marginTop: 20,
    backgroundColor: 'white',
  },
  box: {
    width: '50%',
    height: '20%',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: 'oldlace',
    alignSelf: 'flex-start',
    marginHorizontal: '1%',
    marginBottom: 6,
    minWidth: '48%',
    textAlign: 'center',
  },
  selected: {
    backgroundColor: 'coral',
    borderWidth: 0,
  },
  buttonLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: 'coral',
  },
  selectedLabel: {
    color: 'white',
  },
  label: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 20,
  },
  headline: {
    textAlign: 'center', // <-- the magic
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 0,
    width: 200,
  },
});

const mapStateToProps = ({Get_Agent_Location, GetAgentTokenReducer}) => {
  const {AgentLocation} = Get_Agent_Location;
  const {AgentToken} = GetAgentTokenReducer;

  return {
    AgentLocation,
    AgentToken,
  };
};
export default connect(mapStateToProps)(TaskFullDetail);
