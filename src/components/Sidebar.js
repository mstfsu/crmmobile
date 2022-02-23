import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
import {Icon} from 'native-base';
import {Button} from 'react-native-elements';

const Sidebar = props => {
  const forgetUser = async () => {
    try {
      await AsyncStorage.removeItem('credentials');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{height: 250, backgroundColor: '#d2d2d2', opacity: 0.9}}>
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            height: 200,
            backgroundColor: 'Green',
            alignItems: 'center',
          }}>
          <Image
            source={require('../assets/person.png')}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{height: 150, width: 150, borderRadius: 60, marginTop:10}}
          />
        </View>
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            height: 50,
            backgroundColor: 'Green',
            alignItems: 'center',
          }}>
          <Text>{props.Agent.name}</Text>
        </View>
      </View>
      <ScrollView>
        <View style={styles.buttonsContainer}>
          <Button
            title="Tasks"
            // eslint-disable-next-line react-native/no-inline-styles
            buttonStyle={{
              borderColor: 'rgba(78, 116, 289, 1)',
            }}
            onPress={() => {
              Actions.reset('_tasklist', {a: 'task'});
              //Actions.tasklist();
            }}
            type="outline"
            raised
            titleStyle={{color: 'rgba(78, 116, 289, 1)'}}
            // eslint-disable-next-line react-native/no-inline-styles
            containerStyle={{
              width: 200,
              marginHorizontal: 50,
              marginVertical: 10,
            }}
          />
          <Button
            title="Closed Tasks"
            // eslint-disable-next-line react-native/no-inline-styles
            buttonStyle={{
              borderColor: 'rgba(78, 116, 289, 1)',
            }}
            onPress={() => {
              Actions.reset('_closedtaskslist', {a: 'task'});
              //Actions.tasklist();
            }}
            type="outline"
            raised
            titleStyle={{color: 'rgba(78, 116, 289, 1)'}}
            // eslint-disable-next-line react-native/no-inline-styles
            containerStyle={{
              width: 200,
              marginHorizontal: 50,
              marginVertical: 10,
            }}
          />
          <Button
            title="Log Out"
            onPress={() => {
              forgetUser();
              Actions.login_base();
            }}
            // eslint-disable-next-line react-native/no-inline-styles
            buttonStyle={{
              backgroundColor: 'rgba(244, 244, 244, 1)',
              borderRadius: 3,
              color: 'rgba(78, 116, 289, 1)',
            }}
            // eslint-disable-next-line react-native/no-inline-styles
            containerStyle={{
              height: 40,
              width: 200,
              marginHorizontal: 50,
              marginVertical: 10,
            }}
            titleStyle={{marginHorizontal: 20, color: 'rgba(78, 116, 289, 1)'}}
          />
        </View>
      </ScrollView>
      <View style={{alignItems: 'center', bottom: 20}}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flexDirection: 'column', marginRight: 15}}>
            <Icon
              name="flask"
              style={{fontSize: 24}}
              onPress={() => console.log('Tıkladın')}
            />
          </View>
          <View style={{flexDirection: 'column'}}>
            <Icon
              name="call"
              style={{fontSize: 24}}
              onPress={() => console.log('Tıkladın')}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

let styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    flex: 1,
  },
  navItemStyle: {
    padding: 10,
  },
  navSectionStyle: {
    backgroundColor: 'white',
    padding: 10,
    fontWeight: 'bold',
  },
  sectionHeadingStyle: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  footerContainer: {
    padding: 20,
    backgroundColor: 'lightgrey',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'blue',
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
  },
});

const mapStateToProps = ({Get_Agent_Info, Get_Agent_Location}) => {
  const {Agent} = Get_Agent_Info;
  const {Agent_Location} = Get_Agent_Location;
  return {
    Agent,
    Agent_Location,
  };
};
export default connect(mapStateToProps)(Sidebar);
