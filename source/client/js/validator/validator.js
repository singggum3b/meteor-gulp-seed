function escapeRegExp(str) {
	return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

var V = {
	length(value, condition) {
		var min = condition.length[0];
		var max = condition.length[1];
		max = max == -1 ? Infinity : max;
		return (min <= value.length && value.length <= max);
	},
	size(value, condition) {
		return value[0] ? value[0].size < parseInt(condition.size) : true
	},
	email(value, condition) {
		let email = condition.email ?
			condition.email
			:
			String.raw`^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$`;

		return new RegExp(email, "i").test(value);
	},
	number(value) {
		return Validator.isNumeric(value);
	},
	dateRange(value, condition) {
		var _date = Moment(value, "YYYY/M/D", true);//Strict match

		if (_date.isValid()) {
			var dateRange = condition.dateRange.map(function (val, index) {
				if (val == "today") return Moment();
				else if (val == -1) return val;
				else return Moment(val, "DD/MM/YYYY");
			});

			if (dateRange[0] == dateRange[1] == -1) {
				return true;
			} else if (dateRange[0] == -1) {
				return _date.isBefore(dateRange[1]);
			} else if (dateRange[1] == -1) {
				return _date.isAfter(dateRange[1]);
			} else {
				return _date.isBetween(dateRange[0], dateRange[1]);
			}
		} else {
			return false;
		}
	}
};

module.exports = V;
