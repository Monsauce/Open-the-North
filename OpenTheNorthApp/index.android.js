/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

 /**
  * sqlite.ios.callback.js
  *
  * Created by Andrzej Porebski on 10/29/15.
  * Copyright (c) 2015 Andrzej Porebski.
  *
  * Test App using JS Callbacks for react-naive-sqlite-storage
  *
  * This library is available under the terms of the MIT License (2008).
  * See http://opensource.org/licenses/alphabetical for full text.
  */
 'use strict';

 import React, { Component } from 'react';
 import {
     AppRegistry,
     StyleSheet,
     Text,
     View,
     ListView
 } from 'react-native';

 import SQLite from 'react-native-sqlite-storage';
 SQLite.DEBUG(true);
 SQLite.enablePromise(false);

 const database_name = "Test.db";
 const database_version = "1.0";
 const database_displayname = "SQLite Test Database";
 const database_size = 200000;
 let db;

 const SQLiteDemo = React.createClass({
     getInitialState(){
         return {
             progress: [],
             dataSource: new ListView.DataSource({
                 rowHasChanged: (row1, row2) => row1 !== row2,
             })
         };
     },

     componentWillUnmount(){
         this.closeDatabase();
     },

     errorCB(err) {
         console.log("error: ",err);
         this.state.progress.push("Error: "+ (err.message || err));
         this.setState(this.state);
         return false;
     },

     successCB() {
         console.log("SQL executed ...");
     },

     openCB() {
         this.state.progress.push("Database OPEN");
         this.setState(this.state);
         this.populateDatabase(db);
     },

     closeCB() {
         this.state.progress.push("Database CLOSED");
         this.setState(this.state);
     },

     deleteCB() {
         console.log("Database DELETED");
         this.state.progress.push("Database DELETED");
         this.setState(this.state);
     },

     populateDatabase(db){
         var that = this;
         that.state.progress.push("Database integrity check");
         that.setState(that.state);
         db.executeSql('SELECT * FROM fishes LIMIT 1', [],
             function () {
                 that.state.progress.push("Database is ready ... executing query ...");
                 that.setState(that.state);
                 db.transaction(that.queryEmployees,that.errorCB,function() {
                     that.state.progress.push("Processing completed");
                     that.setState(that.state);
                 });
             },
             that.errorCB
                 });
             });
     },


     queryEmployees(tx) {
         console.log("Executing sql...");
         tx.executeSql('SELECT * FROM fishes LIMIT 10', [],
             this.queryEmployeesSuccess,this.errorCB);
         //tx.executeSql('SELECT a.name, from TEST', [],() => {},this.errorCB);
     },

     queryEmployeesSuccess(tx,results) {
         this.state.progress.push("Query completed");
         this.setState(this.state);
         var len = results.rows.length;
         for (let i = 0; i < len; i++) {
             let row = results.rows.item(i);
             this.state.progress.push(`Empl Name: ${row.WATERBODY_CODE}, Dept Name: ${row.SPECNAME}`);
         }
         this.setState(this.state);
     },


     loadAndQueryDB(){
         this.state.progress.push("Opening database ...");
         this.setState(this.state);
         db = SQLite.openDatabase({name: 'example.db', readOnly: true, createFromLocation : "~example.db"}, this.openCB, this.errorCB);
         //db = SQLite.openDatabase(database_name, database_version, database_displayname, database_size, this.openCB, this.errorCB);
        //  function() sleep(ms) {
        //     return new Promise(resolve => setTimeout(resolve, ms));
        //   }
    //     await sleep(4000);

     },



     deleteDatabase(){
         this.state.progress = ["Deleting database"];
         this.setState(this.state);
         SQLite.deleteDatabase(database_name, this.deleteCB, this.errorCB);
     },

     closeDatabase(){
         var that = this;
         if (db) {
             console.log("Closing database ...");
             that.state.progress.push("Closing database");
             that.setState(that.state);
             db.close(that.closeCB,that.errorCB);
         } else {
             that.state.progress.push("Database was not OPENED");
             that.setState(that.state);
         }
     },

     runDemo(){
         this.state.progress = ["Starting SQLite Callback Demo"];
         this.setState(this.state);
         this.loadAndQueryDB();
     },

     renderProgressEntry(entry){
         return (<View style={listStyles.li}>
             <View>
                 <Text style={listStyles.liText}>{entry}</Text>
             </View>
         </View>)
     },

     render(){
         var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
         return (<View style={styles.mainContainer}>
             <View style={styles.toolbar}>
                 <Text style={styles.toolbarButton} onPress={this.runDemo}>
                     Run Demo
                 </Text>
                 <Text style={styles.toolbarButton} onPress={this.closeDatabase}>
                     Close DB
                 </Text>
                 <Text style={styles.toolbarButton} onPress={this.deleteDatabase}>
                     Delete DB
                 </Text>
             </View>
             <ListView
                 enableEmptySections={true}
                 dataSource={ds.cloneWithRows(this.state.progress)}
                 renderRow={this.renderProgressEntry}
                 style={listStyles.liContainer}/>
         </View>);
     }
 });

 var listStyles = StyleSheet.create({
     li: {
         borderBottomColor: '#c8c7cc',
         borderBottomWidth: 0.5,
         paddingTop: 15,
         paddingRight: 15,
         paddingBottom: 15,
     },
     liContainer: {
         backgroundColor: '#fff',
         flex: 1,
         paddingLeft: 15,
     },
     liIndent: {
         flex: 1,
     },
     liText: {
         color: '#333',
         fontSize: 17,
         fontWeight: '400',
         marginBottom: -3.5,
         marginTop: -3.5,
     },
 });

 var styles = StyleSheet.create({
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
   toolbar: {
       backgroundColor: '#51c04d',
       paddingTop: 30,
       paddingBottom: 10,
       flexDirection: 'row'
   },
   toolbarButton: {
       color: 'blue',
       textAlign: 'center',
       flex: 1
   },
   mainContainer: {
       flex: 1
   }
 });

 AppRegistry.registerComponent('OpenTheNorthApp', () => SQLiteDemo);


 /*

import React, { Component, } from 'react';
import { StyleSheet, View, AppRegistry, Text, Button, Picker, Switch, TextInput } from 'react-native';

var SQLite = require('react-native-sqlite-storage')

import {
  TabNavigator,
} from 'react-navigation';

class MyLocationScreen extends React.Component {

  test_database() {
    //var db = SQLite.openDatabase({name: 'example.db', readOnly: true, createFromLocation : "www/example.db"}, this.successcb, this.errorcb);
    var db = SQLite.openDatabase()
    var txt = "NOT WORKING";
    console.log("HEY")
    return txt;
  };

  successcb(){
    console.log("UMMMMM")
    db.transaction((tx) => {
      tx.executeSql('SELECT TOP 1 * FROM fishes;', [], (tx, results) => {
            this.props.name = results.rows.item(0).GUIDE_LOCNAME_ENG;
            console.warn(results.rows.item(0).GUIDE_LOCNAME_ENG)
          }
        );
    });

    console.warn("woo");

  }

  errorcb(){
    console.error("FAILED");
  }

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
    this.test_database()
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
    <Text>{this.props.name}</Text>
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

 const myNavigator = TabNavigator({
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

class TopLevelApp extends React.Component {
render () {
return  (<AppNavigator/>)
}
}

const MyApp = TopLevelApp()

AppRegistry.registerComponent('OpenTheNorthApp', () => MyApp);
*/
