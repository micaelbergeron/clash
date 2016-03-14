React = require('react')
icons = require.context('../images/icons', true, /\.svg/)

module.exports = (props) ->
  icon = icons('./' + props.glyph + '.svg')
  <svg className={props.className || 'icon'} width={props.width || 32} height={props.height || 32}>
    <use xlinkHref={icon}" />
  </svg>