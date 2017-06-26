/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, View, AppRegistry, Text } from 'react-native';


/*
var React = require('react');
var ReactNative = require('react-native');
var {
  StyleSheet,
  Text,
  View,
} = ReactNative;
*/

import {
  StackNavigator,
} from 'react-navigation';

const App = StackNavigator({
  Main: {screen: MainScreen},
  Profile: {screen: GeolocationExample},x
});


class MainScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome',
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <Button
        title="Go to Jane's profile"
        onPress={() =>
          navigate('Profile', { name: 'Jane' });
        }
      />
    );
  }
}

exports.framework = 'React';
exports.title = 'Geolocation';
exports.description = 'Examples of using the Geolocation API.';

exports.examples = [
  {
    title: 'navigator.geolocation',
    render: function(): Element<any> {
      return <GeolocationExample />;
    },
  }
];

class GeolocationExample extends Component {
  state = {
    initialPosition: 'unknown',
    lastPosition: 'unknown',
  };

  watchID: ?number = null;

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
        this.setState({initialPosition});
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lastPosition = JSON.stringify(position);
      this.setState({lastPosition});
    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  render() {
    return (
      <View>
        <Text>
          <Text style={styles.title}>Initial position: </Text>
          {this.state.initialPosition}
        </Text>
        <Text>
          <Text style={styles.title}>Current position: </Text>
          {this.state.lastPosition}
        </Text>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  title: {
    fontWeight: '500',
  },
});

class HelloWorldApp extends Component {
  render() {
    return (
      <Text>Hello world!</Text>
    );
  }
}

AppRegistry.registerComponent('OpenTheNorthApp', () => GeolocationExample);




/*

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';

export default class OpenTheNorthApp extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Image source={require('./img/OpenTheNorthLogoSmall.png')} />
        <Text style={styles.welcome}>
          Open the North!
        </Text>
        <Text style={styles.instructions}>
          Building a mobile app and open repository{"\n"}
          for indigenous ecological data and resources.
        </Text>
        <Text style={styles.instructions}>
          {"https://github.com/Monsauce/Open-the-North"}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('OpenTheNorthApp', () => OpenTheNorthApp);
*/