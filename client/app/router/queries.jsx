import React from 'react';
import Relay from 'react-relay';

export default {
  default: (Component, variables) => Relay.QL`
    query {
      analytics {
        ${Component.getFragment('analytics', variables)}
      }
    }
  `
}