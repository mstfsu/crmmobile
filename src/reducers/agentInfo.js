const INITIAL_STATE = {
  Agent: {},
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'Get_Agent_Info':
      return {...state, Agent: action.payload};
    // return INITIAL_STATE şeklinde dönderseydil state ler initial halini alırdı.
    default:
      return state;
  }
};
