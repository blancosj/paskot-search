import React from 'react';
import PropTypes from 'prop-types';

class ItemFound extends React.Component {

  static propTypes = {
    finding: PropTypes.any.isRequired,
  }

  render() {

    const { finding } = this.props

    return (
      <section>
        <header><h3>{finding}</h3></header>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita, quas ex vero enim in doloribus officiis ullam vel nam esse sapiente velit incidunt. Eaque quod et, aut maiores excepturi sint.</p>
        <hr/>
      </section>
    )
  }
}

ItemFound.defaultProps = {
  finding: 'nothing'
};

export default ItemFound;
