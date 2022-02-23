import React from 'react';
import {StyleSheet} from 'react-native';
import {Scene, Router, Drawer} from 'react-native-router-flux';
import {Actions, ActionConst} from 'react-native-router-flux';
import {connect} from 'react-redux';
import loginPage from './components/Login';
import location from './components/Location';
import SideBar from './components/Sidebar';
import TaskList from './components/ListTasks';
import TaskFullDetail from './components/TaskFullDetail';
import ClosedTasksList from './components/ClosedTasksList';

const RouterComponent = props => {
  return (
    <Router
      statusBarStyle="light-content"
      navigationBarStyle={{backgroundColor: '#560CCE'}}
      titleStyle={styles.textStyle}>
      <Scene
        key="root"
        hideNavBar={true}
        navigationBarStyle={styles.navBar}
        titleStyle={styles.navTitle}>
        <Drawer
          drawerWidth={250}
          contentComponent={SideBar}
          drawerPosition="right"
          hideNavBar={true}
          hideTabBar={true}>
          <Scene key="location_base" hideTabBar={true} drawer={true}>
            <Scene
              key="location"
              component={location}
              title="Location"
              drawerLockMode="locked-closed"
            />
            <Scene
              key="tasklist"
              component={TaskList}
              title="Tasks"
              drawerLockMode="locked-closed"
            />
            <Scene
              key="closedtaskslist"
              component={ClosedTasksList}
              title="Closed Tasks"
              drawerLockMode="locked-closed"
            />
            <Scene
              key="taskfulldetail"
              component={TaskFullDetail}
              title="Tasks"
              drawerLockMode="locked-closed"
            />
          </Scene>
        </Drawer>
        <Scene
          key="login_base"
          hideNavBar={true}
          drawerLockMode="unlocked"
          type="reset"
          initial>
          <Scene
            key="login"
            component={loginPage}
            title="Login"
            drawerLockMode="unlocked"
          />
        </Scene>
      </Scene>
    </Router>
  );
};
const styles = StyleSheet.create({
  textStyle: {
    fontSize: 23,
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    alignSelf: 'center',
    flex: 1,
  },
  navBar: {
    backgroundColor: 'white', // changing navbar color
  },
  navTitle: {
    color: 'black', // changing navbar title color
  },
});

export default RouterComponent;
