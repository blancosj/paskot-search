import React from 'react';
import ReactDom from 'react-dom';
import 'terminal.css';
import './style/app.css';

const App = () => (
  <div class="container">
    <section>
      <header><h2 id="Cards">Cards</h2></header>
      <div class="terminal-card">
        <header>Card Title</header>
        <div>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita, quas
          ex vero enim in doloribus officiis ullam vel nam esse sapiente velit
          incidunt. Eaque quod et, aut maiores excepturi sint.
        </div>
      </div>
    </section>
  </div>
);

ReactDom.render(<App/>, document.getElementById('syno-nsc-ext-gen3'));
