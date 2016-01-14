import React, { Component } from 'react';
import Relay from 'react-relay';
import { Styles, CardTitle, List, ListItem, Paper, AppBar, IconMenu, IconButton, MenuItem, Checkbox } from 'material-ui';
import './DonutChart.styl';

class DonutChart {
  constructor(options) {
    let {parent, data, width, height, color} = options;
    this.state.parent = parent;
    this.state.data = data;

    var radius = Math.min(width, height) / 2;

    var palette = d3.scale.ordinal()
      .range(["#f1f1f1", color]);

    var arc = d3.svg.arc()
      .outerRadius(radius)
      .innerRadius(radius - 5);

    var pie = d3.layout.pie()
      .sort(null)
      .value(function(d) {
        return d.value;
      });

    var svg = d3.select(parent).append("svg")
      .attr("width", width)
      .attr("height", height)
      .classed('donut-chart', true)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var g = svg.selectAll(".arc")
      .data(pie(data))
      .enter().append("g")
      .attr("class", "arc");

    g.append("path")
      .attr("d", arc)
      .style("fill", function(d, i) {
        return palette(i);
      });

    svg.append("text")
      .attr("dy", ".35em")
      .attr('text-anchor', 'middle')
      .text(Math.round(data[1].value / data[0].value * 10000) / 100 + '%');
  }

  state = {
    axises: {},
    scales: {},
    brushes: {},
    chart: {
      categoriesLineChart: {
        scales: {},
        axises: {},
        sizes: {},
      },
      categoriesBarChart: {},
      mainBarChart: {
        scales: {},
        axises: {},
        sizes: {},
      },
    },
    sizes: {},
    excludedCategories: [],
    selectedDates: [],
    selectedCategories: {},
  }
}

export default DonutChart;
