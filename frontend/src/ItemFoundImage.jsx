import React from 'react';
import PropTypes from 'prop-types';

class ItemFound extends React.Component {

  static propTypes = {
    finding: PropTypes.any.isRequired,
    Ads: PropTypes.element
  }

  render() {

    const { finding, Ads } = this.props
    const { images } = finding
    const header = {__html: finding.header}
    const content = {__html: finding.content}

    return (
      <section class="result">
        <div class="terminal-card">
          { header &&
            <header dangerouslySetInnerHTML={header}></header>
          }
          { _.map(images, item =>
              (
                <figure>
                  <img src={item['src']} alt='nasa photo' title={item['title']} />
                  {
                    content &&
                      <figaction dangerouslySetInnerHTML={content} />
                  }
                </figure>
              )
            )
          }
        </div>
        { Ads && <Ads/> }
      </section>
    )
  }
}

ItemFound.defaultProps = {
  finding: 'nothing'
};

export default ItemFound
