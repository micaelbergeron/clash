import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import keycode from 'keycode';
import TextField from 'material-ui/TextField';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Popover from 'material-ui/Popover/Popover';
import propTypes from 'material-ui/utils/propTypes';
import Events from 'material-ui/utils/events';

const SelectableList = makeSelectable(List);

function getStyles(props, context, state) {
  const {anchorEl} = state;
  const {fullWidth} = props;

  const styles = {
    root: {
      display: 'inline-block',
      position: 'relative',
      width: fullWidth ? '100%' : 256,
    },
    menu: {
      width: '100%',
    },
    list: {
      display: 'block',
      width: fullWidth ? '100%' : 256,
    },
    innerDiv: {
      overflow: 'hidden',
    },
  };

  if (anchorEl && fullWidth) {
    styles.popover = {
      width: anchorEl.clientWidth,
    };
  }

  return styles;
}

class AutoComplete extends Component {
  static propTypes = {
    /**
     * Location of the anchor for the auto complete.
     */
    anchorOrigin: propTypes.origin,
    /**
     * If true, the auto complete is animated as it is toggled.
     */
    animated: PropTypes.bool,
    /**
     * Override the default animation component used.
     */
    animation: PropTypes.func,
    /**
     * Array of strings or nodes used to populate the list.
     */
    dataSource: PropTypes.array.isRequired,
    /**
     * Config for objects list dataSource.
     *
     * @typedef {Object} dataSourceConfig
     *
     * @property {string} text `dataSource` element key used to find a string to be matched for search
     * and shown as a `TextField` input value after choosing the result.
     * @property {string} value `dataSource` element key used to find a string to be shown in search results.
     */
    dataSourceConfig: PropTypes.object,
    /**
     * Disables focus ripple when true.
     */
    disableFocusRipple: PropTypes.bool,
    /**
     * Override style prop for error.
     */
    errorStyle: PropTypes.object,
    /**
     * The error content to display.
     */
    errorText: PropTypes.node,
    /**
     * Callback function used to filter the auto complete.
     *
     * @param {string} searchText The text to search for within `dataSource`.
     * @param {string} key `dataSource` element, or `text` property on that element if it's not a string.
     * @returns {boolean} `true` indicates the auto complete list will include `key` when the input is `searchText`.
     */
    filter: PropTypes.func,
    /**
     * The content to use for adding floating label element.
     */
    floatingLabelText: PropTypes.node,
    /**
     * If true, the field receives the property `width: 100%`.
     */
    fullWidth: PropTypes.bool,
    /**
     * The hint content to display.
     */
    hintText: PropTypes.node,
    /**
     * Override style for list.
     */
    listStyle: PropTypes.object,
    /**
     * The max number of search results to be shown.
     * By default it shows all the items which matches filter.
     */
    maxSearchResults: PropTypes.number,
    /**
     * Delay for closing time of the menu.
     */
    menuCloseDelay: PropTypes.number,
    /**
     * Props to be passed to menu.
     */
    menuProps: PropTypes.object,
    /**
     * Override style for menu.
     */
    menuStyle: PropTypes.object,
    /** @ignore */
    onBlur: PropTypes.func,
    /**
     * Callback function fired when the menu is closed.
     */
    onClose: PropTypes.func,
    /** @ignore */
    onFocus: PropTypes.func,
    /** @ignore */
    onKeyDown: PropTypes.func,
    /**
     * Callback function that is fired when a list item is selected, or enter is pressed in the `TextField`.
     *
     * @param {string} chosenRequest Either the `TextField` input value, if enter is pressed in the `TextField`,
     * or the text value of the corresponding list item that was selected.
     * @param {number} index The index in `dataSource` of the list item selected, or `-1` if enter is pressed in the
     * `TextField`.
     */
    onNewRequest: PropTypes.func,
    /**
     * Callback function that is fired when the user updates the `TextField`.
     *
     * @param {string} searchText The auto-complete's `searchText` value.
     * @param {array} dataSource The auto-complete's `dataSource` array.
     * @param {object} params Additional information linked the update.
     */
    onUpdateInput: PropTypes.func,
    /**
     * Auto complete menu is open if true.
     */
    open: PropTypes.bool,
    /**
     * If true, the list item is showed when a focus event triggers.
     */
    openOnFocus: PropTypes.bool,
    /**
     * Props to be passed to popover.
     */
    popoverProps: PropTypes.object,
    /**
     * Text being input to auto complete.
     */
    searchText: PropTypes.string,
    /**
     * Override the inline-styles of the root element.
     */
    style: PropTypes.object,
    /**
     * Origin for location of target.
     */
    targetOrigin: propTypes.origin,
    /**
     * Override the inline-styles of AutoComplete's TextField element.
     */
    textFieldStyle: PropTypes.object,
  };

  static defaultProps = {
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'left',
    },
    animated: true,
    dataSourceConfig: {
      text: 'text',
      value: 'value',
    },
    disableFocusRipple: true,
    filter: (searchText, key) => searchText !== '' && key.indexOf(searchText) !== -1,
    fullWidth: false,
    open: false,
    openOnFocus: false,
    onUpdateInput: () => {},
    onNewRequest: () => {},
    searchText: '',
    menuCloseDelay: 300,
    targetOrigin: {
      vertical: 'top',
      horizontal: 'left',
    },
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  state = {
    anchorEl: null,
    open: false,
    searchText: undefined,
    selectedIndex: -1,
  };

  componentWillMount() {
    this.requestsList = [];
    this.setState({
      open: this.props.open,
      searchText: this.props.searchText,
    });
    this.timerTouchTapCloseId = null;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.searchText !== nextProps.searchText) {
      this.setState({
        searchText: nextProps.searchText,
      });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timerTouchTapCloseId);
    clearTimeout(this.timerBlurClose);
  }

  close() {
    this.setState({
      open: false,
      anchorEl: null,
      selectedIndex: -1,
    });
    
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  handleMouseDown = (event) => {
    // Keep the TextField focused
    event.preventDefault();
  };

  chosenRequestText = (chosenRequest) => {
    if (typeof chosenRequest === 'string') {
      return chosenRequest;
    } else {
      return chosenRequest[this.props.dataSourceConfig.text];
    }
  };

  handleEscKeyDown = () => {
    this.close();
  };

  handleItemTouchTap = (event) => {
    const searchText = this.getSelectedItem().text;
    this.setState({
      open: false,
      searchText: searchText,
    }, () => {
      this.props.onUpdateInput(searchText, this.props.dataSource, {
        source: 'touchTap',
      });
    });

    this.timerTouchTapCloseId = setTimeout(() => {
      this.timerTouchTapCloseId = null;
      this.close();

    }, this.props.menuCloseDelay);
  };

  handleKeyDown = (event) => {
    if (this.props.onKeyDown) this.props.onKeyDown(event);

    let selectedIndex = -1;
    let preventDefault = true

    switch (keycode(event)) {
      case 'enter':
        this.update('keyboard')
        this.close();
        break;

      case 'esc':
        this.close();
        break;

      case 'down':
        selectedIndex = (this.state.selectedIndex + 1) % this.requestsList.length 
        this.setState({
          open: true,
          anchorEl: ReactDOM.findDOMNode(this.refs.searchTextField),
          selectedIndex: selectedIndex,
        });
        break;

      case 'up':
        selectedIndex = Math.max(this.state.selectedIndex - 1, -1)
        this.setState({
          open: true,
          anchorEl: ReactDOM.findDOMNode(this.refs.searchTextField),
          selectedIndex: selectedIndex,
        });
        break;

      default:
        preventDefault = false
        break;
    }

    if (preventDefault)
      event.preventDefault()
  };

  getSelectedItem(index) {
    const idx = index === undefined ? this.state.selectedIndex : index;
    return this.requestsList && this.requestsList[idx];
  };

  handleChange = (event) => {
    const searchText = event.target.value;

    // Make sure that we have a new searchText.
    // Fix an issue with a Cordova Webview
    if (searchText === this.state.searchText) {
      return;
    }

    this.setState({
      searchText: searchText,
      open: true,
      anchorEl: ReactDOM.findDOMNode(this.refs.searchTextField),
    }, () => {
      this.props.onUpdateInput(searchText, this.props.dataSource, {
        source: 'change',
      });
    });
  };

  handleItemChange = (event, index) => {
    const selectedItem = this.getSelectedItem(index)

    this.setState({
      selectedIndex: selectedItem ? index : -1,
    }, () => {
      this.timerTouchTapCloseId = setTimeout(() => {
        this.timerTouchTapCloseId = null;
        this.update('touchtap')
        this.close()
      }, this.props.menuCloseDelay);
    });
  }

  handleFocus = (event) => {
    console.info(event);
    
    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
  };

  update(source, idx) {
    const selectedItem = this.getSelectedItem(idx);
    if (!selectedItem) {
      this.close()
      return
    }
    
    const searchText = selectedItem.text
    this.setState({
      searchText,
      selectedIndex: -1,
      open: false,
    }, () => {
      this.props.onUpdateInput(
        searchText,
        this.props.dataSource,
        { source }
      )
    })
  }

  // this is nasty side effect, but still better than losing focus
  createRequestList() {
    const {
      anchorOrigin,
      animated,
      animation,
      dataSource,
      dataSourceConfig, // eslint-disable-line no-unused-vars
      disableFocusRipple,
      errorStyle,
      floatingLabelText,
      filter,
      fullWidth,
      style,
      hintText,
      maxSearchResults,
      menuCloseDelay, // eslint-disable-line no-unused-vars
      textFieldStyle,
      menuStyle,
      menuProps,
      listStyle,
      targetOrigin,
      onClose, // eslint-disable-line no-unused-vars
      onNewRequest, // eslint-disable-line no-unused-vars
      onUpdateInput, // eslint-disable-line no-unused-vars
      openOnFocus, // eslint-disable-line no-unused-vars
      popoverProps,
      searchText: searchTextProp, // eslint-disable-line no-unused-vars
      ...other
    } = this.props;

    const {
      style: popoverStyle,
      ...popoverOther
    } = popoverProps || {};

    const {
      open,
      anchorEl,
      searchText,
      focusTextField,
      selectedIndex,
    } = this.state;

    const {prepareStyles} = this.context.muiTheme;
    const styles = getStyles(this.props, this.context, this.state);
    const requestsList = [];

    dataSource.every((item, index) => {
      switch (typeof item) {
        case 'string':
          if (filter(searchText, item, item)) {
            requestsList.push({
              text: item,
              value: (
                <ListItem
                    value={requestsList.length}
                    key={index}
                    primaryText={item}
                    innerDivStyle={styles.innerDiv}
                    disableFocusRipple={disableFocusRipple}
                />),
            });
          }
          break;

        case 'object':
          if (item && typeof item[this.props.dataSourceConfig.text] === 'string') {
            const itemText = item[this.props.dataSourceConfig.text];
            if (!this.props.filter(searchText, itemText, item)) break;

            const itemValue = item[this.props.dataSourceConfig.value];
            if (itemValue.type && (itemValue.type.muiName === ListItem.muiName ||
                                   itemValue.type.muiName === Divider.muiName)) {
              requestsList.push({
                text: itemText,
                value: React.cloneElement(itemValue, {
                  key: index,
                  value: requestsList.length,
                  disableFocusRipple: disableFocusRipple,
                }),
              });
            } else {
              requestsList.push({
                text: itemText,
                value: (
                  <ListItem
                      value={requestsList.length}
                      key={index}
                      innerDivStyle={styles.innerDiv}
                      primaryText={itemText}
                      disableFocusRipple={disableFocusRipple}
                  />),
              });
            }
          }
          break;

        default:
          // Do nothing
      }

      return !(maxSearchResults && maxSearchResults > 0 && requestsList.length === maxSearchResults);
    });

    this.requestsList = requestsList;
  }

  focus() {
    this.refs.searchTextField.focus();
  }

  render() {
    const {
      anchorOrigin,
      animated,
      animation,
      dataSource,
      dataSourceConfig, // eslint-disable-line no-unused-vars
      disableFocusRipple,
      errorStyle,
      floatingLabelText,
      filter,
      fullWidth,
      style,
      hintText,
      maxSearchResults,
      menuCloseDelay, // eslint-disable-line no-unused-vars
      textFieldStyle,
      menuStyle,
      menuProps,
      listStyle,
      targetOrigin,
      onClose, // eslint-disable-line no-unused-vars
      onNewRequest, // eslint-disable-line no-unused-vars
      onUpdateInput, // eslint-disable-line no-unused-vars
      openOnFocus, // eslint-disable-line no-unused-vars
      popoverProps,
      searchText: searchTextProp, // eslint-disable-line no-unused-vars
      ...other
    } = this.props;

    const {
      style: popoverStyle,
      ...popoverOther
    } = popoverProps || {};

    const {
      open,
      anchorEl,
      searchText,
      focusTextField,
      selectedIndex,
    } = this.state;

    const {prepareStyles} = this.context.muiTheme;
    const styles = getStyles(this.props, this.context, this.state);

    this.createRequestList(); // side-effect
    const requestsList = this.requestsList;
    const menu = open && requestsList.length > 0 && (
      <SelectableList
          {...menuProps}
          ref="menu"
          autoWidth={false}
          disableAutoFocus={true}
          initiallyKeyboardFocused={false}
          onMouseDown={this.handleMouseDown}
          style={Object.assign(styles.list, listStyle)}
          value={this.state.selectedIndex}
          onTouchTap={(e) => this.update('touchtap')}
          onChange={this.handleItemChange}
      >
        {requestsList.map((i) => i.value)}
      </SelectableList>
    );

    return (
      <div style={prepareStyles(Object.assign(styles.root, style))} >
        <TextField
            {...other}
            ref="searchTextField"
            autoComplete="off"
            value={searchText}
            onBlur={() => this.update('blur')}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
            floatingLabelText={floatingLabelText}
            hintText={hintText}
            fullWidth={fullWidth}
            multiLine={false}
            errorStyle={errorStyle}
            style={textFieldStyle}
        />
        <Popover
            style={Object.assign({}, styles.popover, popoverStyle)}
            canAutoPosition={false}
            anchorOrigin={anchorOrigin}
            targetOrigin={targetOrigin}
            open={open}
            anchorEl={anchorEl}
            useLayerForClickAway={false}
            onRequestClose={this.handleRequestClose}
            animated={animated}
            animation={animation}
            {...popoverOther}
        >
          {menu}
        </Popover>
      </div>
    );
  }
}

AutoComplete.levenshteinDistance = (searchText, key) => {
  const current = [];
  let prev;
  let value;

  for (let i = 0; i <= key.length; i++) {
    for (let j = 0; j <= searchText.length; j++) {
      if (i && j) {
        if (searchText.charAt(j - 1) === key.charAt(i - 1)) value = prev;
        else value = Math.min(current[j], current[j - 1], prev) + 1;
      } else {
        value = i + j;
      }
      prev = current[j];
      current[j] = value;
    }
  }
  return current.pop();
};

AutoComplete.noFilter = () => true;

AutoComplete.defaultFilter = AutoComplete.caseSensitiveFilter = (searchText, key) => {
  return searchText !== '' && key.indexOf(searchText) !== -1;
};

AutoComplete.caseInsensitiveFilter = (searchText, key) => {
  return key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
};

AutoComplete.levenshteinDistanceFilter = (distanceLessThan) => {
  if (distanceLessThan === undefined) {
    return AutoComplete.levenshteinDistance;
  } else if (typeof distanceLessThan !== 'number') {
    throw 'Error: AutoComplete.levenshteinDistanceFilter is a filter generator, not a filter!';
  }

  return (s, k) => AutoComplete.levenshteinDistance(s, k) < distanceLessThan;
};

AutoComplete.fuzzyFilter = (searchText, key) => {
  const compareString = key.toLowerCase();
  searchText = searchText.toLowerCase();

  let searchTextIndex = 0;
  for (let index = 0; index < key.length; index++) {
    if (compareString[index] === searchText[searchTextIndex]) {
      searchTextIndex += 1;
    }
  }

  return searchTextIndex === searchText.length;
};

AutoComplete.Item = ListItem;
AutoComplete.Divider = Divider;

export default AutoComplete;
