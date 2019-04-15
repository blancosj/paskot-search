import React from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'
import 'terminal.css'
import './style/app.css'
import _ from 'lodash'
import ItemFound from './ItemFound'
import ItemFoundTable from './ItemFoundTable'
import ItemFoundImage from './ItemFoundImage'
import AdsItem from './AdsItem'
import { Provider, connect } from 'react-redux'
import { searchRequest, filterResults, cleanResults } from './store'
import { withRouter } from "react-router"

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

  DEFAULT_SEARCH = 'today'

  PAGE_TITLE = 'Paskot Search'

  constructor(props) {
    super(props)

    this.search = React.createRef()
    this.state = this.INITIAL_STATE
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { search } = this.props
    const { doNewSearch, q } = search

    doNewSearch && this.doSearch(_.defaultTo(q, this.DEFAULT_SEARCH))
  }

  doSearch(q) {
    this.props.dispatch(searchRequest(q))

    this.props.history.push(`?q=${q}`)
    document.title = `${this.PAGE_TITLE} | ${q}`
  }

  handleOnSubmit(event) {
    event.preventDefault()
    this.doSearch(this.search.current.value)
  }

  handleOnReset(event) {
    this.props.dispatch(cleanResults())
  }

  handleOnClick(event) {

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
    const adsPos = Math.floor(Math.random() * results.length)

    const filteredResults = _.findIndex(['all', ''], (o) => o === filter) > -1
      ? results
      : _.filter(results, (o) => o['source'] === filter)

    return (
      <div class="container">
        <div class="terminal-nav">
          <div class="terminal-search">
            <form class="form-search" action="#" method="post"
                onReset={::this.handleOnReset}
                onSubmit={::this.handleOnSubmit}>
              <div class="search-input">
                <input id="search" name="search" type="text"
                  class="search-box" placeholder=" "
                  ref={this.search} required="" minlength="2"
                  autocomplete="off" autofocus="on"
                  onChange={_.debounce(::this.handleOnSubmit, 520)}
                  />
                <button class="delete-icon" type="reset">X</button>
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
                { !searching && !_.isEmpty(results) && !_.isEmpty(q) && <header>{results.length} results for <ins>{q}</ins>.</header> }
                <p class="email-contact"><a href="mailto:search@paskot.com">send email here to be listed in this index</a></p>
              </div>
              {
                _.map(filteredResults, (value, key, collection) => {
                  switch (value.typeItem) {
                    case 'IMAGE':
                      return ( <ItemFoundImage finding={value} /> )
                    case 'TABLE':
                      return ( <ItemFoundTable finding={value} /> )
                    case 'ADS':
                      return ( <AdsItem/> )
                    default:
                      return ( <ItemFound finding={value} /> )
                  }
                })
              }
              { !_.isEmpty(results) && <hr/> }
            </main>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(connect(
  (state, ownProps) => {
    return {
      search: _.get(state, 'search', { q: '', results: [] }),
      bootstrapped: _.get(state, 'bootstrapped')
    }
  },
)(App))
