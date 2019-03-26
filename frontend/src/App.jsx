import React from 'react';
import ReactDom from 'react-dom';
import 'terminal.css';
import './style/app.css';
import _ from 'lodash'
import ItemFound from './ItemFound'
import ItemFoundTable from './ItemFoundTable'

class App extends React.Component {

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

    if (_.isEmpty(q)) {
      return;
    }

    fetch('/q', {
      method: 'POST',
      body: JSON.stringify({ s: q }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(json => {
      this.setState(state => {
        return {
          findings: json
        }
      });
    })
  }

  handleOnSubmit(event) {
    event.preventDefault();

    this.doSearch(this.search.current.value);
    this.search.current.value = '';
  }

  handleOnClick(event) {
    this.doSearch(this.search.current.value);
    this.search.current.value = '';
  }

  encodeHTML(s) {
      return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }

  render() {

    const { findings, search } = this.state

    return (
      <div class="container">
        <section>
          <div class="terminal-nav">
            <div class="terminal-logo">
              <div class="logo terminal-prompt"><a href="#" class="no-style">Search</a></div>
            </div>
          </div>
        </section>
        <section>
          <form class="form-search" action="#" method="post" onSubmit={::this.handleOnSubmit}>
            <div class="search-input">
              <input id="search" name="search" type="text" ref={this.search} required="" minlength="2" autocomplete="off" autofocus="on"/>
              <button class="btn btn-default" onClick={::this.handleOnClick}>Go</button>
            </div>
          </form>
        </section>
        {
          _.map(findings, (value, key, collection) => {
            switch (value.typeItem) {
              case 'TABLE':
                return ( <ItemFoundTable finding={value} /> )
              default:
                return ( <ItemFound finding={value} /> )
            }
          })
        }
      </div>
    )
  }
}

ReactDom.render(<App/>, document.getElementById('syno-nsc-ext-gen3'));
