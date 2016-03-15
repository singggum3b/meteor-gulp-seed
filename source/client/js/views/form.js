//====================REACT======================
var Popup = require('client/js/components/popup');
var Layer = require('client/js/components/layer');
var Field = require('client/js/components/field');
var Image = require('client/js/components/image');
var Button = require('client/js/components/button');
var Loading = require('client/js/components/loading');
var MirrorField = require("client/js/components/mirror-field");

var Form;
Form = React.createClass({
	propTypes: {
		device: React.PropTypes.oneOf(DEVICE),
		id: React.PropTypes.string,
		form: React.PropTypes.object,
		onSubmit: React.PropTypes.func,
		onClose: React.PropTypes.func,
		buildLayout: React.PropTypes.func,
		alert: React.PropTypes.object,
		isLoading: React.PropTypes.bool,
		children: React.PropTypes.node
	},
	statics: {

		serialize(refList, context,callback) {
			let _asyncFieldResult = context._asyncFieldResult || Immutable.Map();

			function checkSerializeFinished(result) {
				//console.log(result.size,refList.length);
				if (result.size === refList.length) {
					callback(result);
				}
			}

			function setSerializedValue(field,fieldID) {
				return mdx(field.props.type,{
					"file":()=>{
						try {
							let FReader = new FileReader();
							FReader.onload = (e)=>{
								_asyncFieldResult = _asyncFieldResult.set(context.refs[fieldID].props.id,FReader.result);
								checkSerializeFinished(_asyncFieldResult);
							};
							if (field.getValue() && field.getValue()[0]) {
								FReader.readAsDataURL(field.getValue()[0]);
							} else {
								_asyncFieldResult = _asyncFieldResult.set(context.refs[fieldID].props.id,"");
								checkSerializeFinished(_asyncFieldResult);
							}

						} catch (e) {
							//console.error(e);
							return false;
						}

					}
				},()=>{
					let _value = context.refs[fieldID].getValue();
					_value = _value ? _value : "";
					_asyncFieldResult = _asyncFieldResult.set(context.refs[fieldID].props.id,_value);
					//console.log(_asyncFieldResult.toJS());
					checkSerializeFinished(_asyncFieldResult);
				})
			}

			Immutable.fromJS(refList).map((fieldID)=> {
				setSerializedValue(context.refs[fieldID],fieldID)
			});
		},
		validate() {

		},
		getAlert(refList, context) {
			let _alert =  Immutable.fromJS(refList).map((fieldID)=> {
				return context.refs ? Immutable.fromJS([context.refs[fieldID].props.id ,context.refs[fieldID].getAlert ? context.refs[fieldID].getAlert() : undefined]) : undefined;
			}).toKeyedSeq().mapEntries(function (entry) {
				return [entry[1].get(0), entry[1].get(1) ?  entry[1].get(1) : undefined];
			}).toMap().filter((val,key)=>!!val);

			//console.log(_alert.toJS());
			return (_alert && _alert.size) ? _alert : undefined;
		}
	},
	getDefaultProps() {
		return {
			buildLayout: function (formLength) {
				return Immutable.fromJS([formLength]);
			}
		}
	},
	getInitialState() {
		return {
			isFormValid: this.isValid(this.props, this.state),
			isSubmitDisabled: false,
			isSubmited: false,
			validateOnMount: false
		}
	},
	componentDidMount() {
		this.setState({
			isFormValid: this.isValid(this.props, this.state)
		});
	},
	serialize(props, state, callback) {
		Form.serialize(props.form.get('field').map((field)=>"field" + field.get("id")).toJS(), this,(result)=>{
			callback(result.set('formID', props.id))
		})
	},
	onChange(name, value, formattedValue, isValid) {

	},
	onSubmit(e) {
		this.forceValidate();
		let isFormValid = this.isValid(this.props, this.state);
		let refList = this.props.form.get('field').map((field)=>"field" + field.get("id")).toJS();

		if (this.props.onSubmit) {
			this.serialize(this.props,this.state,(result)=>{
				//console.log(result.toJS());
				this.props.onSubmit(isFormValid, result.toJS(), this.props.form.get('POST'),Form.getAlert(refList,this));
			});
		}

	},
	onClose(e) {
		this.props.onClose && this.props.onClose(e);
	},
	reset() {
		this.props.form.get('field').map((field, index) => {
			var target = this.refs && this.refs['field' + field.get('id')];
			target && target.onChange({target: {value: undefined,edited: false}});
			//target && target.setOriginal();
		});
	},
	forceValidate() {
		//console.log("force validate");
		this.props.form.get('field').map((field, index) => {
			var target = this.refs && this.refs['field' + field.get('id')];
			target && target.onChange({target: {value: target.state.activeValue}});
		});
	},
	isValid(props, state) {
		let _this = this;
		return (_this && _this.refs) ? props.form.get('field').map((field, index) => {
			let _field = _this.refs ? _this.refs['field' + field.get('id')] : undefined;
			return _field ? _field.state.validated : false;
		}).reduce(function (reduction, value, key) {
			return reduction && value;
		}, true) : false;
	},
	formatAs(type) {
		return mdx(type, {
			'date': ()=> {
				return (value)=> {
					return require('client/js/formatter').date(value, {
						inputDateFormat: 'YYYY/M/D',
						outputDateFormat: 'YYYY/MM/DD'
					});
				}
			}
		});
	},
	buildAlert(props, state) {

		let _alertClass = cx({
			"v-alert": true,
			["v-alert--" + (props.alert ? props.alert.get("type") : "default")]: !!props.alert
		});

		return props.alert ? (
			<div className={_alertClass} dangerouslySetInnerHTML={{__html: props.alert.get("message")}}></div>
		) : null;
	},
	buildLoading(props, state) {
		return props.isLoading ? (
			<Layer parent>
				<Loading></Loading>
			</Layer>
		) : null;
	},
	submitByKey(e) {
		if (e.keyCode === 13) {
			this.onSubmit();
		}
	},
	buildFields(props, state) {
		var fields = props.form.get('field');
		var layout = props.buildLayout(fields.size);

		function groupByIndexArray(listToGroup, layout) {
			var layoutCount = layout.get(0);
			if (layout.size) {
				return Immutable.fromJS([listToGroup.take(layoutCount)]).concat(groupByIndexArray(listToGroup.skip(layoutCount), layout.rest()));
			} else {
				return []
			}
		}

		var groupedFields = groupByIndexArray(fields, layout);
		return props.form ?
			groupedFields.map((fieldGroup, index)=> {
				return (
					<fieldset className={"fieldset-"+index} key={"fieldset-"+index}>
						{
							fieldGroup.map((field, index)=> {
								return mdx(field.get('type'),{
									"mirrorfield" :()=>{
										return <MirrorField key={'field' + field.get('id')}
																				ref={'field' + field.get('id')}
																				validateOnMount={state.validateOnMount}
																				formatter={this.formatAs(field.get('type'))}
																				onChange={this.onChange}
																				onKeyUp={this.submitByKey}
																				className="b-field-block" {...field.toObject()} />
									}
								},()=>{
									return <Field key={'field' + field.get('id')}
																ref={'field' + field.get('id')}
																validateOnMount={state.validateOnMount}
																formatter={this.formatAs(field.get('type'))}
																onKeyUp={this.submitByKey}
																onChange={this.onChange}
																className="b-field-block" {...field.toObject()} />;
								});
							})
						}
					</fieldset>
				)
			}) : null;
	},
	buildAction(props, state) {
		return this.isSuccess(props) ? (
			<div className="actions">
				<Button className="btn" onClick={this.onClose} title="OK"></Button>
			</div>
		) : (
			<div className="actions">
				<Button className="btn" disabled={state.isSubmitDisabled} onClick={this.onSubmit} title="Submit"></Button>
			</div>
		);
	},
	buildTitle(props, state) {
		return props.form.get('title') ? (
			<h3 className="title">{props.form.get('title')}</h3>
		) : null;
	},
	buildMessage(props, state) {

		function buildMsgList(list) {
			return (
				<ul>
					{
						list.map(function (msg, index) {
							return (
								<li key={index}>{msg.get('message')}</li>
							)
						})
					}
				</ul>
			)
		}

		if (props.result) {
			var {success,error} = props.result.toObject();
			if (success) {
				return (
					<div className="message message--success">
						{buildMsgList(success)}
					</div>
				)
			} else if (error) {
				return (
					<div className="message message--error">
						{buildMsgList(error)}
					</div>
				)
			} else {
				return null;
			}
		}
	},
	isSuccess(props) {
		return props.result && props.result.get('success');
	},
	render() {
		var className = cx({
			"b-form": true,
			"is-success": this.isSuccess(this.props),
			"is-failed": this.props.result && !this.props.result.get('success')
		});
		return this.isSuccess(this.props) ?
			(
				<div className={className}>
					{this.buildMessage(this.props, this.state)}
					{this.props.children && React.cloneElement(this.props.children, {
						device: this.state.device
					})}
				</div>
			)
			:
			(
				<div className={className}>
					{this.props.form ? this.buildTitle(this.props, this.state) : null}
					{this.buildAlert(this.props, this.state)}
					{this.buildMessage(this.props, this.state)}
					<form onSubmit={(e)=>{e.preventDefault()}}>
						{this.props.form ? this.buildFields(this.props, this.state) : null}
					</form>
					{this.props.children}
					{this.props.form ? this.buildAction(this.props, this.state) : null}
					{this.buildLoading(this.props, this.state)}
				</div>
			);
	}
});

Form.Popup = React.createClass({
	propTypes: {
		device: React.PropTypes.string,
		form: React.PropTypes.object
	},
	buildLayer(props, state) {
		return props.form ? <Layer onClick={props.form.get('decline')}></Layer> : null;
	},
	buildLayout(formName) {
		return mdx(formName, {
			'career': function () {
				return (formLength)=> {
					if (formLength != 14) throw new Error('Invalid career form length: Must be 14');
					return Immutable.fromJS([4, 4, 1, 2, 2, 1]);
				}
			}
		})
	},
	buildPopup(props, state) {
		if (props.form) {
			var {id,content,result,accept,decline,name,thumbnail,contentType} = props.form.toObject();
			var className = cx({
				[name]: !!name,
				"submitted": !!result,
				"submitted--success": result && result.get('success')
			});
			return (
				<Popup device={props.device} className={className} onClose={decline}>
					<div className="content">
						{thumbnail &&
						<div className="thumbnail"><Image fill={true} src={thumbnail} loadingIcon='/img/hourglass.svg' alt="Loading"></Image>
						</div>}
						<Form id={id} result={result} onSubmit={accept} form={content} onClose={decline}
									buildLayout={this.buildLayout(name)}/>
					</div>
				</Popup>
			);
		} else return null;
	},
	render() {
		return (
			<div className="b-popup-form">
				{this.buildLayer(this.props, this.state)}
				<ReactCSSTransitionGroup component="div" className="wrapper" transitionName="popup-animation"
														transitionEnter={true}>
					{this.buildPopup(this.props, this.state)}
				</ReactCSSTransitionGroup>
			</div>
		)
	}
});

module.exports = Form;
