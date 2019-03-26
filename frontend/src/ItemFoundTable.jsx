import React from 'react';
import PropTypes from 'prop-types';

class ItemFoundTable extends React.Component {

  static propTypes = {
    finding: PropTypes.any.isRequired,
  }

  render() {

    const { finding } = this.props

    return (
      <section>
        <pre>
          <h3>{`${finding.header} - ${finding.content.caption}`}</h3>
          <table>
            <thead><tr>
              {
                _.map(finding.content.header, (value, key, collection) => {
                  return (
                    <th>{value}</th>
                  )
                })
              }
            </tr></thead>
            <tbody>
              {
                _.map(finding.content.data, (value, key, collection) => {
                  return (
                    <tr>
                      <td>{key}</td>
                      <td>{value}</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </pre>
      </section>
    )
  }
}

ItemFoundTable.defaultProps = {
  finding: 'nothing'
}

export default ItemFoundTable
