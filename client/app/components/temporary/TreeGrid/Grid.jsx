import React, { Component } from 'react';
import GridLine from './GridLine.jsx';
import GridLineDiff from './GridLineDiff.jsx';
import BarChart from '../Charts/BarChart.jsx';
import { Styles, Dialog, FlatButton } from 'material-ui';
import Loading from 'app/components/dumb/Loading.jsx';
let { Colors } = Styles;
import Utils from '../../../lib/Utils.js';
var u = new Utils();

class Grid extends Component {

  constructor(props) {
    super(props);

    if (!this.props.data) return;
    this.state = {
      table: [],
      opts: {collapsed: true},
      dialogOpen: false
    };
  }

  componentWillReceiveProps() {
    var show = (this.props.showDetails === 'true'),
      opts = this.state.opts,
      data = this.props.data;

    if (!data) return;

    this.setState(() => {
      var table = data.map((obj) => {
        if (2 == obj.nesting)  obj.show = show;
        return obj;
      });
      opts.collapsed = show;
      return {table: table, opts: opts};
    });

  }

  componentDidMount() {

    var show = (this.props.showDetails === 'true'),
      opts = this.state.opts,
      data = this.props.data;

    this.setState(() => {
      var table = data.map((obj) => {
        if (2 == obj.nesting)  obj.show = show;
        return obj;
      });
      opts.collapsed = show;
      return {table: table, opts: opts};
    });
  }

  _lineClick = (data, nest) => {

    if (nest) {
      var table = this.state.table,
        opts = this.state.opts;

      for (var i = 0, l = table.length; i < l; i++) {
        var line = table[i];
        if (2 == line.nesting) {
          line.show = !line.show;                     // toggle click
        }
      }
      opts.collapsed = !opts.collapsed;               // toggle collapsed
      this.setState({table: table, opts: opts});
    }

  };

  _onDialogSubmit = (e)=> {
    this.setState({ dialogOpen:false });

    if(typeof this.refs.dialog.dismiss == 'function'){
      this.refs.dialog.dismiss();
    }

  };

  _showDialog = (data)=> {

    let dta = Object.assign({}, data.val);
    delete dta.name;

    let debtsBarData = Object.keys(dta).map(function(name, idx){
      let arr = name.split('-').reverse();
      arr.shift();
      return {
        date: arr[0] +"/"+ arr[1].slice(2,4),
        value: Number(dta[name])/1000,
        type: u.ct(data.type) }
    });

    this.setState({
      graphName: data.val.name,
      debtsBarData: debtsBarData
    });

    this.setState({ dialogOpen:true });

    if(typeof this.refs.dialog.show == 'function'){
      this.refs.dialog.show();
    }


  };


  render() {
    let _this = this;
    let bar;
    let  showHead = this.props.showHead;
    let  opts = this.state.opts;
    let standardActions = [
      { text: 'Ok', onTouchTap: this._onDialogSubmit, ref: 'submit' }
    ];
    let customActions = [
      <FlatButton
        label="Закрыть"
        primary={true}
        onTouchTap={this._onDialogSubmit} />
    ];

    let width = window.innerWidth - (window.innerWidth > (536 + 48) ? (420 + 96) : 0) - 48;

    if ('string' == typeof showHead) {
      showHead = ('true' == this.props.showHead);     // need boolean
    }

    if(this.state && this.state.debtsBarData) {

      bar = ( <BarChart yTickFormat="g" maxWidth="650" data={this.state.debtsBarData}  height={300} /> );
//      bar = ( <Bar data={this.state.debtsBarData} width={width} height="300" options={ barOptions }/> );
    }
    let reffy = false;
    var table = this.state.table.map((obj) => {
      if(obj.val.name=='Доход/расход, связанный с резервами')reffy=true;
      if (obj.show && ( showHead || !obj.header )) {
        switch (this.props.use) {
          case 'GridLine':
            return <GridLine key={obj.id} data={obj} opts={ this.props } collapsed={opts.collapsed} chartHandler={this._showDialog}
                             expandHandler={this._lineClick} moduleName={this.props.moduleName} />;
            break;

          case 'GridLineDiff' :
            return <GridLineDiff key={obj.id} data={obj} opts={ this.props } collapsed={opts.collapsed}
                             expandHandler={this._lineClick} callDate={this.props.callDate} elDate={this.props.elDate}/>;
            break;

        }
      }
    });

    if (!table.length) {
      table = <Loading text="Пожалуйста, подождите..."/>;
    } else {
      table =
        <table cellPadding="0" cellSpacing="0">
          <tbody>{table}</tbody>
        </table>;
    }

    return (
      <div >
        {reffy?<div className="rev-exp__reffy-div">справочно</div>:''}
        {table}
        <Dialog ref="dialog" contentClassName="revenue_chart"
                title={this.state.graphName+" тыс. ₽"||''}
                actions={customActions}
                open={this.state.dialogOpen}
                actionFocus="submit"
                autoScrollBodyContent={true}
                modal={true}
                contentStyle={{width:"100%"}}>
          {bar}
        </Dialog>
      </div>
    );
  }
}

export default Grid