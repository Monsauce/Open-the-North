/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component, } from 'react';
import { StyleSheet, View, AppRegistry, Text, Button, Picker, Switch, TextInput } from 'react-native';

import {
  TabNavigator,
} from 'react-navigation';


class MyLocationScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: '1',
    // Note: By default the icon is only shown on iOS. Search the showIcon option below.
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('./img/OpenTheNorthLogoSmall.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  };

  render() {
    return (
    <View>
      <Text>Where did you catch your fish?</Text>
      <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(text) => this.setState({text})}
          value="Search fishing locations by name."
        />
      <Button
          onPress={() => this.props.navigation.goBack()}
          title="Get list of nearby locations."
        />
    </View>
    );
  }
}

class MySensitiveScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: '2',
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('./img/OpenTheNorthLogoSmall.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  };

  render() {
    return (
    <View>
      <Text>Are you under 15 years old?</Text>
      <Switch/>
      <Text>Are you a woman who is pregnant or intends to become pregnant?</Text>
      <Switch/>
    </View>
    );
  }
}

class MySpeciesScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: '3',
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('./img/OpenTheNorthLogoSmall.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  };

  render() {
    return (
    <View>
      <Text>What is the species of your fish?</Text>
      <Picker>
        <Picker.Item label="Java" value="java" />
        <Picker.Item label="JavaScript" value="js" />
      </Picker>
    </View>
    );
  }
}

class MySizeScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: '4',
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('./img/OpenTheNorthLogoSmall.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  };

  render() {
    return (
    <View>
      <Text>What is the length of your fish?</Text>
      <Picker>
        <Picker.Item label="Java" value="java" />
        <Picker.Item label="JavaScript" value="js" />
      </Picker>
    </View> 
    );
  }
}

class MyResultScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: '5',
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('./img/OpenTheNorthLogoSmall.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  };

  render() {
    return (
    <Text> You can eat this many fish safely.</Text>
    );
  }
}


const styles = StyleSheet.create({
  icon: {
    width: 26,
    height: 26,
  },
});

const MyApp = TabNavigator({
  Location: {
    screen: MyLocationScreen,
  },
  Sensitive: {
    screen: MySensitiveScreen,
  },
  Species: {
    screen: MySpeciesScreen,
  },
  Size: {
    screen: MySizeScreen,
  },
  Result: {
    screen: MyResultScreen,
  },
}, {
  tabBarOptions: {
    activeTintColor: '#e91e63',
  },
});

AppRegistry.registerComponent('OpenTheNorthApp', () => MyApp);