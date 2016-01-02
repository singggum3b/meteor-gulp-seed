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
		data: React.PropTypes.object
	},
	buildRow(row,rowIndex) {
		return (
				<tr key={rowIndex}>
					{
						row.map((value,index)=>{
							return (<td key={index}>{value}</td>)
						})
					}
				</tr>
		)
	},
	buildRowVertical(row,rowIndex) {
		return (
				<tr key={rowIndex}>
					{
						row.map((value,index)=>{

							return index==0 ? <th key={index} scope="row">{value}</th> : (<td key={index}>{value}</td>)
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
							return (
									<th key={index}>{value}</th>
							)
						})
					}
				</tr>
				</thead>
		);
	},
	buildHorizontalBody(rows) {
		return (
				<tbody>
				{
					rows.map((row,rowIndex)=>{
						return this.buildRow(row,rowIndex)
					})
				}
				</tbody>
		)
	},
	buildTable(props, state) {
		return mdx(props.orientation, {
			"vertical": ()=> {
				return (
						<table className="b-table b-table--vertical">
							<tbody>
							{
								transpose(props.data).map((row,rowIndex)=>{
									return this.buildRowVertical(row,rowIndex)
								})
							}
							</tbody>
						</table>
				)
			},
			"horizontal": ()=> {
				return (
						<table className="b-table b-table--horizontal" >
							{this.buildHorizontalHeader(props.data.get(0))}
							{this.buildHorizontalBody(props.data.shift())}
						</table>
				)
			}
		})
	},
	render() {
		return (
				this.buildTable(this.props, this.state)
		)
	}
});

module.exports = Table;
