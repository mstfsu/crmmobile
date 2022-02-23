import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, Card, Button, Icon} from 'react-native-elements';
import {Actions} from 'react-native-router-flux';

const TaskDetail = props => {
  const handleDetail = task => {
    Actions.reset('_taskfulldetail', {task: task});
  };
  const renderDetailButton = task => {
    if (
      task.ticket.customer.latitude === null ||
      task.ticket.customer.longitude === null
    ) {
      return <Text>User does't have map info</Text>;
    } else {
      return (
        <Button
          icon={
            <Icon name="code" color="#ffffff" iconStyle={{marginRight: 10}} />
          }
          // eslint-disable-next-line react-native/no-inline-styles
          buttonStyle={{
            borderRadius: 0,
            marginLeft: 0,
            marginRight: 0,
            marginBottom: 0,
          }}
          title="Detail"
          onPress={() => handleDetail(task)}
        />
      );
    }
  };
  return (
    <View style={styles.container}>
      <Card>
        <Card.Title>Task Subject: {props.data.subject.name}</Card.Title>
        <Card.Divider />
        <Text style={{marginBottom: 10, fontSize: 20}}>
          Priority: {props.data.priority.name}
        </Text>
        <Text style={{marginBottom: 10, fontSize: 20}}>
          Group: {props.data.group.name}
        </Text>
        <Text style={{marginBottom: 10, fontSize: 20}}>
          Type: {props.data.type.name}
        </Text>
        <Text style={{marginBottom: 10, fontSize: 20}}>
          Status: {props.data.status.name}
        </Text>
        <Text style={{marginBottom: 10, fontSize: 20}}>
          Customer: {props.data.ticket.customer.fullname}
        </Text>
        {renderDetailButton(props.data)}
      </Card>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fonts: {
    marginBottom: 8,
  },
  user: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  image: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    marginTop: 5,
  },
});

export default TaskDetail;
