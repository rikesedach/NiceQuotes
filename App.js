import React from 'react';
import { StyleSheet, View, Button, Text, AsyncStorage, Alert } from 'react-native';
//import * as SQLite from 'expo-sqlite';
import Firebase from './js/Firebase';
import Quote from './js/components/Quote';
import NewQuote from './js/components/NewQuote';

// const data = [
//   { text: 'Probleme kann man niemals mit der selben Denkweise lösen, durch die sie entstanden sind', author: 'Albert Einstein' },
//   { text: 'Man braucht im Leben nichts zur fürchten man muss es nur verstehen', author: 'Marie Curie' },
//   { text: 'Nichts ist so betändig wie der Wandel', author: 'Heraklit' }
// ];

// const database = SQLite.openDatabase('quotes.db');


function StyledButton(props) {
  let button = null;
  if (props.visible) {
    button = (
      <View style={props.style}>
        <Button title={props.title} onPress={props.onPress} />
      </View>
    )
  }
  return button;
};

export default class App extends React.Component {
  state = { index: 0, showNewQuoteScreen: false, quotes: [] };

  // _retriveData = async () => {
  // let value = await AsyncStorage.getItem('QUOTES');
  // if (value !== null){
  //   value = JSON.parse(value);
  //   this.setState({quotes: value});
  // }
  // };

  // _storeData(quotes){
  // AsyncStorage.setItem('QUOTES', JSON.stringify(quotes));
  // };

  _retriveData = async () => {
    let quotes = [];
    let query = await Firebase.db.collection('quotes').get();
    query.forEach(quote => {
      quotes.push({
        id: quote.id,
        text: quote.data().text,
        author: quote.data().author
      })
    })
    this.setState({ quotes });
    // database.transaction(transaction =>
    //   transaction.executeSql(
    //     'SELECT * FROM quotes',
    //     [],
    //     (_, result) => this.setState({ quotes: result.rows._array })
    //   )
    // );
  };

  _removeQuoteFromDB(id) {
    Firebase.db.collection('quotes').doc(id).delete();
    // database.transaction(transaction =>
    //   transaction.executeSql(
    //     'DELETE FROM quotes WHERE id = ?',
    //     [id]
    //   )
    // );
  }

  _saveQuoteToDB = async (text, author, quotes) => {
    let docRef = await Firebase.db.collection('quotes').add({ text, author });
    quotes[quotes.length - 1].id = docRef.id;
    // database.transaction(transaction =>
    //   transaction.executeSql(
    //     'INSERT INTO quotes(text, author) VALUES (?,?)',
    //     [text, author],
    //     (_, result) => (quotes[quotes.length - 1].id = result.insertId)
    //   )
    // );
  }

  _addQuote = (text, author) => {
    let { quotes } = this.state;
    if (text && author) {
      quotes.push({ text, author });
      // this._storeData(quotes);
      this._saveQuoteToDB(text, author, quotes);
    }
    this.setState({
      index: quotes.length - 1,
      showNewQuoteScreen: false,
      quotes
    });
  }

  _deleteQuote = () => {
    let { quotes, index } = this.state;
    // this._storeData(quotes);
    this._removeQuoteFromDB(quotes[index].id);
    quotes.splice(index, 1);
    this.setState({ index: 0, quotes });
  };

  _deleteButton = () => {
    Alert.alert(
      'Zitat löschen?',
      'Dies kann nicht rückgängig gemacht werden.',
      [
        { text: 'Abbrechen', style: 'cancel' },
        { text: 'Löschen', style: 'destructive', onPress: () => this._deleteQuote() }
      ]
    )
  }

  _displayNextQuote = () => {
    const { quotes, index } = this.state;
    let nextIndex = index + 1;
    if (nextIndex == quotes.length) nextIndex = 0;
    this.setState({ index: nextIndex })
  };

  _displayPrevQuote = () => {
    const { quotes, index } = this.state;
    let prevIndex = index - 1;
    if (prevIndex == -1) prevIndex = quotes.length - 1;
    this.setState({ index: prevIndex })
  };

  componentDidMount() {
    //Tabelle in SQLite anlegen
    // database.transaction(transaction =>
    //   transaction.executeSql(
    //     'CREATE TABLE IF NOT EXISTS quotes (id INTEGER PRIMARY KEY NOT NULL, text TEXT, author TEXT);'
    //   )
    // );
    console.disableYellowBox = true;
    Firebase.init();
    this._retriveData();
  }

  render() {
    const { quotes, index, showNewQuoteScreen } = this.state;
    const quote = quotes[index];

    let content = <Text style={{ fontSize: 36 }}>Keine Zitate</Text>;
    if (quote) {
      content = <Quote text={quote.text} author={quote.author} />;
    }
    return (
      <View style={styles.container}>
        <StyledButton
          style={styles.deleteButton}
          visible={quotes.length >= 1}
          title="Löschen"
          onPress={this._deleteButton}
        />
        <StyledButton
          style={styles.newButton}
          visible={true}
          title="Neu"
          onPress={() => this.setState({ showNewQuoteScreen: true })}
        />
        <NewQuote
          visible={showNewQuoteScreen}
          onSave={this._addQuote}
        />
        {content}
        <StyledButton
          style={styles.nextButton}
          visible={quotes.length >= 2}
          title="Nächstes Zitat"
          onPress={this._displayNextQuote}
        />
      </View>
    );
  }
}
/*
<Button title="Vorheriges Zitat" onPress={() => this.setState({ index: prevIndex })} /> 
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButton: {
    position: 'absolute',
    bottom: 10
  },
  newButton: {
    position: 'absolute',
    right: 10,
    top: 30
  },
  deleteButton: {
    position: 'absolute',
    left: 10,
    top: 30
  }
});
