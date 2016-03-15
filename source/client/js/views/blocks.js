//==================FLUX=========================
var Reactor = require("js/reactor.js");
var StatStore = require("js/statistic-store");
//===============================================
var Chart = require("./charts");
var Table = require("./table");

const Blocks = React.createClass({
	displayName: "Blocks",
	mixins: [Reactor.ReactMixin],
	propsTypes: {},
	getDataBindings() {
		return {
			blocks: StatStore.getters.blocks,
			layout: StatStore.getters.layout
		}
	},
	buildBlocks(props, state) {
		return (
				<div className="b-blocks">
					{
						state.blocks.map(function (item, index) {
							if (item.get("type") == "CHART") {
								return (
										<Chart key={item.get("id")} data={item}></Chart>
								)
							}
							if (item.get("type") == "TABLE") {
								return (
										<Table key={item.get("id")} data={item}></Table>
								)
							}
						})
					}
				</div>
		)
	},
	render() {
		return this.buildBlocks(this.props, this.state);
	}
});

module.exports = Blocks;
