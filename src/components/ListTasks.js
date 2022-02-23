import React, {useState, useEffect} from 'react';
import {View, ScrollView, Text, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import axios from 'axios';
import Config from 'react-native-config';
import TaskDetail from './TaskDetail';
import Spinner from './spinner';

const ListTask = props => {
  const [data, setData] = useState([]);
  const [controlData, setControlData] = useState(true);
  useEffect(() => {
    const getTasks = async () => {
      axios
        .get(
          Config.BASE_URL +
            'Agent/get_task?api_token=' +
            props.AgentToken +
            '&agent_id=' +
            props.Agent.id,
        )
        .then(function (response) {
          setData(response.data.tasks);
          setControlData(false);
        })
        .catch(function (error) {
          console.log(error);
        });
    };
    // const didBlurSubscription = props.navigation.addListener(
    //   'willFocus',
    //   () => {
    //     getTasks();
    //   },
    // );
    getTasks();
  }, []);

  const renderGetDataControl = () => {
    if (controlData) {
      return <Spinner />;
    } else {
      return data.map((task, id) => <TaskDetail key={id} data={task} />);
    }
  };

  return (
    <View>
      {data.length ? (
        <ScrollView>{renderGetDataControl()}</ScrollView>
      ) : (
        <Text style={styles.textStyle}>There is no task</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    textAlign: 'center',
    color: '#000000',
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    textAlignVertical: 'center',
    alignContent: 'center',
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
export default connect(mapStateToProps)(ListTask);
