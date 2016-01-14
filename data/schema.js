import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

import {
  // Import methods that your schema can use to interact with your database
  Analytics,
  Asset,
  AssetsDashboard,
  RevenuesExpenses,
  RevenuesExpensesData,
  RevenuesExpensesGroup,
  RevenuesExpensesDashboard,
  BorrowersSingleGroup,
  BorrowersDashboard,
  BorrowersTypeahead,
  BorrowersCategory,
  BorrowersSummary,
  BorrowersDetails,
  BorrowersClientLoanPortfolio,
  BorrowersClientSaldo,
  BorrowersStats,
  BorrowersStatsItem,
  CashflowClient,
  CashflowClients,
  CashflowClientBlock,
  CashflowClientBlockContent,
  CashflowTaxes,
  CashflowTaxesItem,
  CashflowDashboard,
  CashflowTypeahead,
  CashflowDashboardTurnover,
  CashflowDashboardBlockDetail,
  LivingMoneyDashboard,
  LivingMoneyDashboardItem,
  StateDetail,
  LivingMoneyOtherBanks,
  LivingMoneyOtherBanksBankFundsItem,
  LivingMoneyOtherBanksBankGeneralInformationItem,
  LivingMoneyInterbankLending,
  LivingMoneyInterbankLendingCounteragentItem,
  LivingMoneySecurities,
  LivingMoneySecuritiesItem,
  QualityDetail,
  getBasDashboard,
  getLivingMoneySecurities,
  getLivingMoneyInterbankLending,
  getLivingMoneyOtherBanks,
  getLivingMoneyDashboard,
  getCashflowClients,
  getCashflowTaxes,
  getCashflowDashboard,
  getBorrowersDashboard,
  getBorrowersTypeahead,
  getCashflowTypeahead,
  getAssetsDashboard,
  getRevenuesExpensesDashboard,
  getBorrowersDetails,
  getBorrowersClientDetails,
  getBorrowersStats,
  getBorrowersSingleGroup,
  getAnalytics,
} from './database';

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    if (type === 'AssetsDashboard') {
      return getAssetsDashboard(id);
    } else if (type === 'RevenuesExpensesDashboard') {
      return getRevenuesExpensesDashboard(id);
    } else if (type === 'BorrowersSingleGroup') {
      return getBorrowersSingleGroup();
    } else if (type === 'BorrowersClientSaldo') {
      return getBorrowersClientDetails();
    } else if (type === 'BorrowersClientLoanPortfolio') {
      return getBorrowersClientDetails();
    } else if (type === 'BorrowersDashboard') {
      return getBorrowersDashboard(id);
    } else if (type === 'BorrowersTypeahead') {
      return getBorrowersTypeahead();
    } else if (type === 'CashflowTypeahead') {
      return getCashflowTypeahead();
    } else if (type === 'BorrowersDetails') {
      return getBorrowersDetails(id);
    } else if (type === 'BorrowersStats') {
      return getBorrowersStats();
    } else if (type === 'CashflowClients') {
      return getCashflowClients(id);
    } else if (type === 'BasDashboard') {
      return getBasDashboard();
    } else if (type === 'CashflowDashboard') {
      return getCashflowDashboard(id);
    } else if (type === 'LivingMoneyDashboard') {
      return getLivingMoneyDashboard(sdate, edate);
    } else if (type === 'LivingMoneyOtherBanks') {
      return getLivingMoneyOtherBanks(date);
    } else if (type === 'LivingMoneyInterbankLending') {
      return getLivingMoneyInterbankLending(date);
    } else if (type === 'LivingMoneySecurities') {
      return getLivingMoneySecurities(date);
    } else if (type === 'CashflowTaxes') {
      return getCashflowTaxes(id);
    } else if (type === 'Analytics') {
      return getAnalytics();
    } else {
      return null;
    }
  },
  (obj) => {
    if (obj instanceof AssetsDashboard) {
      return assetsDashboardType;
    } else if (obj instanceof RevenuesExpensesDashboard) {
      return revenuesExpensesDashboardType;
    } else if (obj instanceof BorrowersClientSaldo) {
      return borrowersClientSaldoType;
    } else if (obj instanceof BorrowersSingleGroup) {
      return borrowersSingleGroupType;
    } else if (obj instanceof BorrowersClientLoanPortfolio) {
      return borrowersClientLoanPortfolioType;
    } else if (obj instanceof BorrowersDashboard) {
      return borrowersDashboardType;
    } else if (obj instanceof BorrowersTypeahead) {
      return allTypeaheadType;
    } else if (obj instanceof CashflowTypeahead) {
      return allTypeaheadType;
    } else if (obj instanceof BorrowersDetails) {
      return borrowersDetailsType;
    } else if (obj instanceof BorrowersStats) {
      return borrowersStatsType;
    } else if (obj instanceof CashflowClients) {
      return cashflowClientsType;
    } else if (obj instanceof BasDashboard) {
      return BasDashboardType;
    } else if (obj instanceof CashflowDashboard) {
      return cashflowDashboardType;
    } else if (obj instanceof LivingMoneyDashboard) {
      return livingMoneyDashboardType;
    } else if (obj instanceof LivingMoneyOtherBanks) {
      return livingMoneyOtherBanksType;
    } else if (obj instanceof LivingMoneyInterbankLending) {
      return livingMoneyInterbankLendingType;
    } else if (obj instanceof LivingMoneySecurities) {
      return livingMoneySecuritiesType;
    } else if (obj instanceof CashflowTaxes) {
      return cashflowTaxesType;
    } else if (obj instanceof Analytics) {
      return analyticsType;
    } else {
      return null;
    }
  }
);

/**
 * Define your own types here
 */
///////////////livingmoneydashbord

var livingMoneySecuritiesType = new GraphQLObjectType({
  name: 'LivingMoneySecurities',
  description: 'LivingMoneySecurities',
  fields: () => ({
    //  id: globalIdField('LivingMoneySecurities'),
    nonState: {type: valueStoreType},
    securities: {type: new GraphQLList(livingMoneySecuritiesItemType)},
    state: {type: valueStoreType},
    total: {type: valueStoreType},
  }),
  // interfaces: [nodeInterface],
});

var livingMoneySecuritiesItemType = new GraphQLObjectType({
  name: 'LivingMoneySecuritiesItem',
  description: 'LivingMoneySecuritiesItem',
  fields: () => ({
    //   id: globalIdField('LivingMoneySecuritiesItem'),
    isState: {type: GraphQLBoolean},
    name: {type: GraphQLString},
    price: {type: valueStoreType}
  }),
  // interfaces: [nodeInterface],
});
//
var livingMoneyInterbankLendingType = new GraphQLObjectType({
  name: 'LivingMoneyInterbankLending',
  description: 'LivingMoneyInterbankLending',
  fields: () => ({
    //id: globalIdField('LivingMoneyInterbankLending'),
    counteragents: {type: new GraphQLList(livingMoneyInterbankLendingCounteragentItemType)},
    nonState: {type: valueStoreType},
    state: {type: valueStoreType},
    total: {type: valueStoreType},
    totalIncome: {type: valueStoreType},
    weightedAverageRate: {type: GraphQLFloat}
  }),
  //interfaces: [nodeInterface],
});

var livingMoneyInterbankLendingCounteragentItemType = new GraphQLObjectType({
  name: 'LivingMoneyInterbankLendingCounteragentItem',
  description: 'LivingMoneyInterbankLendingCounteragentItem',
  fields: () => ({
    //id: globalIdField('LivingMoneyInterbankLendingCounteragentItem'),
    bankNumber: {type: GraphQLInt},
    bankTitle: {type: GraphQLString},
    daysCount: {type: GraphQLInt},
    income: {type: valueStoreType},
    interestRate: {type: GraphQLInt},
    isState: {type: GraphQLBoolean},
    placementDate: {type: GraphQLString},
    returnDate: {type: GraphQLString},
    sum: {type: valueStoreType}
  })
});

var livingMoneyOtherBanksType = new GraphQLObjectType({
  name: 'LivingMoneyOtherBanks',
  description: 'LivingMoneyOtherBanks',
  fields: () => ({
    //id: globalIdField('LivingMoneyOtherBanks'),
    //id: {type:GraphQLInt},
    fundsOnCorrespondentAccountInOtherBanks: {type: new GraphQLList(livingMoneyOtherBanksBankFundsItemType)},
    generalInformation: {type: new GraphQLList(livingMoneyOtherBanksBankGeneralInformationItemType)},
    municipalStructure: {type: stateDetailType},
    qualityStructure: {type: qualityDetailType}
  })
  //interfaces: [nodeInterface]
});

var livingMoneyOtherBanksBankFundsItemType = new GraphQLObjectType({
  name: 'LivingMoneyOtherBanksBankFundsItem',
  description: 'LivingMoneyOtherBanksBankFundsItem',
  fields: () => ({
    //id: globalIdField('LivingMoneyOtherBanksBankFundsItem'),
    id: {type: GraphQLInt},
    bankTitle: {type: GraphQLString},
    sum: {type: valueStoreType}
  }),
  //interfaces: [nodeInterface]
});

var livingMoneyOtherBanksBankGeneralInformationItemType = new GraphQLObjectType({
  name: 'LivingMoneyOtherBanksBankGeneralInformationItem',
  description: 'LivingMoneyOtherBanksBankGeneralInformationItem',
  fields: () => ({
//    id: globalIdField('LivingMoneyOtherBanksBankGeneralInformationItem'),
    bankGrade: {type: valueStoreType},
    bankTitle: {type: GraphQLString},
    isState: {type: GraphQLBoolean},
    sumTotal: {type: valueStoreType},
  })
//  interfaces: [nodeInterface],
});

var qualityDetailType = new GraphQLObjectType({
  name: 'QualityDetail',
  description: 'QualityDetail',
  fields: () => ({
//    id: globalIdField('QualityDetail'),
    high: {type: valueStoreType},
    low: {type: valueStoreType},
    medium: {type: valueStoreType},
  })
//  interfaces: [nodeInterface],
});

var stateDetailType = new GraphQLObjectType({
  name: 'StateDetail',
  description: 'StateDetail',
  fields: () => ({
//    id: globalIdField('StateDetail'),
    state: {type: valueStoreType},
    nonState: {type: valueStoreType},
    total: {type: valueStoreType},
    bank: {type: valueStoreType}
  })
//  interfaces: [nodeInterface],
});
//
var livingMoneyDashboardType = new GraphQLObjectType({
  name: 'LivingMoneyDashboard',
  description: 'LivingMoneyDashboard',
  fields: () => ({
//    id: globalIdField('LivingMoneyDashboard'),
    results: {type: new GraphQLList(livingMoneyDashboardItemType)}
  }),
//  interfaces: [nodeInterface],
});

var livingMoneyDashboardItemType = new GraphQLObjectType({
  name: 'LivingMoneyDashboardItem',
  description: 'LivingMoneyDashboardItem',
  fields: () => ({
    //id: globalIdField('LivingMoneyDashboardItem'),
    cashBalance: {type: valueStoreType},
    date: {type: GraphQLString},
    fundsOnCorrespondentAccountInCB: {type: valueStoreType},
    fundsOnCorrespondentAccountInOtherBanks: {type: stateDetailType},
    interbankLending: {type: stateDetailType},
    restOnSpecialCreditCashOffice: {type: valueStoreType},
    securities: {type: stateDetailType},
    total: {type: valueStoreType},
  }),
  //interfaces: [nodeInterface],
});

var stateDetailType = new GraphQLObjectType({
  name: 'LivingMoneyDashboardItemDetail',
  description: 'LivingMoneyDashboardItemDetail',
  fields: () => ({
//    id: globalIdField('LivingMoneyDashboardItemDetail'),
    state: {type: valueStoreType},
    nonState: {type: valueStoreType},
    total: {type: valueStoreType},
    bank: {type: valueStoreType},
  })
//  interfaces: [nodeInterface],
});

///////////////cashflow

var cashflowTaxesType = new GraphQLObjectType({
  name: 'CashflowTaxes',
  description: 'CashflowTaxes',
  fields: () => ({
    results: {type: new GraphQLList(cashflowTaxesItemType)}
  })
});

var cashflowTaxesItemType = new GraphQLObjectType({
  name: 'CashflowTaxesItem',
  description: 'CashflowTaxesItem',
  fields: () => ({
    accountNumber: {type: GraphQLString},
    bank: {type: GraphQLString},
    bic: {type: GraphQLString},
    clientId: {type: GraphQLString},
    correspondentName: {type: GraphQLString},
    date: {type: GraphQLString},
    documentId: {type: GraphQLString},
    //id: {type: GraphQLString},
    paymentPurpose: {type: GraphQLString},
    personalAccountNumber: {type: GraphQLString},
    sbu: {type: GraphQLString},
    turnoverCredit: {type: valueStoreType},
    turnoverDebit: {type: valueStoreType}
  })
});
//
var BasDashboardType = new GraphQLObjectType({
  name: 'BasDashboard',
  description: 'BasDashboard',
  fields: () => ({
    cashflow: {type: cashflowDashboardTotalType},
    incomeexpenses: {type: d3DatesValuesType},
    livingmoney: {type: d3DatesValuesType},
    loaners: {type: loanersDashboardType},
    offbalancedassets: {type: offbalancedassetTotalType}
  })
});

var offbalancedassetTotalType = new GraphQLObjectType({
  name: 'offbalancedassetTotal',
  description: 'offbalancedassetTotal',
  fields: () => ({
    summary: {type: assetsSummary}
  })
});

var loanersDashboardType = new GraphQLObjectType({
  name: 'loanersDashboard',
  description: 'loanersDashboard',
  fields: () => ({
    date: {type: GraphQLString},
    generalInformation: {type: borrowersSummaryType}
  })
});

var d3DatesValuesType = new GraphQLObjectType({
  name: 'd3DatesValues',
  description: 'd3DatesValuesObject',
  fields: () => ({
    dates: {type: new GraphQLList(GraphQLString)},
    values: {type: new GraphQLList(GraphQLString)}
  })
});

var cashflowDashboardTotalType = new GraphQLObjectType({
  name: 'cashflowDashboardTotal',
  description: 'cashflowDashboardTotal',
  fields: () => ({
    turnover: {type: cashflowDashboardTurnoverType}
  })
});

var cashflowDashboardType = new GraphQLObjectType({
  name: 'CashflowDashboard',
  description: 'CashflowDashboard',
  fields: () => ({
    accountsOpened: {type: cashflowDashboardBlockDetailType},
    uniqueClients: {type: cashflowDashboardBlockDetailType},
    cashWithdrawal: {type: cashflowDashboardBlockDetailType},
    turnover: {type: cashflowDashboardTurnoverType},
    clientsFlow: {type: cashflowDashboardBlockDetailType}
  })
});

var cashflowDashboardTurnoverType = new GraphQLObjectType({
  name: 'CashflowDashboardTurnover',
  description: 'CashflowDashboardTurnover',
  fields: () => ({
    debit: {type: cashflowDashboardBlockDetailType},
    credit: {type: cashflowDashboardBlockDetailType}
  })
});

var cashflowDashboardBlockDetailType = new GraphQLObjectType({
  name: 'CashflowDashboardBlockDetail',
  description: 'CashflowDashboardBlockDetail',
  fields: () => ({
    physical: {type: valueStoreType},
    individualAndLegal: {type: valueStoreType},
    total: {type: valueStoreType}
  })
});

var cashflowClientsType = new GraphQLObjectType({
  name: 'CashflowClients',
  description: 'CashflowClients',
  fields: () => ({
    results: {type: new GraphQLList(cashflowClientType)},
    totalItems: {type: GraphQLInt},
    numPages: {type: GraphQLInt},
    currentPage: {type: GraphQLInt},
    pageSize: {type: GraphQLInt}
  })
});

var cashflowClientType = new GraphQLObjectType({
  name: 'CashflowClient',
  description: 'CashflowClient',
  fields: () => ({
    cash: {type: cashflowClientBlockType},
    client: {type: cashflowClientBlockType},
    clientId: {type: GraphQLInt},
    currency: {type: cashflowClientBlockType},
    loans: {type: cashflowClientBlockType},
    tax: {type: cashflowClientBlockType},
    transit: {type: cashflowClientBlockType}
  })
});

var cashflowClientBlockType = new GraphQLObjectType({
  name: 'CashflowClientBlock',
  description: 'CashflowClientBlock',
  fields: () => ({
    blockTitle: {type: GraphQLString},
    blockContent: {type: cashflowClientBlockDetailType}
  })
});

var cashflowClientBlockDetailType = new GraphQLObjectType({
  name: 'CashflowClientBlockDetail',
  description: 'CashflowClientBlockDetail',
  fields: () => ({
    fields: {type: new GraphQLList(cashflowClientBlockDetailFieldType)},
    indicators: {type: new GraphQLList(cashflowClientBlockDetailIndicatorType)}
  })
});

var cashflowClientBlockDetailFieldType = new GraphQLObjectType({
  name: 'CashflowClientBlockDetailField',
  description: 'CashflowClientBlockDetailField',
  fields: () => ({
    fieldName: {type: GraphQLString},
    renderable: {type: GraphQLBoolean},
    type: {type: GraphQLString},
    value: {type: valueStoreType},
    verboseName: {type: GraphQLString}
  })
});

var cashflowClientBlockDetailIndicatorType = new GraphQLObjectType({
  name: 'CashflowClientBlockDetailIndicator',
  description: 'CashflowClientBlockDetailIndicator',
  fields: () => ({
    block: {type: GraphQLString},
    color: {type: GraphQLString},
    helpText: {type: GraphQLString},
    icon: {type: GraphQLString},
    name: {type: GraphQLString},
    title: {type: GraphQLString},
  })
});

///////////////borrowers

var borrowersLoanersType = new GraphQLObjectType({
  name: 'BorrowersLoaners',
  description: 'BorrowersLoaners',
  fields: () => ({
    //id: globalIdField('BorrowersLoaners'),
    count: {type: GraphQLInt},
    debts: {type: valueStoreType},
    reserves: {type: valueStoreType},
  }),
  //interfaces: [nodeInterface],
});

var borrowersCategoryType = new GraphQLObjectType({
  name: 'BorrowersCategory',
  description: 'BorrowersCategory',
  fields: () => ({
    //id: globalIdField('BorrowersCategory'),
    id: {type: GraphQLInt},
    category: {type: GraphQLInt},
    debt: {type: valueStoreType},
    delinquency: {type: valueStoreType},
    legalLoaners: {type: borrowersLoanersType},
    physLoaners: {type: borrowersLoanersType},
    reserves: {type: valueStoreType}
  })
  //interfaces: [nodeInterface],
});
var borrowersCategoryStatType = new GraphQLObjectType({
  name: 'BorrowersCategoryStat',
  description: 'BorrowersCategoryStat',
  fields: () => ({
    //id: globalIdField('BorrowersCategoryStat'),
    id: {type: GraphQLInt},
    category: {type: GraphQLInt},
    debt: {type: valueStoreType},
    delinquency: {type: valueStoreType},
    legalLoaners: {type: borrowersLoanersType},
    physLoaners: {type: borrowersLoanersType},
    reserves: {type: valueStoreType},
    statistics: {
      type: borrowersSingleGroupType,
      resolve: (data) => {
        return getBorrowersSingleGroup(data.category);
      }
    }
  }),
  //interfaces: [nodeInterface],
});
//
var borrowersClientSaldoType = new GraphQLObjectType({
  name: 'BorrowersClientSaldo',
  description: 'BorrowersClientSaldo',
  fields: () => ({
    //id: globalIdField('BorrowersClientSaldo'),
    captions: {type: new GraphQLList(captionType)},
    results: {type: new GraphQLList(borrowersClientSaldoItemType)},
  })
  //interfaces: [nodeInterface],
});

var borrowersClientSaldoItemType = new GraphQLObjectType({
  name: 'BorrowersClientSaldoItem',
  description: 'BorrowersClientSaldoItem',
  fields: () => ({
    //id: globalIdField('BorrowersClientSaldoItem'),
    billN: {type: GraphQLString},
    clientId: {type: GraphQLInt},
    counter: {type: GraphQLInt},
    creditTurn: {type: GraphQLString},
    dateEnd: {type: GraphQLString},
    dateStart: {type: GraphQLString},
    debetTurn: {type: GraphQLString},
    orgName: {type: GraphQLString},
    saldoTurn: {type: GraphQLString}
  }),
  //interfaces: [nodeInterface],
});

var captionType = new GraphQLObjectType({
  name: 'Caption',
  description: 'Caption',
  fields: () => ({
    //id: globalIdField('BorrowersLoaners'),
    caption: {type: GraphQLString},
    name: {type: GraphQLString},
    nn: {type: GraphQLInt},
  }),
  //interfaces: [nodeInterface],
});

var borrowersClientLoanPortfolioItemType = new GraphQLObjectType({
  name: 'BorrowersClientLoanPortfolioItem',
  description: 'BorrowersClientLoanPortfolioItem',
  fields: () => ({
    //id: globalIdField('BorrowersCategory'),
    agreement: {type: GraphQLString},
    auto: {type: GraphQLString},
    borrower: {type: GraphQLString},
    calcReserveSum: {type: GraphQLString},
    category: {type: GraphQLInt},
    clientId: {type: GraphQLInt},
    credit: {type: GraphQLString},
    creditCurrency: {type: GraphQLString},
    creditPurpose: {type: GraphQLString},
    creditSumCurrency: {type: GraphQLString},
    currentDebtCurrency: {type: GraphQLString},
    currentDebtRub: {type: GraphQLString},
    daysN: {type: GraphQLInt},
    flat: {type: GraphQLString},
    goods: {type: GraphQLString},
    guarantees: {type: GraphQLString},
    interestRate: {type: GraphQLString},
    issueDate: {type: GraphQLString},
    lawProp: {type: GraphQLString},
    loanAccount: {type: GraphQLString},
    nonresident: {type: GraphQLString},
    number: {type: GraphQLInt},
    ogrn: {type: GraphQLString},
    papers: {type: GraphQLString},
    prolon: {type: GraphQLString},
    prop: {type: GraphQLString},
    psk: {type: GraphQLString},
    qualityCateg: {type: GraphQLString},
    rate: {type: GraphQLString},
    realReserveSum: {type: GraphQLString},
    repaid: {type: GraphQLString},
    repayDate: {type: GraphQLString},
    reserveForUnusedLimit: {type: GraphQLString},
    restor: {type: GraphQLInt},
    rubCreditSum: {type: GraphQLString},
    rubPercent: {type: GraphQLString},
    tin: {type: GraphQLString},
    unusedLimit: {type: GraphQLString}
  })
  //interfaces: [nodeInterface],
});

var borrowersClientLoanPortfolioType = new GraphQLObjectType({
  name: 'BorrowersClientLoanPortfolio',
  description: 'BorrowersClientLoanPortfolio',
  fields: () => ({
    //id: globalIdField('BorrowersClientLoanPortfolio'),
    captions: {type: new GraphQLList(captionType)},
    results: {type: new GraphQLList(borrowersClientLoanPortfolioItemType)},
  }),
  //interfaces: [nodeInterface],
});
//
var borrowersSummaryType = new GraphQLObjectType({
  name: 'BorrowersSummary',
  description: 'BorrowersSummary',
  fields: () => ({
    //id: globalIdField('BorrowersSummary'),
    debt: {type: valueStoreType},
    delinquency: {type: valueStoreType}
  })
  //interfaces: [nodeInterface],
});

var borrowersDashboardType = new GraphQLObjectType({
  name: 'BorrowersDashboard',
  description: 'BorrowersDashboard',
  fields: () => ({
    categories: {type: new GraphQLList(borrowersCategoryStatType)},
    generalInformation: {type: borrowersSummaryType}
  })
});

var allTypeaheadType = new GraphQLObjectType({
  name: 'allTypeahead',
  description: 'AllTypehead',
  fields: () => ({
    currentPage: {type:GraphQLInt},
    numPages: {type: GraphQLInt},
    pageSize: {type: GraphQLInt},
    results: {type: new GraphQLList(GraphQLString) },
    totalItems:{type: GraphQLInt},
  })
});

var borrowersDetailsType = new GraphQLObjectType({
  name: 'BorrowersDetails',
  description: 'BorrowersDetails',
  fields: () => ({
    totalItems: {type: GraphQLInt},
    numPages: {type: GraphQLInt},
    currentPage: {type: GraphQLInt},
    pageSize: {type: GraphQLInt},
    date: {type: GraphQLString},
    search: {type: GraphQLString},
    results: {type: new GraphQLList(borrowerType)}
  })
});

var borrowerLegalChangesItemType = new GraphQLObjectType({
  name: 'BorrowerLegalChangesItem',
  description: 'BorrowerLegalChangesItem',
  fields: () => ({
    date: {type: GraphQLString},
    change: {type: GraphQLString},
  })
});

var borrowerLegalChangesType = new GraphQLObjectType({
  name: 'BorrowerLegalChanges',
  description: 'BorrowerLegalChanges',
  fields: () => ({
    fnsChangeCounter: {type: GraphQLInt},
    color: {type: GraphQLString},
    status: {type: GraphQLString},
    statusMessage: {type: GraphQLString},
    lastThree: {type: new GraphQLList(borrowerLegalChangesItemType)},
  })
});

var borrowerArbitrationType = new GraphQLObjectType({
  name: 'BorrowerArbitration',
  description: 'BorrowerArbitration',
  fields: () => ({
    color: {type: GraphQLString},
    status: {type: GraphQLString},
    statusMessage: {type: GraphQLString},
    defCountLastYear: {type: GraphQLString},
    defSumLastYear: {type: GraphQLString},
    defCountTotal: {type: GraphQLString},
    defSumTotal: {type: GraphQLString},
    plainCountLastYear: {type: GraphQLString},
    plainSumLastYear: {type: GraphQLString},
    plainCountTotal: {type: GraphQLString},
    plainSumTotal: {type: GraphQLString}
  })
});

var borrowerOwnersItemType = new GraphQLObjectType({
  name: 'BorrowerOwnersItem',
  description: 'BorrowerOwnersItem',
  fields: () => ({
    name: {type: GraphQLString},
    percent: {type: GraphQLString}
  })
});

var borrowerOwnersType = new GraphQLObjectType({
  name: 'BorrowerOwners',
  description: 'BorrowerOwners',
  fields: () => ({
    ceo: {type: GraphQLString},
    ceoDate: {type: GraphQLString},
    color: {type: GraphQLString},
    status: {type: GraphQLString},
    statusMessage: {type: GraphQLString},
    list: {type: new GraphQLList(borrowerOwnersItemType)}
  })
});

var borrowerType = new GraphQLObjectType({
  name: 'Borrower',
  description: 'Borrower',
  fields: () => ({
    activeActions: {type: borrowerFieldType},
    arbitration: {type: borrowerArbitrationType},
    cashFlow: {type: cashFlowFieldType},
    client: {type: borrowerClientType},
    creditAgreements: {type: borrowerAgreementType},
    executive: {type: borrowerFieldType},
    legalChanges: {type: borrowerLegalChangesType},
    owners: {type: borrowerOwnersType},
    procution: {type: borrowerFieldType},
    procutionDetailed:{type:borrowerProcutionType },
    reserves: {type: borrowerFieldType},
    indicators: {type: new GraphQLList(borrowerIndicatorType)}
  })
});

var borrowerIndicatorType = new GraphQLObjectType({
  name: 'BorrowerIndicator',
  description: 'BorrowerIndicator',
  fields: () => ({
    color: {type: GraphQLString},
    block: {type: GraphQLString},
    help_text: {type: GraphQLString},
    icon: {type: GraphQLString},
    name: {type: GraphQLString},
    title: {type: GraphQLString}
  })
});

var borrowerAgreementType = new GraphQLObjectType({
  name: 'borrowerAgreementField',
  description: 'BorrowerAgreeField',
  fields: () => ({
    debtSum: {type: valueStoreType},
    kpItems: {type: new GraphQLList(borrowerAgreementKpItemsType)},
    color: {type: GraphQLString},
    status: {type: GraphQLString},
    statusMessage: {type: GraphQLString}
  })
});

var borrowerAgreementKpItemsType = new GraphQLObjectType({
  name: 'borrowerAgreementKpItemsField',
  description: 'borrowerAgreementKpItemsField',
  fields: () => ({
    credit: {type: GraphQLString},
    currency: {type: GraphQLString},
    dateEnd: {type: GraphQLString},
    dateStart: {type: GraphQLString},
    debtSum: {type: GraphQLString},
    rate: {type: GraphQLString}
  })
});


var borrowerClientType = new GraphQLObjectType({
  name: 'BorrowerClient',
  description: 'BorrowerClient',
  fields: () => ({
    id: {type: GraphQLString},
    agreementsCount: {type: GraphQLInt},
    color: {type: GraphQLString},
    status: {type: GraphQLString},
    statusMessage: {type: GraphQLString},
    courator: {type: GraphQLString},
    debtSum: {type: valueStoreType},
    groupCodes: {type: GraphQLString},
    legal: {type: GraphQLString},
    name: {type: GraphQLString},
    number: {type: GraphQLString},
    okved: {type: GraphQLString},
    tin: {type: GraphQLString}
  })
  //interfaces: [nodeInterface],
});
var cashFlowFieldType = new GraphQLObjectType({
  name: 'BorrowerClientCashFlow',
  description: 'BorrowerClientCashFlowField',
  fields: () => ({
    balanceSum: {type: valueStoreType},
    color: {type: GraphQLString},
    status: {type: GraphQLString},
    statusMessage: {type: GraphQLString},
    billsCount: {type: GraphQLInt},
    debtSum: {type: valueStoreType},
    creditSum: {type: valueStoreType},
    dateEnd: {type: GraphQLString},
    dateStart: {type: GraphQLString}
  })
});

var borrowerProcutionItemsType = new GraphQLObjectType({
  name: 'BorrowerProcutionItemsFields',
  description: 'BorrowerProcutionItemsFields',
  fields: () => ({
    "caption": {type: GraphQLString},
    "items":{type: valueStoreType}
  })
});

var borrowerProcutionType = new GraphQLObjectType({
  name: 'BorrowerProcutionField',
  description: 'BorrowerProcutionField',
  fields: () => ({
    items: {type: new GraphQLList(borrowerProcutionItemsType)},
    totalSum: {type: GraphQLString }
  })
});


var borrowerFieldType = new GraphQLObjectType({
  name: 'BorrowerField',
  description: 'BorrowerField',
  fields: () => ({
    //id: globalIdField('BorrowerField'),
    count: {type: GraphQLString},
    totalSum: {type: GraphQLString},
    haveAny: {type: GraphQLString},
    color: {type: GraphQLString},
    status: {type: GraphQLString},
    statusMessage: {type: GraphQLString},
    procSumCaptions: {type: GraphQLString},
    calcReserveSum: {type: valueStoreType},
    realReserveSum: {type: valueStoreType},
    procutionSum: {type: valueStoreType}
  })
  //interfaces: [nodeInterface],
});

var borrowersStatsType = new GraphQLObjectType({
  name: 'BorrowersStats',
  description: 'BorrowersStats',
  fields: () => ({
    //id: globalIdField('BorrowersStats'),
    results: {type: new GraphQLList(borrowersStatsItemType)}
  })
  //interfaces: [nodeInterface],
});

var borrowersSingleGroupType = new GraphQLObjectType({
  name: 'BorrowersSingleGroup',
  description: 'BorrowersSingleGroup',
  fields: () => ({
    //id: globalIdField('BorrowersStats'),
    results: {type: new GraphQLList(borrowersSingleGroupItemType)}
  })
  //interfaces: [nodeInterface],
});

var borrowersSingleGroupItemType = new GraphQLObjectType({
  name: 'BorrowersSingleGroupItem',
  description: 'BorrowersSingleGroupItem',
  fields: () => ({
    //id: globalIdField('BorrowersStats'),
    category: {type: borrowersCategoryType},
    date: {type: GraphQLString}
  })
  //interfaces: [nodeInterface],
});

var borrowersStatsItemType = new GraphQLObjectType({
  name: 'BorrowersStatsItem',
  description: 'BorrowersStatsItem',
  fields: () => ({
    //id: globalIdField('BorrowersStatsItem'),
    date: {type: GraphQLString},
    generalDebt: {type: GraphQLString},
    generalDelay: {type: GraphQLString},
    generalDelayPercent: {type: GraphQLString}
  })
  //interfaces: [nodeInterface],
});

///////////////revenuesexpenses

var revenuesExpensesGroupType = new GraphQLObjectType({
  name: 'RevenuesExpensesGroup',
  description: 'RevenuesExpensesGroup',
  fields: () => ({
    //id: globalIdField('RevenuesExpensesGroup'),
    credit_total: {type: GraphQLString},
    group_number: {type: GraphQLString},
    type: {type: GraphQLString}
  }),
  //interfaces: [nodeInterface],
});

var revenuesExpensesDataType = new GraphQLObjectType({
  name: 'RevenuesExpensesData',
  description: 'RevenuesExpensesData',
  fields: () => ({
    //id: globalIdField('RevenuesExpensesData'),
    money: {type: GraphQLString},
    name: {type: GraphQLString},
    nesting: {type: GraphQLString},
    type: {type: GraphQLString}
  })
  //interfaces: [nodeInterface],
});

var revenuesExpensesType = new GraphQLObjectType({
  name: 'RevenuesExpenses',
  description: 'RevenuesExpenses',
  fields: () => ({
    //id: globalIdField('RevenuesExpenses'),
    datestamp: {type: GraphQLString},
    groups: {type: new GraphQLList(revenuesExpensesGroupType)},
    data: {type: new GraphQLList(revenuesExpensesDataType)}
  })
  //interfaces: [nodeInterface],
});

var revenuesExpensesDashboardType = new GraphQLObjectType({
  name: 'RevenuesExpensesDashboard',
  description: 'RevenuesExpensesDashboard',
  fields: () => ({
    id: globalIdField('RevenuesExpensesDashboard'),
    results: {type: new GraphQLList(revenuesExpensesType)}
  }),
  interfaces: [nodeInterface]
});

///////////////offbalanced assets

var valueStoreType = new GraphQLObjectType({
  name: 'ValueStore',
  description: 'Value store type',
  fields: () => ({
    percent: {type: GraphQLString},
    currency: {type: GraphQLString},
    label: {type: GraphQLString},
    description: {type: GraphQLString},
    value: {type: GraphQLString}
  })

});

var assetResultsType = new GraphQLObjectType({
  name: 'AssetResults',
  description: 'Asset results',
  fields: () => ({
    //id: globalIdField('Asset'),
    id: {type: GraphQLString},
    currentPrice: {type: valueStoreType},
    dates: {type: new GraphQLList(GraphQLString)},
    description: {type: GraphQLString},
    manager: {type: GraphQLString},
    method: {type: GraphQLString},
    name: {type: GraphQLString},
    owner: {type: GraphQLString},
    price: {type: valueStoreType},
    profit: {type: GraphQLString},
    status: {type: GraphQLString},
    type: {type: GraphQLString},
  }),
  //interfaces: [nodeInterface],
});

var assetType = new GraphQLObjectType({
  name: 'Asset',
  description: 'Asset',
  fields: () => ({
    //id: globalIdField('Asset'),
    currentPage: {type: GraphQLInt},
    numPages: {type: GraphQLInt},
    pageSize: {type: GraphQLInt},
    results: {type: new GraphQLList(assetResultsType)}
  }),
  //interfaces: [nodeInterface],
});

var assetsSummary = new GraphQLObjectType({
  name: 'AssetsSummary',
  description: 'Assets summary',
  fields: ()=>({
    bad: {type: valueStoreType},
    good: {type: valueStoreType}

  })
});

var assetsDashboardType = new GraphQLObjectType({
  name: 'AssetsDashboard',
  description: 'Assets dashboard',
  fields: ()=> ({
    bad: {type: assetType},
    good: {type: assetType},
    summary: {type: assetsSummary}
  })
});

////////////////

/**
 * Define your own connection types here
 */
//var {connectionType: widgetConnection} =
//  connectionDefinitions({name: 'Widget', nodeType: widgetType});

/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
var analyticsType = new GraphQLObjectType({
  name: 'Analytics',
  fields: () => ({
    //id: globalIdField('Analytics'),
    // Add your own root fields here
    assetsDashboard: {
      type: assetsDashboardType,
      args: {
        sdate: {type: GraphQLString},
        edate: {type: GraphQLString},
        goodPageNumber: {type: GraphQLInt},
        goodPageSize: {type: GraphQLInt},
        badPageNumber: {type: GraphQLInt},
        badPageSize: {type: GraphQLInt}
      },
      resolve: (data, {sdate, edate, goodPageSize, goodPageNumber, badPageSize, badPageNumber}) => getAssetsDashboard(sdate, edate, goodPageSize, goodPageNumber, badPageSize, badPageNumber)
    },
    revenuesExpensesDashboard: {
      type: revenuesExpensesDashboardType,
      args: {
        sdate: {type: GraphQLString},
        edate: {type: GraphQLString}
      },
      resolve: (data, {sdate, edate}) => {
        return getRevenuesExpensesDashboard(sdate, edate);
      }
    },
    borrowersDashboard: {
      type: borrowersDashboardType,
      args: {
        date: {type: GraphQLString}
      },
      resolve: (data, {date}) => {
        return getBorrowersDashboard(date);
      }
    },
    borrowersDetails: {
      type: borrowersDetailsType,
      args: {
        date: {type: GraphQLString},
        group: {type: GraphQLString},
        entity: {type: GraphQLString},
        pageNumber: {type: GraphQLInt},
        pageSize: {type: GraphQLInt},
        search: {type: GraphQLString},
        indicators: {type: GraphQLString},
      },
      resolve: (data, {date, group, entity, pageNumber, pageSize, search, indicators}) => {
        return getBorrowersDetails(date, group, entity, pageNumber, pageSize, search, indicators);
      }
    },

    borrowersTypeahead: {
      type: allTypeaheadType,
        args: {
        search: {type:GraphQLString},
        group: {type: GraphQLString}
      },
      resolve: (data, {search, group}) => {
        return getBorrowersTypeahead(search, group);
      }
    },

    cashflowTypeahead: {
      type: allTypeaheadType,
        args: {
        search: {type:GraphQLString}
      },
      resolve: (data, {search}) => {
        return getCashflowTypeahead(search);
      }
    },

    borrowersClientSaldo: {
      type: borrowersClientSaldoType,
      args: {
        date: {type: GraphQLString},
        loaner: {type: GraphQLString}//,
        //pageNumber: {type: GraphQLInt},
        //pageSize: {type: GraphQLInt},
      },
      resolve: (data, {loaner, date }) => {
        return getBorrowersClientDetails(date, loaner, 'saldo');
      }
    },
    borrowersSingleGroup: {
      type: borrowersSingleGroupType,
      args: {
        group: {type: GraphQLString}
      },
      resolve: (data, {group}) => {
        return getBorrowersSingleGroup(group);
      }
    },
    borrowersClientLoanPortfolio: {
      type: borrowersClientLoanPortfolioType,
      args: {
        date: {type: GraphQLString},
        loaner: {type: GraphQLString},
        //pageNumber: {type: GraphQLString},
        //pageSize: {type: GraphQLString},
      },
      resolve: (data, {loaner, date }) => {
        return getBorrowersClientDetails(date, loaner, 'loan_portfolio');
      }
    },
    borrowersStats: {
      type: borrowersStatsType,
      resolve: () => getBorrowersStats()
    },
    basDashboard: {
      type: BasDashboardType,
      resolve: () => getBasDashboard()
    },
    cashflowClients: {
      type: cashflowClientsType,
      args: {
        type: {type: GraphQLString},
        sdate: {type: GraphQLString},
        edate: {type: GraphQLString},
        indicators: {type: GraphQLString},
        ordering: {type: GraphQLString},
        pageNumber: {type: GraphQLInt},
        pageSize: {type: GraphQLInt},
        search: {type: GraphQLString},
      },
      resolve: (data, {type, sdate, edate, pageNumber, pageSize, indicators, ordering, search}) => getCashflowClients(type, sdate, edate, pageNumber, pageSize, indicators, ordering, search)
    },
    cashflowTaxes: {
      type: cashflowTaxesType,
      args: {
        client: {type: GraphQLString},
        sdate: {type: GraphQLString},
        edate: {type: GraphQLString}
      },
      resolve: (data, {client, sdate, edate}) => getCashflowTaxes(client, sdate, edate)
    },

    cashflowDashboard: {
      type: cashflowDashboardType,
      args: {
        sdate: {type: GraphQLString},
        edate: {type: GraphQLString}
      },
      resolve: (data, {sdate, edate}) => getCashflowDashboard(sdate, edate)
    },

    livingMoneyDashboard: {
      type: livingMoneyDashboardType,
      args: {
        sdate: {type: GraphQLString},
        edate: {type: GraphQLString}
      },
      resolve: (data, {sdate, edate}) => {
        return getLivingMoneyDashboard(sdate, edate);
      }
    },
    livingMoneyOtherBanks: {
      type: livingMoneyOtherBanksType,
      args: {
        date: {type: GraphQLString}
      },
      resolve: (data, {date}) => {
        return getLivingMoneyOtherBanks(date);
      }
    },

    livingMoneyInterbankLending: {
      type: livingMoneyInterbankLendingType,
      args: {
        date: {type: GraphQLString}
      },
      resolve: (data, {date}) => {
        return getLivingMoneyInterbankLending(date);
      }
    },

    livingMoneySecurities: {
      type: livingMoneySecuritiesType,
      args: {
        date: {type: GraphQLString}
      },
      resolve: (data, {date}) => {
        return getLivingMoneySecurities(date);
      }
    }

  })
});

var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    // Add your own root fields here
    analytics: {
      type: analyticsType,
      resolve: () => getAnalytics()
    },
  })
});

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
//var mutationType = new GraphQLObjectType({
//  name: 'Mutation',
//  fields: () => ({
//    // Add your own mutations here
//  })
//});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export var Schema = new GraphQLSchema({
  query: queryType,
  // Uncomment the following after adding some mutation fields:
  // mutation: mutationType
});