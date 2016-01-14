import React from 'react';
import './barMono.styl';
import Utils from '../../../lib/Utils'
let utils = new Utils();

/*
 <BarChart chartUnicName="mainChart123" width="100" height="100" data=[array] />

  Where array is:
     var data =[
         {date:'2015-06-01', value: 100},
         ..
      ];
*/

class BarChart extends React.Component {

	constructor(props) {
		super(props);
    let chartName = this.props.chartUnicName||Math.random().toString(36).substring(7);
    this.state = {
      chartName:chartName
    };

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
  }

  _clearBar = () =>{
    //d3.selectAll("g").remove();
    //d3.selectAll(".bar-chart-ttip").remove()
  };

  _renderBar = () =>{
    if(!this.state.chartName||!this.props.data) return;


    let chartName = this.state.chartName;
    let data = this.props.data;
    let margin = { top: 10, right: 0, bottom: 20, left: 60 };
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

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(3)
      .tickFormat( d3.format(',') )
      .tickFormat( function(d) { return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "); } );

    let svg = d3.select(this.refs[chartName])
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(data.map(function(d) {
      return d.date;
    }));

    let minDomain = d3.min(data, function(d) {return d.value});
    let maxDomain = d3.max(data, function(d) {return d.value});
    y.domain([
      minDomain > 0 ? 0 : minDomain,
      maxDomain > 0 ? maxDomain : 0
    ]).nice();

    //y.domain(d3.extent(data, function(d) {
    //  return d.value;
    //})).nice();

    let barWidth = x.rangeBand() - (width/10);

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
//        console.log('y(d.value)',y(d.value));
        if (d.value > 0){
          return y(d.value)-2;
        } else {
          return y(0);
        }

      })
      .attr("x", function(d) {
        return (x( d.date ) + (width/20) );
      })
      .attr("width", barWidth )
      .attr("height", function(d) {
        let barHeight=Math.abs(y(d.value) - y(0))
//        console.log(barHeight, y(0))
        return barHeight>y(0)?barHeight-2:barHeight+2 ;
      })
      .style("fill","#fff");

    svg.append("g")
      .attr("class", "y_axis_mono")
      .call(yAxis);

    svg.append("g")
      .attr("class", "x_axis_mono")
      .attr("transform", "translate("+(0)+"," + height + ")") //" + (margin.left - 6.5) + ","
      .style("fill","#fff")
      .call(xAxis);

// axis lines
    svg.append("g")
      .attr("class", "x axis")
      .append("line")
      .attr("y1", y(0))
      .attr("y2", y(0))
      .attr("x2", width+PADDING)
      .style("fill","#fff");

  };



	render() {
    let chartName = this.state.chartName;

		return (
      <div className="BarChart-wrapper">
        <svg className="BarChart" ref={chartName} width={this.props.width} height={this.props.height} />
      </div>
    );
	}
}

export default BarChart