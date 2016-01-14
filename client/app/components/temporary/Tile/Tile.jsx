import React, { Component } from 'react';
import { Paper, FontIcon, Styles } from 'material-ui';
let { Colors } = Styles;
import 'styles/fonts.styl';
import './Tile.styl';

class Tile extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      zDepth: 1,
    };
  }

  static defaultProps = {
    bg: Colors.indigo500,
  }

  static contextTypes = {
    history: React.PropTypes.object.isRequired,
    location: React.PropTypes.object.isRequired,
    muiTheme: React.PropTypes.object.isRequired,
  }

  _onClickHandler = (e)=> {
    this.context.history.pushState(null, this.props.route);
    if (this.props.onClick)this.props.onClick(e);
  }

  _onMouseEnterHandler = () => {
    this.setState({
      zDepth: 5,
    });
  }

  _onMouseLeaveHandler = () => {
    this.setState({
      zDepth: 1,
    });
  }

  render() {
    let { title, rightMarker, leftMarker} = this.props;

    let tileStyle = {
      tile: {
        backgroundColor: this.props.bg,
      },
      tileTitle: {
        color: 'white',
        fontSize: '18px',
        position: 'absolute',
        bottom: '24px',
        left: '64px',
      },
      tileType: {
        color: 'white',
        fontSize: '8px',
        position: 'absolute',
        top: '24px',
        right: '24px',
      },
      tileIcon: {
        position: 'absolute',
        bottom: '24px',
        left: '24px',
      },
      tileLeftMarker: {
        position: 'absolute',
        left: '24px',
        top: '24px',
      },
      tileRightMarker: {
        position: 'absolute',
        right: '24px',
        top: '24px',
      },
    };

    return (
      <Paper zDepth={this.state.zDepth} className='tile' style={tileStyle.tile}
             onClick={this._onClickHandler}
             onMouseEnter={this._onMouseEnterHandler}
             onMouseLeave={this._onMouseLeaveHandler}>
        <span className='tile__left-marker' style={tileStyle.tileLeftMarker}>{leftMarker}</span>
        <span className='tile__right-marker' style={tileStyle.tileRightMarker}>{rightMarker}</span>
        <i className={'tile__icon ' + this.props.icon}></i>
        <span className='tile__title' style={tileStyle.tileTitle}>{title}</span>
        {this.props.children}
      </Paper>
    );
  }
}

export default Tile;
