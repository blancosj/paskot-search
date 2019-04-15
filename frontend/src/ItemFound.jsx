import React from 'react';
import PropTypes from 'prop-types';

class ItemFound extends React.Component {

  static propTypes = {
    finding: PropTypes.any.isRequired
  }

  render() {

    const { finding } = this.props
    const header = {__html: finding.header}
    const content = {__html: finding.content}

    return (
      <section class="result-regular">
        { finding.header &&
          <h3><div dangerouslySetInnerHTML={header}></div></h3>
        }
        { finding.content &&
          <p><div dangerouslySetInnerHTML={content}></div></p>
        }
      </section>
    )
  }
}

ItemFound.defaultProps = {
  finding: 'nothing'
};

export default ItemFound
