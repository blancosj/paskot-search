import React from 'react';
import PropTypes from 'prop-types';

class ItemFound extends React.Component {

  static propTypes = {
    finding: PropTypes.any.isRequired,
  }

  render() {

    const { finding } = this.props
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
      </section>
    )
  }
}

// { header &&
//   <header dangerouslySetInnerHTML={header}></header>
// }

// { finding.header &&
//   <h3><div dangerouslySetInnerHTML={header}></div></h3>
// }
// { finding.content &&
//   <p><div dangerouslySetInnerHTML={content}></div></p>
// }

ItemFound.defaultProps = {
  finding: 'nothing'
};

export default ItemFound
