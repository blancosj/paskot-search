import React from 'react';
import PropTypes from 'prop-types';

class ItemFoundTable extends React.Component {

  static propTypes = {
    finding: PropTypes.any.isRequired
  }

  render() {

    const { finding } = this.props

    return (
      <section class="result-table">
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
                if (key.indexOf('symbol') > -1) {
                  return (
                    <tr>
                      <td>{key}</td>
                      <td><a href={`?q=${value}`}>{value}</a></td>
                    </tr>
                  )
                } else {
                  return (
                    <tr>
                      <td>{key}</td>
                      <td>{value}</td>
                    </tr>
                  )
                }
              })
            }
          </tbody>
        </table>
      </section>
    )
  }
}

ItemFoundTable.defaultProps = {
  finding: 'nothing'
}

export default ItemFoundTable
