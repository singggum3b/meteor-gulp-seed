//==================FLUX=========================
var Reactor = require("js/reactor.js");
var Media = require("js/media");
// ============================================

const ChartCore = React.createClass({
	displayName: "ChartCore",
	propTypes: {
		data: React.PropTypes.object,
		ratio: React.PropTypes.number,
		onMount: React.PropTypes.func,
		initGoogleChart: React.PropTypes.func
	},
	mixins: [Reactor.ReactMixin],
	componentDidMount() {
		this.loadGoogleJSAPI();
	},
	componentDidUpdate() {
		this.props.initGoogleChart(this.props, this.state, this.refs.element);
	},
	getDataBindings() {
		return {
			width: Media.getters.width
		}
	},
	loadGoogleJSAPI() {
		if (!window.google) {
			$.cachedScript("https://www.google.com/jsapi").done(()=> {
				this.props.initGoogleChart(this.props, this.state, this.refs.element);
			});
		} else {
			this.props.initGoogleChart(this.props, this.state, this.refs.element);
		}
	},
	initGoogleChart(props, state, element) {
		this.initGoogleChart(props, state, element);
	},
	buildChart(props, state) {
		return (
				<div ref="element">
				</div>
		)
	},
	render() {
		return this.buildChart(this.props, this.state);
	}
});

const Chart = React.createClass({
	displayName: "Chart",
	propTypes: {
		data: React.PropTypes.object,
		drawChart: React.PropTypes.func,
		buildLoader: React.PropTypes.func
	},
	getDefaultProps() {
		return {
			buildLoader: ()=> {
				return (
						<div>{"Loading chart..."}</div>
				)
			}
		}
	},
	getInitialState() {
		return {
			loaded: false
		}
	},
	componentDidUpdate() {
		this.drawChart(this.state.chart.props,this.state.chart.state,this.state.chart.element);
	},
	onLoaded(props,state,element) {
		if (!this.state.loaded) {
			this.setState({
				loaded: true,
				chart: {
					props: props,
					state: state,
					element: element
				}
			})
		}
	},
	drawChart(props,state,element) {
		this.props.drawChart(props,state,element);
	},
	initGoogleChart(props, state, element) {
		//google jsapi ready
		window.google.load("visualization", "1", {packages: ["controls"], callback: ()=>{
			this.onLoaded(props,state,element);
		}});

	},
	buildCharts(props, state) {
		return (
				<div>
					{!state.loaded && props.buildLoader()}
					<ChartCore data={props.data} initGoogleChart={this.initGoogleChart}></ChartCore>
				</div>
		)
	},
	render() {
		return this.buildCharts(this.props, this.state)
	}
});

module.exports = Chart;
