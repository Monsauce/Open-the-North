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

 import React, { Component, } from 'react';
 import { StyleSheet, View, ListView, AppRegistry, Text, Button, Picker, Switch, TextInput, Image } from 'react-native';

 //var SQLite = require('react-native-sqlite-storage')

 import {
   TabNavigator,
 } from 'react-navigation';

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
                 );
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
         //db = SQLite.openDatabase({name: 'example.db', readOnly: true, createFromLocation : "~example.db"}, this.openCB, this.errorCB);
         db = SQLite.openDatabase({name: 'example.db', readOnly: true, createFromLocation : "www/example.db"}, this.openCB, this.errorCB);
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

// AppRegistry.registerComponent('OpenTheNorthApp', () => SQLiteDemo);


class MyLocationScreen extends React.Component {

 constructor(props)
 {
   super(props);
   this.state = {wb:46387936};
   // this.state = {name:"SOME NUMBER", db:undefined};
   // this.successcb = this.successcb.bind(this);
   this.onChangeWB = this.onChangeWB.bind(this)
 }

 onChangeWB(itemValue, itemIndex) { this.setState({wb: itemValue}) }

  static navigationOptions = {
    tabBarLabel: 'LAKE',
    // Note: By default the icon is only shown on iOS. Search the showIcon option below.
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('./img/waterbody.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  };

  render() {
    var waterbodies = [[41508250, "Lake Erie 1 - Western Basin"], [42048308, "Lake Erie 5b - Lower Detroit River"], [42068227, "Lake Erie 2b - Wheatley Harbour"], [42158307, "Lake Erie 5a - Detroit River"], [42178153, "Lake Erie 2a - Rondeau Bay"], [42208225, "Thames River"], [42288240, "Lake Erie 6 - Lake St. Clair"], [42358211, "Sydenham River"], [42368026, "Big Creek"], [42378107, "Lake Erie 2 - Central Basin"], [42388113, "Kettle Creek"], [42388142, "Thames River"], [42408010, "Lake Erie 3 - Long Point Bay"], [42408230, "Lake Erie 7c - Lower St. Clair River"], [42457915, "Lake Erie 4 - Eastern Basin"], [42458035, "Deer Creek Reservoir"], [42468059, "Aylmer Police College Ponds"], [42478030, "Big Creek"], [42508018, "Lynn River"], [42508020, "Lynn River"], [42518029, "Big Creek"], [42518030, "Delhi Reservoir"], [42528044, "Lake Lisgar"], [42537935, "Grand River"], [42538226, "Lake Erie 7b - Middle St. Clair River"], [42548057, "Lake Whittaker"], [42557918, "Wainfleet Marsh"], [42567904, "Black Creek"], [42568019, "Waterford Lakes"], [42568111, "Westminster Ponds"], [42568118, "Thames River"], [42577857, "Lake Ontario 1a - Upper Niagara River"], [42587912, "Lyons Creek"], [42597911, "Lyons Creek"], [42597933, "Oswego Creek"], [42597934, "Welland River"], [42598058, "Thames River"], [42598111, "Thames River"], [42598114, "Thames River"], [42598224, "Lake Erie 7a - Upper St. Clair River"], [43007918, "16 Mile Creek Marsh"], [43007925, "Welland River"], [43008109, "Skyway Storm Pond"], [43017913, "Old Welland Canal"], [43017914, "Welland River"], [43017916, "Miller Creek"], [43018001, "Boston Creek"], [43018013, "McKenzie Creek"], [43018114, "Pottersburg Creek"], [43037908, "Welland River"], [43038052, "Thames River"], [43047933, "North Creek"], [43047957, "Grand River"], [43048111, "Fanshawe Reservoir (Thames River)"], [43057912, "Old Welland Canal"], [43067914, "Lake Gibson"], [43077903, "Lake Ontario 1b - Lower Niagara River"], [43077913, "Lake Gibson (Marlatt's Pond)"], [43077948, "Binbrook Reservoir (Lake Niapenco)"], [43077955, "Welland River"], [43078024, "Whiteman's Creek"], [43087903, "Lyons Creek"], [43088013, "Mohawk Lake"], [43088044, "Pittock Reservoir (Thames River)"], [43097923, "Twenty Mile Creek"], [43107915, "St. Catharines - Water Intake Canal"], [43108140, "Parkhill Reservoir"], [43117916, "Martindale Pond"], [43117922, "Lake Ontario 2a - Jordan Harbour"], [43117923, "Twenty Mile Creek"], [43128202, "Lake Huron H5"], [43147947, "Red Hill Creek"], [43148102, "Wildwood Reservoir"], [43158002, "Valens Reservoir"], [43158108, "Thames River"], [43167956, "Lake Jojo"], [43167957, "Desjardins Canal"], [43168023, "Pinehurst Lake"], [43177906, "Lake Ontario 2 - Western Lake Ontario"], [43177950, "Lake Ontario 3 - Hamilton Harbour"], [43178001, "Christie Reservoir"], [43187953, "Grindstone Creek"], [43198146, "Ausable River"], [43218127, "Morrison Lake"], [43228017, "Shades Mill Reservoir"], [43228022, "Speed River"], [43228042, "Nith River"], [43228049, "Shakespeare Pond"], [43228057, "Avon River"], [43228059, "Avon River (Lake Victoria)"], [43237957, "Bronte Creek"], [43237958, "Bronte Creek - Carlisle Pond"], [43238023, "Grand River"], [43247953, "Bronte Creek"], [43258003, "Bronte Creek"], [43258016, "Puslinch Lake"], [43268002, "Mountsberg Reservoir"], [43268019, "Speed River"], [43288111, "Thames River"], [43298029, "Columbia Lake (Laurel Creek)"], [43307940, "Lake Aquitaine"], [43307956, "Kelso Reservoir"], [43307957, "Hilton Falls Reservoir"], [43317936, "Rattray Marsh"], [43328010, "Eramosa River"], [43328014, "Speed River"], [43338015, "Speed River"], [43347935, "Credit River Marsh"], [43347944, "Lake Wabukayne"], [43348019, "Speed River"], [43348029, "Grand River"], [43348138, "Bayfield River"], [43357917, "Lake Ontario 4 - Toronto Offshore Area"], [43357943, "Lake Ontario 5 - Credit River"], [43358015, "Guelph Lake"], [43368033, "Canagagigue Creek"], [43377999, "Black Creek"], [43378003, "Fairy Lake"], [43378035, "Canagagigue Creek"], [43387935, "Centennial Park Pond"], [43388035, "Canagagigue Creek (Woolwich Reservoir)"], [43397919, "Lake Ontario 4a - Toronto Waterfront Area"], [43397927, "Humber River"], [43397928, "Humber River Marsh"], [43407927, "Grenadier Pond"], [43408043, "Conestogo River"], [43417921, "Don River"], [43417928, "Eglinton Flats Pond"], [43427943, "Norton Place Park Pond"], [43428044, "Conestogo Lake"], [43437923, "West Don River"], [43447923, "G. Ross Lord Reservoir"], [43447940, "West Humber River"], [43447946, "Professor's Lake"], [43447947, "Heart Lake"], [43447948, "Loafers Lake"], [43448115, "Maitland River, Middle"], [43448150, "Lake Huron H4"], [43457940, "Claireville Reservoir (West Humber River)"], [43458143, "Maitland River"], [43468020, "Belwood Lake (Grand River)"], [43468132, "Maitland River"], [43487903, "Duffin Creek Marsh"], [43488000, "Credit River"], [43497905, "Lake Ontario 6a - Frenchman Bay"], [43497907, "Rouge River Marsh"], [43497913, "Milne Reservoir (Rouge River)"], [43507840, "Lake Ontario 6 - Northwestern Lake Ontario"], [43507953, "Little Credit River"], [43517847, "McLaughlin Bay (Lake Ontario)"], [43517857, "Lynde Creek Marsh"], [43518115, "Little Maitland River"], [43527850, "Oshawa Creek"], [43527851, "Oshawa Harbour (Lake Ontario)"], [43527856, "Lake Ontario 6b - Whitby Harbour"], [43527910, "Rouge River"], [43527918, "Toogood Pond"], [43527927, "Mill Pond"], [43528109, "Maitland River"], [43537835, "Wilmot Creek Marsh"], [43537840, "Westside Marsh"], [43537938, "Bowmanville Creek Marsh"], [43538119, "Maitland River"], [43547834, "Graham Creek - Port Newcastle"], [43547848, "Farewell Creek"], [43557712, "East Lake"], [43557717, "West Lake"], [43557842, "Bowmanville Creek"], [43557943, "Humber River"], [43558006, "Island Lake (Orangeville Reservoir)"], [43567717, "Lake Ontario 8 - Northeastern Lake Ontario"], [43567903, "Duffin Creek (east)"], [43567932, "Eaton Hall (Seneca) Lake"], [43568026, "Luther Marsh Reservoir"], [43577818, "Lake Ontario 7 - Ganaraska River"], [43577840, "Soper Creek"], [43577926, "Wilcox Lake"], [43577950, "Palgrave Reservoir (Humber River)"], [43578131, "Lucknow River"], [43587844, "Bowmanville Creek"], [43587911, "Duffin Creek (west)"], [43597837, "Wilmot Creek"], [43597923, "Preston Lake"], [43598119, "Teeswater River"], [44007727, "Consecon Lake"], [44017841, "Soper Creek"], [44027916, "Musselman Lake"], [44037927, "Fairy Lake"], [44057733, "Lake Ontario 9a - Upper Bay of Quinte"], [44058125, "Silver Lake"], [44067734, "Trent River"], [44077656, "Lake Ontario 10 - Middle Bay of Quinte"], [44087724, "Lake Ontario 9b - Upper Bay of Quinte"], [44097717, "Lake Ontario 9 - Upper Bay of Quinte"], [44098009, "Pine River"], [44107644, "Lake Ontario 11 - Lower Bay of Quinte/Eastern Lake Ontario"], [44107850, "Lake Scugog"], [44107931, "Holland Marsh Canals"], [44108103, "Marl Lakes"], [44127810, "Rice Lake"], [44127931, "Holland River"], [44147747, "Percy Reach (Trent River)"], [44147808, "Rice Lake"], [44147819, "Otonabee River"], [44157956, "Bear Creek"], [44167628, "Cataraqui River"], [44167720, "Moira River"], [44167731, "Oak Lake"], [44167736, "Trent River"], [44177844, "Scugog River"], [44187627, "Colonel By Lake (Cataraqui River)"], [44187819, "Otonabee River (Little Lake)"], [44187832, "Pigeon River"], [44188029, "Beaver River"], [44188040, "Rocky Saugeen River"], [44197507, "South Nation River"], [44197953, "Pine River"], [44198030, "Eugenia Lake"], [44198044, "Bells Lake"], [44207600, "St. Lawrence River 12 - Thousand Islands area"], [44218033, "Beaver River"], [44237749, "Seymour Lake (Trent River)"], [44237814, "Otonabee River"], [44237845, "Scugog River"], [44237951, "Willow Creek"], [44247824, "Chemong Lake"], [44248055, "Sydenham River"], [44257621, "Dog Lake"], [44257633, "Sydenham Lake"], [44257742, "Rylstone Lake (Crowe River)"], [44257845, "Sturgeon Lake"], [44257920, "Lake Simcoe"], [44257940, "Little Lake"], [44267613, "South Lake"], [44277609, "Gananoque Lake"], [44277625, "Loughborough Lake"], [44277816, "Katchewanooka Lake"], [44277830, "Pigeon Lake"], [44278046, "Bighead River"], [44287641, "Hambly Lake"], [44287717, "Stoco Lake"], [44287843, "Sturgeon Lake"], [44287910, "Talbot River"], [44297744, "Crowe Lake"], [44297823, "Buckhorn Lake"], [44298000, "Nottawasaga River"], [44298013, "Georgian Bay GB4a"], [44298115, "Arran Lake"], [44298119, "Saugeen River"], [44307632, "Otter Lake"], [44307702, "Beaver Lake"], [44307727, "Moira Lake"], [44307730, "Moira River"], [44307753, "Round Lake"], [44308118, "Saugeen River"], [44317749, "Belmont Lake"], [44327600, "Charleston Lake"], [44327605, "Red Horse Lake"], [44327614, "Whitefish Lake"], [44327626, "Buck Lake"], [44327630, "Big Salmon Lake"], [44327632, "Birch Lake"], [44327638, "Thirteen Island Lake"], [44327806, "Dummer (White) Lake"], [44327818, "Buckhorn Lake, Lower"], [44327825, "Sandy Lake"], [44337628, "Big Clear Lake"], [44337645, "Second Depot Lake"], [44337806, "Stony Lake"], [44337813, "Lovesick Lake"], [44337846, "Cameron Lake"], [44338114, "Chesley Lake"], [44347553, "Graham Lake"], [44347616, "Sand Lake"], [44347619, "Opinicon Lake"], [44347647, "Third Depot Lake"], [44347652, "Fifth Depot Lake"], [44347823, "Bald Lake, Big"], [44347825, "Bald Lake, Little"], [44347857, "Mitchell Lake"], [44347903, "Canal Lake"], [44348050, "Sheppard Lake"], [44348056, "Sydenham River"], [44348119, "Lake Huron H3"], [44357627, "Devil Lake"], [44357647, "Fourth Depot Lake"], [44357659, "Gull Lake"], [44357700, "Sheffield Long Lake"], [44357750, "Cordova Lake"], [44357850, "Balsam Lake"], [44367553, "Temperance Lake"], [44367608, "Beverley Lake, Lower"], [44367620, "Indian Lake"], [44367625, "Crow Lake (Little) (Devil Lake)"], [44367640, "St. Andrew Lakes"], [44367753, "Oak Lake"], [44367809, "Julian Lake"], [44367812, "Coon Lake"], [44367930, "Bass Lake"], [44367948, "Orr Lake"], [44377605, "Beverley Lake, Upper"], [44377643, "Elbow Lake"], [44387620, "Newboro Lake"], [44387758, "Kasshabog Lake"], [44387907, "Dalrymple Lake"], [44388104, "McNab Lake"], [44397633, "Burridge Lake"], [44407658, "Horseshoe Lake"], [44407922, "Lake Couchiching"], [44417620, "Rideau Lake, Upper"], [44417630, "Wolfe Lake"], [44417635, "Bobs Lake"], [44417642, "Eagle Lake"], [44417658, "Bull Lake"], [44417810, "Long Lake"], [44417845, "Four Mile Lake"], [44417919, "Lake St. John"], [44427532, "St. Lawrence River 13 - Middle Corridor"], [44427657, "Buck Lake"], [44427732, "Wolf Lake"], [44427802, "Jack Lake"], [44427819, "Mississagua Lake"], [44437643, "Leggat Lake"], [44437655, "Big Clear Lake"], [44437750, "Tangamong Lake"], [44437755, "Methuen Lake"], [44437848, "Shadow Lake"], [44438041, "Mountain Lake"], [44438113, "Boat Lake"], [44447658, "Kennebec Lake"], [44447716, "Deerock Lake"], [44447810, "Wolf Lake"], [44447855, "Head Lake"], [44447953, "Little (Midland Park) Lake"], [44457626, "Crosby Lake"], [44457812, "Anstruther Lake"], [44457819, "Catchacoma Lake"], [44457829, "Crystal Lake"], [44467613, "Rideau Lake, Big"], [44467618, "Black Lake"], [44467630, "Farrell (Farren) Lake"], [44467641, "Sharbot Lake"], [44467643, "Black Lake"], [44467725, "Lingham Lake"], [44467903, "Cranberry Lake"], [44467942, "Georgian Bay GB4"], [44477621, "Pike Lake"], [44477738, "Jordan Lake"], [44477744, "Dickey Lake"], [44477924, "Sparrow Lake"], [44477929, "Matchedash (Long) Lake"], [44478114, "Isaac Lake"], [44487615, "Long Lake"], [44487626, "Christie Lake"], [44487630, "Little Silver Lake"], [44487803, "Chandos Lake"], [44487846, "Buller Lake"], [44487914, "Clearwater Lake"], [44487929, "Eastern Lake"], [44488111, "Berford Lake"], [44497849, "Black Lake"], [44497910, "Riley Lake"], [44497934, "Dumbell Lake"], [44497939, "Black (MacLean) Lake"], [44497942, "Little Lake (Severn River)"], [44497959, "Farlain Lake"], [44507636, "Silver Lake"], [44507658, "Big Gull Lake"], [44507702, "Sand (Plevna) Lake"], [44507716, "Skootamatta Lake"], [44507741, "Steenburg Lake"], [44507749, "Urbach Lake"], [44507803, "Tallan Lake"], [44507826, "Fortescue Lake"], [44507829, "White Lake"], [44507848, "Little Gull Lake"], [44507918, "Kahshe Lake"], [44507938, "Horseshoe Lake"], [44517607, "Rideau Lake, Lower"], [44517613, "Otty Lake"], [44517750, "Wollaston Lake"], [44517829, "Salerno Lake"], [44517847, "Gull Lake"], [44517942, "Gloucester Pool (Severn River)"], [44527701, "Kashwakamak Lake"], [44527705, "Mississagagon Lake"], [44527808, "Alder Lake"], [44527847, "Little Bob Lake"], [44527850, "Devil's Lake"], [44527927, "Morrison Lake"], [44527939, "Tea Lake"], [44537556, "Rideau River"], [44537607, "Tay River"], [44537614, "Tay River"], [44537713, "Bon Echo Lake"], [44537737, "Limerick Lake"], [44537826, "Contau Lake"], [44547703, "Shawenegog Lake"], [44547708, "Shabomeka Lake"], [44547710, "Kishkebus Lake"], [44547717, "Joeperry Lake"], [44547808, "Eels Lake"], [44547823, "Gooderham Lake"], [44547927, "Muldrew Lakes"], [44547933, "Woodland Lake"], [44547934, "Boleau Lake"], [44547943, "Six Mile Lake"], [44557628, "Bennett Lake"], [44557648, "Crotch Lake"], [44557712, "Mazinaw Lakes"], [44557733, "Cashel Lake"], [44557743, "Robinson Lake"], [44557804, "Silent Lake"], [44557841, "South Lake"], [44557847, "Bob Lake"], [44567504, "St. Lawrence River 14 - Lake St. Lawrence"], [44567652, "Ardoch Lake"], [44567735, "Mephisto Lake"], [44567815, "Blue Rock (Lowry) Lake"], [44567828, "Bark Lake"], [44567924, "Lake Muskoka"], [44577806, "Farrel Lake"], [44577935, "Nine Mile Lake"], [44587634, "Dalhousie Lake"], [44587801, "Paudash Lake, Lower"], [44587803, "Paudash Lake"], [44587808, "Cheddar Lake"], [44587824, "Stormy Lake"], [44587829, "Koshlong Lake"], [44587945, "Gibson Lake"], [44597716, "Mackavoy Lake"], [44597721, "Effingham Lake"], [44597836, "Kashagawigamog Lake"], [44597841, "Horseshoe Lake"], [44597908, "Prospect Lake"], [45007520, "South Nation River"], [45007644, "Antoine Lake"], [45007657, "Grindstone Lake"], [45007704, "Buckshot Lake"], [45007807, "Monck Lake"], [45007823, "Portage Lake"], [45007827, "Blue Hawk Lake"], [45007839, "Duck Lake"], [45007925, "Lake Muskoka"], [45017651, "Palmerston Lake"], [45017749, "L'Amable Lake"], [45017756, "Bow Lake"], [45017803, "Centre Lake"], [45017816, "Esson Lake"], [45017823, "Loon (Dudmon) Lake"], [45017843, "Twelve Mile Lake"], [45017905, "Wood Lake"], [45017951, "Go Home Lake"], [45027623, "Kerr Lake"], [45027636, "Park Lake"], [45027725, "Weslemkoon Lake"], [45027755, "Bentley Lake"], [45027806, "Deer Lake"], [45027814, "Cockle Lake"], [45027821, "Little Dudmon Lake"], [45027827, "Haas Lake"], [45027856, "Bentshoe Lakes"], [45027901, "Clear Lake"], [45027958, "Tadenac Bay (Georgian Bay)"], [45037647, "Canonto Lake"], [45037703, "Brule Lake"], [45037809, "Cope Lake"], [45037813, "Pusey Lake"], [45037819, "Miskwabi Lake"], [45037824, "South Portage Lake"], [45037850, "Brady Lake"], [45037903, "Bigwind Lake"], [45037906, "Leech Lake"], [45037910, "McKay Lake"], [45037957, "Tadenac Lake"], [45047639, "Robertson Lake"], [45047723, "Ashby Lake"], [45047755, "Faraday Lake"], [45047802, "Diamond Lake"], [45047804, "Jordan Lake"], [45047808, "Hudson Lake"], [45047844, "Boshkung Lake"], [45047847, "Kushog Lake"], [45047904, "Pine Lake"], [45047927, "Leonard Lake"], [45057610, "Mississippi Lake"], [45057659, "Mackie Lake"], [45057824, "Drag Lake"], [45057902, "Crosson Lake"], [45057911, "Healey Lake"], [45058123, "Miller Lake"], [45067648, "Redhorse Lake"], [45067701, "Fortune Lake"], [45067845, "Halls Lake"], [45067931, "Brandy Lake"], [45077659, "Round Schooner Lake"], [45077803, "Baptiste Lake"], [45077828, "Basshaunt Lake"], [45077834, "Cranberry Lake"], [45077835, "Pine Lake"], [45077914, "Halfway Lake"], [45077918, "Muskoka River"], [45087425, "St. Lawrence River 15 - Lake St. Francis"], [45087430, "St. Lawrence River 16 - Lake St. Francis at Raisin River"], [45087648, "Govan Lake"], [45087716, "Denbigh Lake"], [45087726, "Trout Lake"], [45087808, "Elephant Lake"], [45087829, "Eagle Lake"], [45087906, "Heeney Lake"], [45087945, "Stewart Lake"], [45087959, "Moon River"], [45097439, "Raisin River"], [45097539, "Rideau River"], [45097607, "Mississippi River"], [45097636, "Green Lake"], [45097641, "Widow Lake"], [45097703, "Centennial (Black Donald) Lake"], [45097719, "Big Yirkie Lake"], [45097843, "Hawk Lake, Little"], [45097844, "Hawk Lake, Big"], [45097850, "St. Nora Lake"], [45097905, "Dickie Lake"], [45097910, "Moot Lake"], [45097954, "Kapikog Lake"], [45097955, "Healey Lake"], [45107620, "Clayton Lake"], [45107652, "Norcan Lake"], [45107712, "Leatherroot Lake"], [45107835, "Tedious Lake"], [45107915, "Fawn Lake"], [45107927, "Three Mile Lake"], [45107935, "Lake Rosseau"], [45107944, "Lake Joseph"], [45108135, "Willow Creek"], [45108140, "Lake Huron H2"], [45108236, "North Channel NC2a - Whalesback Channel"], [45117422, "Gunn Creek"], [45117608, "Mississippi River"], [45117739, "Fraser Lake"], [45117749, "Salmon Trout Lake"], [45117832, "Redstone Lake"], [45117843, "Clear Lake"], [45117847, "Sherborne Lake"], [45117857, "Red Chalk Lake"], [45117904, "Echo Lake"], [45127656, "Black Donald Lake"], [45127726, "Genricks Lake"], [45127813, "Kingscote Lake"], [45127822, "Percy Lake"], [45127824, "Haliburton Lake"], [45127835, "Birchy Lake"], [45127842, "Red Pine Lake"], [45127844, "Nunikani Lake"], [45127851, "Raven Lake"], [45127856, "Blue Chalk Lake"], [45128120, "Gillies Lake"], [45128128, "George Lake"], [45137830, "Dog Lake"], [45137831, "Duck Lake"], [45137838, "Kennisis Lake"], [45137856, "Paint Lake"], [45137859, "Chub Lake"], [45137933, "Young Lake"], [45137957, "Crane Lake"], [45138128, "Emmett Lake"], [45138131, "Cyprus Lake"], [45138134, "Cameron Lake"], [45147650, "Wabun Lake"], [45157443, "Loch Garry"], [45157740, "Fosters Lake"], [45157830, "Eyre Lake"], [45157832, "Depot Lake"], [45157835, "Kennisis Lake, Little"], [45157838, "Goodwin Lake"], [45157904, "Lake of Bays"], [45157915, "Mary Lake"], [45157927, "Skeleton Lake"], [45157940, "Sucker Lake"], [45167645, "Calabogie Lake"], [45167731, "Dropledge Lake"], [45167755, "Cardwell Lake"], [45167831, "Dutton Lake"], [45167936, "Woods Lake"], [45167947, "Clear Lake"], [45177807, "Meach Lakes"], [45177842, "Slipper Lake"], [45177958, "Otter Lake"], [45187631, "White Lake"], [45187651, "Fergusons Lake"], [45187805, "Big Mink Lake"], [45187845, "Kawagama Lake"], [45197641, "Balmer Lake"], [45197705, "Burns Lake"], [45197802, "Lake St. Peter"], [45197850, "Millichamp Lake"], [45197852, "Clinto Lake"], [45197908, "Buchanan Lake"], [45197958, "Oastler Lake"], [45207554, "Monahan Drain"], [45207643, "Norway Lake"], [45207701, "Tooeys Lake"], [45207842, "Bear Lake"], [45207851, "McFadden Lake"], [45207855, "Flaherty Lake"], [45207906, "Peninsula Lake"], [45207911, "Fairy Lake"], [45207917, "Lake Vernon"], [45208135, "Georgian Bay GB2"], [45217744, "Purdy Lake"], [45217749, "Papineau Lake"], [45217841, "Kimball Lake"], [45217847, "Fletcher Lake"], [45217850, "Fletcher Lake, Lower"], [45217858, "Fifteen Mile Lake"], [45217956, "Haines Lake"], [45227750, "Hicks Lake"], [45227801, "McKenzie Lake"], [45227843, "Livingstone Lake"], [45227854, "McCann Lake"], [45227855, "Oxtongue Lake"], [45227921, "Fox Lake"], [45227935, "Meadow (Mead) Lake"], [45228000, "Mill Lake"], [45237635, "Madawaska River"], [45237848, "Fisher Lake"], [45237900, "Buck Lake"], [45237901, "Solitaire Lake"], [45237905, "Walker Lake"], [45237907, "Harp Lake"], [45237913, "Mayflower Lake"], [45237930, "Axe Lake"], [45247559, "Constance Lake"], [45247640, "Hurds Lake"], [45247659, "Constant Lake"], [45247757, "Cross (Lyell) Lake"], [45247812, "Hay Lake, Lower"], [45247851, "Niger Lake"], [45247912, "Arrowhead Lake"], [45247917, "Waseosa Lake"], [45247942, "Manitouwaba Lake"], [45247949, "Isabella Lake"], [45257545, "Ottawa River"], [45257741, "Kamaniskeg Lake"], [45257841, "Wolf Lake"], [45257902, "Rebecca Lake"], [45257923, "Buck Lake"], [45257939, "Fry Lake, Upper"], [45267616, "Mississippi River"], [45267712, "Lake Clear"], [45267735, "Wadsworth Lake"], [45267834, "McGarvey Lake"], [45267840, "Crown Lake"], [45267845, "Roger Lake"], [45267855, "Camp Lake"], [45267858, "Oxbow Lake"], [45267902, "Bella Lake"], [45267935, "Bear Lake"], [45267937, "Horn Lake"], [45268011, "Shebeshekong Lake"], [45277542, "Rideau River"], [45277615, "Mississippi River Snye"], [45277751, "Bark Lake"], [45277837, "Big Porcupine Lake"], [45277856, "Tasso Lake"], [45277859, "Dotty Lake"], [45277911, "Oudaze Lake"], [45287621, "Madawaska Lake"], [45287829, "Lake Louisa"], [45287835, "Bonnechere Lake"], [45287911, "Foote Lake"], [45287924, "Round Lake"], [45297744, "Trout Lake"], [45297847, "Westward Lake"], [45297954, "Manitouwabing Lake"], [45307745, "Carson Lake"], [45307817, "Galeairy Lake"], [45307843, "Swan Lake"], [45307912, "Bay Lake"], [45308015, "Georgian Bay GB3"], [45317633, "Bonnechere River"], [45317836, "Delano Lake"], [45317841, "Smoke Lake"], [45317857, "Unnamed Lake #420"], [45317912, "Emsdale Lake"], [45317916, "Clear (Schamerhorn) Lake"], [45317948, "Oliver Lake"], [45317956, "McKellar Lake"], [45327500, "South Nation River"], [45327835, "Cache Lake"], [45327902, "Hungry Lake"], [45327924, "Doe Lake"], [45327930, "Rainy Lake"], [45327958, "Lorimer Lake"], [45337703, "Mink Lake"], [45337710, "Mud (Wilbur) Lake"], [45337807, "McCauley Lake"], [45337900, "Cripple Lake"], [45338015, "Rock Island Lake (Shawanaga River)"], [45347721, "Golden Lake"], [45347835, "Canisbay Lake"], [45347854, "McCraney Lake"], [45357740, "Burns Lake"], [45357917, "Deer Lake"], [45357919, "Three Mile Lake"], [45358010, "Trout Lake"], [45358206, "Manitou River"], [45367458, "Lac Georges"], [45377707, "Lake Dor\u04a9 (Dore)"], [45377751, "Aylen Lake"], [45377921, "Kernick Lake"], [45377942, "Ahmic Lake"], [45378129, "Georgian Bay GB1"], [45387454, "Ottawa River"], [45387730, "Round Lake"], [45387933, "Cecebe Lake"], [45397748, "Murphys Lake"], [45397911, "Sand Lake"], [45397952, "Whitestone Lake"], [45398014, "Miskokway Lake"], [45407650, "Ottawa River"], [45407655, "Muskrat Lake"], [45407736, "Stevenson Lake"], [45407814, "MyKiss Lake"], [45407913, "Loon (Pevensey) Lake"], [45407918, "Pickerel River"], [45407920, "Jacks (Burden) Lake"], [45417729, "Jacks Lakes"], [45417806, "Ryan Lake"], [45417814, "Little MyKiss Lake"], [45417848, "Timberwolf Lake"], [45417905, "Nabdoe Lake"], [45417910, "Buck (McCann) Lake"], [45417912, "Grass (Sweny) Lake"], [45417914, "Island (Proudfoot) Lake"], [45417918, "Pickerel Lake"], [45417944, "Magnetawan River"], [45427719, "Kelly Lake"], [45427823, "Opeongo Lake"], [45427911, "Long (Oliphant) Lake"], [45428204, "Windfall Lake"], [45437912, "North Lake"], [45438002, "Wahwashkesh Lake"], [45438030, "Giroux Lake"], [45438152, "Sucker Lake"], [45447812, "Round Island Lake"], [45457923, "Lake Bernard"], [45458213, "Mindemoya Lake"], [45458257, "Lake Huron H1"], [45467828, "Redrock Lake"], [45467908, "Peyton Lake"], [45467945, "Big Deer Lake"], [45477812, "Dickson Lake"], [45478200, "Lake Manitou"], [45487908, "Trout Lake"], [45497918, "Forest Lake"], [45497940, "Spring (Fowke) Lake"], [45498218, "Kagawong Lake"], [45507806, "White Partridge Lake"], [45507811, "Little Crooked Lake"], [45507835, "Lake La Muir"], [45507930, "Eagle Lake"], [45508327, "North Channel NC1"], [45517814, "Lake Lavieille"], [45517954, "Le Grou Lake"], [45518014, "Smoky Lake"], [45518227, "Tobacco Lake"], [45527830, "Hogan Lake"], [45528159, "Pike Lake"], [45537914, "Red Deer Lake"], [45537921, "Bacon Lake"], [45538157, "Bass Lake"], [45538254, "Silver Lake"], [45547720, "Petawawa River"], [45547957, "Seagull Lake"], [45548000, "Wauquimakog Lake"], [45548033, "Portage Lake"], [45548034, "Key River"], [45557914, "Tower Lake"], [45557951, "Cadden Lake"], [45558032, "Gurd Lake"], [45567950, "Arthurs Lake"], [45568004, "Big Caribou Lake"], [45568013, "Dollars Lake"], [45598032, "Pakeshkag Lake"], [46008000, "Memesagamesing Lake"], [46017723, "Sturgeon Lake"], [46017828, "Cedar Lake"], [46017931, "Ruth Lake"], [46017943, "Commanda Lake"], [46018000, "Mud Lake"], [46027932, "Beatty (Wolfe) Lake"], [46027934, "McQuaby Lake"], [46028004, "Woodcock Lake"], [46028124, "George Lake"], [46037946, "Restoule Lake"], [46037958, "Robin Lake"], [46037959, "Migisi (Snigisi) Lake"], [46038005, "Fraser Lake"], [46038055, "French River"], [46048117, "Carlyle Lake"], [46048120, "Kakakise Lake"], [46057853, "Kioshkokwi Lake"], [46057947, "Patterson (Stormy) Lake"], [46058010, "French River"], [46058127, "Threenarrows Lake"], [46067801, "Chateau Lake"], [46067947, "Clear (Watt) Lake"], [46068006, "Hemlock Lake #1"], [46068007, "Hemlock Lake #2"], [46068008, "Harris Lake"], [46068133, "Helen Lake"], [46077729, "Ottawa River"], [46077933, "South River"], [46078010, "French River"], [46078107, "Tyson Lake"], [46078114, "Johnnie Lake"], [46087913, "Wistiwasing (Wasi) Lake"], [46088045, "Crooked Lake"], [46088112, "Bell Lake"], [46088140, "Charlton Lake"], [46088152, "Evangeline Lake"], [46097740, "Tee Lake"], [46098121, "Great Mountain Lake"], [46098220, "North Channel NC2"], [46108015, "Mercer Lake"], [46108137, "Deerhound Lake"], [46108140, "Lang Lake"], [46108155, "Maple Lake"], [46108204, "La Cloche Lake"], [46108301, "Mississagi River"], [46118130, "Walker Lake"], [46118145, "Raven Lake"], [46118156, "Cutler Lake"], [46127913, "Lake Nosbonsing"], [46128047, "Kakakiwaganda Lake"], [46128113, "Peter Lake"], [46128127, "Bear Lake"], [46128140, "Stratton Lake"], [46128229, "Grassy Lake"], [46128250, "Lauzon Lake"], [46138035, "Trout Lake"], [46138138, "St. Leonard Lake"], [46148136, "Augusta Lake"], [46157855, "Smith Lake"], [46158010, "French River (Little)"], [46158052, "Wanapitei River"], [46158120, "Panache Lake"], [46158138, "Elizabeth Lake"], [46158146, "Spanish River"], [46158255, "Lake of the Mountains (Dubourne Lake)"], [46158300, "Cataract Lake"], [46168113, "Little Trout Lake"], [46168136, "Vermilion River"], [46168218, "Kecil Lake"], [46168219, "Lang Lake"], [46168240, "Turtle Lake"], [46168302, "Scarfe Lake"], [46168318, "Bright Lake"], [46177851, "Long Lake"], [46177852, "Moore Lake"], [46178000, "Lake Nipissing"], [46178122, "Little Panache Lake"], [46178256, "Heron (Upper Cranberry) Lake"], [46178302, "Falls (Canoe) Lake"], [46187851, "Mattawa River"], [46187905, "Lake Talon (Mattawa River)"], [46187910, "Turtle Lake (Mattawa River)"], [46187920, "Trout Lake"], [46188100, "White Oak Lake"], [46188135, "Wabagishik Lake"], [46188145, "Spanish River"], [46188158, "Gough (Birch) Lake"], [46188220, "Little Serpent Lake"], [46188243, "McGiverin Lake"], [46188258, "Bearhead Lake"], [46188302, "Plump Lake"], [46188317, "Mississagi River"], [46198015, "Bear Lake"], [46198109, "Long Lake"], [46198220, "Bellows Lake"], [46198228, "McCarthy Lake"], [46198236, "Grandeur Lake"], [46198237, "Marshland Lake"], [46198301, "Lear Lake"], [46198317, "Red Rock Lake (Mississagi River)"], [46198324, "Basswood Lake"], [46207923, "Lees Creek"], [46208107, "Long Lake"], [46208112, "Round Lake"], [46208247, "Rossmere Lake"], [46208307, "Darrel Lake"], [46218133, "Spanish River"], [46218303, "Chiblow Lake"], [46218308, "Chiblow Lake, Little"], [46228038, "Nepewassi Lake"], [46228111, "Whitefish Lake"], [46228145, "Agnew Lake"], [46228240, "Esten Lake"], [46228241, "Slipper Lake"], [46228257, "Matinenda Lake"], [46238115, "McCharles Lake"], [46238242, "Elliot Lake"], [46248112, "Simon Lake"], [46258059, "McFarlane Lake"], [46258229, "May Lake"], [46258234, "McCabe Lake"], [46258252, "Big Moon Lake"], [46258313, "Constance Lake"], [46258350, "Gorden Lake"], [46268055, "Richard Lake"], [46268100, "Still Lake"], [46268101, "St. Charles Lake"], [46268220, "Whiskey Lake"], [46268329, "Bridgland (Burrows) Lake"], [46268346, "Rock Lake"], [46268356, "McCarroll Lake"], [46278051, "Alice Lake"], [46278054, "Daisy Lake"], [46278056, "Laurentian Lake"], [46278057, "Bennett Lake"], [46278058, "Nepahwin Lake"], [46278102, "Robinson Lake"], [46278104, "Kelley Lake"], [46278233, "Popeye (Poppy) Lake"], [46278326, "Tunnel Lake (Mississagi River)"], [46288013, "Deer Lake"], [46288057, "Bethel Lake"], [46288126, "Fairbank Lake"], [46288233, "Quirke Lake"], [46298002, "Muskosung Lake"], [46298057, "Ramsey Lake"], [46298242, "Dunlop Lake"], [46307903, "Timber Lake"], [46308126, "Vermilion Lake"], [46308257, "Keelor Lake"], [46308323, "Chub Lake"], [46308427, "Big Carp River"], [46317857, "Lac la Cave"], [46318229, "Geiger Lake"], [46318231, "Rochester Lake"], [46318247, "Ten Mile Lake"], [46318349, "Aberdeen (Bass) Lake"], [46327949, "Tomiko Lake"], [46328109, "Whitewater Lake"], [46328134, "Whitefish Lake"], [46328336, "Skookum Lake"], [46328348, "McMahon Lake"], [46328421, "St. Marys River"], [46337927, "Little Tomiko Lake"], [46338055, "Maley Reservoir"], [46338245, "Samreid Lake"], [46338247, "Dollyberry Lake"], [46348134, "Ministic Lake"], [46348225, "Deschamp Lake"], [46348251, "Astonish Lake"], [46348311, "Castra Lake"], [46348322, "Wakomata Lake"], [46348359, "Echo Lake"], [46357900, "Ottawa River"], [46357931, "Rock Island Lake"], [46358058, "Whitson Lake"], [46358144, "Fox (Macaulay) Lake"], [46358205, "Klondyke Lake, Lower"], [46358232, "Alexander Lake"], [46358241, "Semiwite Lake"], [46358244, "Jimchrist (Christman) Lake"], [46358247, "Flack Lake"], [46358302, "Endikai Lake"], [46358335, "Shelden Lake"], [46368127, "Windy Lake"], [46368305, "Regal Lake"], [46368307, "Burns Lake"], [46377939, "Tilden Lake"], [46378211, "Madawanson Lake"], [46387936, "Bear (Kaotisinimigo) Lake"], [46388233, "Sister Lake, Little"], [46388248, "Cobre Lake"], [46388308, "Stinkfish Lake"], [46398236, "Rawhide Lake"], [46398247, "Tenfish Lake"], [46398305, "Kirkpatrick Lake"], [46407937, "Poplar Lake"], [46408001, "Island (Thistle) Lake"], [46408018, "Theriault Lake"], [46408026, "Murray Lake"], [46408051, "Lac St. Jean (Massey Lake)"], [46408153, "S Lake"], [46408222, "Spinweb Lake"], [46428307, "White Bear Lake"], [46437925, "Sucker Lake"], [46437947, "Marten Lake"], [46438029, "Carafel Lake"], [46438059, "Frenchman Lake"], [46438107, "Sans Chambre Lake"], [46438130, "Green Lake"], [46438303, "Duval Lake"], [46438428, "Goulais River"], [46438431, "Lake Superior 11 - Goulais Bay area"], [46447921, "McConnell Lake"], [46448033, "Kukagami Lake"], [46448101, "Joe Lake"], [46448105, "Nelson Lake"], [46448154, "Rushbrook Lake"], [46457954, "Red Cedar Lake"], [46458030, "Chuggin Lake"], [46458045, "Wanapitei Lake"], [46458310, "Toodee Lake"], [46467940, "Wicksteed Lake"], [46467949, "Opechee Lake"], [46468133, "Geneva Lake"], [46468159, "Shakwa Lake"], [46468342, "Garden Lake"], [46468356, "Devil's Lake"], [46468415, "Sill Lake"], [46478036, "Matagamasi Lake"], [46478220, "Lac aux Sables"], [46488020, "Wawiashkashi (Grassy) Lake"], [46497953, "Hangstone Lake"], [46498114, "Michaud Lake"], [46508029, "Matagamasi Lake, Lower"], [46508408, "Weckstrom Lake"], [46508432, "Lake Superior 10 - Agawa & Batchawana Bays"], [46518017, "Manitou Lake"], [46518042, "Caswell Lake"], [46518105, "Bigwood Lake"], [46518301, "Doehead Lake"], [46527915, "Lake Timiskaming"], [46527957, "Cross Lake"], [46528001, "Aileen Lake"], [46528225, "Boumage Lake"], [46537949, "Jumping Cariboo Lake"], [46538247, "Bobowash Lake"], [46548019, "Emerald Lake"], [46548138, "Halfway Lake"], [46548154, "Dennie Lake"], [46548334, "Ranger Lake"], [46557953, "Wasaksina Lake"], [46558032, "Pedro Lake"], [46558034, "Rawson Lake"], [46558053, "Fraleck Lake"], [46558211, "Jeanne Lake"], [46558228, "Bark Lake"], [46558304, "Rocky Island Lake"], [46558313, "Aubrey Lake"], [46558412, "Achigan Lake"], [46568112, "Venetian Lake, Little"], [46568115, "Venetian Lake"], [46568137, "Antrim Lake"], [46568159, "Sinaminda Lake"], [46577948, "Wilson Lake"], [46578021, "Iron Lake"], [46578042, "Chiniguchi Lake"], [46578051, "Beaver Lake"], [46578130, "Onaping Lake"], [46578205, "Mozhabong Lake"], [46578347, "Saddle Lake"], [46578444, "Pancake River"], [46587949, "Herridge Lake"], [46587952, "Driftwood Lake"], [46588150, "Pogamasing Lake"], [46588308, "Peshu Lake"], [46588421, "Chippewa River"], [46597938, "Rabbit Lake"], [46598134, "Sugarbush Lake"], [46598214, "Labitchie Lake"], [46598331, "Saymo Lake"], [46598347, "Ward Lake"], [47008005, "Lake Temagami"], [47008105, "Helen Lake"], [47008118, "Rome Lake"], [47018157, "Big Squaw Lake"], [47018436, "Mamainse Lake"], [47028015, "Obabika Lake"], [47028425, "Turkey Lake"], [47038032, "Yorston Lake"], [47038042, "Stouffer Lake"], [47038332, "Mystery (South Anvil) Lake"], [47047943, "Cassels Lake"], [47047949, "Link Lake"], [47047952, "Tetapaga Lake"], [47047955, "Iron Lake"], [47048122, "Scotia Lake"], [47048332, "Anvil Lake"], [47048339, "South Branch Lake"], [47048418, "Adelaide Lake"], [47058002, "Kokoko Lake"], [47058030, "Linger Lake"], [47058050, "Bowland Lake"], [47058113, "Edna Lake"], [47058137, "Lower Muldrew Lake"], [47058332, "Gong Lake"], [47058424, "Griffin Lake"], [47067937, "Lorrain Lake"], [47067946, "Net Lake"], [47068032, "Seagram Lake"], [47068353, "Hanes Lake"], [47068400, "Gavor Lake"], [47068422, "Dick Lake"], [47068437, "Pancake Lake, Upper"], [47077943, "Pishabo Lake"], [47078034, "Yorston River"], [47078052, "Laundrie Lake"], [47078105, "Little Burwash Lake"], [47078208, "Indian Lake"], [47078349, "Point Lake"], [47087928, "Lower Notch Lake (Montreal River)"], [47088113, "Avery Lake"], [47088117, "Thor Lake"], [47088349, "Graham Lake"], [47098001, "Red Squirrel Lake"], [47098354, "Quinn Lake"], [47098437, "Queminico Lake"], [47107930, "Tooth Lake"], [47107949, "Thieving Bear Lake"], [47108037, "Bluesucker Lake"], [47108038, "Rodd Lake"], [47108123, "Kalaco Lake"], [47108340, "Goulais Lake"], [47117958, "McLean Lake"], [47118041, "Pilgrim Lake"], [47118042, "Solace Lake"], [47118121, "Oshawong Lake"], [47118142, "Low Water Lake"], [47127942, "Rib Lake"], [47128014, "Diamond Lake"], [47128144, "Marquette Lake"], [47128308, "Beak Lake"], [47137949, "Mountain Lake"], [47138102, "Welcome Lake"], [47138122, "Shoofly Lake"], [47138215, "Ramsey Lake"], [47138338, "Gull Lake"], [47138355, "Galloway Lake"], [47147957, "Anima Nipissing Lake"], [47148033, "Florence Lake"], [47148047, "Regan Lake"], [47158049, "Stull Lake"], [47158228, "Bardney Lake"], [47158317, "Aubinadong River"], [47158332, "Megisan Lake"], [47167941, "Montreal River"], [47168145, "Sand Lake"], [47178006, "Barter Lake"], [47178050, "Whitepine Lake"], [47178312, "Flame Lake"], [47188026, "Jim Edwards Lake"], [47188145, "Paudash Lake"], [47188151, "Ninth Lake"], [47197942, "Montreal River"], [47198121, "Oshkegami Lake, Lower"], [47198207, "Biscotasi Lake"], [47198427, "Hubert Lake"], [47198436, "Speckled Trout Creek"], [47207957, "Kittson Lake"], [47208010, "Lady Evelyn Lake"], [47208042, "McCulloch Lake"], [47208427, "Hubert Lake, North"], [47217951, "Bay Lake"], [47218031, "Dee's Lake"], [47218108, "Skog Lake"], [47218353, "Caesar Lake"], [47218423, "Little Agawa Lake"], [47227940, "Giroux Lake"], [47228038, "Whirligig Lake"], [47228039, "Jerry Lake"], [47228135, "Donnegana Lake"], [47237939, "Kerr Lake"], [47237940, "Peterson Lake"], [47238108, "Jean Lake"], [47238131, "Deschenes Lake"], [47238255, "Kebskwasheshi Lake"], [47238306, "Wenebegon Lake"], [47247939, "Crosswise Lake"], [47247941, "Cobalt Lake"], [47247942, "Sasaginaga Lake"], [47247944, "Sharp Lake"], [47248040, "Marina Lake"], [47248045, "Lulu Lake"], [47248108, "Karchuk Lake"], [47248133, "Duchabani Lake"], [47248430, "Black Beaver Lake"], [47258016, "Anvil Lake"], [47258145, "Threecorner Lake"], [47268023, "Grays Lake"], [47268025, "Makobe Lake"], [47268314, "Weshaygo Lake"], [47278045, "Okiniada Lake"], [47278109, "Kasakanta Lake"], [47278435, "Kwagama Lake"], [47288106, "Chrysler Lake"], [47297951, "Pike Lake"], [47298035, "Carmen Lake"], [47298251, "Wakami Lake"], [47307952, "Twin Lakes"], [47308035, "Island Lake"], [47308037, "Shack Lake"], [47318120, "Opikinimika Lake, Lower"], [47318318, "Kindogan Lake"], [47318431, "Callahan Lake"], [47318433, "Vesi Lake"], [47328154, "Three Duck Lake (Middle)"], [47338104, "East Shining Tree Lake"], [47338127, "Nabakwasi Lake"], [47338549, "Lake Superior 9 - Michipicoten Island area"], [47348316, "Five Mile Lake"], [47348351, "Graveyard Lake"], [47358045, "Stumpy Lake"], [47358117, "West Shining Tree Lake"], [47368152, "Susanne Lake"], [47368434, "Radium Lake"], [47378050, "Long Lake"], [47378052, "Margueratt Lake"], [47378215, "Opeepeesway Lake"], [47378258, "Kinogama Lake"], [47378303, "Tony Lake"], [47378443, "Old Woman Lake"], [47378454, "Gargantua Lake"], [47388047, "Gowganda Lake"], [47388100, "Cripple Lake"], [47388113, "Michiwakenda Lake"], [47388159, "Wolf Lake"], [47388407, "McEwen Lake"], [47388454, "Fife Lake"], [47398034, "Ashigami Lake"], [47398041, "Leroy Lake"], [47398144, "Minisinakwa Lake"], [47398446, "Gamitagama Lake"], [47408153, "Mesomikenda Lake"], [47418315, "Nemegos Lake"], [47428037, "Longpoint Lake"], [47428048, "Obushkong Lake"], [47428442, "Mijinemungshing Lake"], [47438019, "Elk Lake"], [47438103, "Pigeon Lake"], [47438203, "Pebonishewi Lake"], [47438208, "Rice Lake"], [47448146, "Wizard Lake"], [47448150, "Makami Lake"], [47448306, "Handclasp Lake"], [47448324, "McLennan Lake"], [47448337, "Nagasin Lake"], [47458054, "Penassi Lake"], [47458330, "Sideburned Lake"], [47458333, "Highbrush Lake"], [47458431, "Sand Lake"], [47458442, "Little Dossier Lake"], [47458554, "Michi Lake"], [47468038, "Shillington Lake"], [47468058, "Duncan Lake"], [47468242, "Cree Lake"], [47478119, "Marne Lake"], [47478138, "Kenetogami Lake"], [47478211, "Rush Lake"], [47488114, "Grassy Lake"], [47488326, "Chapleau River"], [47488454, "Old Woman River"], [47498008, "Long Lake"], [47498150, "Akonesi Lake"], [47508247, "Denyes Lake"], [47508317, "Borden Lake"], [47508334, "Wangoon Lake"], [47508436, "Anjigami Lake"], [47518121, "Sinclair Lake"], [47518148, "Katodawa Lake"], [47518350, "Little Wawa Lake"], [47527939, "Skeleton Lake"], [47527943, "Wendigo Lake"], [47528040, "Sisseney Lake"], [47528105, "Dumbell Lake"], [47528135, "Mattagami Lake"], [47528142, "Tatachikapika Lake"], [47528235, "Hanson Lake"], [47528451, "Treeby Lake"], [47538050, "Elmer Lake"], [47538112, "Halliday Lake"], [47538137, "Hazen Lake"], [47548045, "Mistinikon Lake"], [47548059, "Midlothian Lake"], [47548116, "Sothman Lake"], [47548118, "Reading Lake"], [47548125, "Nursey Lake"], [47548158, "Katagi Lake"], [47548241, "Little Ridley Lake"], [47558330, "Como Lake"], [47558351, "Prairie Bee Lake"], [47568039, "Montreal River"], [47568117, "Lake 61"], [47568449, "Magpie River"], [47568451, "Michipicoten River"], [47578040, "Ottise Lake"], [47578103, "Melick Lake"], [47578238, "Rollo Lake"], [47578430, "Whitefish Lake - Expanded Reservoir"], [47578449, "Magpie River"], [47587943, "St. Anthony Lake"], [47588347, "Windermere Lake"], [47598535, "Jackfish Lake"], [48008110, "Canoeshed Lake"], [48008220, "Horwood Lake"], [48008307, "Nemegosenda Lake"], [48018002, "Round Lake"], [48018049, "Ashley Lake"], [48018428, "Whitefish Lake"], [48018443, "Wawa Lake"], [48028105, "Moray Lake"], [48028136, "Indian Lake"], [48028320, "Racine Lake"], [48028353, "Goldie Lake"], [48037933, "Raven Lake"], [48038103, "Austen Lake"], [48038440, "Lena Lake"], [48038450, "Black Trout Lake"], [48048035, "Separation Lake"], [48048158, "Kaneki Lake"], [48048434, "Hawk Lake"], [48048444, "Magpie River"], [48048520, "Katzenbach Lake"], [48057938, "Larder Lake"], [48057948, "Grassy Lake"], [48058022, "Burt Lake"], [48058118, "Muskasenda Lake"], [48058125, "Peterlong Lake"], [48058155, "Kenogaming Lake"], [48058444, "Magpie River"], [48058521, "Mishi Lake"], [48058525, "Mishibishu Lake"], [48059135, "Basswood Lake"], [48068014, "Kenogami Lake"], [48068215, "Groundhog Lake"], [48068235, "Ivanhoe Lake"], [48068408, "Shikwamkwa Lake"], [48068439, "Bauldry (Scott) Lake"], [48068448, "Catfish Lake"], [48068924, "Lake Superior 1 - Border/Pie Island area"], [48069119, "Sheridan Lake"], [48077937, "Bear Lake"], [48078148, "Pharand Lake"], [48078439, "Goetz Lake"], [48079032, "North Lake"], [48088115, "Scott Lake"], [48088523, "Ellen Lake"], [48088932, "Cloud Lake"], [48098242, "Carty Lake"], [48099016, "Arrow Lake"], [48099112, "This Man Lake"], [48099119, "Louisa Lake"], [48107943, "Beaverhouse Lake"], [48108127, "Splitrock Lake"], [48108424, "Manitowik Lake"], [48109026, "Addie Lake"], [48117953, "Victoria Lake"], [48118014, "Sesekinika Lake"], [48119020, "Iron Range Lake"], [48119109, "Other Man Lake"], [48119139, "Robinson Lake"], [48127936, "Wawagoshe Lake"], [48128005, "Amikougami Lake"], [48128045, "Radisson Lake"], [48128433, "Speight Lake"], [48129135, "Sarah Lake"], [48137945, "Misema Lake"], [48138310, "Schewabik Lake"], [48138338, "Little Missinaibi Lake"], [48139000, "Whitefish Lake"], [48139031, "Sunbow Lake"], [48139034, "Icarus Lake"], [48139037, "Madalaine Lake"], [48147949, "Howard Lake"], [48148033, "Watabeag Lake"], [48148409, "Murray Lake"], [48149014, "Sandstone Lake"], [48149108, "Blackstone Lake"], [48149128, "Kahshahpiwi Lake"], [48158133, "Kenogamissi Lake"], [48158209, "Groundhog River"], [48159029, "Reta Lake"], [48159032, "Shaco Lake"], [48159148, "Argo Lake"], [48168118, "Papakomeka Lake"], [48168500, "Kabenung Lake"], [48168503, "Kabenug Lake, West"], [48169039, "Northern Light Lake"], [48169120, "Agnes Lake"], [48177952, "Allan (Lallan) Lake"], [48177953, "Panagapka Lake"], [48178151, "Opishing Lake"], [48178408, "Dog Lake"], [48178426, "Goudreau Lake"], [48179110, "McEwen Lake"], [48179133, "Burt Lake"], [48187953, "Gourlay Lake"], [48188506, "Knife Lake"], [48188531, "Partridge Lake"], [48189055, "Saganagons Lake"], [48197952, "Lulu Lake"], [48198027, "Legault Lake"], [48198442, "Davies Lake"], [48198458, "Fungus Lake"], [48199023, "Weikwabinonaw Lake"], [48207932, "Clarice Lake"], [48208351, "Crooked Lake"], [48218315, "Makonie Lake"], [48218502, "Burnfield Lake"], [48218919, "Kam River"], [48219208, "Lac La Croix"], [48228144, "Jowsey Lake"], [48228438, "Lola Lake"], [48229032, "Titmarsh Lake"], [48229052, "Twinhouse Lake"], [48229140, "Poohbah Lake"], [48238340, "Missinaibi Lake"], [48238358, "Rennie Lake"], [48238529, "McCrea Lake, North"], [48238848, "Marie Louise Lake"], [48239217, "Thompson Lake"], [48239228, "Sand Point Lake"], [48248439, "Boulder Lake"], [48248506, "Hammer Lake"], [48248950, "Marks Lake"], [48249046, "Greenwood Lake"], [48258910, "Lake Superior 3 - Thunder Bay Inner Harbour"], [48259016, "Blunder Lake"], [48268413, "Wabatongushi Lake"], [48269010, "Batwing Lake"], [48278102, "Redstone River"], [48278315, "Bittern Lake"], [48278353, "South Greenhill Lake"], [48279032, "Nelson Lake"], [48279218, "Bill Lake"], [48279221, "Little Eva Lake (Namakan River)"], [48279235, "Namakan Lake"], [48288058, "Night Hawk Lake"], [48288118, "Pearl Lake"], [48288119, "Gillies Lake"], [48288233, "Sweetwater Lake"], [48288500, "Negwazu Lake"], [48289153, "Your Lake"], [48289219, "Captain Tom Lake"], [48298111, "Porcupine Lake"], [48308044, "Moose Lake"], [48308109, "Bobs Lake"], [48308257, "Kapuskasing Lake"], [48308844, "Lake Superior 2 - Thunder Bay Outer Harbour area"], [48318106, "Three Nations Lake"], [48318127, "Mattagami River"], [48319012, "Kekekuab Lake"], [48319033, "Squeers Lake"], [48328608, "White River"], [48328609, "White River"], [48329005, "Matawin River"], [48329033, "Grouse Lake"], [48329126, "Olifaunt Lake"], [48329142, "Jean Lake"], [48329206, "Beaverhouse Lake"], [48338052, "Island Lake"], [48338053, "Pexton Lake"], [48348052, "Hughes Lake"], [48348053, "Irrigation Lake"], [48348131, "Kamiskotia River"], [48348132, "Kamiskotia River"], [48348138, "Kamiskotia Lake"], [48348558, "Hayward Lake"], [48349026, "Greenwater Lake"], [48349155, "Quetico Lake"], [48357941, "Trollope Lake"], [48358045, "Abitibi River"], [48358556, "Herrick Lake"], [48358903, "Penassen Lakes"], [48358919, "Hazelwood Lake"], [48358956, "Shebandowan River"], [48359033, "Jacob Lake"], [48359038, "Burchell Lake"], [48359159, "Cirrus Lake"], [48368433, "Esnagi Lake"], [48368553, "White River"], [48369010, "Shebandowan Lake, Lower"], [48378118, "Bigwater Lake"], [48378553, "Spangle Lake"], [48378617, "Pic River"], [48379119, "Pickerel Lake"], [48379343, "Rainy River"], [48379345, "Rainy River"], [48388052, "McIntosh Lake"], [48388513, "Tukanee Lake"], [48388546, "White River"], [48389215, "Pipe Lake"], [48389315, "Rainy Lake"], [48398055, "Frederick House Lake"], [48398547, "Frank Lake"], [48398606, "Campfire Lake"], [48398613, "Black River"], [48399249, "Grassy Lake, Little (Seine River)"], [48408407, "Tatnall Lake"], [48408416, "Oba Lake"], [48408553, "Molson Lake"], [48408613, "Black River"], [48408847, "Nalla Lake"], [48408859, "Unnamed Lake"], [48409140, "Abbess Lake"], [48409219, "Whalen Lake"], [48409242, "Grassy Lake"], [48418541, "Clearwater Lake"], [48418550, "Cedar Lake, Little"], [48418558, "Cigar Lake"], [48418601, "Rous Lake"], [48418844, "Elbow Lake"], [48418855, "Unnamed Lake (Beck Creek)"], [48418927, "Hawkeye Lake"], [48419036, "Crayfish Lake"], [48419238, "Shoal Lake (Seine River)"], [48419323, "Rainy Lake"], [48427945, "Lake Abitibi"], [48428038, "Black River"], [48428844, "Upper Hunters Lake"], [48428845, "Bisect Lake"], [48429116, "Crystal Lake"], [48429126, "Nym Lake"], [48429158, "McCaulay Lake"], [48429203, "Factor Lake"], [48438049, "Hidden Lake"], [48438305, "Dumbell Lake"], [48438815, "Lost Lake"], [48439023, "Kashabowie Lake"], [48439110, "Eva Lake"], [48439120, "Niobe Lake"], [48439229, "Wild Potato Lake (Seine River)"], [48448049, "Wilson Lake"], [48448457, "Strickland Lake"], [48448625, "Lake Superior 8a - Peninsula Harbour"], [48449123, "Aramis Lake"], [48449222, "Partridge Crop Lake (Seine River)"], [48449240, "Bad Vermilion Lake"], [48449334, "Wasaw Lake"], [48458558, "Cedar Creek"], [48458604, "Gowan Lake"], [48458655, "Lake Superior 7 - Schreiber Point/Sewell Point Area"], [48459113, "Kawene Lake"], [48459151, "Perch Lake"], [48459155, "Chub Lake (Seine River)"], [48459320, "Boffin Lake"], [48468155, "Aitken Lake, Lower"], [48468501, "Dayohessarah lake"], [48468654, "Steel River"], [48468932, "Dog Lake"], [48469012, "Athelstane Lake"], [48469121, "Sapawe Lake"], [48469141, "Apungsisagen (Lower Steeprock) Lake"], [48469204, "Calm Lake (Seine River)"], [48478030, "Abitibi River"], [48478442, "Nameigos Lake"], [48478537, "White Lake"], [48478545, "Wabikoba Lake"], [48478627, "Knob Lake"], [48479104, "Crooked Pine Lake"], [48479132, "Rawn Reservoir"], [48479240, "Little Turtle Lake"], [48488048, "Nellie Lake"], [48488055, "Devonshire Lake"], [48488155, "Aitken Lake"], [48488232, "Lisgar Lake"], [48488459, "Gagegenha Lake"], [48488520, "Kwinkwaga Lake"], [48488659, "Lake Superior 8 - Jackfish Bay"], [48488711, "Hays Lake"], [48488825, "Lake Superior 5 - Pie Island"], [48489017, "Henderson Lake"], [48489107, "Mercutio Lake"], [48489123, "Osinawi Lake"], [48489140, "Steep Rock Lake"], [48489141, "Colin Lake"], [48489257, "Rainy Lake"], [48498103, "Frederick House River"], [48498129, "Mattagami River"], [48498621, "Bamoos Lake"], [48498905, "Hicks Lake"], [48499005, "Savanne Lake"], [48499058, "Union Lake"], [48499140, "Seine River Diversion"], [48508555, "Black River"], [48508657, "Jackfish Lake"], [48508825, "Lake Superior 4 - Black Bay area"], [48509030, "Lac des Mille Lacs"], [48509132, "Icy Lake"], [48518103, "Pickerel Lake"], [48518558, "Pan Lake"], [48518724, "Whitesand Lake"], [48528038, "Moseley Lake"], [48528455, "Gourlay Lake"], [48528653, "Santoy Lake"], [48528708, "Sand Lake"], [48529051, "Bedivere Lake"], [48529202, "Dovetail Lake"], [48538347, "Minnipuka Lake, Lower"], [48538448, "Beaton Lake"], [48538733, "Pays Plat River"], [48539131, "Marmion Lake"], [48548050, "Tom Lake"], [48548108, "Reaume Lake"], [48548400, "Pichogen Lake"], [48548425, "Kabinakagami Lake"], [48548720, "Ross Lake, Upper and Lower"], [48549119, "Marmion Lake, Upper"], [48549218, "Manion Lake"], [48549300, "Big Sawbill Lake"], [48549349, "Off Lake"], [48549352, "Pony Lake"], [48558223, "Griffin Lake"], [48558723, "Hornblende Lake"], [48559000, "Lac du Milieu"], [48559134, "Finlayson Lake (Seine River)"], [48559304, "Tupman Lake"], [48568038, "Doucette Lake"], [48568153, "Oke Lake"], [48568704, "Lower Lake"], [48569240, "Heron Lake"], [48569331, "Calder Lake"], [48569338, "Jackfish Lake"], [48569339, "Jackfish Lake, West"], [48578228, "Esmee Lake"], [48578230, "Pratt Lake"], [48578231, "Shack Lake"], [48578407, "Gull Lake"], [48578814, "Lake Superior 6 - Nipigon Bay"], [48579112, "Farley Lake"], [48579157, "Turtle Lake"], [48579211, "Sandbeach Lake"], [48579216, "Pettit Lake"], [48579251, "Otukamamoan (Trout) Lake"], [48579308, "Weller Lake"], [48579346, "Burditt Lake"], [48588323, "Brunswick Lake"], [48588715, "Charlotte Lake"], [48588723, "Cleaver Lake"], [48588745, "Buckaday Lake"], [48588843, "Unknown Lake"], [48588917, "Smiley Lake"], [48589121, "Lizard Lake"], [48589149, "Crowrock Lake"], [48598106, "Frederick House River"], [48598228, "Keenoa Lake"], [48598656, "Cairngorm Lake"], [48598914, "DeCourcey Lake"], [48599348, "Kishkutena Lake, Little"], [49008416, "Cameron Lake"], [49009002, "Muskeg Lake"], [49009157, "Clearwater West Lake"], [49009224, "Eltrut Lake"], [49009306, "Pickwick Lake"], [49009330, "Loonhaunt Lake"], [49009437, "Rainy River"], [49018019, "Findlay Lake"], [49018450, "Lake Placid"], [49018529, "Garnham Lake"], [49018550, "Agonzon Lake"], [49018727, "Beavertrap Lake"], [49018802, "Ozone Creek"], [49018808, "Fire Hill Lake"], [49019205, "Grey Trout Lake"], [49028253, "Oscar Lake"], [49028259, "Powell Lake"], [49028643, "Prairie Lake"], [49028846, "Cliff Lake"], [49028904, "Walotka Lake"], [49028912, "Eaglehead Lake"], [49029009, "Kaogomok Lake, Upper"], [49029208, "South Crook Lake"], [49029210, "Mount Lake"], [49029253, "Sakwite Lake"], [49038259, "Cooper Lake"], [49038325, "Foster Lake"], [49038509, "Tocheri Lake"], [49038807, "Limestone Creek"], [49039208, "Crook Lake"], [49039304, "Vista Lake"], [49039323, "Kaiashkons Lake"], [49048101, "Commando Lake"], [49048235, "Saganash Lake"], [49048306, "Opasatika Lake"], [49049208, "Secret Lake"], [49049212, "Rutter Lake"], [49057933, "Joe Lake"], [49057938, "Patten River"], [49058112, "Rawcourt Lake"], [49058134, "Mattagami River"], [49058205, "Groundhog River"], [49058300, "Bourinot Lake"], [49058446, "West Larkin Lake"], [49058505, "Shekak Lake"], [49058632, "Killala Lake"], [49058815, "Helen Lake"], [49058915, "Starnes Lake"], [49059009, "Ricestalk Lake"], [49059136, "Little Gull Lake"], [49059335, "Pipestone Lake"], [49068102, "Lillabelle Lake"], [49068246, "Kapuskasing River"], [49068305, "Penelton Lake"], [49068441, "Haken Lake"], [49068515, "Granitehill Lake"], [49068529, "Macutagon Lake"], [49068547, "Kaginu Lake"], [49068844, "Shillabeer Lake"], [49068909, "Arrowroot Lake"], [49069141, "Sandford Lake"], [49078027, "Mistango Lake"], [49078851, "Sturge Lake"], [49079136, "Irene Lake"], [49079152, "White Otter Lake"], [49079342, "Katimiagamak Lake"], [49087947, "Abbotsford Lake"], [49088251, "Graveyard Lake"], [49088546, "Little Mose Lake"], [49088548, "Manitouwadge Lake"], [49088914, "Mawn Lake"], [49089241, "Entwine Lake"], [49098114, "Lower Deception Lake"], [49098243, "Kapuskasing River"], [49098305, "Rufus Lake"], [49098509, "Obakamiga Lake"], [49098542, "Gaugino Lake"], [49098545, "Mose Lake"], [49098639, "Islington Lake"], [49098825, "Purdom Lake"], [49098923, "Max Lake"], [49099211, "Pekagoning Lake"], [49099336, "Schistose Lake"], [49108115, "Blue Lake"], [49108243, "Kapuskasing River"], [49108545, "Wowun Lake"], [49108700, "Catlonite Lake"], [49108927, "Jolly Lake"], [49109109, "Scotch Lake"], [49109322, "Bluffpoint Lake"], [49118029, "Cabin Lake"], [49118058, "Dora Lake"], [49118109, "Frederick House River"], [49118126, "North Driftwood River"], [49118837, "Eskwanonwatin Lake"], [49119202, "Dibble Lake"], [49128138, "Mattagami River"], [49128304, "Flatt Lake"], [49128453, "Second Government Lake"], [49128855, "Little Sturge Lake"], [49128937, "Lac des Iles"], [49129150, "Nora Lake"], [49138003, "Endelman Lake"], [49138042, "Chin Lake"], [49138102, "Abitibi River"], [49138241, "Kapuskasing River"], [49139352, "Kakagi Lake"], [49148223, "Wabicock Lake"], [49148753, "Kilgour Lake"], [49148756, "Cosgrave Lake"], [49149128, "Kay Lake"], [49158148, "Departure Lake"], [49158205, "Groundhog River"], [49158649, "Steel Lake"], [49158826, "Elizabeth Lake"], [49158832, "Frazer Lake"], [49158856, "Muskrat Lake"], [49159216, "Beak Lake"], [49159258, "Manitou Lake, Lower"], [49159445, "Lake of the Woods"], [49168107, "Louise Lake"], [49168108, "Margaret Lake"], [49168201, "Watersnake Lake"], [49168530, "Mooseskull Lake"], [49168626, "Kagiano Lake"], [49168821, "Cox Lake"], [49169100, "Savoy Lake"], [49169322, "Lawrence Lake"], [49178525, "Poppy Lake"], [49178955, "Hine Lake"], [49179236, "Meggisi Lake"], [49179243, "Scattergood Lake"], [49188156, "Shackleton Lake"], [49188928, "Whistle Lake"], [49189351, "Cedar Tree Lake"], [49198147, "Ouellet Lake"], [49198447, "Wicksteed Lake"], [49198524, "Fields Lake"], [49199203, "WE66-23 Lake"], [49199208, "Bending Lake"], [49199221, "Wapageisi Lake"], [49199333, "Rowan Lake"], [49208028, "Lac La France"], [49208748, "Barbara Lake"], [49208853, "Black Sturgeon Lake"], [49209151, "Horseshoe Lake"], [49218106, "Sucker River"], [49218142, "Sand Lake"], [49218222, "Gravel Lake"], [49218523, "Flanders Lake"], [49218823, "Oskawe Lake"], [49218901, "Circle Lake"], [49219015, "Pakashkan Lake"], [49228019, "South Floodwood Lake"], [49229346, "Caviar Lake"], [49229354, "Dogpaw Lake"], [49238022, "Bragg Lake"], [49238148, "Indian Lake"], [49238208, "Bonner Lake"], [49238612, "Waboosekon Lake"], [49238714, "Wig Lake"], [49238732, "Trapnarrows Lake"], [49238919, "Gennis Lake"], [49239218, "Stormy Lake"], [49248028, "Starvation Lake"], [49248033, "Little Abitibi Lake"], [49248043, "Humestone Lake"], [49248115, "Eddie Lake"], [49248227, "Kapuskasing River"], [49249008, "Grew Lake"], [49249247, "Manitou Lake, Upper"], [49258044, "Zinger Lake"], [49258501, "Nagagami Lake"], [49259034, "Wawang Lake"], [49268005, "Sproule Lake"], [49268011, "Wasicho Lake"], [49268055, "Thorning Lake"], [49268210, "Remi Lake"], [49268226, "Kapuskasing River"], [49268716, "Wintering Lake"], [49269006, "Holly Lake"], [49269007, "Loganberry Lake"], [49269132, "Little Sandbar Lake"], [49269220, "Long Lake"], [49269432, "Buck Lake"], [49278027, "Shirley Lake"], [49278203, "Audrey Lake"], [49278521, "Bound Lake"], [49278547, "Ramsay Lake"], [49278738, "Parks Lake"], [49279053, "Selwyn Lake"], [49279317, "Tadpole Lake"], [49279332, "Atikwa Lake"], [49288440, "Nagagamisis Lake"], [49288533, "White Otter Lake"], [49289135, "Sandbar Lake"], [49298146, "Mattagami River"], [49308022, "Baker Lake"], [49308045, "Pierre Lake"], [49308500, "Hiawatha Lake"], [49308650, "Long Lake"], [49309002, "Kearns Lake"], [49309309, "Pikwans Lake"], [49309336, "Populus Lake"], [49318349, "Coppell Lake"], [49318711, "Gamsby Lake"], [49318720, "South Beatty Lake"], [49318809, "Blackwater River"], [49319011, "Weaver Lake"], [49319237, "Whitewater Lake"], [49319350, "Dryberry Lake"], [49328016, "Tweed Lake, Lower"], [49329111, "Sowden Lake"], [49329123, "Cecil Lake"], [49329236, "Rock Lake"], [49329238, "Minnehaha Lake"], [49329404, "Black Lake"], [49338047, "Montreuil Lake"], [49338135, "Abimatinu Lake"], [49338211, "Maxwell Lake"], [49339140, "Indian Lake"], [49339501, "Shoal Lake"], [49348018, "Tweed Lake"], [49349132, "Paguchi Lake"], [49349149, "Mameigwess Lake"], [49349153, "Mud Lake"], [49349237, "Dinorwic Lake"], [49358050, "Harris Lake"], [49358210, "Gurney Lake"], [49358607, "Koandowango Lake"], [49367959, "Burntbush Lake"], [49368017, "Tweed Lake, North"], [49368019, "Wakwayowkastic Lake"], [49368756, "Empire Lake"], [49369245, "Godson Lake"], [49378230, "Francklyn Lake"], [49378437, "Claire Lake"], [49378625, "McKay Lake"], [49379132, "Victoria Lake"], [49379151, "Gustauson Lake"], [49379233, "Dinorwic Lake"], [49379249, "Dor\u04a9 Lake"], [49379405, "Andy Lake"], [49388158, "Groundhog River"], [49388432, "Redpine Lake"], [49398221, "Pearce Lake"], [49398226, "Owlet Lake"], [49398928, "Roaring River"], [49398940, "Holinshead Lake"], [49399131, "Barrel Lake"], [49399157, "Unnamed Lake"], [49399247, "Trap Lake"], [49408017, "Kesagami Lake, Upper"], [49408258, "Raft Lake"], [49408734, "Blackwater Lake"], [49408800, "Sturgeon (Namewaminikan) River"], [49409222, "Avery Lake"], [49409246, "Mile Lake"], [49409415, "Blindfold Lake"], [49418015, "George Lake"], [49418224, "Ghost Lake"], [49418245, "Allan Lake"], [49419033, "Little Metionga Lake"], [49419058, "Mattawa Lake"], [49419132, "Gooch Lake"], [49419141, "Heathwalt Lake"], [49419240, "Butler Lake"], [49419341, "Lake 305"], [49419344, "Roddy Lake"], [49428223, "Bovril Lake"], [49428241, "Zadi Lake"], [49428246, "St. Amand Lake"], [49428653, "Kenogamisis Lake"], [49428657, "Kenogamisis Lake"], [49428704, "Magnet Lake"], [49428736, "Beatty Lake"], [49428751, "Windigokan Lake"], [49428752, "Knox Lake"], [49428758, "Sturgeon (Namewaminikan) River"], [49429313, "Eagle Lake"], [49429402, "Kilvert Lake"], [49429508, "High Lake"], [49438158, "Groundhog River"], [49438205, "Torrance Lake"], [49438606, "Pagwachuan Lake"], [49438749, "Brookbank Creek"], [49439015, "Empire Lake"], [49439024, "Brightsand Lake"], [49439028, "Metionga Lake"], [49439110, "Crystal Lake"], [49439118, "Wintering Lake"], [49439150, "Arethusa Lake"], [49439350, "Porcus Lake"], [49439410, "Dogtooth Lake"], [49439418, "Longbow Lake"], [49448043, "Sand Lake"], [49448221, "Douglas Lake"], [49448711, "Wildgoose Lake"], [49448751, "Sturgeon (Namewaminikan) River"], [49448755, "Sturgeon (Namewaminikan) River"], [49449227, "Hartman Lake"], [49449244, "Wabigoon Lake"], [49458016, "Kesagami Lake, Little"], [49458221, "Guilfoyle Lake"], [49458232, "Eleanor Lake"], [49459342, "Winnange Lake"], [49459348, "#625 (Fish) Lake"], [49468158, "Mattagami River"], [49469141, "Kukukus Lake"], [49469400, "Hawk Lake"], [49469406, "Percy Lake"], [49469421, "Breakneck Lake"], [49478339, "Lac Ste. Th\u04a9r\u04a5se"], [49478359, "Banks Lake"], [49478408, "Pike Lake"], [49478410, "Calstock Lake"], [49478657, "Hutchison Lake"], [49478737, "Sturgeon (Namewaminikan) River - upstream Hwy 801"], [49479129, "Press Lake"], [49479240, "Thunder Lake"], [49479502, "Whitefish Lake"], [49488218, "Bennet Lake"], [49488324, "Shannon Lake"], [49488358, "Stoddart Lake"], [49488402, "St. Joseph Lake"], [49488407, "Wilmot Lake"], [49488409, "Constance Lake"], [49488410, "West Lake"], [49488429, "Shekak River"], [49488552, "Klotz Lake"], [49488958, "Kashishibog Lake"], [49489054, "Bell Lake"], [49489420, "Island Lake"], [49489452, "Pickerel Lake"], [49498343, "Pivabiska Lake"], [49498411, "Louise Lake"], [49498603, "Castlebar Lake"], [49499010, "Sparkling Lake"], [49499154, "Amik Lake"], [49499221, "Big Sandy (Sandybeach) Lake"], [49508346, "Wolverine Lake"], [49508348, "Hanlan Lake"], [49508354, "Fushimi Lake"], [49508830, "Lake Nipigon"], [49509311, "Wabigoon River"], [49509350, "Little Joe Lake"], [49509355, "Island Lake"], [49518005, "Lawagamau (Kattawagami) Lake"], [49518123, "Takwata Lake"], [49518740, "Pinel Lake"], [49519100, "Darkwater Lake"], [49519342, "Augite Lake"], [49519425, "Black Sturgeon Lakes"], [49528404, "Kabinakagami River"], [49528757, "North Wind Lake"], [49528922, "Crevasse Lake"], [49529018, "Rude Lake"], [49529223, "Tablerock Lake"], [49529410, "Silver Lake"], [49529452, "Pelicanpouch Lake"], [49538129, "Abitibi River"], [49538331, "Ritchie Lake"], [49539053, "Lyon Lake"], [49539117, "Towers Lake"], [49539222, "Tom Chief Lake"], [49539224, "Crossecho Lake"], [49539345, "Little Gordon Lake"], [49539435, "Winnipeg River"], [49539500, "Malachi Lake"], [49548002, "Whaleshead Lake"], [49549056, "Bell Creek"], [49549235, "Gullwing Lake"], [49549350, "Daniels Lake"], [49549412, "Plum Lake"], [49549414, "Cliff Lake"], [49558605, "Fernow Lake"], [49558900, "Cry Lake"], [49569014, "Harmon Lake"], [49569322, "Wabigoon River"], [49569332, "Edward Lake"], [49569503, "Scot Lake, South"], [49577937, "Lower Detour Lake"], [49578018, "Kesagami River"], [49578159, "Howells Lake"], [49578305, "Wanzatika Lake"], [49578644, "Burrows Lake"], [49578922, "Obonga Lake"], [49579111, "Penassi Lake"], [49579257, "Rugby Lake"], [49579358, "Big Island Lake"], [49579414, "Cross Lake"], [49579439, "Gun Lake"], [49588118, "Little Abitibi River"], [49588555, "Shacabac Lake"], [49588615, "Chipman Lake"], [49589046, "Sturgeon Lake"], [49589200, "Minnitaki Lake"], [49589354, "Shrub Lake"], [49597941, "Mosquito Lake"], [49597951, "Hopper Lake"], [49599117, "Lake of Bays"], [49599135, "Bawden Lake"], [49599344, "Canyon Lake"], [49599503, "Scot Lake, North"], [50008135, "Pinard Creek"], [50008726, "Onaman Lake"], [50009330, "Eye Lake"], [50009400, "Favel Lake"], [50009453, "Cygnet Lake"], [50019413, "Old Man Lake"], [50028137, "Abitibi River"], [50028138, "Foxville Creek"], [50028402, "Kabinakagami River"], [50028905, "Pishidgi Lake"], [50029401, "Keys Lake"], [50029404, "Tom Lake"], [50029448, "Gooseneck Lake"], [50038254, "McLeister Lake"], [50039021, "Seseganaga Lake"], [50039104, "Gibraltar Lake"], [50039330, "Clay Lake (Wabigoon River)"], [50049010, "Wapikaimaski Lake"], [50049122, "Dominion Lake"], [50049448, "Winnipeg River"], [50058311, "Missinaibi River (lower)"], [50058900, "Wabinosh Lake"], [50059125, "Burnt Dam (Nagron) Lake"], [50059236, "Mold Lake"], [50059403, "Delaney Lake"], [50059439, "Big Sand Lake"], [50068212, "Mattagami River"], [50068756, "Weewullee Lake"], [50068928, "Maggotte Lake"], [50068941, "Sandison Lake"], [50069446, "Roughrock Lake"], [50078808, "Ombabika River"], [50078852, "Castle Lake"], [50078913, "Bukemiga Lake"], [50079050, "Eady Lake"], [50079354, "Meandering Lake"], [50079355, "Wabigoon River"], [50079408, "Toothpick Lake"], [50088747, "Elbow Lake"], [50088905, "Waweig Lake"], [50089138, "Botsford Lake"], [50099115, "Singapore Lake"], [50099300, "Ord Lake"], [50099308, "Cedar Lake"], [50099339, "Wabigoon River"], [50099358, "Mission Lake"], [50099359, "Grassy Narrows Lake"], [50099400, "Garden Lake"], [50099403, "English River"], [50099444, "Blueberry Lake"], [50107951, "Robin Lake"], [50108017, "Knight Lake"], [50108024, "Ministik Lake"], [50108753, "Frank Lake"], [50109203, "Richardson Lake"], [50109252, "Thaddeus Lake"], [50109343, "Wabigoon River"], [50109356, "Victor Lake"], [50109400, "Garden Lake"], [50109412, "Big Fox Lake (English River)"], [50109419, "Lount Lake (English River)"], [50118633, "Twin Lake, Lower"], [50119124, "Marchington Lake"], [50119356, "Slant Lake"], [50119502, "Tetu Lake"], [50128616, "Jemar Lake"], [50129010, "Kawaweogama Lake"], [50129145, "Mills Lake"], [50129441, "Snook Lake"], [50138034, "Nettogami Lake"], [50139025, "Fog Lake"], [50139255, "Square Lake"], [50148907, "Mattice Lake"], [50149405, "Indian Lake (English River)"], [50149424, "Separation Lake (English River)"], [50149454, "Trout Lake"], [50158639, "Cordingley Lake"], [50158957, "Redhead Lake"], [50159131, "Stranger Lake"], [50159240, "Lac Seul"], [50159354, "Wabigoon River"], [50168857, "Randolph Lake"], [50169022, "Heathcote Lake"], [50178823, "Little Jackfish River (Lower)"], [50178853, "Jojo Lake"], [50179333, "Sup Lake"], [50179400, "Ball Lake (English River)"], [50187941, "Corner Lakes"], [50188640, "Alph Lake"], [50189308, "Perrault Lake"], [50189318, "Cliff Lake"], [50189400, "Ball Lake (English River)"], [50189445, "Umfreville Lake (English River)"], [50198650, "Esnagami Lake"], [50208201, "Mattagami River"], [50208623, "Wababimiga Lake"], [50209125, "Rapid Lake"], [50209147, "Expanse Lake"], [50209359, "Tide Lake"], [50219130, "Hik Lake"], [50229020, "Smye Lake"], [50229332, "Toole Lake"], [50229335, "Marshalok Lake"], [50229354, "Maynard Lake (English River)"], [50238015, "Kesagami Lake"], [50248308, "Martison Lake"], [50249021, "Silver Lake"], [50258702, "O'Sullivan Lake"], [50258905, "Caribou Lake"], [50259457, "Routine Lake"], [50269123, "Bury Lake"], [50269313, "Wabaskang Lake"], [50269326, "Anishinabi Lake"], [50269350, "Oak Lake (English River)"], [50269456, "Grant Lake"], [50279013, "Sassenach Lake"], [50279226, "Spruce Lake"], [50279454, "Werner Lake"], [50288715, "Abamasagi Lake"], [50288946, "Granite Lake"], [50289455, "Gordon Lake"], [50289506, "Reynar Lake"], [50298820, "Zigzag Lake"], [50299025, "Savant Lake"], [50309140, "Theatre Lake"], [50309433, "Wyder Lake"], [50309457, "Trapline Lake"], [50309502, "Wilson Lake"], [50318724, "Meta Lake"], [50319113, "Ragged Wood Lake"], [50319225, "Birmingham Lake"], [50319331, "Zizania Lake"], [50338728, "Ara Lake"], [50339220, "Wapesi Lake"], [50339401, "Conifer Lake"], [50349334, "Wegg Lake"], [50349446, "Walleye Lake"], [50349507, "Snowshoe Lake"], [50368127, "Abitibi River"], [50369448, "Silver Fox Lake"], [50379032, "Fitchie Lake"], [50379116, "Carling Lake"], [50379443, "Dowswell Lake"], [50379457, "Chase Lake"], [50388946, "Wabakimi Lake"], [50389503, "Wingiskus Lake"], [50408407, "Pitukupi Lake"], [50408815, "Mojikit Lake"], [50409409, "Confusion Lake"], [50409453, "Eagle Lake"], [50409459, "Eden Lake"], [50428702, "Melchett Lake"], [50439042, "De Lesseps Lake"], [50439054, "Arc Lake"], [50439107, "St. Raphael Lake"], [50439428, "Kilburn Lake"], [50439445, "Ghost (Talon) Lake"], [50449310, "Wenasaga Lake"], [50449501, "Trident Lake"], [50459330, "Pakwash Lake"], [50469032, "Minchin Lake"], [50469408, "Longlegged Lake"], [50479322, "Griffith Mine - South Pit"], [50489320, "Griffith Mine - Iron Bay (Tailings Pond)"], [50499050, "Miniss Lake"], [50499257, "Bluffy Lake"], [50499320, "Bruce Lake"], [50499322, "Griffith Mine - North Pit"], [50499448, "Aegean Lake"], [50508710, "Ogoki Lake"], [50509243, "Whitemud Lake"], [50509500, "Mather Lake"], [50519151, "Otatakan Lake"], [50529017, "McCrea Lake"], [50538342, "Pledger Lake"], [50539041, "Bertaud Lake"], [50539403, "Upper Medicine Stone Lake"], [50548843, "Whiteclay Lake"], [50549305, "Trout Lake River"], [50558946, "Webster Lake"], [50559105, "Lake St. Joseph"], [50559335, "Two Island Lake"], [50569005, "Greenbush Lake"], [50569416, "Onnie Lake"], [50569443, "Hansen Lake"], [50578750, "Kagianagami Lake"], [50579347, "Petersen Lake"], [50589018, "Pashkokogan Lake"], [50589340, "Gullrock Lake"], [51009223, "Jubilee Lake"], [51009341, "Keg Lake"], [51017939, "Harricanaw River"], [51029343, "Chukini River"], [51029345, "Balmer Creek"], [51029352, "Red Lake"], [51029424, "Crystal Lake"], [51029455, "Donald Lake"], [51038055, "Abitibi River"], [51038059, "Cheepash River"], [51038905, "Gremm Lake"], [51039026, "Lake St. Joseph"], [51039235, "Uchi Lake"], [51039349, "Red Lake"], [51048926, "Greenmantle Lake"], [51048957, "Frain Lake"], [51049317, "Little Trout Lake"], [51049413, "Red Lake"], [51059035, "Lake St. Joseph"], [51059208, "Jeanette Lake"], [51059244, "Confederation Lake"], [51059402, "Hammell Lake"], [51078849, "Kilbarry Lake"], [51079244, "Rowe Lake"], [51079300, "Joyce Lake"], [51088043, "North French River"], [51088757, "I291 Lake"], [51098050, "Moose River"], [51098522, "Quantz Lake"], [51099009, "Osnaburgh Lake"], [51099125, "Bamaji Lake"], [51118843, "Luella Lake"], [51119046, "Carpenter Lake"], [51129206, "Hailstone Lake"], [51129241, "Premier Lake"], [51129245, "Woman Lake"], [51137935, "Missisicabi River"], [51149432, "Orange Lake"], [51158837, "Weese Lake"], [51158859, "Shabuskwia Lake"], [51159315, "Trout Lake"], [51169350, "Little Vermilion Lake"], [51178720, "Makokibatan Lake"], [51179229, "Grace Lake"], [51199057, "Wright Lake"], [51199113, "Obaskaka Lake"], [51208024, "Moose River"], [51209258, "Shabu Lake"], [51209335, "Coli Lake"], [51218348, "Albany River"], [51229306, "Blair Lake"], [51239300, "Unknown Lake"], [51249221, "Birch Lake"], [51249426, "Bigshell Lake"], [51249456, "Musclow Lake"], [51258644, "Teabeau Lake"], [51279103, "Dobie Lake"], [51289015, "Pickle Lake"], [51289024, "Kapkichi Lake"], [51289330, "Nungesser Lake"], [51298758, "Triangular Lake"], [51308844, "Bolster Lake"], [51309020, "Ponsford Lake"], [51309309, "Guernsey Lake"], [51309341, "Pedlar Lake"], [51328746, "Eabamet Lake"], [51328858, "Snowdrift Lake"], [51328901, "Snowflake Lake"], [51329002, "Kawinogans River"], [51329328, "Pringle Lake"], [51329356, "Kirkness Lake"], [51349503, "Irwin Lake"], [51358505, "Muswabik Lake"], [51358837, "Miminiska Lake"], [51358915, "Crerar Lake"], [51359130, "Lang Lake"], [51359244, "Wavell Lake"], [51398955, "Kawinogans River"], [51399256, "Mamakwash Lake"], [51408804, "Opikeigen Lake"], [51418852, "Troutfly Lake"], [51428930, "Monmonawson Lake"], [51429429, "Cairns Lake"], [51438740, "Gifford Lake"], [51449508, "Frances Lake"], [51458945, "Badesdawa Lake"], [51459120, "Morris Lake"], [51459323, "Silcox Lake"], [51459342, "Berens Lake"], [51469215, "Sleep Lake"], [51489207, "Kamungishkamo Lake"], [51489359, "Pikangikum Lake"], [51509105, "Upturnedroot Lake"], [51569249, "Madden Lake"], [51579157, "Whitestone Lake"], [52009103, "Kinloch Lake"], [52018830, "Ozhiski Lake"], [52028802, "Kemp Lake"], [52029444, "Donaldson Lake"], [52038711, "Beteau Lake (Attawapiskat River)"], [52038911, "Totogan Lake"], [52049410, "Barton Lake"], [52058752, "Richter Lake"], [52059011, "Menako Lake"], [52059228, "Tutu Lake"], [52088554, "Streatfeild Lake"], [52089200, "Kishikas Lake"], [52099213, "Nabimina Lake"], [52108518, "Kapiskau Lake"], [52118820, "Kabania Lake"], [52128140, "Albany River"], [52128621, "Attawapiskat River"], [52139323, "Matchett Lake"], [52139344, "McInnes Lake"], [52148753, "Attawapiskat Lake"], [52149046, "Horseshoe Lake"], [52159357, "Grist Lake"], [52179334, "Hampton Lake"], [52188512, "Missisa Lake"], [52198610, "Highbank Lake"], [52209102, "Stirland Lake"], [52209201, "Pakhoan Lake"], [52209338, "Culverson Lake"], [52218624, "Fishtrap Lake"], [52218941, "Brock Lake"], [52258630, "Kitchie Lake"], [52259033, "Chilton Lake"], [52278924, "Wigwascence Lake"], [52289310, "Margot Lake"], [52309052, "Donnelly Lake"], [52309135, "Westin Lake (Upper Windigo Lake)"], [52309450, "Black Birch Lake"], [52319255, "North Spirit Lake"], [52328644, "Goods Lake"], [52349336, "Kennedy Lake"], [52358750, "Mameigwess Lake"], [52358935, "Schryburt Lake"], [52359110, "Berry Lake"], [52359132, "Windigo Lake"], [52388953, "Cordick Lake"], [52399508, "Perreault Lake"], [52409123, "Agutua Lake"], [52409303, "Hawley Lakes"], [52409415, "Deer Lake"], [52418915, "Sims Lake"], [52419018, "Skinner Lake"], [52428614, "Koper Lake"], [52428620, "Muketei River"], [52458618, "Muketei River"], [52468603, "McFaulds Lake"], [52468634, "Muketei River"], [52479322, "Northwind Lake"], [52479336, "Setting Net Lake"], [52508956, "Assin (Asinne) Lake"], [52509040, "North Caribou Lake"], [52509327, "Sandy Lake"], [52528645, "Leaver Lake"], [52539122, "Weagamow Lake"], [52539153, "Nikip Lake"], [52549132, "Opakopa Lake"], [52559357, "Favourable Lake"], [52568224, "Attawapiskat River"], [52568723, "Winisk Lake"], [52588548, "Attawapiskat River"], [52599120, "Atikomik Lake"], [52599140, "Magiss Lake"], [53019302, "Sandy Lake"], [53028421, "Attawapiskat River"], [53088816, "No Name Lake 21"], [53089247, "Kadota Lake"], [53189334, "Opasquia Lake"], [53399059, "Garrett Lake"], [53409115, "Asipoquobah Lake"], [53449317, "East Lake"], [53459000, "Big Trout Lake"], [53469252, "Lingman Lake"], [53489256, "Durell Lake"], [53498930, "Angling Lake"], [53499034, "Fawn Lake"], [53499208, "Sachigo Lake"], [53499248, "Pullan Lake"], [53519301, "Seeber Lake"], [53529127, "Two River Lake"], [53548406, "Opinnagau Lake (East)"], [53558358, "Opinnagau River"], [53559104, "Bearskin Lake"], [53588614, "Wild Berry Lake"], [54069028, "Fat Lake"], [54088502, "Pine Lake"], [54098541, "Shamattawa Lake (Winisk River)"], [54099211, "Little Sachigo Lake"], [54099256, "Pierce Lake"], [54158444, "Sutton Lake"], [54179112, "Swan Lake"], [54208500, "Spruce Lake"], [54228433, "Aquatuk Lake"], [54229142, "Withers Lake"], [54249234, "Stull Lake"], [54308439, "Hawley Lake"], [54308446, "Raft Lake (North)"], [54309125, "Sherman Lake"], [54319214, "Echoing Lake"], [54458440, "Sutton River"], [55008524, "Winisk River"], [55108247, "Brant River"], [55158345, "Sutton River"], [55178505, "Winisk River"], [55598738, "Severn River"], [56068739, "Pipowitan River"], [56308810, "Majikun Creek"], [56328815, "Tamuna River"], [56408837, "Mintiagan Creek"]];

    return (
    <View>
      <Text>Where did you catch your fish?</Text>
      <Picker selectedValue={this.state.wb}
       onValueChange={(itemValue,itemIndex) => this.onChangeWB(itemValue,itemIndex)}>
          {waterbodies.map(
            function(waterbody) {
            return <Picker.Item label={waterbody[1]} value={waterbody[0]} key={waterbody[0]} />
          })}
          </Picker>
    </View>
    // <TextInput
    //     style={{height: 40, borderColor: 'gray', borderWidth: 1}}
    //     //onChangeText={(text) => this.setState({text})}
    //     value={this.state.name}
    //   />
    //<Button
    // onPress={() => this.props.navigation.goBack()}
    // title="Get list of nearby locations."
    ///>
    );
  }
}

class MySensitiveScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'AGE',
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('./img/sensitive.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  };

  constructor(props)
  {
    super(props);
    this.state = {age:false, woman:false};
    this.ageChange = this.ageChange.bind(this);
    this.womanChange = this.womanChange.bind(this);
  }

  //two different ways of doing this
  ageChange(value) { this.setState({age:value, woman:this.state.woman});}
  womanChange(value) {this.state.woman = value; this.setState(this.state);}

  render() {
    return (
    <View>
      <Text>Are you under 15 years old?</Text>
      <Switch onValueChange={value => this.ageChange(value)} value={this.state.age} />
      <Text>Are you a woman who is pregnant or intends to become pregnant?</Text>
      <Switch onValueChange={value => this.womanChange(value)} value={this.state.woman}/>
    </View>
    );
  }
}

class MySpeciesScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: '',
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('./img/species.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  };

  constructor(props)
  {
    super(props);
    this.state = {species:41};
    this.onChangeSpecies = this.onChangeSpecies.bind(this)
  }

  onChangeSpecies(itemValue, itemIndex) {
    this.setState({species: itemValue})
    var questionnaire = {
      length: this.props.screenProps.questionnaire.length,
      species_code: itemValue
    };
    //console.warn(questionnaire);
    this.props.screenProps.handleQuestionnaireChange(questionnaire)
  }

  render() {

      var species = [[31, "Sturgeon"], [41, "Longnose Gar"], [51, "Bowfin"], [63, "Gizzard Shad"], [71, "Pink Salmon"], [73, "Coho Salmon"], [75, "Chinook Salmon"], [76, "Rainbow Trout"], [77, "Atlantic Salmon"], [78, "Brown Trout"], [80, "Brook Trout"], [81, "Lake Trout"], [82, "Splake"], [83, "Aurora Trout"], [87, "Siscowet"], [91, "Lake Whitefish"], [93, "Cisco(Lake Herring)"], [102, "Round Whitefish"], [121, "Rainbow Smelt"], [131, "Northern Pike"], [132, "Muskellunge"], [151, "Goldeye"], [152, "Mooneye"], [161, "Quillback Carpsucker"], [162, "Longnose Sucker"], [163, "White Sucker"], [166, "Bigmouth Buffalo"], [177, "Redhorse Sucker"], [181, "Goldfish"], [186, "Common Carp"], [233, "Brown Bullhead"], [234, "Channel Catfish"], [271, "Ling (Burbot)"], [301, "White Perch"], [302, "White Bass"], [311, "Rock Bass"], [313, "Pumpkinseed"], [314, "Bluegill"], [316, "Smallmouth Bass"], [317, "Largemouth Bass"], [318, "White Crappie"], [319, "Black Crappie"], [331, "Yellow Perch"], [332, "Sauger"], [334, "Walleye"], [371, "Freshwater Drum"], [400, "Salmon Hybrid"], [450, "Whitefish hybrid"]];

    return (

    <View>
      <Text>What is the species of your fish?</Text>
      <Picker selectedValue={this.state.species}
       onValueChange={(itemValue,itemIndex) => this.onChangeSpecies(itemValue,itemIndex)}>
      {species.map(
        function(species) {
        return <Picker.Item label={species[1]} value={species[0]} key={species[0]} />
      })}
      </Picker>
    </View>
    );
  }
}

class MySizeScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: undefined,
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('./img/length.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  };

  constructor(props)
  {
    super(props);
    this.state = {length:15};
    this.onChangeLength = this.onChangeLength.bind(this)
  }

  onChangeLength(itemValue, itemIndex) {
    this.setState({length: itemValue});
    var questionnaire = {
      length: itemValue,
      species_code: this.props.screenProps.questionnaire.species_code
    };
    //console.warn(questionnaire);
    this.props.screenProps.handleQuestionnaireChange(questionnaire)
  }


  render() {
    //TODO: replace with db call

    var AllFishLengths = [
       [15, '15-20cm'],
       [20, '20-25cm'],
       [25, '25-30cm'],
       [30, '30-35cm'],
       [35, '35-40cm'],
       [40, '40-45cm'],
       [45, '45-50cm'],
       [50, '50-55cm'],
       [55, '55-60cm'],
       [60, '60-65cm'],
       [65, '65-70cm'],
       [70, '70-75cm'],
       [75, '>75cm']
    ];

    return (

    <View>
      <Text>What is the length of your fish?</Text>
      <Picker selectedValue={this.state.length}
       onValueChange={(itemValue,itemIndex) => this.onChangeLength(itemValue,itemIndex)}>
        {AllFishLengths.map(
          function(fish_length) {
          return <Picker.Item label={fish_length[1]} value={fish_length[0]} key={fish_length[0]} />
        })}
      </Picker>
    </View>
    );
  }
}

class MyResultScreen extends React.Component {

  constructor(props) {
   super(props);
   this.state = {name:"SOME NUMBER", db:undefined};
   this.successcb = this.successcb.bind(this);
 }

 componentWillMount() {
   this.test_database();
 }
  //static db;


  shouldComponentUpdate(nextProps, nextState)
  {
    console.log(this.props.screenProps.questionnaire.length, "?=", nextProps.screenProps.questionnaire.length);
    console.log(this.props.screenProps.questionnaire.species_code, "?=",nextProps.screenProps.questionnaire.species_code);
    console.log(this.state.name, "?=",nextState.name);
    return (this.props.screenProps.questionnaire.length != nextProps.screenProps.questionnaire.length)||(this.props.screenProps.questionnaire.species_code != nextProps.screenProps.questionnaire.species_code)||(this.state.name !=nextState.name);
  }

  componentWillUpdate() {
    this.successcb();
  }

  test_database() {
    //var db = SQLite.openDatabase({name: 'example.db', readOnly: true, createFromLocation : "www/example.db"}, this.successcb, this.errorcb);

    console.log("I AM BEING CALLED");
    this.state.db = SQLite.openDatabase({name: 'example.db', readOnly: true, createFromLocation : "~example.db"}, this.successcb, this.errorcb);
    this.setState(this.state);
    //var db = SQLite.openDatabase()
    //var txt = "NOT WORKING";
    //console.log("HEY")
  };

  successcb(){
    //this.state.name = "SOME NUMBER";
    //this.setState(this.state);
    var that = this;
    this.state.db.transaction((tx) => {
      var length=that.props.screenProps.questionnaire.length;
      //var length=40;
      //var waterbody=44277609; // Ganonoque lake;
      var species=that.props.screenProps.questionnaire.species_code;
      console.log(length,species)
      console.log("????","PROFIT")
      //var species=317;//Largemouth Bass;
      //TODO: add sensitive population -- can't find which column distinguishes sensitive/non-sensitive
      //TODO: add waterbody -- works in python, why not in react-native ??
       tx.executeSql('SELECT ADV_LEVEL FROM fishes WHERE LENGTH_CATEGORY_ID='+ length + ' AND SPECIES_CODE='+ species + ';', [], (tx, results) => {
            console.log("here")
            if (results.rows.item(0))
            {
              //that.state.name = results.rows.item(0).ADV_LEVEL;
              that.setState((prevState, props) => {return {name: results.rows.item(0).ADV_LEVEL}});
            }
            else {
              //that.state.name = "ERROR: no such combination of attributes";
              that.setState((prevState, props) => {return {name: "<ERROR: no such combination of attributes>"}});
            }
            console.log("there")

            //console.warn(results.rows.item(0).ADV_LEVEL);
          }
        );
    });
  }

  errorcb(){
    console.error("FAILED");
  }

  static navigationOptions = {
    tabBarLabel: '',
    // Note: By default the icon is only shown on iOS. Search the showIcon option below.
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('./img/results.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  };

  render() {
    return (
    <View>
    <Text>You can eat {this.state.name} meals* of this fish safely in a one-month period </Text>
    <Text></Text>
    <Text></Text>
    <Text></Text>
    <Text></Text>
    <Text></Text>
    <Text></Text>
    <Text></Text>
    <Text></Text>
    <Text></Text>
    <Text>*One meal is defined as 0.5 lbs (227 grams) of fish, or one normal-sized fillet.</Text>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    width: 26,
    height: 26,
  },
});

 const MyNavigator = TabNavigator({
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
    labelStyle: {
      fontSize: 10,
      },
    activeTintColor: '#e91e63',
    showIcon: true
  },
});

class TopLevelApp extends React.Component {

  populateDb () {
    return undefined;
  }

  constructor(props){
    super(props);
    var questionnaire = {
                        //sensitive: undefined,
                        //waterbody_code: undefined,
                        species_code: 317,
                        length: 40
                        }
    this.state = {db: this.populateDb(), questionnaire: questionnaire}
    this.handleQuestionnaireChange = this.handleQuestionnaireChange.bind(this)
  }

  handleQuestionnaireChange(questionnaire) {
    this.state.questionnaire = questionnaire;
    this.setState(this.state);
    //forceUpdate()
    console.log(this);
  }

  render () {
      return  (<MyNavigator screenProps={{questionnaire: this.state.questionnaire, handleQuestionnaireChange:this.handleQuestionnaireChange}}/>)
  }
}

//const MyApp = TopLevelApp

AppRegistry.registerComponent('OpenTheNorthApp', () => TopLevelApp);
