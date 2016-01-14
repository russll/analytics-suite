import React, { Component } from 'react';
import Relay from 'react-relay';
import { Paper, Card, CardActions, CardTitle, FlatButton, FontIcon, Styles } from 'material-ui';
let { Colors } = Styles;
import './CategoryCard.styl';
import Utils from '../../../lib/Utils.js';
import DonutChart from 'components/temporary/DonutChart/DonutChart.jsx';

let utils = new Utils();

class CategoryCard extends Component {
  static contextTypes = {
    history: React.PropTypes.object.isRequired,
    location: React.PropTypes.object.isRequired,
    muiTheme: React.PropTypes.object.isRequired,
  };

  componentDidMount() {
    this._renderDonut();
  }

  componentDidUpdate() {
    this._renderDonut();
  }

  _renderDonut = ()=> {
    let color = d3.scale.ordinal()
      .domain([1, 2, 3, 4, 5, 6])
      .range([Colors.indigo500, Colors.teal500, Colors.yellow500, Colors.amber500, Colors.orange500, Colors.deepOrange500]);

    d3.select(this.refs.chart).selectAll('*').remove();
    new DonutChart({
      color: color(this.props.category.category),
      parent: this.refs.chart,
      data: [
        {
          key: 'Всего',
          value: this.props.all.debt.value,
        },
        {
          key: this.props.category.category,
          value: this.props.category.debt.value,
        },
      ],
      width: 75,
      height: 75,
      margin: {top: 10, left: 10, right: 10, bottom: 10},
    });
  }

  _onOpenDashboard = (e)=> {
    e.preventDefault();
    this.context.history.pushState(null, utils.cPath('/borrowers/borrowers-report?', {
      date: this.props.date,
      group: this.props.category.category,
      entity: 'all',
      pagesize: 20,
      pagenumber: 1,
    }));
  };

  render() {

    return (
      <Card className='category-card'>

        <CardTitle
          title={'Категория ' + this.props.category.category}
          subtitle={utils.dsn(this.props.date)}/>
        <CardTitle>
          <div className='card-table card-table_top'>
            <div className='card-table__row'>
              <div className='card-table__col_width-6'>Всего, млн. ₽</div>
              <div className='card-table__col_width-6 card-table__col_align-right'>
                {Math.round(this.props.category.debt.value / 10000) / 100} = {this.props.category.debt.percent}%
              </div>
            </div>

            <div className='card-table__row'>
              <div className='card-table__col_width-6'>Просрочка, млн. ₽</div>
              <div className='card-table__col_width-6 card-table__col_align-right'>
                {Math.round(this.props.category.delinquency.value / 10000) / 100}
              </div>
            </div>

            <div className='card-table__row'>
              <div className='card-table__col_width-6'>Резервы, млн. ₽</div>
              <div className='card-table__col_width-6 card-table__col_align-right'>
                {Math.round(this.props.category.reserves.value / 10000) / 100} = {this.props.category.reserves.percent}%
              </div>
            </div>

          </div>
        </CardTitle>

        <CardTitle>
          <div className='card-table'>
            <div className='card-table__row'>
              <div className='card-table__col_width-6'></div>
              <div className='card-table__col_width-3 card-table__col_align-right'>ФЛ
                x {this.props.category.physLoaners.count}</div>
              <div className='card-table__col_width-3 card-table__col_align-right'>ЮЛ
                x {this.props.category.legalLoaners.count}</div>
            </div>
            <div className='card-table__row'>
              <div className='card-table__col_width-6'>Всего, млн. ₽</div>
              <div className='card-table__col_width-3 card-table__col_align-right'>
                {Math.round(this.props.category.physLoaners.debts.value / 10000) / 100}
              </div>
              <div className='card-table__col_width-3 card-table__col_align-right'>
                {Math.round(this.props.category.legalLoaners.debts.value / 10000) / 100}
              </div>
            </div>
            <div className='card-table__row'>
              <div className='card-table__col_width-6'>Резервы, млн. ₽</div>
              <div className='card-table__col_width-3 card-table__col_align-right'>
                {Math.round(this.props.category.physLoaners.reserves.value / 10000) / 100}
              </div>
              <div className='card-table__col_width-3 card-table__col_align-right'>
                {Math.round(this.props.category.legalLoaners.reserves.value / 10000) / 100}
              </div>
            </div>
          </div>
        </CardTitle>


        <CardActions className="category-card__buttons category-card__buttons_bottom">
          <FlatButton secondary={true} label="Подробнее" onClick={this._onOpenDashboard}/>
        </CardActions>

        <div ref="chart" className="category-card__chart"></div>
      </Card>
    );
  }

}

export default CategoryCard;
