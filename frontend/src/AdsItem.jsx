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
          data-ad-format="fluid"
          data-ad-layout-key="-fb+5w+4e-db+86"
          data-ad-client="ca-pub-7090864477039814"
          data-ad-slot="8697644025">
        </ins>
      </section>
    )
  }
}

export default AdsItem
