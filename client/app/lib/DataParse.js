/*
 * File contains functions, for parse, and "humanize" incoming server data.
 */
import 'd3'
import { Styles } from 'material-ui'
import Utils from './Utils'

let { Colors } = Styles;

export default class {

  RevenueExpensesScoreTableData=(json)=>{
    var id,
        cols = {'id': 0, 'header': true, 'nesting': 0, 'show': true, 'val': {'name': ''}},
        data = {}, tables = [], table = [];


    for (let i = 0, l = json.length; i < l; i++) {
      var obj = json[i];
      id = 1;
      cols.val[obj.datestamp] = obj.datestamp;

      for (var n = 0, ln = obj.data.length; n < ln; n++) {
        id++;
        var o = obj.data[n];
        if (3 == o.nesting) continue;
        if (!data[id]) { data[id] = {'id': n + 1}; }
        data[id].nesting = o.nesting;
        data[id].type = o.type;
        data[id].show = true;
        data[id].header = false;
        if (!data[id].val) data[id].val = {};
        data[id].val.name = o.name;
        data[id].val[obj.datestamp] = o.money;
      }
    }

    for (var obj in data) {
      if (1 == data[obj].nesting) {
        table = [cols, data[obj]];
        tables.push(table);
      } else {
        table.push(data[obj]);
      }
    }

    return tables;
  };

  getBorrowersGroups = (data) =>{
    return data.map((el) => {
      return { date: el.datestamp, groups: el.groups }
    })
  }

  livingMoneySummary = (json)=> {
    let data = {
      labels: json.map((el)=> {
        return el.date.split('-').reverse().join('/');
      }),
      datasets: [
        {
          label: 'Динамика по месяцам',
          fillColor: "rgba(63,81,181,0.8)",  //"rgba(63,81,181,0.2)",
          strokeColor: Colors.indigo500,
          highlightFill:Colors.indigo500,
          highlightStroke: Colors.indigo500,
          data: json.map((el)=> {
            return isNaN(Number(el.total.value))?0:(Number(el.total.value)/1000).toFixed(0);
          })
        }
      ]
    };
    return data;
  };
  cashFlowDashboardChart = (json)=> {

    let data = {
      labels: json.dates.map((el)=> {
        return el.split('-')[1];
      }),
      datasets: [
        {
          fillColor: "#fff",
          strokeColor: '#fff',
          highlightFill: "#fff",
          highlightStroke: "#fff",
          data: json.values.map((el)=> {
            return isNaN(Number(el))?0:(Number(el)).toFixed(0);
          })
        }
      ]
    };
    return data;
  };

  livingMoneyDashboardNormalize = (json) => {
    var catNames = {
      'date': 'Дата',
      'cashBalance': 'Денежные средства в кассе',
      'fundsOnCorrespondentAccountInCB': 'Средства на корсчете в ЦБ',
      'fundsOnCorrespondentAccountInOtherBanks': 'Средства на корсчетах в иных Банках',
      'interbankLending': 'Межбанковское кредитование',
      'state': 'Государственные',
      'nonState': 'Негосударственные',
      'restOnSpecialCreditCashOffice': 'Остатки в "специальных ККО',
      'securities': 'Ценные бумаги (с учетом 12,8% дисконта)',
      'total': 'Всего'
    };
    var id, cols = {
      'id': 0,
      'header': true,
      'nesting': 0,
      'show': true,
      'val': {'name': 'Наименование'}
    }, data = {}, table = [], tables = [];

    for (var i = 0, l = json.length; i < l; i++) {
      var obj = json[i];
      id = 0;
      cols.val[obj.date] = obj.date;

      Object.keys(obj).map(function (value) {
        if ('date' === value || '__dataID__'== value) return;
        id++;
        if (!data[id]) {
          data[id] = {'id': id, 'header': false}
        }

        if (!data[id].val) data[id].val = {};

        if ('object' == typeof obj[value] && !obj[value].value) {
          data[id].val.name = catNames[value];
          data[id].nesting = 1;
          data[id].show = true;
          data[id].val[obj.date] = obj[value].total;
          var o = obj[value];

          for (var a in o) {
            if ('total' == a ||'__dataID__' == a)  continue;

            id++;
            if (!data[id]) {
              data[id] = {'id': id};
            }
            if (!data[id].val) data[id].val = {};
            data[id].val.name = catNames[a];
            data[id].nesting = 2;
            data[id].show = false;
            data[id].val[obj.date] = o[a];
          }
        } else {
          data[id].val.name = catNames[value];
          data[id].val[obj.date] = obj[value];
          data[id].nesting = 4;
          data[id].show = true;
        }

      });
    }

    table.push(cols);

    for (var obj in data) {
      if (1 == data[obj].nesting || 4 == data[obj].nesting) {
        tables.push(table);
        table = [cols, data[obj]];
      } else {
        table.push(data[obj]);
      }
    }
    tables.push(table);
    tables.shift();

    return tables;
  }


}
