/* eslint-disable */
import React from 'react';
import { NetInfo, Platform } from 'react-native';
import { connectionShape } from '../shapes';

const withConnection = ComposedComponent => class extends React.Component {
  constructor() {
    super();
    this.state = {
      isConnected: false,
    };
    this.handleIsConnected = this.handleIsConnected.bind(this);
  }


  isNetworkConnected = () => {
    if (Platform.OS === 'ios') {
      return new Promise(resolve => {
        const handleFirstConnectivityChangeIOS = isConnected => {
          NetInfo.isConnected.removeEventListener('change', handleFirstConnectivityChangeIOS);
          resolve(isConnected);
        };
        NetInfo.isConnected.addEventListener('change', handleFirstConnectivityChangeIOS);
      });
    }
    return NetInfo.isConnected.fetch();
  };

  componentDidMount() {
    this.isNetworkConnected.then(isConnected => {
      this.handleIsConnected(isConnected);
    });
    NetInfo.isConnected.addEventListener(
      'change',
      this.handleIsConnected
    );
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      'change',
      this.handleIsConnected
    );
  }

  handleIsConnected(isConnected) {
    this.setState({ isConnected });
  }

  render() {
    return (
      <ComposedComponent {...this.props} connection={{ ...this.state }} />
    );
  }
};

withConnection.propTypes = {
  connection: connectionShape,
};

export default withConnection;
