/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

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
