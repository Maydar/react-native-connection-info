/* eslint-disable */
import React from 'react';
import { NetInfo, Platform } from 'react-native';
import { connect } from 'react-redux';
import { connectionShape } from '../../shapes';

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
    NetInfo.isConnected.fetch().then(isConnected => {
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

  getWrappedInstance() {
    return this.wrappedInstance;
  }

  handleIsConnected(isConnected) {
    this.setState({ isConnected });
  }

  render() {
    return (
      <ComposedComponent
        ref={c => { this.wrappedInstance = c; }}
        {...this.props}
        connection={{ ...this.state }}
      />
    );
  }
};

withConnection.propTypes = {
  connection: connectionShape,
};

export default ComposedComponent => connect(
  null, null, null, { withRef: true },
)(withConnection(ComposedComponent));
