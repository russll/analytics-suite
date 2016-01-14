import React from 'react';

export default React.createClass({
  render: function () {
    return (
      <div className='inlineError'>
        {this.props.message}
      </div>
    );
  },
});
