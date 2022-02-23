import React, {Component} from 'react';
import {Image, StyleSheet, ToastAndroid} from 'react-native';
import {FooterTab, Button, Text} from 'native-base';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {Get_Data, Get_Country} from '../actions';

class FooterContent extends Component {
  state = {
    Türkiye: true,
    Amerika: false,
    Italy: false,
    News: false,
    other: false,
  };

  ActionTürkiye() {
    this.setState({
      Amerika: false,
      Türkiye: true,
      Italy: false,
      News: false,
      other: false,
    });
    this.props.Get_Country('Turkey');
    this.props.Get_Data();
    Actions.coronadata();
  }
  ActionAmerika() {
    this.props.Get_Country('USA');
    this.setState({
      Amerika: true,
      Türkiye: false,
      Italy: false,
      News: false,
      other: false,
    });
    this.props.Get_Data();
    Actions.amerika();
  }
  ActionItaly() {
    this.props.Get_Country('Italy');
    this.setState({
      Amerika: false,
      Türkiye: false,
      Italy: true,
      News: false,
      other: false,
    });
    this.props.Get_Data();
    Actions.italy();
  }
  ActionNews() {
    this.setState({
      Amerika: false,
      Türkiye: false,
      Italy: false,
      News: true,
      other: false,
    });
    this.props.Get_Data();
    this.showToastWithGravityAndOffset();
    Actions.News();
  }
  showToastWithGravityAndOffset() {
    ToastAndroid.showWithGravityAndOffset(
      'Sağa veya Sola kaydırarak haberleri gezebilirsiniz..',
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  }
  OtherCountries() {
    this.setState({
      Amerika: false,
      Türkiye: false,
      Italy: false,
      News: false,
      other: true,
    });
    Actions.OtherCountries();
  }

  render() {
    return (
      <FooterTab style={{backgroundColor: '#fff'}}>
        <Button
          vertical
          onPress={() => this.ActionTürkiye()}
          active={this.state.Türkiye}>
          <Image style={styles.tinyLogo} source={require('../Flags/tr.png')} />
          <Text style={styles.textStyle}>Türkiye</Text>
        </Button>
        <Button
          vertical
          active={this.state.Amerika}
          onPress={() => this.ActionAmerika()}>
          <Image
            style={styles.tinyLogo}
            source={require('../Flags/amerika.png')}
          />
          <Text style={styles.textStyle}>Amerika</Text>
        </Button>
        <Button
          vertical
          active={this.state.Italy}
          onPress={() => this.ActionItaly()}>
          <Image
            style={styles.tinyLogo}
            source={require('../Flags/italy.png')}
          />
          <Text style={styles.textStyle}>İtalya</Text>
        </Button>
        <Button
          vertical
          active={this.state.other}
          onPress={() => this.OtherCountries()}>
          <Image
            style={styles.tinyLogo}
            source={require('../Flags/earth.png')}
          />
          <Text style={styles.textStyle}>Ülkeler</Text>
        </Button>
        <Button
          vertical
          active={this.state.News}
          onPress={() => this.ActionNews()}>
          <Image
            style={styles.tinyLogo}
            source={require('../Flags/haber.png')}
          />
          <Text style={styles.textStyle}>Haberler</Text>
        </Button>
      </FooterTab>
    );
  }
}

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 8,
  },
  tinyLogo: {
    width: 20,
    height: 20,
  },
  logo: {
    width: 20,
    height: 20,
  },
});

export default connect(
  null,
  {Get_Data, Get_Country},
)(FooterContent);
