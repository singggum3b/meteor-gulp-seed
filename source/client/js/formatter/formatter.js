var F = {
	date: (value, opt)=> {
		return Moment(value, opt.inputDateFormat, true).format(opt.outputDateFormat);
	}
};

module.exports = F;
