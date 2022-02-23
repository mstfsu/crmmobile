import React, {useState, useEffect} from 'react';
import {View, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import axios from 'axios';
import Config from 'react-native-config';
import {Get_Data, Get_Data_Control, Get_Country_Data} from '../actions';
import ClosedTaskDetail from './ClosedTasksDetail';
import Spinner from './spinner';

const ClosedTasksList = props => {
  const [data, setData] = useState([]);
  const [controlData, setControlData] = useState(true);
  useEffect(() => {
    const getTasks = async () => {
      axios
        .get(
          Config.BASE_URL +
            'Agent/get_closed_task?api_token=' +
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
      return data.map((task, id) => <ClosedTaskDetail key={id} data={task} />);
    }
  };

  return (
    <View>
      <ScrollView>{renderGetDataControl()}</ScrollView>
    </View>
  );
};

const mapStateToProps = ({GetAgentTokenReducer, Get_Agent_Info}) => {
  const {AgentToken} = GetAgentTokenReducer;
  const {Agent} = Get_Agent_Info;

  return {
    AgentToken,
    Agent,
  };
};
export default connect(mapStateToProps)(ClosedTasksList);
