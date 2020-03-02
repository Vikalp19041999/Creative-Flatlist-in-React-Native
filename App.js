import React, { Component } from 'react'
import { Icon } from "react-native-elements";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      dataSource: []
    }
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData = () => {
    this.setState({ loading: true })
    fetch("https://jsonplaceholder.typicode.com/photos")
      .then(response => response.json())
      .then(responseJson => {
        responseJson = responseJson.map(item => {
          item.isSelect = false,
            item.selectedClass = styles.list
          return item
        })

        this.setState({
          loading: false,
          dataSource: responseJson
        })
      }).catch(error => {
        this.setState({ loading: false })
      })
  }

  FlatListItemSeparator = () => <View style={styles.line} />

  selectItem = data => {
    data.item.isSelect = !data.item.isSelect;
    data.item.selectedClass = data.item.isSelect ? styles.selected : styles.list;

    const index = this.state.dataSource.findIndex(
      item => data.item.id === item.id
    );

    this.state.dataSource[index] = data.item;

    this.setState({
      dataSource: this.state.dataSource,
    });
  };

  goToStore = () => this.props.navigation.navigate("Expenses", { selected: this.state.selected, });

  renderItem = data =>
    <TouchableOpacity
      style={[styles.list, data.item.selectedClass]}
      onPress={() => this.selectItem(data)}
    >
      <Image
        source={{ uri: data.item.thumbnailUrl }}
        style={{ width: 40, height: 40, margin: 6 }}
      />
      <Text style={styles.lightText}>  {data.item.title.charAt(0).toUpperCase() + data.item.title.slice(1)}  </Text>
    </TouchableOpacity>

  render() {
    const itemNumber = this.state.dataSource.filter(item => item.isSelect).length;
    if (this.state.loading) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="purple" />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <View style={styles.appHeader}>
          <Text style={styles.headerText}>Highlight and Multiselect in Flatlist</Text>
        </View>
        <FlatList
          data={this.state.dataSource}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          renderItem={item => this.renderItem(item)}
          keyExtractor={item => item.id.toString()}
          extraData={this.state}
        />

        <View style={styles.numberBox}>
          <Text style={styles.number}>{itemNumber}</Text>
        </View>

        <TouchableOpacity style={styles.icon}>
          <View>
            <Icon
              raised
              name="shopping-cart"
              type="font-awesome"
              color="#e3e3e3"
              size={30}
              onPress={() => this.goToStore()}
              containerStyle={{ backgroundColor: "#FA7B5F" }}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  appHeader: {
    backgroundColor: 'black',
    height: '9%',
    alignItems: 'center'
  },
  headerText: {
    fontSize: 21,
    marginTop: '5%',
    fontWeight: 'bold',
    color: 'snow'
  },
  list: {
    paddingVertical: '2%',
    margin: '1%',
    paddingBottom: '7%',
    flexDirection: "row",
    backgroundColor: "black",
    justifyContent: "flex-start",
    alignItems: "center",
    zIndex: -1
  },
  lightText: {
    color: "#f7f7f7",
    width: '80%',
    paddingLeft: '4%',
    fontSize: 15
  },
  icon: {
    position: "absolute",
    bottom: '8%',
    width: "100%",
    left: '80%',
    zIndex: 1
  },
  numberBox: {
    position: "absolute",
    bottom: '10%',
    width: '15%',
    height: '10%',
    borderRadius: 15,
    left: '95%',
    zIndex: 3,
    backgroundColor: "#e3e3e3",
    justifyContent: "center",
    alignItems: "center"
  },
  number: {
    fontSize: 14,
    color: "#000"
  },
  selected: {
    backgroundColor: "#FA7B5F"
  },
  line: {
    height: '0.1%',
    width: "100%",
    backgroundColor: 'snow'
  },
});
