import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'react-router';
import { Route, IndexRoute, Redirect } from 'react-router';
import Relay from 'react-relay';
import {RelayRouter} from 'react-router-relay';
import createBrowserHistory from 'history/lib/createBrowserHistory';

import Clear from 'components/layouts/Clear/Clear.jsx';
import Home from 'app/routes/Home.jsx';

import Borrowers from 'app/routes/borrowers/Borrowers.jsx';
import BorrowersReport from 'app/routes/borrowers/BorrowersReport.jsx';
import BorrowersReportTable from 'app/routes/borrowers/BorrowersReportTable.jsx';
import BorrowersCategoryReport from 'app/routes/borrowers/BorrowersCategoryReport.jsx';
import BorrowersClientLoanPortfolioReport from 'app/routes/borrowers/BorrowersClientLoanPortfolioReport.jsx';
import BorrowersClientSaldoReport from 'app/routes/borrowers/BorrowersClientSaldoReport.jsx';

import Cashflow from 'app/routes/cashflow/Cashflow.jsx';
import CashflowGrid from 'app/routes/cashflow/CashflowGrid.jsx';
import CashflowTax from 'app/routes/cashflow/CashflowTax.jsx';
import CashflowStatistics from 'app/routes/cashflow/CashflowStatistics.jsx';

import NonBalanceAssets from 'app/routes/NonBalanceAssets.jsx';
import RevenuesExpenses from 'app/routes/RevenuesExpenses.jsx';

import Admin from 'app/routes/Admin.jsx';
import AdminUsers from 'app/components/admin/AdminUsers.jsx';
import AdminLogs from 'app/components/admin/AdminLogs.jsx';

import Money from 'app/routes/money/Money.jsx';
import FundsOnCorrespondedAccounts from 'app/routes/money/FundsOnCorrespondedAccounts.jsx';
import InterbankList from 'app/routes/money/InterbankList.jsx';
import SecuritiesList from 'app/routes/money/SecuritiesList.jsx';
import Utils from 'app/lib/Utils.js';
import Loading from 'components/dumb/Loading.jsx';
import Login from 'app/routes/Login.jsx';
import Logout from 'app/routes/Logout.jsx';
import Upload from 'app/routes/Upload.jsx';
import Queries from './queries.jsx';
import history from 'app/services/history.js';

let defaultQuery = {
  analytics: Queries.default
};
let u = new Utils();

// FIXME : Это общий router, почему API из analytics тянется сюда?
// TODO : Сделать по роутеру для каждого из: RBS, Analytics, Back-Office.
import { auth } from 'app/api/analytics/auth.js';

auth.actualize(function (logged) {

  if (logged) {

    ReactDOM.render((
      <RelayRouter history={history}>

        <Route name="auth" component={Clear}>
          <Route name="logout" path="/logout" component={Logout}/>
          <Redirect from="/login" to="/"/>
        </Route>

        <Route name="base" path="/" component={Clear}>
          <IndexRoute name="home" component={Home} queries={defaultQuery} renderLoading={() => <Loading />}/>
          <Route name="upload" path="/upload" component={Upload}/>
          <Route name="nonBalanceAssets" path="/non-balance-assets" component={NonBalanceAssets} queries={defaultQuery}/>

          <Route name="moneybase" path="money" component={Clear}>
            <IndexRoute name="money" component={Money} queries={defaultQuery} renderLoading={() => <Loading />}/>
            <Route name="fundsOnCorrespondedAccounts" path="fundsOnCorrespondedAccounts" queryParams={['date']}
                   component={FundsOnCorrespondedAccounts} queries={defaultQuery} renderLoading={() => <Loading />}/>
            <Route name="interbankList" path="interbankList" queryParams={['date']} component={InterbankList}
                   queries={defaultQuery} renderLoading={() => <Loading />}/>
            <Route name="securitiesList" path="securitiesList"  queryParams={['date']} component={SecuritiesList}
                   queries={defaultQuery} renderLoading={() => <Loading />}/>
          </Route>

          <Route name="revenuesExpenses" path="/revenues-expenses" component={RevenuesExpenses} queries={defaultQuery}
                 renderLoading={() => <Loading />}/>

          <Route name="cashflowbase" path="cashflow" component={Clear}>
            <IndexRoute  name="cashflow" component={Cashflow} queries={defaultQuery} renderLoading={() => <Loading />} />

            <Route name="cashflowTax" path="tax" queryParams={['client', 'sdate', 'edate']} component={CashflowTax} queries={defaultQuery} renderLoading={() => <Loading />} />
            <Route name="cashflowStatistics" path="statistics" component={CashflowStatistics} queries={defaultQuery} renderLoading={() => <Loading />} />
          </Route>

          <Route name="borrowersbase" path="borrowers" component={Clear}>
            <IndexRoute name="borrowers" component={Borrowers} queries={defaultQuery} renderLoading={() => <Loading />}/>

            <Route name="borrowersReport" component={BorrowersReport}  queries={defaultQuery}  renderLoading={() => <Loading />}>
              <Route
                queryParams={['date', 'group', 'entity', 'pagesize', 'pagenumber', 'search', 'indicators']}
                path="/borrowers/borrowers-report"
                name="borrowersReportTable"
                queries={defaultQuery}
                component={BorrowersReportTable}
                prepareParams={prepareBorrowersReportParams}
                renderLoading={() => <Loading />}
              />
            </Route>

            <Route
              queryParams={['date','loaner']}
              path="borrowers-client-loan-portfolio-report"
              name="borrowersClientLoanPortfolioReport"
              queries={defaultQuery}
              component={BorrowersClientLoanPortfolioReport}
              renderLoading={() => <Loading />}
            />

            <Route
              name="borrowersClientSaldoReport"
              queryParams={['loaner','date']}
              path="borrowers-client-saldo-report"
              component={BorrowersClientSaldoReport}
              queries={defaultQuery}
              renderLoading={() => <Loading />}
            />

            <Route
              name="borrowersCategoryReport"
              path="borrowers-category-report"
              component={BorrowersCategoryReport}
              queries={defaultQuery}
              renderLoading={() => <Loading />}
            />

          </Route>

          <Route name="admin" path="/admin">
            <IndexRoute name="admin" component={Admin} />
            <Route name="adminUsers" path="/admin/users" component={AdminUsers} />
            <Route name="adminLogs" path="/admin/logs" component={AdminLogs} />
          </Route>

        </Route>

        <Redirect from="*" to="/"/>
      </RelayRouter>
    ), document.getElementById('root'));

  } else {
    ReactDOM.render((
      <Router history={history}>
        <Route name="login" path="/login" component={Login}/>
        <Redirect from="*" to="/login"/>
      </Router>
    ), document.getElementById('root'));

  }
});

function prepareBorrowersReportParams(params, route) {
  return {
    ...params,
    date: params.date?params.date:u.dts(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
    group: params.group?params.group:'all',
    entity: params.entity?params.entity:'all',
    pagesize: params.pagesize ? parseInt(params.pagesize, 10) : 20,
    pagenumber: params.pagenumber ? parseInt(params.pagenumber, 10) : 1,
    search: params.search ? params.search : '',
    indicators: params.indicators?params.indicators : '',
  };
};
