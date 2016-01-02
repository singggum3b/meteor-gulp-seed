var V = require("js/validator");

var Field = React.createClass({
	displayName: "Field",
	propTypes: {
		id: React.PropTypes.string.isRequired,
		type: React.PropTypes.oneOf(["text", "radio", "date", "select", "textarea", "label"]).isRequired,
		title: React.PropTypes.string,
		required: React.PropTypes.oneOf([true, false, "true", "false"]),
		validation: React.PropTypes.object,
		multiple: React.PropTypes.oneOf([true, false, "true", "false"]),
		value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.object]),
		placeholder: React.PropTypes.string,
		disabled: React.PropTypes.bool,
		onChange: React.PropTypes.func,
		formatter: React.PropTypes.func,
		maxLength : React.PropTypes.string,
		validateOnMount: React.PropTypes.bool
	},
	getDefaultProps() {
		return {
			validateOnMount: true
		}
	},
	getInitialState() {
		return {
			activeValue: (this.props.value && this.props.value.size) ? this.props.value.getIn([0, "value"]) : this.props.value,
			validated: !(this.props.validation && (this.props.validation.size > 0)) || (!this.props.required && !(this.props.value && this.props.value.length)),
			edited: false
		}
	},
	componentWillMount() {
		if (this.props.validateOnMount || this.props.value) {
			var isValidated = this.validate(this.props, this.state);
			this.setState({
				validated: isValidated
			});
		}
	},
	componentDidUpdate(prevProps, prevState) {
		if (prevState.activeValue !== this.state.activeValue) {
			var formattedVal = this.getValue();
			//return [id-value-formattedVal-isValidated]
			this.props.onChange && this.props.onChange(this.props.id, this.state.activeValue, formattedVal, this.state.validated);
		}
		if (!prevProps.validateOnMount && this.props.validateOnMount) {
			this.setState({
				edited: true
			})
		}
	},
	getValue() {
		return this.props.formatter ? this.props.formatter(this.state.activeValue) : this.state.activeValue;
	},
	validate(props, state) {
		if (props.required && (!state.activeValue || !state.activeValue.length)) {
			return false;
		} else if (!props.required && (!state.activeValue || !state.activeValue.length)) {
			//console.log(state.activeValue);
			return true;
		}
		return (props.validation && (props.validation.size > 0)) ? (props.validation.findIndex(function (val, index) {
			return !V[val.get("type")](state.activeValue, val.toJS());
		}) == -1) : true;
	},
	onChange(e) {
		this.setState({
			edited: true,
			activeValue: e.target.value,
			validated: this.validate(this.props, Object.assign({}, this.state, {activeValue: e.target.value}))
		});
	},
	buildField(props, state) {
		var propstoPass = Object.assign({}, props, {
			onChange: this.onChange,
			validated: state.validated,
			activeValue: state.activeValue,
			edited: state.edited
		});
		return mdx(props.type, {
			"text": ()=> {
				return <Field.Text {...propstoPass} ></Field.Text>
			},
			"textarea": ()=> {
				return <Field.Text {...propstoPass} textarea></Field.Text>
			},
			"radio": ()=> {
				return <Field.Radio {...propstoPass}  ></Field.Radio>
			},
			"select": ()=> {
				return <Field.Select {...propstoPass} ></Field.Select>
			},
			"date": ()=> {
				return <Field.Date {...propstoPass} ></Field.Date>
			},
			"label": ()=> {
				return <Field.Label {...propstoPass} ></Field.Label>
			}
		});
	},
	render() {
		return this.buildField(this.props, this.state);
	}
});

Field.Label = React.createClass({
	displayName: "Field_Label",
	propTypes: {
		title: React.PropTypes.string
	},
	className(props, state) {
		return cx({
			"b-field": true,
			"b-field-label": true
		})
	},
	render() {
		return (
				<label className={this.className(this.props,this.state)}>
					{this.props.title}
				</label>
		)
	}
});

Field.Text = React.createClass({
	displayName: "Field_Text",
	className(props, state) {
		return cx({
			"b-field": true,
			"b-field-text": !props.textarea,
			"b-field-textarea": props.textarea,
			"is-required": !!props.required,
			"is-disabled": !!props.disabled,
			"is-invalid": !props.validated,
			"is-original": !props.edited,
			[props.className]: !!props.className
		});
	},
	buildField(props, state) {
		return (
				<label className={this.className(props,state)}>
					{props.title}
					{
						!props.textarea ?
								<input maxLength={props.maxLength} required={props.required} type="text" name={props.id} value={props.activeValue} onChange={props.onChange}
											 placeholder={props.placeholder}/>
								:
								<textarea maxLength={props.maxLength} required={props.required} name={props.id} value={props.activeValue} onChange={props.onChange}
													placeholder={props.placeholder} cols="30" rows="4"/>
					}
				</label>
		)
	},
	render() {
		return this.buildField(this.props, this.state);
	}
});

Field.Radio = React.createClass({
	displayName: "Field_Radio",
	propTypes: {
		onChange: React.PropTypes.func,
		title: React.PropTypes.string
	},
	className(props, state) {
		return cx({
			"b-field b-field-radio": true,
			"is-required": !!props.required,
			"is-disabled": !!props.disabled,
			"is-invalid": !props.validated,
			"is-original": !props.edited,
			[props.className]: !!props.className
		});
	},
	buildField(props, state) {
		return props.value.map((val, index) => {
			return (
					<label key={val.get("value")} className="item">
						<input type="radio" checked={props.activeValue == val.get("value")} name={props.id}
									 onChange={this.props.onChange} value={val.get("value")}/>
						{val.get("title")}
					</label>
			);
		});
	},
	render() {
		return (
				<label className={this.className(this.props,this.state)}>
					{this.props.title}
					{this.buildField(this.props, this.state)}
				</label>
		)
	}
});

Field.Select = React.createClass({
	displayName: "Field_Select",
	propTypes: {
		title: React.PropTypes.string,
		activeValue: React.PropTypes.oneOfType([React.PropTypes.string,React.PropTypes.number]),
		onChange: React.PropTypes.func,
		id: React.PropTypes.string
	},
	className(props, state) {
		return cx({
			"b-field b-field-select": true,
			"is-required": !!props.required,
			"is-disabled": !!props.disabled,
			"is-invalid": !props.validated,
			"is-original": !props.edited,
			[props.className]: !!props.className
		});
	},
	buildField(props, state) {
		return props.value.map(function (val, index) {
			return (
					<option key={val.get("value")} value={val.get("value")}>{val.get("title")}</option>
			);
		});
	},
	render() {
		return (
				<label className={this.className(this.props,this.state)}>
					{this.props.title}
					<select value={this.props.activeValue} name={this.props.id} onChange={this.props.onChange}>
						{this.buildField(this.props, this.state)}
					</select>
				</label>
		)
	}
});

Field.Date = React.createClass({
	displayName: "Field_Date",
	propTypes: {
		onChange: React.PropTypes.func
	},
	className(props, state) {
		return cx({
			"b-field b-field-date": true,
			"is-required": !!props.required,
			"is-disabled": !!props.disabled,
			"is-invalid": !props.validated,
			"is-original": !props.edited,
			[props.className]: !!props.className
		});
	},
	buildField(props, state) {
		return (
				<label className={this.className(props,state)}>
					{props.title}
					<input type="text" name={props.id} value={props.activeValue} onChange={this.props.onChange}
								 placeholder={props.placeholder}/>
				</label>
		);
	},
	render() {
		return this.buildField(this.props, this.state);
	}
});


module.exports = Field;
