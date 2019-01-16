var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}var categories = [
{
  name: "Football Teams",
  items: ["Arsenal", "Chelsea", "Liverpool", "Man City", "Man United", "Tottenham", "Real Madrid", "Barcelona", "Atletico Madrid", "Bayern Munich", "Borussia Dortmund", "Juventus", "Paris Saint Germain", "AC Milan", "Inter Milan", "Ajax"] },

{
  name: "British Bands",
  items: ["The Beatles", "The Rolling Stones", "The Kinks", "The Who", "Queen", "Led Zeppelin", "The Clash", "The Jam", "New Order", "Oasis", "Blur", "Muse", "Arctic Monkeys", "The Cure", "Black Sabbath", "Radiohead"] },

{
  name: "US Presidents",
  items: ["Washington", "Jefferson", "Lincoln", "T. Roosevelt", "F.D. Roosevelt", "Kennedy", "Nixon", "Clinton", "Reagan", "G.W. Bush", "Obama", "Wilson", "Trump", "Truman", "Carter", "Eisenhower"] }];



var blankRound = [
['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
['', '', '', '', '', '', '', ''],
['', '', '', ''],
['', '']];


function shuffle(a) {
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));var _ref =
    [a[j], a[i]];a[i] = _ref[0];a[j] = _ref[1];
  }
  return a;
}var

App = function (_React$Component) {_inherits(App, _React$Component);
  function App(props) {_classCallCheck(this, App);var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this,
    props));
    _this.state = {
      categories: categories,
      round: blankRound.map(function (arr) {return arr.slice();}),
      champion: '' };

    _this.onSelect = _this.onSelect.bind(_this);
    _this.changeCategory = _this.changeCategory.bind(_this);return _this;
  }_createClass(App, [{ key: "componentWillMount", value: function componentWillMount()
    {
      var round = [].concat(_toConsumableArray(this.state.round));
      round[0] = shuffle(this.state.categories[0].items);
      this.setState({
        round: round });

    } }, { key: "changeCategory", value: function changeCategory(

    event) {
      var round = [].concat(blankRound);
      round[0] = shuffle(this.state.categories[event.target.value].items);
      this.setState({
        champion: '',
        round: round });

    } }, { key: "onSelect", value: function onSelect(

    item, index, roundIndex) {
      var champion = this.state.champion;
      var round = [].concat(_toConsumableArray(this.state.round));
      if (roundIndex === 3) {
        champion = item;
      } else {
        round[roundIndex + 1][index] = item;
        if (roundIndex === 0) {
          round[2][Math.floor(index / 2)] = "";
          round[3][Math.floor(index / 4)] = "";
          champion = "";
        }
        if (roundIndex === 1) {
          round[3][Math.floor(index / 2)] = "";
          champion = "";
        }
        if (roundIndex === 2) {
          champion = "";
        }
      }
      this.setState({
        round: round,
        champion: champion });

    } }, { key: "render", value: function render()

    {var _this2 = this;
      var list = this.state.round.map(function (round, i) {
        return round.map(function (el, j) {
          var checked = i !== 3 ? _this2.state.round[i + 1][Math.floor(j / 2)] : _this2.state.champion;
          return React.createElement(Match, { roundIndex: i, data: el, checked: checked, index: Math.floor(j / 2), onSelect: _this2.onSelect });
        });
      });
      var rounds = list.map(function (el, i) {
        var key = 'round' + i;
        return React.createElement(Round, { key: key, data: el, round: i, champion: _this2.state.champion });
      });

      var options = this.state.categories.map(function (el, i) {
        return React.createElement("option", { value: i }, el.name);
      });

      return (
        React.createElement("div", { className: "app" },
          React.createElement("header", null,
            React.createElement("h1", { className: "title" }, "Championship of Anything")),

          React.createElement("div", { className: "category-selection" },
            React.createElement("div", null, "Choose Category: "),
            React.createElement("select", { onChange: this.changeCategory },
              options)),


          React.createElement("div", { className: "knockout-container" },
            rounds)));



    } }]);return App;}(React.Component);var


Match = function (_React$Component2) {_inherits(Match, _React$Component2);function Match() {_classCallCheck(this, Match);return _possibleConstructorReturn(this, (Match.__proto__ || Object.getPrototypeOf(Match)).apply(this, arguments));}_createClass(Match, [{ key: "render", value: function render()
    {var _this4 = this;
      var checked = this.props.checked === this.props.data && this.props.data !== "";
      return (
        React.createElement("div", { className: "knockout-match bracket-team" },
          React.createElement("div", { className: "team-name" },
            React.createElement("div", null, this.props.data)),

          React.createElement("div", { className: "team-radio" },
            this.props.data ? React.createElement("input", { type: "radio", checked: checked,
              onChange: function onChange() {return _this4.props.onSelect(_this4.props.data, _this4.props.index, _this4.props.roundIndex);} }) :
            '')));



    } }]);return Match;}(React.Component);var


Round = function (_React$Component3) {_inherits(Round, _React$Component3);function Round() {_classCallCheck(this, Round);return _possibleConstructorReturn(this, (Round.__proto__ || Object.getPrototypeOf(Round)).apply(this, arguments));}_createClass(Round, [{ key: "render", value: function render()
    {
      var champions = this.props.champion && this.props.round === 3 ? React.createElement("div", { className: "champions-container" },
        React.createElement("div", { className: "champions-data" },
          React.createElement("div", null, React.createElement("i", { className: "fas fa-trophy" })),
          React.createElement("div", { className: "champions-team" }, this.props.champion))) :

      '';
      return (
        React.createElement("div", { className: "knockout-stage" },
          React.createElement("h2", null),
          React.createElement("div", { className: 'knockout-round-container bracket-' + (this.props.round + 1) },
            champions,
            this.props.data)));



    } }]);return Round;}(React.Component);


ReactDOM.render(React.createElement(App, null), document.getElementById('root'));