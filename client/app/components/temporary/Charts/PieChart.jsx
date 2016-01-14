import React from 'react';
import './pie.styl';

/*
 <PieChart chartUnicName="mainChart123" width="100" height="100" data={obj} />

  Where obj is:
  {
    labels: ["Lorem ipsum", "dolor sit",..]
    colors: ["#e2e2e2", "#dddddd",.. ]
    pieData: [{ label: label, value: 123456 }, .. ]
  }

  chartUnicName & colors - optional
 */

class PieChart extends React.Component {

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
    this._renderPie();
  }

  _renderPie = () =>{
    if(!this.state.chartName||!this.props.data||!this.props.data.pieData||!this.props.data.pieData.length) return;

    function get_random_color() {
      var letters = 'ABCDE23456789'.split('');      // Only light colors & no white :)
      var color = '#';
      for (var i=0; i<6; i++ ) color += letters[Math.floor(Math.random() * letters.length)];
      return color;
    };

    let chartName = this.state.chartName;
    let svg = d3.select(this.refs[chartName])
      .append("g")
      ;
    svg.append("g")
      .attr("class", "slices");
    svg.append("g")
      .attr("class", "labels");
    svg.append("g")
      .attr("class", "lines");

    var width = this.props.width,
      height = this.props.height,
      radius = Math.min(width, height) / 2;

    var pie = d3.layout.pie()
      .sort(null)
      .value(function(d) {
        return d.value;
      });

    var arc = d3.svg.arc()
      .outerRadius(radius * 0.8)
      .innerRadius(radius * 0.4);

    var outerArc = d3.svg.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var key = function(d){ return d.data.label; };

    let colors = this.props.data.colors;

    if(!colors.length){
      colors = this.props.data.labels.map((el)=>{
        return get_random_color();
        //return "#"+((1<<24)*Math.random()|0).toString(16);
        //return '#'+Math.random().toString(16).substr(-6);
      });
    }

    var color = d3.scale.ordinal()
      .domain(this.props.data.labels)
      .range(colors);

    //function randomData() {
    //  var labels = color.domain();
    //  return labels.map(function(label){
    //    return { label: label, value: Math.random() }
    //  });
    //}

    render( this.props.data.pieData );

    function wrap(text, width) {
      text.each(function() {
        var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1,
          y = text.attr("y"),
          dy = parseFloat(text.attr("dy")),
          tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", (++lineNumber?1:0 + dy) + "em").text(word);
          }
        }
      });
    }

    function render(data) {

      /* ------- PIE SLICES -------*/
      var slice = svg.select(".slices").selectAll("path.slice")
        .data(pie(data), key);

      slice.enter()
        .insert("path")
        .style("fill", function(d) { return color(d.data.label); })
        .attr("class", "slice");

      slice
        .transition().duration(1000)
        .attrTween("d", function(d) {
          this._current = this._current || d;
          var interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function(t) {
            return arc(interpolate(t));
          };
        });

      slice.exit()
        .remove();

      /* ------- TEXT LABELS -------*/

      var text = svg.select(".labels").selectAll("text")
        .data(pie(data), key);

      text.enter()
        .append("text")
        .attr("dy", ".35em")
        .text(function(d) {
          return d.data.label;
        })
        .style("font-size","11px")
        .call(wrap, 150);

      function midAngle(d){
        return d.startAngle + (d.endAngle - d.startAngle)/2;
      }

      text.transition().duration(1000)
        .attrTween("transform", function(d) {
          this._current = this._current || d;
          var interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function(t) {
            var d2 = interpolate(t);
            var pos = outerArc.centroid(d2);
            pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
            return "translate("+ pos +")";
          };
        })
        .styleTween("text-anchor", function(d){
          this._current = this._current || d;
          var interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function(t) {
            var d2 = interpolate(t);
            return midAngle(d2) < Math.PI ? "start":"end";
          };
        });

      text.exit()
        .remove();

      /* ------- SLICE TO TEXT POLYLINES -------*/

      var polyline = svg.select(".lines").selectAll("polyline")
        .data(pie(data), key);

      polyline.enter()
        .append("polyline");

      polyline.transition().duration(1000)
        .attrTween("points", function(d){
          this._current = this._current || d;
          var interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function(t) {
            var d2 = interpolate(t);
            var pos = outerArc.centroid(d2);
            pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
            return [arc.centroid(d2), outerArc.centroid(d2), pos];
          };
        });

      polyline.exit()
        .remove();
    };
  };

	render() {
    let chartName = this.state.chartName;
		return (<svg className="pieChart" ref={chartName} width={this.props.width} height={this.props.height} />);
	}
}

export default PieChart