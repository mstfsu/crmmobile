import React from 'react';
import {View, Button, Alert} from 'react-native';

export default function Buton() {
  return (
    <View>
      <Button
        title="Press me"
        onPress={() => Alert.alert('Simple Button pressed')}
      />
    </View>
  );
}
