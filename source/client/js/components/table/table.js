//Transpose matrix row become column
function transpose(matrix) {
	if (!matrix.get(0).size) return [];
	return Immutable.fromJS([]).push(matrix.map((row, index)=> {
		return row.first();
	})).concat(transpose(matrix.map((row, index)=> {
		return row.skip(1);
	})))
}

var Table = React.createClass({
	displayName: "Table",
	propTypes: {
		orientation: React.PropTypes.oneOf(["vertical", "horizontal"]),
		data: React.PropTypes.object,
		buildCell: React.PropTypes.func,
		layout: React.PropTypes.array,
		buildCustom: React.PropTypes.func,
		limitRowView: React.PropTypes.number,
		activeRow: React.PropTypes.array,
		buildNavigation: React.PropTypes.func,
		centerHeader: React.PropTypes.bool
	},
	getInitialState() {
		let props = this.props;
		return {
			activeRow: props.limitRowView ? props.activeRow ? Immutable.List(props.activeRow) : Immutable.Range(0, props.limitRowView).toList() : undefined
		};
	},
	componentWillReceiveProps(nextProps) {
		if (nextProps.activeRow != this.props.activeRow) {
			this.setState({
				activeRow: nextProps.activeRow
			});
		}
	},
	getDefaultProps() {
		return {
			orientation: "horizontal",
			buildCell(value, index) {
				return (
					<td key={index}>{value}</td>
				)
			},
			buildHeader(value, index) {
				return (
					<th key={index} scope="row">{value}</th>
				)
			},
			buildNavigation(context) {
				return (
					<div className="navigation">
						<span className="prev" onClick={context.prev}>Prev</span>
						<span className="next" onClick={context.next}>Next</span>
					</div>
				)
			}
		}
	},
	nextRowGroup(props, state) {
		console.log(state.activeRow.toJS());
		return state.activeRow && Immutable.Range(state.activeRow.last() + 1, state.activeRow.last() + 1 + props.limitRowView)
				.toList()
				.map((rowIndex)=> {
					return ((rowIndex) >= (props.data.size - 1)) ? rowIndex - (props.data.size - 1) : rowIndex
				})
	},
	prevRowGroup(props, state) {
		console.log(state.activeRow.toJS());
		return state.activeRow && Immutable.Range(state.activeRow.first() - props.limitRowView, state.activeRow.first())
				.toList()
				.map((rowIndex)=> {
					return ((rowIndex) < 0) ? props.data.size - 1 + rowIndex : rowIndex
				})
	},
	next() {
		this.setState({
			activeRow: this.nextRowGroup(this.props, this.state)
		});
	},
	prev() {
		this.setState({
			activeRow: this.prevRowGroup(this.props, this.state)
		});
	},
	parseData(props, state) {

		let _center = Math.floor((props.data.size) / 2);
		let _table = props.centerHeader ?
			props.data.slice(1, _center + 1).concat(props.data.take(1)).concat(props.data.slice(_center + 1, props.data.size))
			:
			props.data;

		return mdx(props.orientation, {
			"vertical": ()=> {
				if (props.limitRowView) {

					return transpose(state.activeRow.map((rowIndex)=> {
						return _table.get(rowIndex + 1);
					}).unshift(_table.get(0)));
				} else {
					return transpose(_table);
				}

			},
			"horizontal": ()=> {
				if (props.limitRowView) {
					return state.activeRow.map((rowIndex)=> {
						return _table.get(rowIndex + 1);
					}).unshift(_table.get(0));
				} else {
					return _table;
				}
			}
		});
	},
	buildRow(row, rowIndex) {
		return (
			<tr key={rowIndex}>
				{
					row.map((value, index)=> {
						return this.props.buildCell(value, index);
					})
				}
			</tr>
		)
	},
	buildRowVertical(row, rowIndex) {

		let _center = Math.floor((this.props.data.size) / 2);

		return (
			<tr key={rowIndex}>
				{
					row.map((value, index)=> {

						return this.props.centerHeader ? (
							index == _center ? this.props.buildHeader(value, index) : this.props.buildCell(value, index)
						) : (
							index == 0 ? this.props.buildHeader(value, index) : this.props.buildCell(value, index)
						)
					})
				}
			</tr>
		)
	},
	buildHorizontalHeader(row) {
		return (
			<thead>
			<tr>
				{
					row.map((value, index)=> {
						return this.props.buildHeader(value, index)
					})
				}
			</tr>
			</thead>
		);
	},
	buildHorizontalBody(rows) {
		let props = this.props;
		let _center = Math.floor((props.data.size) / 2);

		return props.centerHeader ? (
			<tbody>
			{
				rows.map((row, rowIndex)=> {
					return _center == rowIndex ?
						(
							<tr>
								{
									row.map((value, index)=> {
										return this.props.buildHeader(value, index)
									})
								}
							</tr>
						)
						: this.buildRow(row, rowIndex);
				})
			}
			</tbody>
		) : (
			<tbody>
			{
				rows.map((row, rowIndex)=> {
					return this.buildRow(row, rowIndex)
				})
			}
			</tbody>
		)
	},
	buildTable(props, state) {
		let table = mdx(props.orientation, {
			"vertical": ()=> {
				let data = this.parseData(props, state);
				return props.layout ? (
					<table>
						{
							$.groupByIndexArray(data, Immutable.fromJS(props.layout)).map((rowGroup, index)=> {
								return (
									<tbody key={index}>
									{
										rowGroup.map((row, rowIndex)=> {
											return this.buildRowVertical(row, rowIndex)
										})
									}
									</tbody>
								)
							})
						}
					</table>
				) : (
					<table>
						<tbody>
						{
							data.map((row, rowIndex)=> {
								return this.buildRowVertical(row, rowIndex)
							})
						}
						</tbody>
					</table>
				)
			},
			"horizontal": ()=> {

				let data = this.parseData(props, state);
				return props.centerHeader ? (
					<table>
						{this.buildHorizontalBody(data)}
					</table>
				) : (
					<table>
						{this.buildHorizontalHeader(data.get(0))}
						{this.buildHorizontalBody(data.shift())}
					</table>
				)
			}
		});

		let _className = cx({
			"b-table b-table--vertical": props.orientation == "vertical",
			"b-table b-table--horizontal": props.orientation == "horizontal",
			"b-table--grouped": props.layout,
			[`columns-${props.data.size}`]: true,
			[props.className]: props.className
		});

		return props.limitRowView ? (
			<div className={_className}>
				{this.props.buildNavigation(this)}
				{table}
			</div>
		) : (
			<div className={_className}>
				{table}
			</div>
		);

	},
	render() {

		return (this.props.data && this.props.data.size) ?
			(this.props.buildCustom ? this.props.buildCustom(parseData(this.props, this.state), this.props.orientation) : this.buildTable(this.props, this.state))
			:
			null
	}
});

module.exports = Table;
