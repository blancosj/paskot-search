import React from 'react'

class AdsItem extends React.Component {

  componentDidMount() {
    (adsbygoogle = window.adsbygoogle || []).push({})
  }

  render() {
    return (
      <section class="results">
        <ins class="adsbygoogle"
             style={{display:"block"}}
             data-ad-test="adtest"
             data-ad-format="fluid"
             data-ad-layout-key="-6p+dg+59-2c-8d"
             data-ad-client="ca-pub-7090864477039814"
             data-ad-slot="8575424326">
        </ins>
      </section>
    )
  }
}

export default AdsItem
