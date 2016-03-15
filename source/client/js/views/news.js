var GridF = require("client/js/components/grid-flexible");
//=======================================
var LoadMore = require("./load-more");
var Loading = require("client/js/components/loading");
var Filter = require("client/js/views/filter");
var Button = require("client/js/components/button");
var NoResult = require("client/js/views/no-result");


var News = React.createClass({
	displayName: "News",
	propTypes: {
		meta: React.PropTypes.object,
		list: React.PropTypes.object,
		showViewAll: React.PropTypes.bool
	},
	getDefaultProps() {
		return {
			showViewAll: true
		}
	},
	buildViewAll() {
		return <Button className="btn load-more" URL="/news" title="View all News"></Button>
	},
	buildNewsGrid(props, state) {
		return (
			<div className="v-news">
				<div className="filter">
					<Filter controlType="customSelect" target="news" type="type"/>
				</div>
				{(props.list && props.list.size) ?
					<GridF onUpdate={this.onGridUpdate}>
						{
							props.list.map((item, index)=> {
								return (
									<GridF.Item key={item.get("id")}
															config={{id: item.get("id"), width: index == 0 ? 1/2 : 1/4, widthType: "%"}}>
										<News.Item index={index} item={item}/>
									</GridF.Item>
								)
							})
						}
					</GridF>
					:
					!props.meta.get("isLoading") ? <NoResult></NoResult> : null
				}
				{
					!props.meta.get("isLoading") ?
						<div className="actions">
							{(props.list && props.list.size) ?
								<LoadMore buildViewAll={props.showViewAll ? this.buildViewAll : ()=>null} target="news"/> : null}
						</div>
						:
						<Loading></Loading>
				}
			</div>
		)
	},
	buildNewsList(props, state) {
		return (
			<div className="v-news v-news--list">
				<div className="filter">
					<Filter controlType="customSelect" target="news" type="type"/>
				</div>
				{
					(props.list && props.list.size) ? props.list.map((item, index)=> {
						return <News.Item key={item.get("id")} index={index} item={item}/>
					}) : !props.meta.get("isLoading") ? <NoResult></NoResult> : null
				}
				{!props.meta.get("isLoading") ? (
					<div className="actions">
						<LoadMore device={props.device} buildViewAll={props.showViewAll ? this.buildViewAll : ()=>null}
											target="news"/>
					</div>
				) : (
					<Loading></Loading>
				)}
			</div>
		)
	},
	render() {
		return this.props.device != DEVICE[0] ?
			this.buildNewsGrid(this.props, this.state)
			:
			this.buildNewsList(this.props, this.state)
	}
});


News.Item = React.createClass({
	propTypes: {
		item: React.PropTypes.object,
		index: React.PropTypes.number,
		//Internal use
		componentDOMReady: React.PropTypes.func
	},
	buildItem(props, state) {
		let _type = props.item.get("type");
		_type = props.item.get("video") ? "video" : _type;
		let _item = props.item.set("type", _type);

		let _className = cx({
			"news-item": true,
			["news-item--" + _item.get("type")]: true
		});

		return (
			<div className={_className}>
				{(props.index != 0 ) && <ItemHeader item={_item}/>}
				<ItemBody layoutReady={props.componentDOMReady} index={props.index} item={_item}/>
				<ItemFooter index={props.index} item={_item}/>
			</div>
		)
	},
	render() {
		return this.buildItem(this.props, this.state);
	}
});

var ItemHeader = React.createClass({
	displayName: "ItemHeader",
	propTypes: {
		item: React.PropTypes.object
	},
	buildIcon(props, state) {
		return mdx(props.item.get("type"), {
			"article": ()=> {
				return <div className="icon icon-article">Article</div>
			},
			"video": ()=> {
				return <div className="icon icon-article">Article</div>
			},
			"twitter": ()=> {
				return <div className="icon icon-twitter">twitter</div>
			},
			"facebook": ()=> {
				return <div className="icon icon-facebook">facebook</div>
			},
			"instagram": ()=> {
				return <div className="icon icon-instagram">instagram</div>
			}
		});
	},
	buildLink(props, state) {
		return mdx(props.item.get("type"), {
			"article": ()=> {
				return <a title={props.item.getIn(["sourceName"])}
									href={props.item.get("sourceURL")}>{props.item.getIn(["sourceName"])}</a>
			},
			"video": ()=> {
				return <a title={props.item.getIn(["sourceName"])}
									href={props.item.get("sourceURL")}>{props.item.getIn(["sourceName"])}</a>
			}
		}, ()=> {
			return <span>{props.item.getIn(["sourceName"])}</span>
		});
	},
	buildItemHeader(props, state) {
		return (
			<div className="header">
				<div className="title">
					{this.buildLink(props, state)}
				</div>
				{this.buildIcon(props, state)}
			</div>
		)
	},
	render() {
		return this.buildItemHeader(this.props, this.state)
	}
});

var ItemBody = React.createClass({
	displayName: "ItemBody",
	propTypes: {
		item: React.PropTypes.object,
		layoutReady: React.PropTypes.func
	},
	getDefaultProps() {
		return {
			layoutReady: ()=> {
			}
		}
	},
	componentDidMount() {
		this.props.layoutReady();
	},
	componentDidUpdate() {
		this.props.layoutReady();
	},
	buildItemBody(props, state) {
		let {type,photo,summary,title,timeline,sourceURL,video} = props.item.toJS();
		return (type != "video" || props.index != 0) ? (
			<div className="body">
				{(type != "article" && type != "video") && <a className="overlink" target="_blank" href={sourceURL}></a>}
				<div className="photo">
					{photo && <img onLoad={props.layoutReady} onError={props.layoutReady} src={photo} alt={title}/>}
					{video && video !== '</iframe>' && <a href={sourceURL} title={title} className="video-button">Play</a>}
				</div>
				<div className="timeline">{timeline}</div>
				<div className="title">
					<a href={sourceURL} title={title}
						 target={(type == "article" || type == "video") ?  null : "_blank"}>{title}</a>
				</div>
				<div className="summary" dangerouslySetInnerHTML={{__html: summary}}></div>
			</div>
		) : (
			<div className="body">
				<div className="photo">
					{photo && <img onLoad={props.layoutReady} onError={props.layoutReady} src={photo} alt={title}/>}
					{video && video !== '</iframe>' && <a href={sourceURL} title={title} className="video-button">Play</a>}
				</div>
			</div>
		)
	},
	render() {
		return this.buildItemBody(this.props, this.state)
	}
});

var scriptLoaded = false;
var ItemFooter = React.createClass({
	displayName: "ItemFooter",
	propTypes: {
		item: React.PropTypes.object,
		index: React.PropTypes.number
	},
	componentDidMount() {
		if (!scriptLoaded) {
			let shareLib = (process.env.NODE_ENV === 'development') ? '//w.sharethis.com/button/buttons.js' : '/sites/all/themes/clubf4/js/buttons.js';
			scriptLoaded = true;
			window.switchTo5x = true;
			$.cachedScript(shareLib).done(()=> {
				stLight.options({
					publisher: "63430089-98ae-4d3a-b138-060be4e3cbd8",
					doNotHash: false,
					doNotCopy: false,
					hashAddressBar: false
				});
			});
		} else if (typeof stButtons !== 'undefined') {
			stButtons.locateElements();
		}
	},
	buildShareButton(props) {
		let sourceURL = props.item.get('sourceURL');
		let author = props.item.get('sourceName');
		let title = props.item.get('title');
		let image = props.item.get('photo') || '';
		let content = props.item.get('desc');
		let updated = props.item.get('timelineShare');
		let summary;

		content = content ? `| ${content}` : '';
		summary = `${author} | ${updated} ${content}`;

		return `<div
			class="share st_sharethis_large"
		  st_url="${location.origin + sourceURL}"
		  st_title="${title}"
		  st_image="${image}" st_summary="${summary}">
		</div>`;
	},
	buildStatisticFooter(props, state) {
		let {type,title,sourceURL,liked,retwitted,favoured} = props.item.toJS();
		return (
			<div className="footer">
				{liked && <div className="liked"><span>{liked}</span></div>}
				{retwitted && <div className="retwitted"><span>{retwitted}</span></div>}
				{favoured && <div className="favoured"><span>{favoured}</span></div>}
			</div>
		)
	},
	buildItemFooter(props, state) {
		let {type,photo,summary,title,timeline} = props.item.toJS();
		return mdx(type, {
			"video": ()=> {
				return (
					<div className="footer share">
						{props.index == 0 && <div className="title">{title}</div>}
						<div dangerouslySetInnerHTML={{__html: this.buildShareButton(props)}}/>
					</div>
				)
			},
			"facebook": ()=> {
				return this.buildStatisticFooter(props, state);
			},
			"twitter": ()=> {
				return this.buildStatisticFooter(props, state);
			},
			"instagram": ()=> {
				return null;
			}
		}, ()=> {
			//default
			return (
				<div className="footer share">
					<div dangerouslySetInnerHTML={{__html: this.buildShareButton(props)}}/>
				</div>
			)
		});
	},
	render() {
		return this.buildItemFooter(this.props, this.state)
	}
});

module.exports = News;
