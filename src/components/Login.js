import React, {useState, useEffect} from 'react';
import {StyleSheet, Alert, Switch, View, Text} from 'react-native';
import axios from 'axios';
import Config from 'react-native-config';
import {Actions} from 'react-native-router-flux';
import {connect, useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Get_Agent_Token, Get_Agent_Info} from '../actions';
import Background from './Background';
import Logo from './Logo';
import Header from './Header';
import Button from './Button';
import TextInput from './TextInput';
import Spinner from './spinner';
import {emailValidator} from '../helpers/emailValidator';
import {passwordValidator} from '../helpers/passwordValidator';
import DeviceInfo from 'react-native-device-info';

const Login = props => {
  const [email, setEmail] = useState({value: '', error: ''});
  const [password, setPassword] = useState({value: '', error: ''});
  const [status, setStatus] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [controlToken, setControlToken] = useState(true);

  useEffect(() => {
    const controlCredentials = async () => {
      const token = await getRememberedUser();
      if (token) {
        const controlDeviceNumber = await controlAgentDeviceNumber(token);
        if (controlDeviceNumber) {
          dispatch(Get_Agent_Token(token.token));
          dispatch(Get_Agent_Info(token.agent));
          Actions.location();
        } else {
          setControlToken(false);
          forgetUser();
          controlPhoneIdAlert(
            'You loged in with another device. Press Ok to change phone request',
            token.token,
            token.agent.id,
          );
        }
      } else {
        setControlToken(false);
      }
    };
    controlCredentials();
  }, []);

  const dispatch = useDispatch();
  const handleLogin = async () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    if (emailError || passwordError) {
      setEmail({...email, error: emailError});
      setPassword({...password, error: passwordError});
      setStatus(false);
      return;
    } else {
      setStatus(true);
      const agentInfo = await axios
        .post(Config.BASE_URL + 'Agent/generate_token', {
          email: email,
          password: password,
        })
        .then(function (response) {
          if (response.data.success === true) {
            return {
              token: response.data.token,
              agent: response.data.agent,
            };
          } else {
            createTwoButtonAlert('Agent was not found');
            setStatus(false);
          }
        })
        .catch(function (error) {
          console.log(error);
          setStatus(false);
        });
      if (agentInfo.agent.phone_unique_number === null) {
        var isPhoneUniqueIdUsed = await setAgentPhoneUniqueNumber(
          agentInfo.token,
          agentInfo.agent.id,
        );
        if (isPhoneUniqueIdUsed) {
          goLocationScreen(agentInfo.token, agentInfo.agent);
        } else {
          setStatus(false);
        }
      } else {
        const controlDeviceNumber = await controlAgentDeviceNumber(agentInfo);
        if (controlDeviceNumber) {
          goLocationScreen(agentInfo.token, agentInfo.agent);
        } else {
          setStatus(false);
          controlPhoneIdAlert(
            'You loged in with another device. Press Ok to change phone request',
            agentInfo.token,
            agentInfo.agent.id,
          );
        }
      }
    }
  };
  const goLocationScreen = (token, agent) => {
    dispatch(Get_Agent_Token(token));
    dispatch(Get_Agent_Info(agent));
    if (isEnabled) {
      rememberUser(token, agent);
    }
    Actions.location();
  };
  const setAgentPhoneUniqueNumber = async (token, agentId) => {
    var deviceId = getDeviceId();
    const result = await axios
      .post(Config.BASE_URL + 'Agent/set_agent_phone_unique_number', {
        api_token: token,
        agent_id: agentId,
        phone_unique_number: deviceId,
      })
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response.data.message);
          return true;
        } else {
          createTwoButtonAlert(response.data.message);
          return false;
        }
      })
      .catch(function (error) {
        console.log(error);
        setStatus(false);
      });
    return result;
  };
  const controlAgentDeviceNumber = async token => {
    try {
      const result = await axios
        .get(
          Config.BASE_URL +
            'Agent/get_agent_phone_unique_number?api_token=' +
            token.token +
            '&agent_id=' +
            token.agent.id,
        )
        .then(function (response) {
          if (
            response.data.success === true &&
            response.data.phone_unique_number === getDeviceId()
          ) {
            return true;
          } else {
            return false;
          }
        })
        .catch(function (error) {
          console.log(error);
          setStatus(false);
          return false;
        });
      return result;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  const getDeviceId = () => {
    var uniqueId = DeviceInfo.getUniqueId();
    return uniqueId;
  };

  const clearAll = async () => {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      // clear error
    }
    console.log('Done.');
  };
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const rememberUser = async (agent_token, agent) => {
    try {
      const data = {token: agent_token, agent: agent};
      await AsyncStorage.setItem('credentials', JSON.stringify(data));
    } catch (error) {
      // Error saving data
    }
  };
  const getRememberedUser = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('credentials');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.log(error);
    }
  };

  const createTwoButtonAlert = message => {
    Alert.alert('Error', message, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
  };
  const sendChangePhoneIdRequest = (token, agentId) => {
    console.log(agentId);
    axios
      .get(
        Config.BASE_URL +
          'Agent/change_phone_request?api_token=' +
          token +
          '&agent_id=' +
          agentId,
      )
      .then(function (response) {
        console.log(response.data.message);
      })
      .catch(function (error) {
        console.log(error);
        createTwoButtonAlert(
          'you send request to change phone number. Wait for admin approve',
        );
      });
  };
  const controlPhoneIdAlert = (message, token, agentId) => {
    console.log(token);
    Alert.alert('Error', message, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => sendChangePhoneIdRequest(token, agentId)},
    ]);
  };
  const loginButton = () => {
    if (status) {
      return <Spinner />;
    } else {
      return (
        <Button mode="contained" onPress={handleLogin}>
          Login
        </Button>
      );
    }
  };
  const forgetUser = async () => {
    try {
      await AsyncStorage.removeItem('credentials');
    } catch (error) {
      console.log(error);
    }
  };

  const controlTokenStatus = () => {
    if (controlToken) {
      return <Spinner />;
    } else {
      return (
        <Background>
          <Logo />
          <Header>Welcome to Isp</Header>
          <TextInput
            label="Email"
            returnKeyType="next"
            editable={true}
            value={email.value}
            onChangeText={text => setEmail({value: text, error: ''})}
            error={!!email.error}
            errorText={email.error}
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
          />
          <TextInput
            label="Password"
            returnKeyType="done"
            value={password.value}
            onChangeText={text => setPassword({value: text, error: ''})}
            error={!!password.error}
            errorText={password.error}
            secureTextEntry
          />
          <View
            style={[
              {
                flexDirection: 'row',
                alignContent: 'space-between',
              },
            ]}>
            <Text>Remember Me : </Text>
            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
          {loginButton()}
        </Background>
      );
    }
  };
  return controlTokenStatus();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  image: {
    marginBottom: 40,
  },
  loginText: {
    color: '#fff',
  },
  inputView: {
    backgroundColor: '#1e88e5',
    borderRadius: 30,
    width: '70%',
    height: 45,
    marginBottom: 20,

    alignItems: 'center',
  },

  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    color: '#fff',
  },

  forgot_button: {
    height: 30,
    marginBottom: 30,
  },

  loginBtn: {
    width: '80%',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    backgroundColor: '#001970',
  },
});

const mapStateToProps = ({GetAgentTokenReducer}) => {
  const {AgentToken} = GetAgentTokenReducer;
  return {
    AgentToken,
  };
};
export default connect(mapStateToProps, {
  Get_Agent_Token,
})(Login);
