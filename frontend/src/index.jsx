import React from 'react';
import ReactDom from 'react-dom';
import 'terminal.css';
import './style/app.css';

const App = () => (
  <div class="container">
    <section>
      <header><h2 id="Forms">Forms</h2></header>
      <form action="#">
        <fieldset>
          <legend>Form legend</legend>
          <div class="form-group">
            <label for="email">Email input:</label>
            <input id="email" name="email" type="email" required="" minlength="5" placeholder="test"/>
          </div>
        </fieldset>
      </form>
    </section>
  </div>
);

ReactDom.render(<App/>, document.getElementById('syno-nsc-ext-gen3'));
