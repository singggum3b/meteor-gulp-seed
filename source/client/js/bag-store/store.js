var actionTypes = require("./constant").action;

var BagStore = new Nuclear.Store({
	getInitialState: function () {
		return require("js/data/bag-data").getData("medium").merge(
				Immutable.fromJS({
					dialog: undefined,
					customerComment: "",
					customerName: ""
				})
		);
	},
	initialize: function () {

		this.on(actionTypes.SET_BAG_OPTION, function (state, payload) {
			if (payload) {
				var _payload = Immutable.fromJS(payload);
				if (!_payload.every((feature,index)=> {
					return feature ? feature.has("index") : true
				})) throw new Error("Every option need to have an index");

				return state.update("selectedBagOptions", function (oldOption) {
					return oldOption.mergeDeep(_payload);
				});
			} else return state;
		});

		this.on(actionTypes.TOGGLE_PALETTE, function (state, payload) {
			if (payload) {
				return state.update("bagData",(oldBag)=>{
					return oldBag.map((feature,index)=>{
						return feature.setIn(["meta","paletteOpened"],false);
					});
				}).updateIn(["bagData",payload.type,"meta","paletteOpened"], function (oldOption) {
					return payload.isShow;
				});
			} else return state;
		});

		this.on(actionTypes.TOGGLE_SIZECHOOSER, function (state, payload) {
			if (payload) {
				return state.updateIn(["bagMeta","size","meta","isShow"], function (oldOption) {
					return payload.mode;
				});
			} else return state;
		});

		this.on(actionTypes.UPDATE_CUSTOMER_COMMENT, function (state, payload) {
			if (payload) {
				return state.update("customerComment", function (oldOption) {
					return payload.comment;
				});
			} else return state;
		});

		this.on(actionTypes.UPDATE_CUSTOMER_NAME, function (state, payload) {
			if (payload) {
				return state.update("customerName", function (oldOption) {
					return payload.name;
				});
			} else return state;
		});

		this.on(actionTypes.RESET_BAGOPTION, function (state, payload) {
			return state.update("selectedBagOptions", function (oldOptions) {
				return Immutable.fromJS({
					size: oldOptions.get("size")
				});
			});
		});


		this.on(actionTypes.UPDATE_BAGDATA, function (state, payload) {
			if (payload.size) {
				return state.update("bagData", function (oldbagData) {
					return require("js/data/bag-data").getData(payload.size.get("type")).get("bagData");
				});
			} else return state;
		});

		this.on(actionTypes.SET_DIALOG, function (state, payload) {
			if (payload) {
				return state.update("dialog", function (oldDialog) {
					return Immutable.fromJS(payload.dialog);
				});
			} else return state;
		});

	}
});

module.exports = BagStore;
