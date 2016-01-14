import React, { Component } from 'react';
import Relay from 'react-relay';
import { Styles, CardTitle, List, ListItem, Paper, AppBar, IconMenu, IconButton, MenuItem, Checkbox } from 'material-ui';
let { Colors, Typography } = Styles;
import Loading from 'components/dumb/Loading.jsx';
import BaseStore from 'components/layouts/BaseStore/BaseStore.jsx';
import BasePaper from 'components/layouts/BasePaper/BasePaper.jsx';
import DataParse from '../../../lib/DataParse.js';
import Utils from '../../../lib/Utils.js';
import './BorrowersCategoryChart.styl'
let dp = new DataParse();
let utils = new Utils();

class BorrowersCategoryChart {
  constructor(parent, data) {
    this.state.parent = parent;
    this.state.categories = data.borrowersDashboard.categories;
    this.state.general = data.borrowersStats.results;

    let categories = this._getAllCategories();
    for (let i = 0; i < categories.length; i++) {
      this.state.selectedCategories[categories[i]] = true;
    }

    // sizes
    this.state.chart.categoriesBarChart.sizes.margin = {top: 20, right: 20, bottom: 40, left: 20};
    this.state.chart.categoriesLineChart.sizes.margin = {top: 20, right: 20, bottom: 40, left: 20};
    this.state.chart.mainBarChart.sizes.margin = {top: 20, right: 20, bottom: 40, left: 20};
    this.state.chart.brushChart.sizes.margin = {top: 20, right: 20, bottom: 40, left: 20};

    this.state.chart.categoriesBarChart.sizes.height = 200 - this.state.chart.categoriesBarChart.sizes.margin.top - this.state.chart.categoriesBarChart.sizes.margin.bottom;
    this.state.chart.categoriesBarChart.sizes.width = this.state.parent.offsetWidth - this.state.chart.categoriesBarChart.sizes.margin.left - this.state.chart.categoriesBarChart.sizes.margin.right;

    this.state.chart.categoriesLineChart.sizes.height = 200 - this.state.chart.categoriesLineChart.sizes.margin.top - this.state.chart.categoriesLineChart.sizes.margin.bottom;
    this.state.chart.categoriesLineChart.sizes.width = this.state.parent.offsetWidth - this.state.chart.categoriesLineChart.sizes.margin.left - this.state.chart.categoriesLineChart.sizes.margin.right;

    this.state.chart.mainBarChart.sizes.height = 200 - this.state.chart.mainBarChart.sizes.margin.top - this.state.chart.mainBarChart.sizes.margin.bottom;
    this.state.chart.mainBarChart.sizes.width = this.state.parent.offsetWidth - this.state.chart.mainBarChart.sizes.margin.left - this.state.chart.mainBarChart.sizes.margin.right;

    this.state.chart.brushChart.sizes.height = 100 - this.state.chart.brushChart.sizes.margin.top - this.state.chart.brushChart.sizes.margin.bottom;
    this.state.chart.brushChart.sizes.width = this.state.parent.offsetWidth - this.state.chart.brushChart.sizes.margin.left - this.state.chart.brushChart.sizes.margin.right;

    ///////////////////////////////////////////////////////////////////////////////////////////////
    this._initializeScales();
    this._initializeCategoriesLineChartScales();
    this._initializeMainBarChartScales();

    this._initializeBrush();

    this._initializeSVG();

    this._initializeFocus();//
    this._initializeFocusCategoriesLineChart();
    this._initializeFocusMainBarChart();
    this._initializeContext();

    this._enter();
    this._enterCategoriesLineChart();
    this._enterMainBarChart();

    this._initializeBrushStore();
  }

  state = {
    axises: {},
    scales: {},
    brushes: {},
    chart: {
      categoriesLineChart: {
        scales: {},
        axises: {},
        sizes: {}
      },
      categoriesBarChart: {
        scales: {},
        axises: {},
        sizes: {}},
      mainBarChart: {
        scales: {},
        axises: {},
        sizes: {}
      },
      brushChart: {
        scales: {},
        axises: {},
        sizes: {}
      }
    },
    sizes: {},
    selectedDates: [],
    selectedCategories: {}
  }

  _initializeSVG() {
    let {data, dates, categories} = this._getData();

    this.state.hoveredDate = dates[dates.length-1];
    // render categories
    let categoryStore = d3.select(this.state.parent).append('div').classed('categories-store', true);
    let categoriesDiv = categoryStore
      .selectAll('category-item').data(categories)
      .enter()
      .append('div')
      .classed('category-item', true);

    categoriesDiv.classed('checked', (d)=>this.state.selectedCategories[d]);
    let colorDiv = categoriesDiv.append('div')
      .classed('color', true)
      .style('background-color', (d)=> {
        return this.state.color(+d);
      })
      .on('click', (d)=> {
        this.state.selectedCategories[d] = !this.state.selectedCategories[d];

        this._updateCategories();

        let {data, dates, categories} = this._getData();
        this.state.chart.categoriesBarChart.scales.x1.domain(categories).rangeRoundBands([0, this.state.chart.categoriesBarChart.scales.x0.rangeBand()]);

        this._exit();
        this._enter();
        this._update();

        this._exitCategoriesLineChart();
        this._enterCategoriesLineChart();
        this._updateCategoriesLineChart();

        this.state.chart.categoriesBarChart.focus.selectAll(".x.axis .tick text")
          //.attr("x", 4)
          .attr("dy", 24);

        this.state.chart.categoriesLineChart.store.selectAll(".x.axis .tick text")
          //.attr("x", 4)
          .attr("dy", 24);

      });

    colorDiv.append('svg')
      .classed('close', true)
      .attr('width', 18)
      .attr('height', 18)
      .attr('viewBox', '0 0 18 18')
      .append('path')
      .attr('d', 'M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z');

    colorDiv.append('svg')
      .classed('check', true)
      .attr('width', 18)
      .attr('height', 18)
      .attr('viewBox', '0 0 18 18')
      .append('path')
      .attr('d', 'M6.61 11.89L3.5 8.78 2.44 9.84 6.61 14l8.95-8.95L14.5 4z');

    categoriesDiv.append('div')
      .classed('name', true)
      .text(function (d) {
        return d;
      });
    categoriesDiv.append('div')
      .classed('data'.true);
    this._updateCategories();

    // render svg categories line chart
    this.state.chart.categoriesLineChart.svg = d3.select(this.state.parent).append('svg')
      .attr("width", this.state.chart.categoriesLineChart.sizes.width + this.state.chart.categoriesLineChart.sizes.margin.left + this.state.chart.categoriesLineChart.sizes.margin.right)
      .attr("height", this.state.chart.categoriesLineChart.sizes.height + this.state.chart.categoriesLineChart.sizes.margin.top + this.state.chart.categoriesLineChart.sizes.margin.bottom);

    // render svg categories bar chart
    this.state.chart.categoriesBarChart.svg = d3.select(this.state.parent).append('svg')
      .attr("width", this.state.chart.categoriesBarChart.sizes.width + this.state.chart.categoriesBarChart.sizes.margin.left + this.state.chart.categoriesBarChart.sizes.margin.right)
      .attr("height", this.state.chart.categoriesBarChart.sizes.height + this.state.chart.categoriesBarChart.sizes.margin.top + this.state.chart.categoriesBarChart.sizes.margin.bottom);

    // render svg main bar chart
    this.state.chart.mainBarChart.svg = d3.select(this.state.parent).append('svg')
      .attr("width", this.state.chart.mainBarChart.sizes.width + this.state.chart.mainBarChart.sizes.margin.left + this.state.chart.mainBarChart.sizes.margin.right)
      .attr("height", this.state.chart.mainBarChart.sizes.height + this.state.chart.mainBarChart.sizes.margin.top + this.state.chart.mainBarChart.sizes.margin.bottom);

    // render svg brush chart
    this.state.chart.brushChart.svg = d3.select(this.state.parent).append('svg')
      .attr("width", this.state.chart.brushChart.sizes.width + this.state.chart.brushChart.sizes.margin.left + this.state.chart.brushChart.sizes.margin.right)
      .attr("height", this.state.chart.brushChart.sizes.height + this.state.chart.brushChart.sizes.margin.top + this.state.chart.brushChart.sizes.margin.bottom);
  }

  _initializeContext() {
    let {data, dates, categories} = this._getData();

    //render context

    this.state.chart.brushChart.context = this.state.chart.brushChart.svg.append("g")
      .attr("class", "context")
      .attr("transform", "translate(" + this.state.chart.brushChart.sizes.margin.left + "," + this.state.chart.brushChart.sizes.margin.top + ")");

    this.state.chart.brushChart.contextData = this.state.chart.brushChart.context.append("g")
      .attr("class", "data");

    this.state.chart.brushChart.contextStore = this.state.chart.brushChart.contextData.selectAll(".context-store")
      .data(data)
      .enter().append("g")
      .attr("class", "context-store")
      .attr("transform", (d) => {
        return "translate(" + this.state.chart.brushChart.scales.x0(d.date) + ",0)";
      });

    this.state.chart.brushChart.contextStore.append("rect")
      .attr("width", this.state.chart.brushChart.scales.x1.rangeBand() > 10 ? 10 : this.state.chart.brushChart.scales.x1.rangeBand())
      .attr("x", (d) => {
        return this.state.chart.brushChart.scales.x1(d.category.category) + (this.state.chart.brushChart.scales.x1.rangeBand() - (this.state.chart.brushChart.scales.x1.rangeBand() > 10 ? 10 : this.state.chart.brushChart.scales.x1.rangeBand())) / 2;
      })
      .attr("y", (d) => {
        return this.state.chart.brushChart.scales.y(+d.category.debt.value);
      })
      .attr("height", (d) => {
        return this.state.chart.brushChart.sizes.height - this.state.chart.brushChart.scales.y(+d.category.debt.value);
      })
      .style("fill", (d) => {
        return this.state.color(d.category.category);
      });

    this.state.chart.brushChart.context.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + this.state.chart.brushChart.sizes.height + ")")
      .call(this.state.chart.brushChart.axises.xAxis);

  }

  _initializeBrush() {
    this.state.chart.brushChart.brush = d3.svg.brush()
      .x(this.state.chart.brushChart.scales.x0)
      .extent([this.state.chart.brushChart.scales.x0(this.state.chart.brushChart.scales.x0.domain()[0]),this.state.chart.brushChart.scales.x0(this.state.chart.brushChart.scales.x0.domain()[this.state.chart.brushChart.scales.x0.domain().length-1])+5])
      //.extent(this.state.chart.brushChart.scales.x0.range())
      .on("brush", this._brushed.bind(this));
  }

  _initializeBrushStore() {
    this.state.chart.brushChart.brushStore = this.state.chart.brushChart.context.append("g")
      .attr("class", "x brush")
      .call(this.state.chart.brushChart.brush);

    this.state.chart.brushChart.brushStore.selectAll("rect")
      .attr("y", -6)
      .attr("height", this.state.chart.brushChart.sizes.height + 7);

    this.state.chart.brushChart.brushStore.selectAll('.resize')
      .append('circle')
      .attr('r', 20)
      .attr('cy', '18px')
  }

  _initializeTooltip() {
    this.state.chart.tooltip = this.state.chart.categoriesBarChart.focus.append('g');
    this.state.chart.tooltip.classed('tooltip', true).style('display', 'none');
    this.state.chart.tooltip.append('line');
    this.state.chart.tooltip.append('rect').style('width', 100).style('height', 24).style('fill', Colors.indigo300).attr('transform', 'translate(0,0)');
    this.state.chart.tooltip.append('text').text('').style('fill', Colors.white).style('font-size', '12px').attr('transform', 'translate(5,16)').attr('width', '90').style('text-align', 'center');

  }

  _eqDates(selected) {
    let eq = true;
    for(let i = 0; i < this.state.selectedDates.length; i++){
      if(selected[i] != this.state.selectedDates[i]) {
        eq = false;
        break;
      }
    }
    return eq;
  }

  _brushed() {
    let {data, dates, categories} = this._getData();

    let selected = this.state.chart.brushChart.scales.x0.domain()
      .filter((d) => {
        return (this.state.chart.brushChart.brush.extent()[0] <= this.state.chart.brushChart.scales.x0(d)) && (this.state.chart.brushChart.scales.x0(d) <= this.state.chart.brushChart.brush.extent()[1]);
      });

    selected = selected.length > 0 ? selected : dates;
    if(this._eqDates(selected) && this.state.selectedDates.length != 0) {
      return;
    }
    this.state.selectedDates = selected;

    this.state.chart.categoriesBarChart.scales.x0.domain(selected);
    this.state.chart.categoriesLineChart.scales.x0.domain(selected);
    this.state.chart.mainBarChart.scales.x0.domain(selected);
    this.state.chart.categoriesBarChart.scales.x1.domain(categories).rangeRoundBands([0, this.state.chart.categoriesBarChart.scales.x0.rangeBand()]);

    this.state.chart.categoriesBarChart.focus.select(".x.axis")
      .transition()
      .duration(100)
      .call(this.state.chart.categoriesBarChart.axises.xAxis);

    this.state.chart.categoriesLineChart.store.select(".x.axis")
      .transition()
      .duration(100)
      .call(this.state.chart.categoriesLineChart.axises.xAxis);

    this.state.chart.mainBarChart.store.select(".x.axis")
      .transition()
      .duration(100)
      .call(this.state.chart.mainBarChart.axises.xAxis);

    this._update();
    this._exit();
    this._enter();

    this._updateCategoriesLineChart();
    this._exitCategoriesLineChart();
    this._enterCategoriesLineChart();

    this._updateMainBarChart();
    this._exitMainBarChart();
    this._enterMainBarChart();

    this.state.chart.categoriesBarChart.focus.selectAll(".x.axis .tick text")
      //.attr("x", 4)
      .attr("dy", 24);

    this.state.chart.categoriesLineChart.store.selectAll(".x.axis .tick text")
      //.attr("x", 4)
      .attr("dy", 24);

    this.state.chart.mainBarChart.store.selectAll(".x.axis .tick text")
      //.attr("x", 4)
      .attr("dy", 24);
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////

  _getMainData = ()=> {

    let data = this.state.general.filter((item, i)=> {
      if (this.state.selectedDates.length === 0) {
        return true;
      } else {
        return ~this.state.selectedDates.indexOf(item.date);
      }
    });

    var dates = (this.state.general.map(function (item, i) {
      return item.date;
    })).filter((item)=> {
      if (this.state.selectedDates.length > 0) {
        for (let i = 0; i < this.state.selectedDates.length; i++) {
          if (item == this.state.selectedDates[i]) {
            return true;
          }
        }
        return false;
      }
      return true;
    });

    return {
      dates: dates,
      data: data,
    }
  }

  _getData = ()=> {
    let categoricallyData = (this.state.categories.map((item, i)=> {
      return item.statistics.results.filter((item, i)=> {
        if (this.state.selectedDates.length === 0) {
          return true;
        } else {
          return ~this.state.selectedDates.indexOf(item.date);
        }
      }).map((item, i)=> {
        return item;
      });
    })).filter((item)=>this.state.selectedCategories[item[0].category.category]);

    let data = d3.merge(this.state.categories.map((item, i)=> {
      return item.statistics.results.filter((item, i)=> {
        if (this.state.selectedDates.length === 0) {
          return true;
        } else {
          return ~this.state.selectedDates.indexOf(item.date);
        }
      }).map((item, i)=> {
        return item;
      });
    })).filter((item)=>item.category&&this.state.selectedCategories[item.category.category]);

    var dates = (this.state.categories[0].statistics.results.map(function (item, i) {
      return item.date;
    })).filter((item)=> {
      if (this.state.selectedDates.length > 0) {
        for (let i = 0; i < this.state.selectedDates.length; i++) {
          if (item == this.state.selectedDates[i]) {
            return true;
          }
        }
        return false;
      }
      return true;
    });

    var categories = this.state.categories.map(function (item, i) {
      return item.category;
    }).filter((item)=> this.state.selectedCategories[item]);

    return {
      dates: dates,
      categories: categories,
      data: data,
      categoricallyData: categoricallyData
    }
  }

  _getAllData = ()=> {
    let data = d3.merge(this.state.categories.map((item, i)=> {
      return item.statistics.results.map((item, i)=> {
        return item;
      });
    }));

    var dates = (this.state.categories[0].statistics.results.map(function (item, i) {
      return item.date;
    }));

    var categories = this.state.categories.map(function (item, i) {
      return item.category;
    });

    return {
      dates: dates,
      categories: categories,
      data: data
    }
  }

  _getAllCategories() {
    return this.state.categories.map(function (item, i) {
      return item.category;
    });
  }

  _keyCategory = (d)=> {
    return (d.category.category + '-' + d.date).replace('-', '');
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////

  _updateCategories() {
    let {data} = this._getAllData();

    // render categories
    let categoryStore = d3.select(this.state.parent).select('.categories-store');
    let categoriesDiv = categoryStore.selectAll('.category-item');

    categoriesDiv.classed('checked', (d)=>this.state.selectedCategories[d]);
    categoriesDiv.selectAll('.color')
      .style('background-color', (d)=> {
        return this.state.selectedCategories[d] ? this.state.color(+d) : 'grey';
      });

    categoriesDiv.selectAll('.name')
      .text((d) => {
        let dataItem = 0;
        for (let i = 0; i < data.length; i++) {
          if (data[i].category && data[i].category.category == d && data[i].date == this.state.hoveredDate) {
            dataItem = data[i].category.debt.value;
            break;
          }
        }
        return 'Категория ' + d + ' = ' + Math.round(dataItem / 10000) / 100 + ' млн. р. за ' + (utils.dc(this.state.hoveredDate, 2));
      });
  }

  // categories bar chart ///////////////////////////////////////////////////////////////////////////////////////////////

  _initializeScales() {
    let {data, dates, categories} = this._getData();

    this.state.color = d3.scale.ordinal()
      .range([Colors.indigo500, Colors.teal500, Colors.yellow500, Colors.amber500, Colors.orange500, Colors.deepOrange500]);

    // scales
    this.state.chart.categoriesBarChart.scales.x0 = d3.scale.ordinal()
      .rangeRoundBands([0, this.state.chart.categoriesBarChart.sizes.width], .1);

    this.state.chart.categoriesBarChart.scales.x1 = d3.scale.ordinal();

    this.state.chart.categoriesBarChart.scales.y = d3.scale.linear()
      .range([this.state.chart.categoriesBarChart.sizes.height, 0]);

    this.state.chart.brushChart.scales.x0 = d3.scale.ordinal()
      .rangeRoundBands([0, this.state.chart.categoriesBarChart.sizes.width], .1);

    this.state.chart.brushChart.scales.x1 = d3.scale.ordinal();

    this.state.chart.brushChart.scales.y = d3.scale.linear()
      .range([this.state.chart.brushChart.sizes.height, 0]);

    this.state.chart.categoriesBarChart.axises.xAxis = d3.svg.axis()
      .scale(this.state.chart.categoriesBarChart.scales.x0)
      .tickSize(-this.state.chart.categoriesBarChart.sizes.height, 0)
      .orient("bottom")
      .tickFormat((d) => {
        return utils.dc(d, 2);
      });

    this.state.chart.brushChart.axises.xAxis = d3.svg.axis()
      .scale(this.state.chart.brushChart.scales.x0)
      .tickSize(-this.state.chart.brushChart.sizes.height, 0)
      .orient("bottom")
      .tickFormat((d) => {
        return utils.dc(d, 2);
      });

    this.state.chart.categoriesBarChart.axises.yAxis = d3.svg.axis()
      .scale(this.state.chart.categoriesBarChart.scales.y)
      .ticks(3)
      .orient("right")
      .tickSize(this.state.chart.categoriesBarChart.sizes.width, 0)
      .tickFormat((d) => {
        return Math.round(d / 10000) / 100;
      });

    this.state.chart.categoriesBarChart.scales.x0.domain(dates);
    this.state.chart.categoriesBarChart.scales.x1.domain(categories).rangeRoundBands([0, this.state.chart.categoriesBarChart.scales.x0.rangeBand()]);
    this.state.chart.categoriesBarChart.scales.y.domain([0, d3.max(data, (d) => {
      return +d.category.debt.value;
    })]);

    this.state.chart.brushChart.scales.x0.domain(dates);
    this.state.chart.brushChart.scales.x1.domain(categories).rangeRoundBands([0, this.state.chart.categoriesBarChart.scales.x0.rangeBand()]);
    this.state.chart.brushChart.scales.y.domain([0, d3.max(data, (d) => {
      return +d.category.debt.value;
    })]);
  }

  _initializeFocus() {
    let {data, dates, categories} = this._getData();

    // render focus
    this.state.chart.categoriesBarChart.focus = this.state.chart.categoriesBarChart.svg.append("g")
      .attr("class", "focus")
      .attr("transform", "translate(" + this.state.chart.categoriesBarChart.sizes.margin.left + "," + this.state.chart.categoriesBarChart.sizes.margin.top + ")");

    //this._initializeTooltip();

    this.state.chart.categoriesBarChart.focusDatesData = this.state.chart.categoriesBarChart.focus.append("g")
      .attr("class", "dates");

    this.state.chart.categoriesBarChart.focus.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + this.state.chart.categoriesBarChart.sizes.height + ")")
      .call(this.state.chart.categoriesBarChart.axises.xAxis);

    this.state.chart.categoriesBarChart.focus.append("g")
      .attr("class", "y axis")
      .call(this.state.chart.categoriesBarChart.axises.yAxis)
      .append("text")
      //.attr("transform", "rotate(-90)")
      .attr("y", -20)
      .attr('x', 180)
      .attr("dy", ".71em")
      .style('opacity', '.6')
      .style("text-anchor", "end")
      .text("Задолженность, млн. ₽");

    this.state.chart.categoriesBarChart.focus.selectAll(".y.axis .tick text")
      .attr("x", 4)
      .attr("dy", -4);

    this.state.chart.categoriesBarChart.focus.selectAll(".x.axis .tick text")
      //.attr("x", 4)
      .attr("dy", 24);

    this.state.chart.categoriesBarChart.focusData = this.state.chart.categoriesBarChart.focus.append("g")
      .attr("class", "data");

    this.state.chart.categoriesBarChart.focusHoverableData = this.state.chart.categoriesBarChart.focus.append("g")
      .attr("class", "dates_hoverable");

  }

  _update = ()=> {
    let {data, dates, categories} = this._getData();

    this.state.chart.categoriesBarChart.focusHoverableData.selectAll(".date-store_hoverable")
      .data(dates, (d, i)=>+d.split('-').join(''))
      .attr("transform", (d) => {
        return "translate(" + this.state.chart.categoriesBarChart.scales.x0(d) + ",0)";
      })

    this.state.chart.categoriesBarChart.focusHoverableData.selectAll(".date-store_hoverable").selectAll('.date-rect')
      .attr("width", this.state.chart.categoriesBarChart.scales.x0.rangeBand() + 14);


    this.state.chart.categoriesBarChart.focusDatesData.selectAll(".date-store")
      .data(dates, (d, i)=>+d.split('-').join(''))
      .classed('highlight', (d, i) =>  d.split('-')[1] % 2)
      .attr("transform", (d) => {
        return "translate(" + this.state.chart.categoriesBarChart.scales.x0(d) + ",0)";
      })

    this.state.chart.categoriesBarChart.focusDatesData.selectAll(".date-store").selectAll('.date-rect')
      .attr("width", this.state.chart.categoriesBarChart.scales.x0.rangeBand() + 14);


    this.state.chart.categoriesBarChart.focusData.selectAll(".focus-store")
      .data(data, this._keyCategory)
      .attr("transform", (d) => {
        return "translate(" + this.state.chart.categoriesBarChart.scales.x0(d.date) + ",0)";
      });

    this.state.chart.categoriesBarChart.focusData.selectAll(".focus-store").selectAll(".valued-rect")
      .attr("width", this.state.chart.categoriesBarChart.scales.x1.rangeBand() > 10 ? 10 : this.state.chart.categoriesBarChart.scales.x1.rangeBand())
      .attr("x", (d) => {
        return this.state.chart.categoriesBarChart.scales.x1(d.category.category) + (this.state.chart.categoriesBarChart.scales.x1.rangeBand() - (this.state.chart.categoriesBarChart.scales.x1.rangeBand() > 10 ? 10 : this.state.chart.categoriesBarChart.scales.x1.rangeBand())) / 2;
      })
      .style("fill", (d) => {
        return this.state.color(d.category.category);
      });
    this.state.chart.categoriesBarChart.focusData.selectAll(".focus-store").selectAll(".action-rect")
      .attr("width", this.state.chart.categoriesBarChart.scales.x1.rangeBand())
      .attr("x", (d) => {
        return this.state.chart.categoriesBarChart.scales.x1(d.category.category) + (this.state.chart.categoriesBarChart.scales.x1.rangeBand() - (this.state.chart.categoriesBarChart.scales.x1.rangeBand() > 10 ? 10 : this.state.chart.categoriesBarChart.scales.x1.rangeBand())) / 2;
      })
      .attr("y", (d) => {
        return 0;
      })
      .attr("height", (d) => {
        return this.state.chart.categoriesBarChart.sizes.height;
      })
      .style("fill", (d) => {
        return 'rgba(0,0,0,0)';
      });
    this.state.chart.categoriesBarChart.focusData.selectAll(".focus-store").selectAll('text')
      .text((d) => {
        return d.category.category
      })
      .attr('y', (d) => {
        return this.state.chart.categoriesBarChart.scales.y(0) + 12;
      })
      .attr('x', (d) => {
        return this.state.chart.categoriesBarChart.scales.x1(d.category.category) + (this.state.chart.categoriesBarChart.scales.x1.rangeBand() - (this.state.chart.categoriesBarChart.scales.x1.rangeBand() > 10 ? 10 : this.state.chart.categoriesBarChart.scales.x1.rangeBand())) / 2 + 2;
      });

  }

  _enter = ()=> {
    let {data, dates, categories} = this._getData();

    this.state.chart.categoriesBarChart.dateHoverableStore = this.state.chart.categoriesBarChart.focusHoverableData.selectAll(".date-store_hoverable")
      .data(dates, (d, i)=>+d.split('-').join(''))
      .enter().append("g")
      .attr("class", "date-store_hoverable")
      .attr("transform", (d) => {
        return "translate(" + this.state.chart.categoriesBarChart.scales.x0(d) + ",0)";
      });

    this.state.chart.categoriesBarChart.dateHoverableStore.append("rect")
      .classed('date-rect', true)
      .attr("width", this.state.chart.categoriesBarChart.scales.x0.rangeBand() + 14)
      .attr("x", (d) => {
        return -7;
      })
      .attr("y", (d) => {
        return 0;
      })
      .attr("height", (d) => {
        return this.state.chart.categoriesBarChart.sizes.height;
      })
      .on('mouseenter', (d) => {
        this.state.hoveredDate = d;
        this._updateCategories();
      })
      .on('mouseleave', (d) => {

      });

    this.state.chart.categoriesBarChart.dateStore = this.state.chart.categoriesBarChart.focusDatesData.selectAll(".date-store")
      .data(dates, (d, i)=>+d.split('-').join(''))
      .enter().append("g")
      .attr("class", "date-store")
      .classed('highlight', (d, i) => d.split('-')[1] % 2)
      .attr("transform", (d) => {
        return "translate(" + this.state.chart.categoriesBarChart.scales.x0(d) + ",0)";
      });

    this.state.chart.categoriesBarChart.dateStore.append("rect")
      .classed('date-rect', true)
      .attr("width", this.state.chart.categoriesBarChart.scales.x0.rangeBand() + 14)
      .attr("x", (d) => {
        return -7;
      })
      .attr("y", (d) => {
        return 0;
      })
      .attr("height", (d) => {
        return this.state.chart.categoriesBarChart.sizes.height;
      });

    this.state.chart.categoriesBarChart.focusStore = this.state.chart.categoriesBarChart.focusData.selectAll(".focus-store")
      .data(data, this._keyCategory)
      .enter().append("g")
      .attr("class", "focus-store")
      .attr("transform", (d) => {
        return "translate(" + this.state.chart.categoriesBarChart.scales.x0(d.date) + ",0)";
      });

    this.state.chart.categoriesBarChart.focusStore.append("rect")
      .classed('valued-rect', true)
      .attr("width", this.state.chart.categoriesBarChart.scales.x1.rangeBand() > 10 ? 10 : this.state.chart.categoriesBarChart.scales.x1.rangeBand())
      .attr("x", (d) => {
        return this.state.chart.categoriesBarChart.scales.x1(d.category.category) + (this.state.chart.categoriesBarChart.scales.x1.rangeBand() - (this.state.chart.categoriesBarChart.scales.x1.rangeBand() > 10 ? 10 : this.state.chart.categoriesBarChart.scales.x1.rangeBand())) / 2;
      })
      .attr("y", (d) => {
        return this.state.chart.categoriesBarChart.scales.y(+d.category.debt.value);
      })
      .attr("height", (d) => {
        return this.state.chart.categoriesBarChart.sizes.height - this.state.chart.categoriesBarChart.scales.y(+d.category.debt.value);
      })
      .style("fill", (d) => {
        return this.state.color(d.category.category);
      });
    this.state.chart.categoriesBarChart.focusStore.append('text')
      .text((d) => {
        return d.category.category
      })
      .attr('y', (d) => {
        return this.state.chart.categoriesBarChart.scales.y(0) + 12;
      })
      .attr('x', (d) => {
        return this.state.chart.categoriesBarChart.scales.x1(d.category.category) + (this.state.chart.categoriesBarChart.scales.x1.rangeBand() - (this.state.chart.categoriesBarChart.scales.x1.rangeBand() > 10 ? 10 : this.state.chart.categoriesBarChart.scales.x1.rangeBand())) / 2 + 2;
      });
    this.state.chart.categoriesBarChart.focusStore.append("rect")
      .classed('action-rect', true)
      .attr("width", this.state.chart.categoriesBarChart.scales.x1.rangeBand())
      .attr("x", (d) => {
        return this.state.chart.categoriesBarChart.scales.x1(d.category.category) + (this.state.chart.categoriesBarChart.scales.x1.rangeBand() - (this.state.chart.categoriesBarChart.scales.x1.rangeBand() > 10 ? 10 : this.state.chart.categoriesBarChart.scales.x1.rangeBand())) / 2;
      })
      .attr("y", (d) => {
        return 0;
      })
      .attr("height", (d) => {
        return this.state.chart.categoriesBarChart.sizes.height;
      })
      .style("fill", (d) => {
        return 'rgba(0,0,0,0)';
      });
  }

  _exit = ()=> {
    let {data, dates, categories} = this._getData();

    this.state.chart.categoriesBarChart.focusDatesData.selectAll(".date-store")
      .data(dates, (d, i)=>+d.split('-').join(''))
      .exit()
      .remove();

    this.state.chart.categoriesBarChart.focusHoverableData.selectAll(".date-store_hoverable")
      .data(dates, (d, i)=>+d.split('-').join(''))
      .exit()
      .remove();

    this.state.chart.categoriesBarChart.focusData.selectAll(".focus-store")
      .data(data, this._keyCategory)
      .exit()
      .remove();
  }

  // categories line chart ///////////////////////////////////////////////////////////////////////////////////////////////

  _initializeCategoriesLineChartScales() {
    let {data, dates, categories} = this._getData();

    // scales

    this.state.chart.categoriesLineChart.scales.x0 = d3.scale.ordinal()
      .rangeRoundBands([0, this.state.chart.categoriesLineChart.sizes.width], .1);

    this.state.chart.categoriesLineChart.scales.y = d3.scale.linear()
      .range([this.state.chart.categoriesLineChart.sizes.height, 0]);

    this.state.chart.categoriesLineChart.axises.xAxis = d3.svg.axis()
      .scale(this.state.chart.categoriesLineChart.scales.x0)
      .tickSize(-this.state.chart.categoriesLineChart.sizes.height, 0)
      .orient("bottom")
      .tickFormat((d) => {
        return utils.dc(d, 2);
      });

    this.state.chart.categoriesLineChart.axises.yAxis = d3.svg.axis()
      .scale(this.state.chart.categoriesLineChart.scales.y)
      .ticks(3)
      .orient("right")
      .tickSize(this.state.chart.categoriesLineChart.sizes.width, 0)
      .tickFormat((d) => {
        return Math.round(d / 10000) / 100;
      });

    this.state.chart.categoriesLineChart.scales.x0.domain(dates);
    this.state.chart.categoriesLineChart.scales.y.domain([0, d3.max(data, (d) => {
      return d.category && +d.category.debt.value;
    })]);

  }

  _initializeFocusCategoriesLineChart() {
    let {data, dates, categories} = this._getData();

    // render focus
    this.state.chart.categoriesLineChart.store = this.state.chart.categoriesLineChart.svg.append("g")
      .attr("class", "line-chart")
      .attr("transform", "translate(" + this.state.chart.mainBarChart.sizes.margin.left + "," + this.state.chart.mainBarChart.sizes.margin.top + ")");

    this.state.chart.categoriesLineChart.dates = this.state.chart.categoriesLineChart.store.append("g")
      .attr("class", "dates");

    this.state.chart.categoriesLineChart.store.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + this.state.chart.categoriesLineChart.sizes.height + ")")
      .call(this.state.chart.categoriesLineChart.axises.xAxis);

    this.state.chart.categoriesLineChart.store.append("g")
      .attr("class", "y axis")
      .call(this.state.chart.categoriesLineChart.axises.yAxis)
      .append("text")
      .attr("y", -20)
      .attr('x', 180)
      .attr("dy", ".71em")
      .style('opacity', '.6')
      .style("text-anchor", "end")
      .text("Задолженность, млн. ₽");

    this.state.chart.categoriesLineChart.store.selectAll(".y.axis .tick text")
      .attr("x", 4)
      .attr("dy", -4);

    this.state.chart.categoriesLineChart.store.selectAll(".x.axis .tick text")
      .attr("dy", 24);

    this.state.chart.categoriesLineChart.data = this.state.chart.categoriesLineChart.store.append("g")
      .attr("class", "data");

    this.state.chart.categoriesLineChart.hoverableDates = this.state.chart.categoriesLineChart.store.append("g")
      .attr("class", "dates_hoverable");

    this.state.chart.categoriesLineChart.line = d3.svg.line()
      .x((d) => {
        return this.state.chart.categoriesLineChart.scales.x0(d.date) + this.state.chart.categoriesLineChart.scales.x0.rangeBand() / 2;
      })
      .y((d) => {
        return this.state.chart.categoriesLineChart.scales.y(d.category && +d.category.debt.value);
      });

  }

  _updateCategoriesLineChart = ()=> {
    let {data, dates, categories, categoricallyData} = this._getData();

    this.state.chart.categoriesLineChart.hoverableDates.selectAll(".date-store_hoverable")
      .data(dates, (d, i)=>+d.split('-').join(''))
      .attr("class", "date-store_hoverable")
      .attr("transform", (d) => {
        return "translate(" + this.state.chart.categoriesLineChart.scales.x0(d) + ",0)";
      });

    this.state.chart.categoriesLineChart.hoverableDates.selectAll(".date-store_hoverable").selectAll("rect")
      .attr("width", this.state.chart.categoriesLineChart.scales.x0.rangeBand() + 14)
      .attr("x", (d) => {
        return -7;
      })
      .attr("y", (d) => {
        return 0;
      })
      .attr("height", (d) => {
        return this.state.chart.categoriesLineChart.sizes.height;
      });

    this.state.chart.categoriesLineChart.dates.selectAll(".date-store")
      .data(dates, (d, i)=>+d.split('-').join(''))
      .classed('highlight', (d, i) =>  d.split('-')[1] % 2)
      .attr("transform", (d) => {
        return "translate(" + this.state.chart.categoriesLineChart.scales.x0(d) + ",0)";
      });

    this.state.chart.categoriesLineChart.dates.selectAll(".date-store").selectAll("rect")
      .attr("width", this.state.chart.categoriesLineChart.scales.x0.rangeBand() + 14)
      .attr("x", (d) => {
        return -7;
      })
      .attr("y", (d) => {
        return 0;
      })
      .attr("height", (d) => {
        return this.state.chart.categoriesLineChart.sizes.height;
      });

    let self = this;
    this.state.chart.categoriesLineChart.data.selectAll('.data-store')
      .data(categoricallyData, (d, i)=>d[0].category.category)
      .each(function (d) {
      d3.select(this)
        .select('path').datum(d)
        .classed('new', true)
        .attr("d", (d)=> {
          return self.state.chart.categoriesLineChart.line(d)
        })
    })
  }

  _enterCategoriesLineChart = ()=> {
    let {data, dates, categories, categoricallyData} = this._getData();

    this.state.chart.categoriesLineChart.dateHoverableStore = this.state.chart.categoriesLineChart.hoverableDates.selectAll(".date-store_hoverable")
      .data(dates, (d, i)=>+d.split('-').join(''))
      .enter().append("g")
      .attr("class", "date-store_hoverable")
      .attr("transform", (d) => {
        return "translate(" + this.state.chart.categoriesLineChart.scales.x0(d) + ",0)";
      });

    this.state.chart.categoriesLineChart.dateHoverableStore.append("rect")
      .classed('date-rect', true)
      .attr("width", this.state.chart.categoriesLineChart.scales.x0.rangeBand() + 14)
      .attr("x", (d) => {
        return -7;
      })
      .attr("y", (d) => {
        return 0;
      })
      .attr("height", (d) => {
        return this.state.chart.categoriesLineChart.sizes.height;
      })
      .on('mouseenter', (d) => {
        this.state.hoveredDate = d;
        this._updateCategories();
      })
      .on('mouseleave', (d) => {

      });

    this.state.chart.categoriesLineChart.dateStore = this.state.chart.categoriesLineChart.dates.selectAll(".date-store")
      .data(dates, (d, i)=>+d.split('-').join(''))
      .enter().append("g")
      .attr("class", "date-store")
      .classed('highlight', (d, i) =>  d.split('-')[1] % 2)
      .attr("transform", (d) => {
        return "translate(" + this.state.chart.categoriesLineChart.scales.x0(d) + ",0)";
      });

    this.state.chart.categoriesLineChart.dateStore.append("rect")
      .classed('date-rect', true)
      .attr("width", this.state.chart.categoriesLineChart.scales.x0.rangeBand() + 14)
      .attr("x", (d) => {
        return -7;
      })
      .attr("y", (d) => {
        return 0;
      })
      .attr("height", (d) => {
        return this.state.chart.categoriesLineChart.sizes.height;
      });

    this.state.chart.categoriesLineChart.data.selectAll('.data-store')
      .data(categoricallyData, (d, i)=>d[0].category.category)
      .enter().append('g')
      .classed('data-store', true)
      .append('path')
      .attr("class", "line data")
      .attr("d", this.state.chart.categoriesLineChart.line)
      .style('stroke', (d)=> {
        return this.state.color(d[0].category.category);
      });
  }

  _exitCategoriesLineChart = ()=> {
    let {data, dates, categories, categoricallyData} = this._getData();

    this.state.chart.categoriesLineChart.dates.selectAll(".date-store")
      .data(dates, (d, i)=>+d.split('-').join(''))
      .exit()
      .remove();

    this.state.chart.categoriesLineChart.hoverableDates.selectAll(".date-store_hoverable")
      .data(dates, (d, i)=>+d.split('-').join(''))
      .exit()
      .remove();

    this.state.chart.categoriesLineChart.data.selectAll(".data-store")
      .data(categoricallyData, (d, i)=>d[0].category.category)
      .exit()
      .remove();
  }

  // main bar chart ///////////////////////////////////////////////////////////////////////////////////////////////

  _initializeMainBarChartScales() {
    let {data, dates} = this._getMainData();

    // scales
    this.state.chart.mainBarChart.scales.x0 = d3.scale.ordinal()
      .rangeRoundBands([0, this.state.chart.mainBarChart.sizes.width], .1);

    this.state.chart.mainBarChart.scales.y = d3.scale.linear()
      .range([this.state.chart.mainBarChart.sizes.height, 0]);

    this.state.chart.mainBarChart.axises.xAxis = d3.svg.axis()
      .scale(this.state.chart.mainBarChart.scales.x0)
      .tickSize(-this.state.chart.mainBarChart.sizes.height, 0)
      .orient("bottom")
      .tickFormat((d) => {
        return utils.dc(d, 2);
      });

    this.state.chart.mainBarChart.axises.yAxis = d3.svg.axis()
      .scale(this.state.chart.mainBarChart.scales.y)
      .ticks(3)
      .orient("right")
      .tickSize(this.state.chart.mainBarChart.sizes.width, 0)
      .tickFormat((d) => {
        return Math.round(d / 10000) / 100;
      });

    this.state.chart.mainBarChart.scales.x0.domain(dates);
    this.state.chart.mainBarChart.scales.y.domain([0, d3.max(data, (d) => {
      return +d.generalDebt;
    })]);

  }

  _initializeFocusMainBarChart() {
    let {data, dates} = this._getMainData();

    // render focus
    this.state.chart.mainBarChart.store = this.state.chart.mainBarChart.svg.append("g")
      .attr("class", "main-bar-chart")
      .attr("transform", "translate(" + this.state.chart.mainBarChart.sizes.margin.left + "," + this.state.chart.mainBarChart.sizes.margin.top + ")");

    this.state.chart.mainBarChart.dates = this.state.chart.mainBarChart.store.append("g")
      .attr("class", "dates");

    this.state.chart.mainBarChart.store.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + this.state.chart.mainBarChart.sizes.height + ")")
      .call(this.state.chart.mainBarChart.axises.xAxis);

    this.state.chart.mainBarChart.store.append("g")
      .attr("class", "y axis")
      .call(this.state.chart.mainBarChart.axises.yAxis)
      .append("text")
      .attr("y", -20)
      .attr('x', 234)
      .attr("dy", ".71em")
      .style('opacity', '.6')
      .style("text-anchor", "end")
      .text("Общая задолженность, млн. ₽");

    this.state.chart.mainBarChart.store.selectAll(".y.axis .tick text")
      .attr("x", 4)
      .attr("dy", -4);

    this.state.chart.mainBarChart.store.selectAll(".x.axis .tick text")
      .attr("dy", 24);

    this.state.chart.mainBarChart.data = this.state.chart.mainBarChart.store.append("g")
      .attr("class", "data");

    this.state.chart.mainBarChart.hoverableDates = this.state.chart.mainBarChart.store.append("g")
      .attr("class", "dates_hoverable");


  }

  _updateMainBarChart = ()=> {
    let {data, dates} = this._getMainData();

    this.state.chart.mainBarChart.hoverableDates.selectAll(".date-store_hoverable")
      .data(dates, (d, i)=>+d.split('-').join(''))
      .attr("class", "date-store_hoverable")
      .attr("transform", (d) => {
        return "translate(" + this.state.chart.mainBarChart.scales.x0(d) + ",0)";
      });

    this.state.chart.mainBarChart.hoverableDates.selectAll(".date-store_hoverable").selectAll("rect")
      .attr("width", this.state.chart.mainBarChart.scales.x0.rangeBand() + 14)
      //.attr("x", (d) => {
      //  return -7;
      //})
      //.attr("y", (d) => {
      //  return 0;
      //})
      .attr("height", (d) => {
        return this.state.chart.mainBarChart.sizes.height;
      });

    this.state.chart.mainBarChart.dates.selectAll(".date-store")
      .data(dates, (d, i)=>+d.split('-').join(''))
      .classed('highlight', (d, i) =>  d.split('-')[1] % 2)
      .attr("transform", (d) => {
        return "translate(" + this.state.chart.mainBarChart.scales.x0(d) + ",0)";
      });

    this.state.chart.mainBarChart.dates.selectAll(".date-store").selectAll("rect")
      .attr("width", this.state.chart.mainBarChart.scales.x0.rangeBand() + 14)
      //.attr("x", (d) => {
      //  return -7;
      //})
      //.attr("y", (d) => {
      //  return 0;
      //})
      .attr("height", (d) => {
        return this.state.chart.mainBarChart.sizes.height;
      });

    this.state.chart.mainBarChart.data.selectAll(".data-store")
      .data(data, (d, i)=>+d.date.split('-').join(''))
      .attr("transform", (d) => {
        return "translate(" + this.state.chart.mainBarChart.scales.x0(d.date) + ",0)";
      });

    this.state.chart.mainBarChart.data.selectAll(".data-store").selectAll(".valued-rect")
      .attr("width", this.state.chart.mainBarChart.scales.x0.rangeBand() > 25 ? 25 : this.state.chart.mainBarChart.scales.x0.rangeBand())
      .attr("x", (d) => {
        return (this.state.chart.mainBarChart.scales.x0.rangeBand() - (this.state.chart.mainBarChart.scales.x0.rangeBand() > 25 ? 25 : this.state.chart.mainBarChart.scales.x0.rangeBand())) / 2;
      })
    this.state.chart.mainBarChart.data.selectAll(".data-store").selectAll(".action-rect")
      .attr("width", this.state.chart.mainBarChart.scales.x0.rangeBand())
      //.attr("x", (d) => {
      //  return this.state.chart.mainBarChart.scales.x0(d.date) + (this.state.chart.mainBarChart.scales.x0.rangeBand() - (this.state.chart.mainBarChart.scales.x0.rangeBand() > 25 ? 25 : this.state.chart.mainBarChart.x0.rangeBand())) / 2;
      //})
      .attr("y", (d) => {
        return 0;
      })
      .attr("height", (d) => {
        return this.state.chart.mainBarChart.sizes.height;
      });
    this.state.chart.mainBarChart.data.selectAll(".data-store").selectAll('text')
      .text((d) => {
        return Math.round(d.generalDebt / 10000) / 100 + ' млн. ₽'
      })
      .attr('y', (d) => {
        return this.state.chart.mainBarChart.scales.y(0) + 12;
      })
      //.attr('x', (d) => {
      //  return this.state.chart.mainBarChart.scales.x0(d.data) + (this.state.chart.mainBarChart.scales.x0.rangeBand() - (this.state.chart.mainBarChart.scales.x0.rangeBand() > 10 ? 10 : this.state.chart.mainBarChart.scales.x0.rangeBand())) / 2 + 2;
      //});

  }

  _enterMainBarChart = ()=> {
    let {data, dates} = this._getMainData();

    this.state.chart.mainBarChart.dateHoverableStore = this.state.chart.mainBarChart.hoverableDates.selectAll(".date-store_hoverable")
      .data(dates, (d, i)=>+d.split('-').join(''))
      .enter().append("g")
      .attr("class", "date-store_hoverable")
      .attr("transform", (d) => {
        return "translate(" + this.state.chart.mainBarChart.scales.x0(d) + ",0)";
      });

    this.state.chart.mainBarChart.dateHoverableStore.append("rect")
      .classed('date-rect', true)
      .attr("width", this.state.chart.mainBarChart.scales.x0.rangeBand() + 14)
      .attr("x", (d) => {
        return -7;
      })
      .attr("y", (d) => {
        return 0;
      })
      .attr("height", (d) => {
        return this.state.chart.mainBarChart.sizes.height;
      })
      .on('mouseenter', (d) => {
        this.state.hoveredDate = d;
        this._updateCategories();
      })
      .on('mouseleave', (d) => {

      });

    this.state.chart.mainBarChart.dateStore = this.state.chart.mainBarChart.dates.selectAll(".date-store")
      .data(dates, (d, i)=>+d.split('-').join(''))
      .enter().append("g")
      .attr("class", "date-store")
      .classed('highlight', (d, i) =>  d.split('-')[1] % 2)
      .attr("transform", (d) => {
        return "translate(" + this.state.chart.mainBarChart.scales.x0(d) + ",0)";
      });

    this.state.chart.mainBarChart.dateStore.append("rect")
      .classed('date-rect', true)
      .attr("width", this.state.chart.mainBarChart.scales.x0.rangeBand() + 14)
      .attr("x", (d) => {
        return -7;
      })
      .attr("y", (d) => {
        return 0;
      })
      .attr("height", (d) => {
        return this.state.chart.mainBarChart.sizes.height;
      });

    this.state.chart.mainBarChart.dataStore = this.state.chart.mainBarChart.data.selectAll(".data-store")
      .data(data, (d, i)=>+d.date.split('-').join(''))
      .enter().append("g")
      .attr("class", "data-store")
      .attr("transform", (d) => {
        return "translate(" + this.state.chart.mainBarChart.scales.x0(d.date) + ",0)";
      });

    this.state.chart.mainBarChart.dataStore.append("rect")
      .classed('valued-rect', true)
      .attr("width", this.state.chart.mainBarChart.scales.x0.rangeBand() > 25 ? 25 : this.state.chart.mainBarChart.scales.x0.rangeBand())
      .attr("x", (d) => {
        return (this.state.chart.mainBarChart.scales.x0.rangeBand() - (this.state.chart.mainBarChart.scales.x0.rangeBand() > 25 ? 25 : this.state.chart.mainBarChart.scales.x0.rangeBand())) / 2;
      })
      .attr("y", (d) => {
        return this.state.chart.mainBarChart.scales.y(+d.generalDebt);
      })
      .attr("height", (d) => {
        return this.state.chart.mainBarChart.sizes.height - this.state.chart.mainBarChart.scales.y(+d.generalDebt);
      })
      .style("fill", (d) => {
        return this.state.color(1);
      });
    this.state.chart.mainBarChart.dataStore.append('text')
      .text((d) => {
        return Math.round(d.generalDebt / 10000) / 100 + ' млн. ₽'
      })
      .attr('y', (d) => {
        return this.state.chart.mainBarChart.scales.y(0) + 12;
      })
      //.attr('x', (d) => {
      //  return this.state.chart.mainBarChart.scales.x0(d.date) + (this.state.chart.mainBarChart.scales.x0.rangeBand() - (this.state.chart.mainBarChart.scales.x0.rangeBand() > 25 ? 25 : this.state.chart.mainBarChart.scales.x0.rangeBand())) / 2 + 2;
      //});
    this.state.chart.mainBarChart.dataStore.append("rect")
      .classed('action-rect', true)
      .attr("width", this.state.chart.categoriesBarChart.scales.x0.rangeBand())
      //.attr("x", (d) => {
      //  return this.state.scales.x0(d.category.category) + (this.state.scales.x1.rangeBand() - (this.state.scales.x1.rangeBand() > 10 ? 10 : this.state.scales.x1.rangeBand())) / 2;
      //})
      //.attr("y", (d) => {
      //  return 0;
      //})
      .attr("height", (d) => {
        return this.state.chart.mainBarChart.sizes.height;
      })
      .style("fill", (d) => {
        return 'rgba(0,0,0,0)';
      });
  }

  _exitMainBarChart = ()=> {
    let {data, dates} = this._getMainData();

    this.state.chart.mainBarChart.dates.selectAll(".date-store")
      .data(dates, (d, i)=>+d.split('-').join(''))
      .exit()
      .remove();

    this.state.chart.mainBarChart.hoverableDates.selectAll(".date-store_hoverable")
      .data(dates, (d, i)=>+d.split('-').join(''))
      .exit()
      .remove();

    this.state.chart.mainBarChart.data.selectAll(".data-store")
      .data(data, (d, i)=>+d.date.split('-').join(''))
      .exit()
      .remove();
  }
}

export default BorrowersCategoryChart