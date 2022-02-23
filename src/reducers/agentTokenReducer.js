const INITIAL_STATE = {
  AgentToken: '',
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'Get_Agent_Token':
      return {...state, AgentToken: action.payload};
    // return INITIAL_STATE şeklinde dönderseydil state ler initial halini alırdı.
    default:
      return state;
  }
};
