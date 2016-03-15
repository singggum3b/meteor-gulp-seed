var V = require("client/js/validator");

var Field = React.createClass({
	displayName: "Field",
	propTypes: {
		id: React.PropTypes.string.isRequired,
		type: React.PropTypes.oneOf(["text", "radio", "date", "select", "textarea", "label", "checkbox","ckeditor","file"]).isRequired,
		title: React.PropTypes.string,
		required: React.PropTypes.oneOf([true, false, "true", "false"]),
		validation: React.PropTypes.object,
		multiple: React.PropTypes.oneOf([true, false, "true", "false"]),
		value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.object]),
		defaultValue: React.PropTypes.string,
		placeholder: React.PropTypes.string,
		disabled: React.PropTypes.bool,
		onChange: React.PropTypes.func,
		onKeyUp: React.PropTypes.func,
		formatter: React.PropTypes.func,
		maxLength: React.PropTypes.number,
		validateOnMount: React.PropTypes.bool,
		tabIndex: React.PropTypes.string,
		htmlType: React.PropTypes.string
	},
	getDefaultProps() {
		return {
			validateOnMount: true,
			tabIndex: "0"
		}
	},
	componentWillReceiveProps(nextProps) {
		if (!Immutable.is(Immutable.fromJS(this.props.value), Immutable.fromJS(nextProps.value))) {
			//console.log(this.props.value,nextProps.value);

			this.setState({
				activeValue: (nextProps.value && nextProps.value.size) ? nextProps.defaultValue : nextProps.value,
				validated: !(nextProps.validation && (nextProps.validation.size > 0)) || (!nextProps.required && !(nextProps.value && nextProps.value.length)),
			})
		}
	},
	getInitialState() {
		return {
			activeValue: (this.props.value && this.props.value.size) ? this.props.defaultValue : this.props.value,
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
			this.props.onChange && this.props.onChange(this.props.id, this.state.activeValue, formattedVal, this.state.validated,this.state.edited);
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
	getAlert() {
		let _props =this.props;
		let _result = (this.state.activeValue && this.props.getValidation && this.props.validation) ? this.props.validation.map((vld,index)=>{
			let _isValid = false;
			try {
				_isValid = vld(this.state.activeValue);
			} catch (e) {
				_isValid = V[vld.get("type")](this.state.activeValue, vld.toJS());
			}
			return this.props.getValidation(_props,vld.toJS(),_isValid);

		}).filter((alrt)=>!!alrt) : undefined;
		return (_result && _result.size) ? _result : undefined
	},
	validate(props, state) {
		if (props.required && (!state.activeValue || !state.activeValue.length)) {
			return false;
		} else if (!props.required && (!state.activeValue || !state.activeValue.length)) {
			//console.log(state.activeValue);
			return true;
		}

		return (props.validation && (props.validation.size > 0)) ? (props.validation.findIndex(function (val, index) {
			try {
				return !val(state.activeValue);
			} catch (e) {
				return !V[val.get("type")](state.activeValue, val.toJS());
			}

		}) == -1) : true;
	},
	setOriginal() {
		//console.log(this.props.type);
		this.setState({
			edited: false
		});
	},
	onChange(e) {
		let _state = this.state;
		let rawTextValue = e.target.text;
		let _activeValue = mdx(e.target.type, {
			"checkbox": ()=> {
				return e.target.checked ?
					_state.activeValue ? Object.assign({}, _state.activeValue, {[e.target.value]: true}) : {[e.target.value]: true}
					:
					Object.assign({}, _state.activeValue, {[e.target.value]: false})
			},
			"file":()=>{
				return e.target.files;
			}
		}, ()=> {
			return e.target.value;
		});

		this.setState({
			edited: e.target.edited === false ? e.target.edited : true ,
			activeValue: _activeValue,
			rawTextValue: rawTextValue,
			validated: this.validate(this.props, Object.assign({}, this.state, {activeValue: _activeValue}))
		});
	},
	onKeyUp(e) {
		this.props.onKeyUp && this.props.onKeyUp(e);
	},
	buildField(props, state) {
		var propstoPass = Object.assign({}, props, {
			onChange: this.onChange,
			onKeyUp: this.onKeyUp,
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
			file: ()=>{
				return <Field.File {...propstoPass} ></Field.File>
			},
			"radio": ()=> {
				return <Field.Radio {...propstoPass}  ></Field.Radio>
			},
			"checkbox": ()=> {
				return <Field.CheckBox {...propstoPass}  ></Field.CheckBox>
			},
			"select": ()=> {
				return <Field.Select {...propstoPass} ></Field.Select>
			},
			"date": ()=> {
				return <Field.Date {...propstoPass} ></Field.Date>
			},
			"label": ()=> {
				return <Field.Label {...propstoPass} ></Field.Label>
			},
			"ckeditor":()=> {
			return <Field.CKEditor {...propstoPass} ></Field.CKEditor>
			}
		},()=>{
			return <Field.Label title="[Unsuppoted field type]" ></Field.Label>
		});
	},
	render() {
		return this.buildField(this.props, this.state);
	}
});

Field.File = React.createClass({
	displayName: "Field_File",
	propTypes: {
		title: React.PropTypes.string
	},
	className(props, state) {
		return cx({
			"b-field": true,
			"b-field-file": true,
			"is-required": !!props.required,
			"is-disabled": !!props.disabled,
			"is-invalid": !props.validated,
			"is-original": !props.edited,
			[props.className]: !!props.className
		});
	},
	buildComponent(props,state) {
		return (
			<label className={this.className(this.props,this.state)}>
				{this.props.title}
				<input accept={props.accept} maxLength={props.maxLength} tabIndex={props.tabIndex} required={props.required} type="file"
							 name={props.id} onChange={props.onChange} placeholder={props.placeholder}/>
				<span className="placeholder" dangerouslySetInnerHTML={{__html: props.placeholder}} />
			</label>
		)
	},
	render() {
		return this.buildComponent(this.props,this.state);
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


Field.CKEditor = React.createClass({
	displayName: "Field_CKEditor",
	propTypes: {
		activeValue: React.PropTypes.string,
		maxLength: React.PropTypes.number,
		edited: React.PropTypes.bool
	},
	componentDidMount() {
		$.cachedScript('//cdn.ckeditor.com/4.5.7/basic/ckeditor.js').done(()=> {
			this._editor = CKEDITOR.replace(this.refs["textarea"],{
				on: {
					change: (evt)=>{
						let _data = evt.editor.getData();
						if (_data || this.props.activeValue) {
							this.props.onChange({target: {type: "ckeditor",value: _data,text: evt.editor.document.getBody().getText()}});
						}
					},
					instanceReady: (evt)=>{
						evt.editor.setData(this.props.activeValue);
					}
				}
			});
		});
	},
	componentWillReceiveProps(nextProps) {
		if (this.props.activeValue && this.props.activeValue !== "" && !nextProps.activeValue) {
			this._editor && this._editor.setData("");
			this.props.onChange({target: {type: "ckeditor",value: "",text: "",edited:nextProps.edited}});
		}
	},
	className(props, state) {
		return cx({
			"b-field": true,
			"b-field-ckeditor": true,
			"is-required": !!props.required,
			"is-disabled": !!props.disabled,
			"is-invalid": !props.validated,
			"is-original": !props.edited,
			[props.className]: !!props.className
		});
	},
	buildField(props, state) {
		//console.log(props);
		return (
			<label className={this.className(props,state)}>
				{props.title}
				<textarea ref="textarea" maxLength={props.maxLength} required={props.required} name={props.id} value={props.activeValue}
									onChange={props.onChange}
									placeholder={props.placeholder} cols="30" rows="4"/>
			</label>
		)
	},
	render() {
		return this.buildField(this.props, this.state);
	}
});

Field.Text = React.createClass({
	displayName: "Field_Text",
	propTypes: {
		htmlType: React.PropTypes.string,
		onKeyUp : React.PropTypes.func
	},
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
						<input onKeyUp={props.onKeyUp} maxLength={props.maxLength}
									 tabIndex={props.tabIndex}
									 required={props.required} type={props.htmlType ? props.htmlType : "text"}
									 name={props.id} value={props.activeValue} onChange={props.onChange}
									 placeholder={props.placeholder}/>
						:
						<textarea onKeyUp={props.onKeyUp} maxLength={props.maxLength} required={props.required} name={props.id} value={props.activeValue}
											onChange={props.onChange} tabIndex={props.tabIndex}
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
		title: React.PropTypes.string,
		value: React.PropTypes.object
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

Field.CheckBox = React.createClass({
	displayName: "Field_CheckBox",
	propTypes: {
		onChange: React.PropTypes.func,
		title: React.PropTypes.string,
		value: React.PropTypes.object
	},
	className(props, state) {
		return cx({
			"b-field b-field-checkbox": true,
			"is-required": !!props.required,
			"is-disabled": !!props.disabled,
			"is-invalid": !props.validated,
			"is-original": !props.edited,
			[props.className]: !!props.className
		});
	},
	buildField(props, state) {
		return props.value.map((val, index) => {
			console.log(props.activeValue);
			return (
				<label key={val.get("value")} checked={props.activeValue && props.activeValue[val.get("value")]}
							 className="item">
					<input type="checkbox" name={props.id}
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
		activeValue: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
		onChange: React.PropTypes.func,
		id: React.PropTypes.string,
		value: React.PropTypes.object
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
		//console.log(this.props.activeValue);
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
