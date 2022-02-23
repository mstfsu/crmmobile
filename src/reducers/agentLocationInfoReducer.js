const INITIAL_STATE = {
  AgentLocation: {
    latitude: '',
    longitude: '',
  },
};
export default (state = INITIAL_STATE, action) => {
  console.log("reducer");
  switch (action.type) {
    case 'Get_Agent_Location':
      return {...state, AgentLocation: action.payload};
    default:
      return state;
  }
};
