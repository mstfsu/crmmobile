import {combineReducers} from 'redux';
import getAgentTokenReducer from './agentTokenReducer';
import getAgentIdReducer from './agentInfo';
import getAgentLocation from './agentLocationInfoReducer';

export default combineReducers({
  GetAgentTokenReducer: getAgentTokenReducer,
  Get_Agent_Info: getAgentIdReducer,
  Get_Agent_Location: getAgentLocation,
});
