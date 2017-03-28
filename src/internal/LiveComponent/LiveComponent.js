import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';
import Icon from '@console/bluemix-components-react/dist/components/Icon';
import svgSprite from 'raw!../../assets/bluemix-icons.svg';

class LiveComponent extends Component {
  static propTypes = {
    component: PropTypes.string,
  }

  componentDidMount() {
    let currentComponent = this.props.component;
    currentComponent = currentComponent.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    currentComponent = currentComponent.charAt(0).toUpperCase() + currentComponent.substring(1);
    if (currentComponent === 'Tabs') {
      currentComponent = 'Tab';
    }
    if (window.CarbonComponents[currentComponent]) {
      if (currentComponent === 'Tab') {
        window.CarbonComponents['ContentSwitcher'].init();
      }
      window.CarbonComponents[currentComponent].init();
    }
  }

  renderVariation = (variation) => {
    const classNames = classnames({
      'live-component__component': true,
      [`${variation}`]: true,
    });
    let htmlFile;
    if (this.props.component === 'text-input' && variation === 'text-area') {
      htmlFile = require('carbon-components/src/components/text-area/text-area.html');
    } else if (this.props.component === 'data-table' && variation === 'toolbar') {
      htmlFile = require('carbon-components/src/components/toolbar/toolbar.html');
    } else {
      htmlFile = require(`carbon-components/src/components/${this.props.component}/${variation}.html`);
    }

    if (variation.includes('card')) {
      const oldPath = '/globals/assets/images/placeholder-icon-32x32.svg';
      const newPath = require('../../assets/images/placeholder.svg');
      htmlFile = htmlFile.replace(oldPath, newPath);
    }

    return (
      <div key={variation} className="live-component__variation bx--global-light-ui">
        <div className="svg--sprite" dangerouslySetInnerHTML={{ __html: svgSprite }} />
        <a
          href={`https://github.ibm.com/carbon-design-system/carbon-components/src/components/${this.props.component}`}
          className="live-component__title"
        >
          {variation}.html
        </a>
        <div className={classNames} dangerouslySetInnerHTML={{ __html: htmlFile }} />
      </div>
    );
  }

  render() {
    const {
      component,
    } = this.props;

    const content = require(`../../data/components/${component}.js`); // eslint-disable-line
    const variations = content.variations;
    const variationContent = content.variations ?
      (
        Object.keys(variations).map((variation) => this.renderVariation(variation))
      ) :
      this.renderVariation(component);
    const componentTitle = `${component.charAt(0).toUpperCase()}${component.substring(1)}`;

    return (
      <div className="live-component">
        <Link to={`/components/${component}/code`} className="bx--btn live-component__back-btn">
          <Icon className="live-component__back-btn--icon" name="arrow--left" description="Back button icon" />
          {componentTitle} code page
        </Link>
        {variationContent}
      </div>
    );
  }
}

export default LiveComponent;
