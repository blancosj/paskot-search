import React from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'
import 'terminal.css'
import './style/app.css'
import _ from 'lodash'
import ItemFound from './ItemFound'
import ItemFoundTable from './ItemFoundTable'
import ItemFoundImage from './ItemFoundImage'
import { Provider, connect } from 'react-redux'
import { searchRequest, filterResults } from './store'

class App extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  INITIAL_STATE = {
    findings: [],
    search: '',
    filter: '',
    q: ''
  }

  constructor(props) {
    super(props);

    this.search = React.createRef();
    this.state = this.INITIAL_STATE;
  }

  doSearch(q) {
    this.props.dispatch(searchRequest(q))
  }

  handleOnSubmit(event) {
    event.preventDefault();

    this.doSearch(this.search.current.value);
  }

  handleOnClick(event) {

  }

  ads() {
    return (
      <section>
        <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
        <ins class="adsbygoogle"
          style={{ display: "block" }}
          data-ad-format="fluid"
          data-ad-layout-key="-fb+5w+4e-db+86"
          data-ad-client="ca-pub-7090864477039814"
          data-ad-slot="8697644025"></ins>
        <script>
             (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
      </section>
    )
  }

  encodeHTML(s) {
      return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }

  filterResults = filter => () => {
    this.props.dispatch(filterResults(filter))
  }

  renderAside() {

    const { search } = this.props
    const { q, results, filter } = search

    if (results.length === 0) {
      return <div></div>;
    }

    let summary = _.mapValues(
      _.groupBy(results, 'source'), (value) => value.length)

    if (!_.isEmpty(summary)) {
      summary['all'] = results.length
    }

    return (
      <div>
        <h2>Summary Results</h2>
        <nav>
          <ul>
            {
              _.map(summary, (value, key, collection) => {
                return (
                  <li>
                      <a href="#" onClick={::this.filterResults(key)}>
                        {`${key}...${value}`}
                        {filter === key && <span>&nbsp;&#x2691;</span>}
                      </a>
                  </li>
                )
              })
            }
          </ul>
        </nav>
      </div>
    )
  }

  render() {

    const { search } = this.props
    const { q, results, filter, searching } = search

    const filteredResults = _.findIndex(['all', ''], (o) => o === filter) > -1
      ? results
      : _.filter(results, (o) => o['source'] === filter)

    return (
      <div class="container">
        <div class="terminal-nav">
          <div class="terminal-search">
            <form class="form-search" action="#" method="post" onSubmit={::this.handleOnSubmit}>
              <div class="search-input">
                <input id="search" name="search" type="text" ref={this.search} required="" minlength="2" autocomplete="off" autofocus="on"/>
                <button class="btn btn-default">Search</button>
              </div>
            </form>
          </div>
        </div>
        <div class="container terminal-container">
          <div class={!_.isEmpty(results) ? "components components-grid" : ""}>
            <aside id="menu">
              {::this.renderAside()}
            </aside>
            <main>
              <div class="summary-results">
                { searching && <header>...</header> }
                { !searching && _.isEmpty(results) && !_.isEmpty(q) && <header>Nothing found.</header> }
                { !searching && !_.isEmpty(results) && !_.isEmpty(q) && <header>{results.length} results for <ins>{q}</ins></header> }
              </div>
              {
                _.map(filteredResults, (value, key, collection) => {
                  switch (value.typeItem) {
                    case 'IMAGE':
                      return ( <ItemFoundImage finding={value} /> )
                    case 'TABLE':
                      return ( <ItemFoundTable finding={value} /> )
                    default:
                      return ( <ItemFound finding={value} /> )
                  }
                })
              }
              { this.ads() }
              { !_.isEmpty(results) && <hr/> }
            </main>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  (state, ownProps) => {
    return {
      search: _.get(state, 'search', { q: '', results: [] }),
      bootstrapped: _.get(state, 'bootstrapped')
    }
  },
)(App)
