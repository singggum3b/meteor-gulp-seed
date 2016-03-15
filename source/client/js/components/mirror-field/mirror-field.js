var Field = require("../field");

var MirrorField = React.createClass({
	displayName: "MirrorField",
	propTypes: {
		id: React.PropTypes.string,
		type: React.PropTypes.string,
		title: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.object]),
		value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.object]),
		repeatCount: React.PropTypes.number,
		placeholder: React.PropTypes.string,
		subType: React.PropTypes.string,
		className: React.PropTypes.string,
		required: React.PropTypes.bool,
		getValidation: React.PropTypes.func
	},
	getDefaultProps(){
		return {
			repeatCount: 2
		}
	},
	getInitialState() {
		return {
			validated: this.validate()
		}
	},
	componentDidUpdate(revProps, prevState) {
		if (prevState.activeValue !== this.state.activeValue) {
			var formattedVal = this.getValue();
			//return [id-value-formattedVal-isValidated]
			this.props.onChange && this.props.onChange(this.props.id, this.state.activeValue, formattedVal, this.state.validated, this.state.edited);
		}
	},
	getValue() {
		return this.refs[`mirror-0`].getValue();
	},
	getAlert() {
		try {
			let ref = Immutable.fromJS(this.refs).toList();
			let haveAllInput = ref.every((field, index)=> {
				return !!field.getValue();
			});
			let isValid = ref.every((field, index)=> {
				return field.getValue() === this.refs[`mirror-0`].getValue();
			});

			return haveAllInput ? this.props.getValidation(this.props,{type: "mirrormatch"},isValid) : undefined;

		} catch (e) {
			return undefined;
		}
	},
	validate() {
		try {
			let ref = Immutable.fromJS(this.refs).toList();
			let isValid = !ref.some((field, index)=> {
				return !field.state.validated;
			});
			return ref.size ? isValid : false;

		} catch (e) {
			console.warn("validation failed");
			return false;
		}

	},
	onChange(e) {
		this.forceValidate();
		this.setState({
			validated: this.validate(),
			activeValue: this.getValue()
		})
	},
	forceValidate() {
		try {
			this.refs && Immutable.fromJS(this.refs).toList().map((field, index) => {
				field.onChange({target: {value: field.state.activeValue}});
			});
		} catch (e) {
			console.warn("Force validate failed");
		}
	},
	validRoot(value) {
		try {
			return value === this.refs[`mirror-0`].getValue();
		} catch (e) {
			return false;
		}

	},
	buildComponent(state, props) {

		return (
			<div className="b-mirror-field">
				{
					Immutable.Range(0, props.repeatCount).toList().map((val, index)=> {
						return <Field ref={`mirror-${index}`} key={index} onChange={this.onChange}
													id={props.id +index}
													required={props.required}
													className={props.className}
													validation={props.validation ? props.validation.push(this.validRoot) : Immutable.fromJS([]).push(this.validRoot)}
													htmlType={props.htmlType}
													placeholder={props.placeholder}
													type={props.subType} title={props.title.size ? props.title.get(index) : props.title}/>
					})
				}
			</div>
		)

	},
	render() {
		return this.buildComponent(this.state, this.props);
	}
});

module.exports = MirrorField;
