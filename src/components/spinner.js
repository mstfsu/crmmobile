import React, {Component} from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
export default class SpinnerComponent extends Component {
  render() {
    return <ActivityIndicator size="small" color="#0000ff" />;
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 0,
    marginTop: 0,
  },
});
