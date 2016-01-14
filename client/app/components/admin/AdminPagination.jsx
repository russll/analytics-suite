import React, { Component } from 'react';

import './AdminPagination.styl';

const ranges = {
  first: 3,
  side: 1,
  last: 2
};

export default class AdminPagination extends Component {

  _onClick (page, e) {
    e.preventDefault();
    this.props.callback(page);
  }

  render () {

    function createRange(number) {
      let arr = [];
      for (let i = 1; i <= number; i++) {
        arr.push(i);
      }
      return arr;
    }

    function createElement(page) {
      let cur = this.props.currentPage,
          len = this.props.numPages,
          isCurrent = (page === cur),
          isInRange = (page >= 1 && page <= ranges.first) ||
                      (page >= cur - ranges.side && page <= cur + ranges.side) ||
                      (page > len - ranges.last && page <= len);
      if (isInRange) {
        createElement.gapFlag = false;
        if (isCurrent) {
          return (<span>{page}&nbsp;</span>);
        } else {
          return (<span><a href="#" onClick={this._onClick.bind(this, page)}>{page}</a>&nbsp;</span>);
        }
      } else {
        let result = createElement.gapFlag ? null : (<span>...&nbsp;</span>);
        createElement.gapFlag = true;
        return result;
      }
    }

    let pagesList = createRange(this.props.numPages).map(createElement, this);

    return (<div className="admin-pagination">{pagesList}</div>);

  }

}