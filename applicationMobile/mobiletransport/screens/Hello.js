import React from 'react';
import { StyleSheet, Dimensions, Text } from 'react-native';
import { Block, theme } from 'galio-framework';

const { width } = Dimensions.get('screen');

//ceci est maintenant la page index
class Hello extends React.Component {
  render() {
    return (
      <Block flex center style={styles.home}>
        <Text style={styles.text}>Hello World how are you !</Text>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    color: theme.COLORS.BLACK,
    // color: '#1504D4FF',

  },
});

export default Hello;
