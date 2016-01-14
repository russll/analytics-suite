import React from 'react';
import './bar.styl';
import Utils from '../../../lib/Utils'

class BarChart extends React.Component {

	constructor(props) {
		super(props);
    let chartName = this.props.chartUnicName||Math.random().toString(36).substring(7);
    this.state = {chartName:chartName};
	}

	static contextTypes = {
		history: React.PropTypes.object.isRequired,
		location: React.PropTypes.object.isRequired,
		muiTheme: React.PropTypes.object.isRequired
	};

  componentDidMount(){
    //d3.selectAll(".bar-chart-ttip").remove()
    this._renderBar();
  }

  componentDidUpdate(){
    this._clearBar();
    this._renderBar();
  }

  _clearBar = () =>{
    d3.selectAll("g").remove();
    d3.selectAll(".bar-chart-ttip").remove()
  }
  _renderBar = () =>{

    let o = this.props.options||{
        dropZeros : false,
        barWidth : null,
        thousandSeparator : true
      };

    if(!this.state.chartName||!this.props.data) return;

    let chartName = this.state.chartName;
    let data = this.props.data;
    let margin = { top: 30, right: 10, bottom: 30, left: 70 };
    let PADDING = 40;   // padding between bars
    let width = this.props.width ? this.props.width - margin.left - margin.right : window.innerWidth - margin.left - margin.right -100;
    let height = this.props.height ? this.props.height - margin.top - margin.bottom : "";
    let yTickFormat = this.props.yTickFormat?this.props.yTickFormat:'s';
    let _this = this;

    if(width > this.props.maxWidth) {width = this.props.maxWidth}
    else if(width < data.length*50) {width = data.length*50} //TODO: could be better

    var y = d3.scale.linear()
      .range([height, 0]);

    var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], 0);

    var xAxisScale = d3.scale.linear()
      .range([ 0, width ]);

    var xAxis = d3.svg.axis()
      .scale(x) //xAxisScale
      .orient("bottom");
//    .tickFormat(d3.format("d"));

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
//    .tickFormat( RU.numberFormat("s") );
      .tickFormat( d3.format(yTickFormat) );

//  var svg = d3.select("#chart").append("svg")
    let svg = d3.select(this.refs[chartName])
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let myTool = d3.select(_this.refs[chartName].parentNode)
      .append("div")
      .attr("class", "bar-chart-ttip")
      .style("opacity", "0")
      .style("display", "none");



    x.domain(data.map(function(d) {
      return d.date;
    }));

    let minDomain = d3.min(data, function(d) {return d.value});
    let maxDomain = d3.max(data, function(d) {return d.value});
    y.domain([
      minDomain > 0 ? 0 : minDomain,
      maxDomain > 0 ? maxDomain : 0
    ]).nice();

    let barWidth = o.barWidth? o.barWidth : x.rangeBand() - (width/10);

    svg.selectAll(".bar")
      .data(data)
      .enter()
      .append("g")
      .append("rect")
      .attr("class", function(d) {

        if (d.value < 0){
          return "bar negative";
        } else {
          return "bar positive";
        }

      })
      .attr("data-yr", function(d){
        return d.date;
      })
      .attr("data-c", function(d){
        return d.value;
      })
      .attr("title", function(d){
        return (d.date + ": " + d.value + " ");  // "руб."
      })
      .attr("y", function(d) {
        if (d.value > 0){
          return y(d.value)-2;
        } else {
          return y(0);
        }
      })
      .attr("x", function(d) {
        if(o.barWidth){
          return ( x( d.date ) + (width/data.length)/2 - (o.barWidth/2) );
        }else{
          return ( x( d.date ) + ( width/20 ) );
        }
      })
      .attr("width", barWidth )
      .attr("height", function(d) {
        let barHeight=Math.abs(y(d.value) - y(0))
        return barHeight>y(0)?barHeight-2:barHeight+2 ;
      });

    svg.selectAll("g").append("text")
      .data(data)
      .text((d)=>{
        let val = d.value;
        if(o.format){ val = o.format( val ); }
        val = o.dropZeros?(val).toFixed(0):(val).toFixed(2);
        if( o.thousandSeparator ){
          return (val).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        } else{
          return val
        }

      })
      .attr("class","bar-chart__value")
      .attr("y", function(d) {
          if (d.value > 0){
            return y(d.value) - 4;
          } else {
            return y(0) - 4;
          }
      })
      .attr("x", function(d) {
        return (x(d.date) + (x.rangeBand() / 2) - (this.getBBox().width / 2));
      });


    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

    svg.append("g")
      .attr("class", "X axis")
      .attr("transform", "translate("+(0)+"," + height + ")") //" + (margin.left - 6.5) + ","
      .style("fill","black")
      .call(xAxis);

// axis lines
    svg.append("g")
      .attr("class", "x axis")
      .append("line")
      .attr("y1", y(0))
      .attr("y2", y(0))
      .attr("x2", width+PADDING);
  };



	render() {
    let chartName = this.state.chartName;
		return (<div className="BarChart-wrapper">
              <svg className="BarChart" ref={chartName} width={this.props.width} height={this.props.height} />
            </div>);
	}
}

export default BarChart