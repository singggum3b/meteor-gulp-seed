//==================FLUX=========================
var Reactor = require("client/js/reactor.js");
var MediaStore = require("client/js/media");
//===============================================
var Head = require("react-helmet");
var AppHead = React.createClass({
	displayName: "AppHead",
	render() {
		return (
			<Head meta={[{name: "viewport", content: "width=device-width, initial-scale=1"}]}
						onChangeClientState={(newState) => {
							MediaStore.actions.headReady();
							}}/>
		)
	}
});

module.exports = AppHead;
