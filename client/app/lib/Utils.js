export default class {

  decorateStatusMessage(msg) {
    switch (msg) {
      case 'no_data':
      default:
        return 'Нет данных';
    }
  }

  /*
   * create Path from url & object for get or history request
   * @params
   *   URL = '/path/to/component?'
   *   obkject = { 'name' : 'Vasya', ... }
   *
   *  returns: '/path/to/component?name=Vasya'
   */
  cPath(url, obj) {
    return url + Object.keys(obj).map(function (key) {
        if (null === obj[key] || 'undefined' === typeof obj[key]) obj[key] = '';
        return key + '=' + obj[key] || '';
      }).join('&');
  };

  /* Returns Url params in simple object.
   *  URL: http://ibas.ru?name=vasya&date=01.02.03
   *  return:
   *  {   'name':'vasya', 'date':'01.02.03'  }
   */

  // Depreacted!. use: this.props.route.location.query || location.pathname TODO: remove.

  getUrlParamas() {
    let str = window.location.search;
    let objURL = {};
    str.replace(
      new RegExp('([^?=&]+)(=([^&]*))?', 'g'),
      function ($0, $1, $2, $3) {
        objURL[$1] = $3;
      }
    );
    return objURL;
  }


  /*
   * caseType(string)  return shortcut type (string)
   *
   * @Params:
   * in: @type data type (string)
   * out: @type shortcut type (string)
   */

  ct(type) {
    switch (type) {
      case '%':
        type = '%';
        break;
      case 'RUR':
      case 'RUB':
        type = '₽';
        break;
      case 'USD':
        type = '$';
        break;
      case 'EUR':
        type = '€';
        break;
      default:
        type = '';
    }
    return type;
  }


  /*
   decorateMoney
   @prams (Value, [ Nubers after dot, decimal delimiter, thousand separator, currency sign( any string )])
   usage: _decorateMoney(-123456789.12345, 2, '.', ',', 'р.'); -> -123,456,789.12р.
   or default: dm(-123456789.12345); -> -123 456 789 р.
   */
  dm(n, c, d, t, v) {
    if (isNaN(Number(n))) return n;
    n = Number(n);
    if (!n || typeof n === 'string') return n;
    c = c || 0;
    d = d || '.';
    t = t || ' ';
    v = v || ' ';
    var c = isNaN(c = Math.abs(c)) ? 2 : c,
      d = d == undefined ? '.' : d,
      t = t == undefined ? ',' : t,
      v = v || '',
      s = n < 0 ? '-' : '',
      i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + '',
      j = (j = i.length) > 3 ? j % 3 : 0;

    return s + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '') + ' ' + v;
  }

  /*
   format for Date

   @params ('yyyy,mm,dd', 1)
   where mm (0 = january, 11= december )

   */
  dc(date, format) {
    format = format || 4;
    if (date) {

      date = new Date(date);

      var month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
      var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      var year = date.getFullYear();
      var yearShort = date.getFullYear().toString().slice(2);

      let actions = {
        1: ()=> {
          return day + '/' + month + '/' + yearShort
        },
        2: ()=> {
          return month + '/' + yearShort
        },
        3: ()=> {
          return day + '-' + month + '-' + year
        },
        4: ()=> {
          return year + '-' + month + '-' + day
        }
      };

      return actions[format]();
      //if (format == '1') return day + '/' + month + '/' + yearShort;
      //else if (format == '2') return month + '/' + yearShort;
      //else if (format == '3') return day + '-' + month + '-' + year;
    }
  }


  /*
   Date string to normal view ( 2015-12-25 -> 25/12/2015 ):

   @params: strting(YYYY-MM-DD)
   @returns: DD/MM/YYYY
   */
  dsn(yyyymmdd) {
    return yyyymmdd.split('-').reverse().join('/');
  }


  /*
   DateToString    Convert js date object to formatted string, like 2015-20-01
   @params (date = new Date(), hr = 'delimiter')   Human readable
   returns: YYYY/MM/DD  /   DD-MM-YYYY
   */
  dts(date, hr) {
    if (!date) return;
    if (hr)hr = hr || '/';
    let yyyy = date.getFullYear().toString(),
      mm = (date.getMonth() + 1).toString(),
      dd = date.getDate().toString();
    if (hr) {
      return (dd[1] ? dd : '0' + dd[0]) + hr + (mm[1] ? mm : '0' + mm[0]) + hr + yyyy;
    } else {
      return yyyy + '-' + (mm[1] ? mm : '0' + mm[0]) + '-' + (dd[1] ? dd : '0' + dd[0]);
    }
  }

  /*
   String to date
   @params (str = '2015-10-14' )
   returns: js Date object
   */
  std(YYYY_MM_DD) {
    if (!YYYY_MM_DD) return;
    let str = YYYY_MM_DD.split('-');
    return new Date(str[0], str[1] - 1, str[2]);
  }

}
