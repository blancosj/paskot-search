import React from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'
import 'terminal.css'
import './style/app.css'
import _ from 'lodash'
import ItemFound from './ItemFound'
import ItemFoundTable from './ItemFoundTable'
import { Provider, connect } from 'react-redux'
import { searchRequest } from './store'

class App extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  INITIAL_STATE = {
    findings: [],
    search: ''
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
    this.doSearch(this.search.current.value);
  }

  encodeHTML(s) {
      return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }

  render() {

    const { search } = this.props
    const { q, results } = search

    return (
      <div class="container">
        <div class="terminal-nav">
          <div class="terminal-logo">
            <div class="logo terminal-prompt"><a href="#" class="no-style">Search</a></div>
          </div>
        </div>
        <main>
          <section>
            <form class="form-search" action="#" method="post" onSubmit={::this.handleOnSubmit}>
              <div class="search-input">
                <input id="search" name="search" type="text" ref={this.search} required="" minlength="2" autocomplete="off" autofocus="on"/>
                <button class="btn btn-default" onClick={::this.handleOnClick}>Go</button>
              </div>
            </form>
          </section>
          <section class="summary-results">
            { _.isEmpty(results) && !_.isEmpty(q) && <header><p>Nothing found.</p></header> }
            { !_.isEmpty(results) && !_.isEmpty(q) && <p>{results.length} results for <ins>{q}</ins></p> }
          </section>
          {
            _.map(results, (value, key, collection) => {
              switch (value.typeItem) {
                case 'TABLE':
                  return ( <ItemFoundTable finding={value} /> )
                default:
                  return ( <ItemFound finding={value} /> )
              }
            })
          }
          { !_.isEmpty(results) && <hr/> }
        </main>
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
