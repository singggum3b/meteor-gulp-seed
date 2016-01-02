require("script!unveil");

function getSupportedTransform() {
	var prefixes = "transform WebkitTransform MozTransform OTransform msTransform".split(" ");
	var div = document.createElement("div");
	for (var i = 0; i < prefixes.length; i++) {
		if (div && div.style[prefixes[i]] !== undefined) {
			return prefixes[i];
		}
	}
	return false;
}

//=========================================

//=========================================
var isTransformSupported = getSupportedTransform();

var Image = React.createClass({
	displayName: "Image",
	propTypes: {
		delay: React.PropTypes.number,
		src: React.PropTypes.string,
		alt: React.PropTypes.string,
		fill: React.PropTypes.bool,
		loadingIcon: React.PropTypes.string,
		lazy: React.PropTypes.bool,
		className: React.PropTypes.string
	},
	getDefaultProps() {
		return {
			delay: 500,
			lazy: true
		}
	},
	getInitialState() {
		return {
			loaded: false
		}
	},
	componentDidMount() {
		this.props.lazy && $(this.refs.img.getDOMNode()).find(".asset").unveil({delay: this.props.delay});
	},
	componentWillReceiveProps() {
		this.props.lazy && $(this.refs.img.getDOMNode()).find(".asset").unveil({delay: this.props.delay});
	},
	onLoad(event) {
		var element = $(event.target);
		var parent = element.parent();
		var vRatio = element.height() / parent.height();
		var hRatio = element.width() / parent.width();

		if (vRatio > hRatio) {
			element.css({
				"max-width": "101%"
			});
		} else {
			element.css({
				"max-height": "101%"
			});
		}

		if (!isTransformSupported) {
			element.css({
				"margin-left": -parent.width() / 2,
				"margin-top": -parent.height() / 2
			});

			//css holdup for ie8 - so we dont use media store
			$(window).on("resize", $.throttle(200, function () {
				element.css({
					"margin-left": -element.width() / 2,
					"margin-top": -element.height() / 2
				});
			}))

		}

		this.setState({
			loaded: true
		});

	},
	render() {
		var {src,alt,fill,loadingIcon,lazy} = this.props;
		var _className = cx({
			[this.props.className]: !!this.props.className,
			image: true,
			"image-fill": !!fill
		});

		var _style = {
			opacity: this.state.loaded ? undefined : "0",
			minWidth: this.state.loaded ? undefined : "1px",
			minHeight: this.state.loaded ? undefined : "1px"
		};

		return (
				<div className={_className} ref="img">
					{(!this.state.loaded && loadingIcon) && <img className="spinner" src={loadingIcon} alt={alt}/>}
					<img className="asset" src={lazy ? undefined: src} data-src={src} alt={alt} style={_style}
							 onLoad={this.onLoad}/>
				</div>
		)
	}
});

module.exports = Image;
