import rp from 'request-promise';
import Utils from '../client/app/lib/Utils.js';

let utils = new Utils();
// Model types
// TODO: create modules for data and apis
class Analytics extends Object {
}
class BasDashboard extends Object {
}
class LivingMoneySecurities extends Object {
}
class LivingMoneySecuritiesItem extends Object {
}

class LivingMoneyInterbankLending extends Object {
}
class LivingMoneyInterbankLendingCounteragentItem extends Object {
}

class LivingMoneyOtherBanks extends Object {
}
class QualityDetail extends Object {
}
class LivingMoneyOtherBanksBankFundsItem extends Object {
}
class LivingMoneyOtherBanksBankGeneralInformationItem extends Object {
}

class CashflowTaxes extends Object {
}
class CashflowTaxesItem extends Object {
}

class CashflowClients extends Object {
}
class CashflowClient extends Object {
}
class CashflowClientBlock extends Object {
}
class CashflowClientBlockContent extends Object {
}

class CashflowDashboard extends Object {
}
class CashflowDashboardTurnover extends Object {
}
class CashflowDashboardBlockDetail extends Object {
}

class LivingMoneyDashboard extends Object {
}
class LivingMoneyDashboardItem extends Object {
}
class StateDetail extends Object {
}

class Asset extends Object {
}
class AssetsDashboard extends Object {
}

class RevenuesExpenses extends Object {
}
class RevenuesExpensesGroup extends Object {
}
class RevenuesExpensesData extends Object {
}
class RevenuesExpensesDashboard extends Object {
}
class BorrowersSingleGroup extends Object {
}
class BorrowersSingleGroupItem extends Object {
}
class BorrowersDetails extends Object {
}
class BorrowersDashboard extends Object {
}
class BorrowersCategory extends Object {
}
class BorrowersSummary extends Object {
}
class BorrowersStats extends Object {
}
class BorrowersStatsItem extends Object {
}
class BorrowersClientLoanPortfolio extends Object {
}
class BorrowersClientSaldo extends Object {
}

module.exports = {
  // Export methods that your schema can use to interact with your database
  Analytics,
  Asset,
  AssetsDashboard,
  RevenuesExpenses,
  RevenuesExpensesGroup,
  RevenuesExpensesData,
  RevenuesExpensesDashboard,
  BorrowersSingleGroup,
  BorrowersSingleGroupItem,
  BorrowersDashboard,
  BorrowersCategory,
  BorrowersSummary,
  BorrowersDetails,
  BorrowersStats,
  BorrowersStatsItem,
  LivingMoneyDashboard,
  LivingMoneyDashboardItem,
  BorrowersClientSaldo,
  BorrowersClientLoanPortfolio,
  StateDetail,
  LivingMoneyOtherBanks,
  LivingMoneyOtherBanksBankFundsItem,
  LivingMoneyOtherBanksBankGeneralInformationItem,
  LivingMoneyInterbankLendingCounteragentItem,
  LivingMoneyInterbankLending,
  LivingMoneySecurities,
  LivingMoneySecuritiesItem,
  QualityDetail,
  CashflowClients,
  CashflowClient,
  CashflowClientBlock,
  CashflowClientBlockContent,
  CashflowTaxes,
  CashflowTaxesItem,
  BasDashboard,
  CashflowDashboard,
  CashflowDashboardTurnover,
  CashflowDashboardBlockDetail,

  getAnalytics: () => {
    return {
      id: 'analytics'
    }
  },

  getBasDashboard: () => {
    return new Promise((resolve, reject)=> {
      let options = {
        uri: 'http://' + process.env.API_IP + ':' + process.env.API_PORT + '/api/analytics/bas-dashboard/v0/dashboard',
        qs: {
          authentication_token: '448ce0ce614d4fad8ce7ed015264cfba'
        },
        json: true
      };

      rp(options)
        .then(function (res) {
          resolve(res.data);
        })
        .catch(function (err) {
          reject(err);
        });
    });
  },

  getCashflowTaxes: (client, sdate, edate) => {
//	  console.log('args:', client, sdate, edate);
    let qs = {
      authentication_token: '448ce0ce614d4fad8ce7ed015264cfba'
    };
    client ? qs.clientId = client : false;
    sdate ? qs.sdate = sdate : false;
    edate ? qs.edate = edate : false;

    return new Promise((resolve, reject)=> {
      let options = {
        uri: 'http://' + process.env.API_IP + ':' + process.env.API_PORT + '/api/analytics/bas-cashflow/v0/clients/taxes',//TODO: fix url
        qs: qs,
        json: true
      };

//			console.log( options );

      rp(options)
        .then(function (res) {
          resolve(res.data);
        })
        .catch(function (err) {
          reject(err);
        });
    })
  },
  getLivingMoneySecurities: (date) => {
    date = date || '2015-11-01';
    return new Promise((resolve, reject)=> {
      let options = {
        uri: 'http://' + process.env.API_IP + ':' + process.env.API_PORT + '/api/analytics/bas-livingmoney/v0/securities',
        qs: {
          authentication_token: '448ce0ce614d4fad8ce7ed015264cfba',
          date: date
        },
        json: true
      };

      rp(options)
        .then(function (res) {
          resolve(res.data);
        })
        .catch(function (err) {
          reject(err);
        });
    });
  },

  getLivingMoneyInterbankLending: (date) => {
    date = date || '2015-11-01';
    return new Promise((resolve, reject)=> {
      let options = {
        uri: 'http://' + process.env.API_IP + ':' + process.env.API_PORT + '/api/analytics/bas-livingmoney/v0/interbank-lending',
        qs: {
          authentication_token: '448ce0ce614d4fad8ce7ed015264cfba',
          date: date
        },
        json: true
      };

      rp(options)
        .then(function (res) {
          resolve(res.data);
        })
        .catch(function (err) {
          reject(err);
        });
    })
  },
  getLivingMoneyOtherBanks: (date) => {
    date = date || '2015-11-01';
    return new Promise((resolve, reject)=> {
      let options = {
        uri: 'http://' + process.env.API_IP + ':' + process.env.API_PORT + '/api/analytics/bas-livingmoney/v0/funds-on-correspondent-account-in-other-banks',
        qs: {
          authentication_token: '448ce0ce614d4fad8ce7ed015264cfba',
          date: date
        },
        json: true
      };

      rp(options)
        .then(function (res) {
          resolve(res.data);
        })
        .catch(function (err) {
          reject(err);
        });
    })
  },
  getLivingMoneyDashboard: (sdate, edate) => {
    sdate = sdate || '2015-01-01';
    edate = edate || '2015-12-31';

    return new Promise((resolve, reject)=> {
      let options = {
        uri: 'http://' + process.env.API_IP + ':' + process.env.API_PORT + '/api/analytics/bas-livingmoney/v0/dashboard',
        qs: {
          authentication_token: '448ce0ce614d4fad8ce7ed015264cfba',
          sdate: sdate,
          edate: edate
        },
        json: true
      };

      rp(options)
        .then(function (res) {
          resolve(res.data);
        })
        .catch(function (err) {
          reject(err);
        });
    })
  },
  getCashflowDashboard: (sdate, edate) => {
    let qs = {
      authentication_token: '448ce0ce614d4fad8ce7ed015264cfba'
    };
    sdate ? qs.sdate = sdate : false;
    edate ? qs.edate = edate : false;
    return new Promise((resolve, reject)=> {
      let options = {
        uri: 'http://' + process.env.API_IP + ':' + process.env.API_PORT + '/api/analytics/bas-cashflow/v0/dashboard',
        qs: qs,
        json: true
      };
      rp(options)
        .then(function (res) {
          resolve(res.data);
        })
        .catch(function (err) {
          reject(err);
        });
    })
  },
  getCashflowClients: (type, sdate, edate, pageNumber, pageSize, indicators, ordering, search) => {
    let qs = {
      authentication_token: '448ce0ce614d4fad8ce7ed015264cfba'
    };
    (type && type != 'all') ? qs.ownerType = type : false;
    pageNumber ? qs.pageNumber = pageNumber : false;
    pageSize ? qs.pageSize = pageSize : false;
    sdate ? qs.sdate = sdate : false;
    edate ? qs.edate = edate : false;
    indicators ? qs.indicators = indicators : false;
    ordering ? qs.ordering = ordering : false;
    search ? qs.search = search : false;

    return new Promise((resolve, reject)=> {
      let options = {
        uri: 'http://' + process.env.API_IP + ':' + process.env.API_PORT + '/api/analytics/bas-cashflow/v0/clients',
        qs: qs,
        json: true
      };

//	    console.log(options);

      rp(options)
        .then(function (res) {
          for (let i = 0; i < res.data.results.length; i++) {
            for (let f in res.data.results[i]) {
              if (res.data.results[i][f].blockContent) {
                for (let k = 0; k < res.data.results[i][f].blockContent.fields.length; k++) {
                  if (typeof(res.data.results[i][f].blockContent.fields[k].value) !== 'object') {
                    res.data.results[i][f].blockContent.fields[k].value = {
                      value: res.data.results[i][f].blockContent.fields[k].value || 0
                    }
                  }
                  if (!res.data.results[i][f].blockContent.fields[k].value) {
                    res.data.results[i][f].blockContent.fields[k].value = {
                      value: 0
                    }
                  }
                }
              }
            }
          }
          resolve(res.data);
        })
        .catch(function (err) {
          reject(err);
        });
    })
  },

  getAssetsDashboard: (sdate, edate, goodPageSize, goodPageNumber, badPageSize, badPageNumber) => {
    let qs = {
      authentication_token: '448ce0ce614d4fad8ce7ed015264cfba'
    };
    goodPageNumber ? qs.goodPageNumber = goodPageNumber : false;
    goodPageSize ? qs.goodPageSize = goodPageSize : false;
    badPageNumber ? qs.badPageNumber = badPageNumber : false;
    badPageSize ? qs.badPageSize = badPageSize : false;
    sdate ? qs.sdate = sdate : false;
    edate ? qs.edate = edate : false;
    return new Promise((resolve, reject)=> {
      let options = {
        uri: 'http://' + process.env.API_IP + ':' + process.env.API_PORT + '/api/analytics/bas-offbalancedassets/v0/dashboard',
        qs: qs,
        json: true
      };

      rp(options)
        .then(function (res) {
          resolve(res.data);
        })
        .catch(function (err) {
          reject(err);
        });
    })
  },
  getRevenuesExpensesDashboard: (sdate, edate) => {
    //sdate = sdate || '2015-01-01';
    //edate = edate || '2015-10-01';
    let qs;
    if(!sdate.length||!edate.length){
      qs={
        authentication_token: '448ce0ce614d4fad8ce7ed015264cfba',
      }
    }else{
      qs={
        authentication_token: '448ce0ce614d4fad8ce7ed015264cfba',
        sdate: sdate,
        edate: edate
      }
    }
//    console.log( JSON.stringify(qs) );
    return new Promise((resolve, reject)=> {
      let options = {
        uri: 'http://' + process.env.API_IP + ':' + process.env.API_PORT + '/api/analytics/bas-incomeexpenses/v0/dashboard',
        qs: qs,
        json: true
      };

      rp(options)
        .then(function (res) {
          resolve(res.data);
        })
        .catch(function (err) {
          reject(err);
        });
    })
  },

  getBorrowersSingleGroup: (group, pageNumber, pageSize) => {
    return new Promise((resolve, reject)=> {
      let qs = {
        authentication_token: '448ce0ce614d4fad8ce7ed015264cfba'
      };
      pageNumber ? qs.pageNumber = pageNumber : false;
      pageSize ? qs.pageSize = pageSize : false;
      group ? qs.group = group : false;
      let options = {
        uri: 'http://' + process.env.API_IP + ':' + process.env.API_PORT + '/api/analytics/bas-loaners/v0/singlegroup',
        qs: qs,
        json: true
      };

      rp(options)
        .then(function (res) {
          resolve(res.data);
        })
        .catch(function (err) {
          reject(err);
        });
    })
  },
  getBorrowersDashboard: (date) => {
    let qs = {
      authentication_token: '448ce0ce614d4fad8ce7ed015264cfba'
    };
    date ? qs.date = date : false;
    return new Promise((resolve, reject)=> {
      let options = {
        uri: 'http://' + process.env.API_IP + ':' + process.env.API_PORT + '/api/analytics/bas-loaners/v0/dashboard',
        qs: qs,
        json: true
      };

      rp(options)
        .then(function (res) {
          resolve(res.data);
        })
        .catch(function (err) {
          reject(err);
        });
    })
  },

  getBorrowersTypeahead: (search, group) => {
    let qs = {
      authentication_token: '448ce0ce614d4fad8ce7ed015264cfba'
    };
    group ? qs.group = group : false;
    search ? qs.search = search : false;
  //  console.log(search, group);
    return new Promise((resolve, reject)=> {
        let options = {
          uri: 'http://' + process.env.API_IP + ':' + process.env.API_PORT + '/api/analytics/bas-loaners/v0/typeahead',
          qs: qs,
          json: true
        };

    rp(options)
      .then(function (res) {
        resolve(res.data);
      })
      .catch(function (err) {
        reject(err);
      });
  })
  },

  getCashflowTypeahead: (search) => {
    let qs = {
      authentication_token: '448ce0ce614d4fad8ce7ed015264cfba'
    };
    search ? qs.search = search : false;
    return new Promise((resolve, reject)=> {
        let options = {
          uri: 'http://' + process.env.API_IP + ':' + process.env.API_PORT + '/api/analytics/bas-cashflow/v0/typeahead',
          qs: qs,
          json: true
        };
    rp(options)
      .then(function (res) {
        resolve(res.data);
      })
      .catch(function (err) {
        reject(err);
      });
  })
  },

  getBorrowersDetails: (date, group, entity, pageNumber, pageSize, search, indicators) => {
    let qs = {
      authentication_token: '448ce0ce614d4fad8ce7ed015264cfba'
    };

    date ? qs.date = date : utils.dts(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
    pageNumber ? qs.pageNumber = pageNumber : 1;
    pageSize ? qs.pageSize = pageSize : 20;
    search ? qs.search = search : false;
    indicators ? qs.indicators = indicators : false;
    (group && group != 'all') ? qs.group = group : 'all';
    (entity && entity != 'all') ? qs.entity = entity : 'all';

    return new Promise((resolve, reject)=> {
      let options = {
        uri: 'http://' + process.env.API_IP + ':' + process.env.API_PORT + '/api/analytics/bas-loaners/v0/details',
        qs: qs,
        json: true
      };

      rp(options)
        .then(function (res) {
          resolve(res.data);
        })
        .catch(function (err) {
          reject(err);
        });
    })
  },

  getBorrowersStats: () => {
    let qs = {
      authentication_token: '448ce0ce614d4fad8ce7ed015264cfba'
    };
    return new Promise((resolve, reject)=> {
      let options = {
        uri: 'http://' + process.env.API_IP + ':' + process.env.API_PORT + '/api/analytics/bas-loaners/v0/stats',
        qs: qs,
        json: true
      };

      rp(options)
        .then(function (res) {
          resolve(res.data);
        })
        .catch(function (err) {
          reject(err);
        });
    })
  },
  getBorrowersClientDetails: (date, loaner, column) => {
    let qs = {
      authentication_token: '448ce0ce614d4fad8ce7ed015264cfba'
    };
    date ? qs.date = date : false;
    loaner ? qs.loanerId = loaner : false;
    column ? qs.columnId = column : false;

    return new Promise((resolve, reject)=> {
      let options = {
        uri: 'http://' + process.env.API_IP + ':' + process.env.API_PORT + '/api/analytics/bas-loaners/v0/client/details',
        qs: qs,
        json: true
      };

      rp(options)
        .then(function (res) {

          resolve(res.data);
        })
        .catch(function (err) {
          reject(err);
        });
    })
  }
};
