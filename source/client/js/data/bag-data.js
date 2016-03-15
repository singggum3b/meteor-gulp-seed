function addIndex(list) {
	return list.map((value, index)=> {
		value.index = index;
		return value;
	});
}

var bagDataBaseOnSize = Immutable.fromJS({
	small: {
		body: {
			meta: {
				title: "Front/Back Panels",
				type: "body",
				originalSize: [1250, 1250],
				activePosition: [470, 990],
				paletteOpened: false
			},
			list: addIndex([
				{
					title: "Black",
					img: "/img/bag-1-body-panels-black.png",
					thumbnail: "/img/thumb-1-trim-black.png"
				},
				{
					title: "white sand",
					img: "/img/bag-2-body-panels-white-sand.png",
					thumbnail: "/img/thumb-2-trim-white-sand.png"
				},
				{
					title: "Coral",
					img: "/img/bag-3-body-panels-coral.png",
					thumbnail: "/img/thumb-3-trim-coral.png"
				},
				{
					title: "Mink",
					img: "/img/bag-4-body-panels-mink.png",
					thumbnail: "/img/thumb-4-trim-mink.png"
				},
				{
					title: "Black 2",
					img: "/img/bag-5-body-panels-black-2.png",
					thumbnail: "/img/thumb-5-trim-black-2.png"
				},
				{
					title: "Sky",
					img: "/img/bag-6-body-panels-sky.png",
					thumbnail: "/img/thumb-6-trim-sky.png"
				},
				{
					title: "Brown",
					img: "/img/bag-7-body-panels-brown.png",
					thumbnail: "/img/thumb-7-trim-brown.png"
				},
				{
					title: "Plum",
					img: "/img/bag-8-body-panels-plum.png",
					thumbnail: "/img/thumb-8-trim-plum.png"
				},
				{
					title: "Olive",
					img: "/img/bag-9-body-panels-olive.png",
					thumbnail: "/img/thumb-9-trim-olive.png"
				},{
					title: "marigold snake",
					img: "/img/bag-10-body-panels-marigold-snake.png",
					thumbnail: "/img/thumb-10-trim-marigold-snake.png"
				},{
					title: "hay snake",
					img: "/img/bag-11-body-panels-hay-snake.png",
					thumbnail: "/img/thumb-11-trim-hay-snake.png"
				},{
					title: "lapis snake",
					img: "/img/bag-12-body-panels-lapis-snake.png",
					thumbnail: "/img/thumb-12-trim-lapis-snake.png"
				},{
					title: "violet snake",
					img: "/img/bag-13-body-panels-violet-snake.png",
					thumbnail: "/img/thumb-13-trim-violet-snake.png"
				},{
					title: "cherry snake",
					img: "/img/bag-14-body-panels-cherry-snake.png",
					thumbnail: "/img/thumb-14-trim-cherry-snake.png"
				},{
					title: "marigold croc",
					img: "/img/bag-15-body-panels-marigold-croc.png",
					thumbnail: "/img/thumb-15-trim-marigold-croc.png"
				},{
					title: "cornflower croc",
					img: "/img/bag-16-body-panels-cornflower-croc.png",
					thumbnail: "/img/thumb-16-trim-cornflower-croc.png"
				},{
					title: "violet croc",
					img: "/img/bag-17-body-panels-violet-croc.png",
					thumbnail: "/img/thumb-17-trim-violet-croc.png"
				},{
					title: "cherry croc",
					img: "/img/bag-18-body-panels-cherry-croc.png",
					thumbnail: "/img/thumb-18-trim-cherry-croc.png"
				}
			])
		},
		sidePanels: {
			meta: {
				title: "Side Panels",
				type: "sidePanels",
				originalSize: [1250, 1250],
				activePosition: [220, 580],
				paletteOpened: false
			},
			list: addIndex([
				{
					title: "Black",
					img: "/img/bag-1-side-panels-black.png",
					thumbnail: "/img/thumb-1-trim-black.png"
				},
				{
					title: "white sand",
					img: "/img/bag-2-side-panels-white-sand.png",
					thumbnail: "/img/thumb-2-trim-white-sand.png"
				},
				{
					title: "Coral",
					img: "/img/bag-3-side-panels-coral.png",
					thumbnail: "/img/thumb-3-trim-coral.png"
				},
				{
					title: "Mink",
					img: "/img/bag-4-side-panels-mink.png",
					thumbnail: "/img/thumb-4-trim-mink.png"
				},
				{
					title: "Black 2",
					img: "/img/bag-5-side-panels-black-2.png",
					thumbnail: "/img/thumb-5-trim-black-2.png"
				},
				{
					title: "Sky",
					img: "/img/bag-6-side-panels-sky.png",
					thumbnail: "/img/thumb-6-trim-sky.png"
				},
				{
					title: "Brown",
					img: "/img/bag-7-side-panels-brown.png",
					thumbnail: "/img/thumb-7-trim-brown.png"
				},
				{
					title: "Plum",
					img: "/img/bag-8-side-panels-plum.png",
					thumbnail: "/img/thumb-8-trim-plum.png"
				},
				{
					title: "Olive",
					img: "/img/bag-9-side-panels-olive.png",
					thumbnail: "/img/thumb-9-trim-olive.png"
				},{
					title: "marigold snake",
					img: "/img/bag-10-side-panels-marigold-snake.png",
					thumbnail: "/img/thumb-10-trim-marigold-snake.png"
				},{
					title: "hay snake",
					img: "/img/bag-11-side-panels-hay-snake.png",
					thumbnail: "/img/thumb-11-trim-hay-snake.png"
				},{
					title: "lapis snake",
					img: "/img/bag-12-side-panels-lapis-snake.png",
					thumbnail: "/img/thumb-12-trim-lapis-snake.png"
				},{
					title: "violet snake",
					img: "/img/bag-13-side-panels-violet-snake.png",
					thumbnail: "/img/thumb-13-trim-violet-snake.png"
				},{
					title: "cherry snake",
					img: "/img/bag-14-side-panels-cherry-snake.png",
					thumbnail: "/img/thumb-14-trim-cherry-snake.png"
				},{
					title: "marigold croc",
					img: "/img/bag-15-side-panels-marigold-croc.png",
					thumbnail: "/img/thumb-15-trim-marigold-croc.png"
				},{
					title: "cornflower croc",
					img: "/img/bag-16-side-panels-cornflower-croc.png",
					thumbnail: "/img/thumb-16-trim-cornflower-croc.png"
				},{
					title: "violet croc",
					img: "/img/bag-17-side-panels-violet-croc.png",
					thumbnail: "/img/thumb-17-trim-violet-croc.png"
				},{
					title: "cherry croc",
					img: "/img/bag-18-side-panels-cherry-croc.png",
					thumbnail: "/img/thumb-18-trim-cherry-croc.png"
				}
			])
		},
		hardware: {
			meta: {
				title: "Hardware",
				type: "hardware", //hardware
				originalSize: [1250, 1250],
				activePosition: [860, 690],
				paletteOpened: false
			},
			list: addIndex([
				{
					title: "Nickel",
					img: "/img/bag-1-hardware-nickel.png",
					thumbnail: "/img/thumb-1-hardware-nickel.png"
				},
				{
					title: "Light Gold",
					img: "/img/bag-2-hardware-light-gold.png",
					thumbnail: "/img/thumb-2-hardware-light-gold.png"
				},
				{
					title: "Gunmetal",
					img: "/img/bag-3-hardware-gunmetal.png",
					thumbnail: "/img/thumb-3-hardware-gunmetal.png"
				},
				{
					title: "Matte Black",
					img: "/img/bag-4-hardware-matte-black.png",
					thumbnail: "/img/thumb-4-hardware-matte-black.png"
				}
			])
		},
		trim: {
			meta: {
				title: "Trim",
				type: "trim", //trim
				originalSize: [1250, 1250],
				activePosition: [905, 470],
				paletteOpened: false
			},
			list: addIndex([
				{
					title: "Black",
					img: "/img/bag-1-trim-black.png",
					thumbnail: "/img/thumb-1-trim-black.png"
				},
				{
					title: "white sand",
					img: "/img/bag-2-trim-white-sand.png",
					thumbnail: "/img/thumb-2-trim-white-sand.png"
				},
				{
					title: "Coral",
					img: "/img/bag-3-trim-coral.png",
					thumbnail: "/img/thumb-3-trim-coral.png"
				},
				{
					title: "Mink",
					img: "/img/bag-4-trim-mink.png",
					thumbnail: "/img/thumb-4-trim-mink.png"
				},
				{
					title: "Black 2",
					img: "/img/bag-5-trim-black-2.png",
					thumbnail: "/img/thumb-5-trim-black-2.png"
				},
				{
					title: "Sky",
					img: "/img/bag-6-trim-sky.png",
					thumbnail: "/img/thumb-6-trim-sky.png"
				},
				{
					title: "Brown",
					img: "/img/bag-7-trim-brown.png",
					thumbnail: "/img/thumb-7-trim-brown.png"
				},
				{
					title: "Plum",
					img: "/img/bag-8-trim-plum.png",
					thumbnail: "/img/thumb-8-trim-plum.png"
				},
				{
					title: "Olive",
					img: "/img/bag-9-trim-olive.png",
					thumbnail: "/img/thumb-9-trim-olive.png"
				},{
					title: "marigold snake",
					img: "/img/bag-10-trim-marigold-snake.png",
					thumbnail: "/img/thumb-10-trim-marigold-snake.png"
				},{
					title: "hay snake",
					img: "/img/bag-11-trim-hay-snake.png",
					thumbnail: "/img/thumb-11-trim-hay-snake.png"
				},{
					title: "lapis snake",
					img: "/img/bag-12-trim-lapis-snake.png",
					thumbnail: "/img/thumb-12-trim-lapis-snake.png"
				},{
					title: "violet snake",
					img: "/img/bag-13-trim-violet-snake.png",
					thumbnail: "/img/thumb-13-trim-violet-snake.png"
				},{
					title: "cherry snake",
					img: "/img/bag-14-trim-cherry-snake.png",
					thumbnail: "/img/thumb-14-trim-cherry-snake.png"
				},{
					title: "marigold croc",
					img: "/img/bag-15-trim-marigold-croc.png",
					thumbnail: "/img/thumb-15-trim-marigold-croc.png"
				},{
					title: "cornflower croc",
					img: "/img/bag-16-trim-cornflower-croc.png",
					thumbnail: "/img/thumb-16-trim-cornflower-croc.png"
				},{
					title: "violet croc",
					img: "/img/bag-17-trim-violet-croc.png",
					thumbnail: "/img/thumb-17-trim-violet-croc.png"
				},{
					title: "cherry croc",
					img: "/img/bag-18-trim-cherry-croc.png",
					thumbnail: "/img/thumb-18-trim-cherry-croc.png"
				}
			])
		}
	},
	medium: {
		body: {
			meta: {
				title: "Front/Back Panels",
				type: "body",
				originalSize: [1250, 1250],
				activePosition: [470, 990],
				paletteOpened: false
			},
			list: addIndex([
				{
					title: "Black",
					img: "/img/bag-1-body-panels-black.png",
					thumbnail: "/img/thumb-1-trim-black.png"
				},
				{
					title: "white sand",
					img: "/img/bag-2-body-panels-white-sand.png",
					thumbnail: "/img/thumb-2-trim-white-sand.png"
				},
				{
					title: "Coral",
					img: "/img/bag-3-body-panels-coral.png",
					thumbnail: "/img/thumb-3-trim-coral.png"
				},
				{
					title: "Mink",
					img: "/img/bag-4-body-panels-mink.png",
					thumbnail: "/img/thumb-4-trim-mink.png"
				},
				{
					title: "Black 2",
					img: "/img/bag-5-body-panels-black-2.png",
					thumbnail: "/img/thumb-5-trim-black-2.png"
				},
				{
					title: "Sky",
					img: "/img/bag-6-body-panels-sky.png",
					thumbnail: "/img/thumb-6-trim-sky.png"
				},
				{
					title: "Brown",
					img: "/img/bag-7-body-panels-brown.png",
					thumbnail: "/img/thumb-7-trim-brown.png"
				},
				{
					title: "Plum",
					img: "/img/bag-8-body-panels-plum.png",
					thumbnail: "/img/thumb-8-trim-plum.png"
				},
				{
					title: "Olive",
					img: "/img/bag-9-body-panels-olive.png",
					thumbnail: "/img/thumb-9-trim-olive.png"
				},{
					title: "marigold snake",
					img: "/img/bag-10-body-panels-marigold-snake.png",
					thumbnail: "/img/thumb-10-trim-marigold-snake.png"
				},{
					title: "hay snake",
					img: "/img/bag-11-body-panels-hay-snake.png",
					thumbnail: "/img/thumb-11-trim-hay-snake.png"
				},{
					title: "lapis snake",
					img: "/img/bag-12-body-panels-lapis-snake.png",
					thumbnail: "/img/thumb-12-trim-lapis-snake.png"
				},{
					title: "violet snake",
					img: "/img/bag-13-body-panels-violet-snake.png",
					thumbnail: "/img/thumb-13-trim-violet-snake.png"
				},{
					title: "cherry snake",
					img: "/img/bag-14-body-panels-cherry-snake.png",
					thumbnail: "/img/thumb-14-trim-cherry-snake.png"
				},{
					title: "marigold croc",
					img: "/img/bag-15-body-panels-marigold-croc.png",
					thumbnail: "/img/thumb-15-trim-marigold-croc.png"
				},{
					title: "cornflower croc",
					img: "/img/bag-16-body-panels-cornflower-croc.png",
					thumbnail: "/img/thumb-16-trim-cornflower-croc.png"
				},{
					title: "violet croc",
					img: "/img/bag-17-body-panels-violet-croc.png",
					thumbnail: "/img/thumb-17-trim-violet-croc.png"
				},{
					title: "cherry croc",
					img: "/img/bag-18-body-panels-cherry-croc.png",
					thumbnail: "/img/thumb-18-trim-cherry-croc.png"
				}
			])
		},
		sidePanels: {
			meta: {
				title: "Side Panels",
				type: "sidePanels",
				originalSize: [1250, 1250],
				activePosition: [220, 580],
				paletteOpened: false
			},
			list: addIndex([
				{
					title: "Black",
					img: "/img/bag-1-side-panels-black.png",
					thumbnail: "/img/thumb-1-trim-black.png"
				},
				{
					title: "white sand",
					img: "/img/bag-2-side-panels-white-sand.png",
					thumbnail: "/img/thumb-2-trim-white-sand.png"
				},
				{
					title: "Coral",
					img: "/img/bag-3-side-panels-coral.png",
					thumbnail: "/img/thumb-3-trim-coral.png"
				},
				{
					title: "Mink",
					img: "/img/bag-4-side-panels-mink.png",
					thumbnail: "/img/thumb-4-trim-mink.png"
				},
				{
					title: "Black 2",
					img: "/img/bag-5-side-panels-black-2.png",
					thumbnail: "/img/thumb-5-trim-black-2.png"
				},
				{
					title: "Sky",
					img: "/img/bag-6-side-panels-sky.png",
					thumbnail: "/img/thumb-6-trim-sky.png"
				},
				{
					title: "Brown",
					img: "/img/bag-7-side-panels-brown.png",
					thumbnail: "/img/thumb-7-trim-brown.png"
				},
				{
					title: "Plum",
					img: "/img/bag-8-side-panels-plum.png",
					thumbnail: "/img/thumb-8-trim-plum.png"
				},
				{
					title: "Olive",
					img: "/img/bag-9-side-panels-olive.png",
					thumbnail: "/img/thumb-9-trim-olive.png"
				},{
					title: "marigold snake",
					img: "/img/bag-10-side-panels-marigold-snake.png",
					thumbnail: "/img/thumb-10-trim-marigold-snake.png"
				},{
					title: "hay snake",
					img: "/img/bag-11-side-panels-hay-snake.png",
					thumbnail: "/img/thumb-11-trim-hay-snake.png"
				},{
					title: "lapis snake",
					img: "/img/bag-12-side-panels-lapis-snake.png",
					thumbnail: "/img/thumb-12-trim-lapis-snake.png"
				},{
					title: "violet snake",
					img: "/img/bag-13-side-panels-violet-snake.png",
					thumbnail: "/img/thumb-13-trim-violet-snake.png"
				},{
					title: "cherry snake",
					img: "/img/bag-14-side-panels-cherry-snake.png",
					thumbnail: "/img/thumb-14-trim-cherry-snake.png"
				},{
					title: "marigold croc",
					img: "/img/bag-15-side-panels-marigold-croc.png",
					thumbnail: "/img/thumb-15-trim-marigold-croc.png"
				},{
					title: "cornflower croc",
					img: "/img/bag-16-side-panels-cornflower-croc.png",
					thumbnail: "/img/thumb-16-trim-cornflower-croc.png"
				},{
					title: "violet croc",
					img: "/img/bag-17-side-panels-violet-croc.png",
					thumbnail: "/img/thumb-17-trim-violet-croc.png"
				},{
					title: "cherry croc",
					img: "/img/bag-18-side-panels-cherry-croc.png",
					thumbnail: "/img/thumb-18-trim-cherry-croc.png"
				}
			])
		},
		hardware: {
			meta: {
				title: "Hardware",
				type: "hardware", //hardware
				originalSize: [1250, 1250],
				activePosition: [860, 690],
				paletteOpened: false
			},
			list: addIndex([
				{
					title: "Nickel",
					img: "/img/bag-1-hardware-nickel.png",
					thumbnail: "/img/thumb-1-hardware-nickel.png"
				},
				{
					title: "Light Gold",
					img: "/img/bag-2-hardware-light-gold.png",
					thumbnail: "/img/thumb-2-hardware-light-gold.png"
				},
				{
					title: "Gunmetal",
					img: "/img/bag-3-hardware-gunmetal.png",
					thumbnail: "/img/thumb-3-hardware-gunmetal.png"
				},
				{
					title: "Matte Black",
					img: "/img/bag-4-hardware-matte-black.png",
					thumbnail: "/img/thumb-4-hardware-matte-black.png"
				}
			])
		},
		trim: {
			meta: {
				title: "Trim",
				type: "trim", //trim
				originalSize: [1250, 1250],
				activePosition: [905, 470],
				paletteOpened: false
			},
			list: addIndex([
				{
					title: "Black",
					img: "/img/bag-1-trim-black.png",
					thumbnail: "/img/thumb-1-trim-black.png"
				},
				{
					title: "white sand",
					img: "/img/bag-2-trim-white-sand.png",
					thumbnail: "/img/thumb-2-trim-white-sand.png"
				},
				{
					title: "Coral",
					img: "/img/bag-3-trim-coral.png",
					thumbnail: "/img/thumb-3-trim-coral.png"
				},
				{
					title: "Mink",
					img: "/img/bag-4-trim-mink.png",
					thumbnail: "/img/thumb-4-trim-mink.png"
				},
				{
					title: "Black 2",
					img: "/img/bag-5-trim-black-2.png",
					thumbnail: "/img/thumb-5-trim-black-2.png"
				},
				{
					title: "Sky",
					img: "/img/bag-6-trim-sky.png",
					thumbnail: "/img/thumb-6-trim-sky.png"
				},
				{
					title: "Brown",
					img: "/img/bag-7-trim-brown.png",
					thumbnail: "/img/thumb-7-trim-brown.png"
				},
				{
					title: "Plum",
					img: "/img/bag-8-trim-plum.png",
					thumbnail: "/img/thumb-8-trim-plum.png"
				},
				{
					title: "Olive",
					img: "/img/bag-9-trim-olive.png",
					thumbnail: "/img/thumb-9-trim-olive.png"
				},{
					title: "marigold snake",
					img: "/img/bag-10-trim-marigold-snake.png",
					thumbnail: "/img/thumb-10-trim-marigold-snake.png"
				},{
					title: "hay snake",
					img: "/img/bag-11-trim-hay-snake.png",
					thumbnail: "/img/thumb-11-trim-hay-snake.png"
				},{
					title: "lapis snake",
					img: "/img/bag-12-trim-lapis-snake.png",
					thumbnail: "/img/thumb-12-trim-lapis-snake.png"
				},{
					title: "violet snake",
					img: "/img/bag-13-trim-violet-snake.png",
					thumbnail: "/img/thumb-13-trim-violet-snake.png"
				},{
					title: "cherry snake",
					img: "/img/bag-14-trim-cherry-snake.png",
					thumbnail: "/img/thumb-14-trim-cherry-snake.png"
				},{
					title: "marigold croc",
					img: "/img/bag-15-trim-marigold-croc.png",
					thumbnail: "/img/thumb-15-trim-marigold-croc.png"
				},{
					title: "cornflower croc",
					img: "/img/bag-16-trim-cornflower-croc.png",
					thumbnail: "/img/thumb-16-trim-cornflower-croc.png"
				},{
					title: "violet croc",
					img: "/img/bag-17-trim-violet-croc.png",
					thumbnail: "/img/thumb-17-trim-violet-croc.png"
				},{
					title: "cherry croc",
					img: "/img/bag-18-trim-cherry-croc.png",
					thumbnail: "/img/thumb-18-trim-cherry-croc.png"
				}
			])
		}
	},
	large: {
		body: {
			meta: {
				title: "Front/Back Panels",
				type: "body",
				originalSize: [1250, 1250],
				activePosition: [470, 990],
				paletteOpened: false
			},
			list: addIndex([
				{
					title: "Black",
					img: "/img/bag-1-body-panels-black.png",
					thumbnail: "/img/thumb-1-trim-black.png"
				},
				{
					title: "white sand",
					img: "/img/bag-2-body-panels-white-sand.png",
					thumbnail: "/img/thumb-2-trim-white-sand.png"
				},
				{
					title: "Coral",
					img: "/img/bag-3-body-panels-coral.png",
					thumbnail: "/img/thumb-3-trim-coral.png"
				},
				{
					title: "Mink",
					img: "/img/bag-4-body-panels-mink.png",
					thumbnail: "/img/thumb-4-trim-mink.png"
				},
				{
					title: "Black 2",
					img: "/img/bag-5-body-panels-black-2.png",
					thumbnail: "/img/thumb-5-trim-black-2.png"
				},
				{
					title: "Sky",
					img: "/img/bag-6-body-panels-sky.png",
					thumbnail: "/img/thumb-6-trim-sky.png"
				},
				{
					title: "Brown",
					img: "/img/bag-7-body-panels-brown.png",
					thumbnail: "/img/thumb-7-trim-brown.png"
				},
				{
					title: "Plum",
					img: "/img/bag-8-body-panels-plum.png",
					thumbnail: "/img/thumb-8-trim-plum.png"
				},
				{
					title: "Olive",
					img: "/img/bag-9-body-panels-olive.png",
					thumbnail: "/img/thumb-9-trim-olive.png"
				},{
					title: "marigold snake",
					img: "/img/bag-10-body-panels-marigold-snake.png",
					thumbnail: "/img/thumb-10-trim-marigold-snake.png"
				},{
					title: "hay snake",
					img: "/img/bag-11-body-panels-hay-snake.png",
					thumbnail: "/img/thumb-11-trim-hay-snake.png"
				},{
					title: "lapis snake",
					img: "/img/bag-12-body-panels-lapis-snake.png",
					thumbnail: "/img/thumb-12-trim-lapis-snake.png"
				},{
					title: "violet snake",
					img: "/img/bag-13-body-panels-violet-snake.png",
					thumbnail: "/img/thumb-13-trim-violet-snake.png"
				},{
					title: "cherry snake",
					img: "/img/bag-14-body-panels-cherry-snake.png",
					thumbnail: "/img/thumb-14-trim-cherry-snake.png"
				},{
					title: "marigold croc",
					img: "/img/bag-15-body-panels-marigold-croc.png",
					thumbnail: "/img/thumb-15-trim-marigold-croc.png"
				},{
					title: "cornflower croc",
					img: "/img/bag-16-body-panels-cornflower-croc.png",
					thumbnail: "/img/thumb-16-trim-cornflower-croc.png"
				},{
					title: "violet croc",
					img: "/img/bag-17-body-panels-violet-croc.png",
					thumbnail: "/img/thumb-17-trim-violet-croc.png"
				},{
					title: "cherry croc",
					img: "/img/bag-18-body-panels-cherry-croc.png",
					thumbnail: "/img/thumb-18-trim-cherry-croc.png"
				}
			])
		},
		sidePanels: {
			meta: {
				title: "Side Panels",
				type: "sidePanels",
				originalSize: [1250, 1250],
				activePosition: [220, 580],
				paletteOpened: false
			},
			list: addIndex([
				{
					title: "Black",
					img: "/img/bag-1-side-panels-black.png",
					thumbnail: "/img/thumb-1-trim-black.png"
				},
				{
					title: "white sand",
					img: "/img/bag-2-side-panels-white-sand.png",
					thumbnail: "/img/thumb-2-trim-white-sand.png"
				},
				{
					title: "Coral",
					img: "/img/bag-3-side-panels-coral.png",
					thumbnail: "/img/thumb-3-trim-coral.png"
				},
				{
					title: "Mink",
					img: "/img/bag-4-side-panels-mink.png",
					thumbnail: "/img/thumb-4-trim-mink.png"
				},
				{
					title: "Black 2",
					img: "/img/bag-5-side-panels-black-2.png",
					thumbnail: "/img/thumb-5-trim-black-2.png"
				},
				{
					title: "Sky",
					img: "/img/bag-6-side-panels-sky.png",
					thumbnail: "/img/thumb-6-trim-sky.png"
				},
				{
					title: "Brown",
					img: "/img/bag-7-side-panels-brown.png",
					thumbnail: "/img/thumb-7-trim-brown.png"
				},
				{
					title: "Plum",
					img: "/img/bag-8-side-panels-plum.png",
					thumbnail: "/img/thumb-8-trim-plum.png"
				},
				{
					title: "Olive",
					img: "/img/bag-9-side-panels-olive.png",
					thumbnail: "/img/thumb-9-trim-olive.png"
				},{
					title: "marigold snake",
					img: "/img/bag-10-side-panels-marigold-snake.png",
					thumbnail: "/img/thumb-10-trim-marigold-snake.png"
				},{
					title: "hay snake",
					img: "/img/bag-11-side-panels-hay-snake.png",
					thumbnail: "/img/thumb-11-trim-hay-snake.png"
				},{
					title: "lapis snake",
					img: "/img/bag-12-side-panels-lapis-snake.png",
					thumbnail: "/img/thumb-12-trim-lapis-snake.png"
				},{
					title: "violet snake",
					img: "/img/bag-13-side-panels-violet-snake.png",
					thumbnail: "/img/thumb-13-trim-violet-snake.png"
				},{
					title: "cherry snake",
					img: "/img/bag-14-side-panels-cherry-snake.png",
					thumbnail: "/img/thumb-14-trim-cherry-snake.png"
				},{
					title: "marigold croc",
					img: "/img/bag-15-side-panels-marigold-croc.png",
					thumbnail: "/img/thumb-15-trim-marigold-croc.png"
				},{
					title: "cornflower croc",
					img: "/img/bag-16-side-panels-cornflower-croc.png",
					thumbnail: "/img/thumb-16-trim-cornflower-croc.png"
				},{
					title: "violet croc",
					img: "/img/bag-17-side-panels-violet-croc.png",
					thumbnail: "/img/thumb-17-trim-violet-croc.png"
				},{
					title: "cherry croc",
					img: "/img/bag-18-side-panels-cherry-croc.png",
					thumbnail: "/img/thumb-18-trim-cherry-croc.png"
				}
			])
		},
		hardware: {
			meta: {
				title: "Hardware",
				type: "hardware", //hardware
				originalSize: [1250, 1250],
				activePosition: [860, 690],
				paletteOpened: false
			},
			list: addIndex([
				{
					title: "Nickel",
					img: "/img/bag-1-hardware-nickel.png",
					thumbnail: "/img/thumb-1-hardware-nickel.png"
				},
				{
					title: "Light Gold",
					img: "/img/bag-2-hardware-light-gold.png",
					thumbnail: "/img/thumb-2-hardware-light-gold.png"
				},
				{
					title: "Gunmetal",
					img: "/img/bag-3-hardware-gunmetal.png",
					thumbnail: "/img/thumb-3-hardware-gunmetal.png"
				},
				{
					title: "Matte Black",
					img: "/img/bag-4-hardware-matte-black.png",
					thumbnail: "/img/thumb-4-hardware-matte-black.png"
				}
			])
		},
		trim: {
			meta: {
				title: "Trim",
				type: "trim", //trim
				originalSize: [1250, 1250],
				activePosition: [905, 470],
				paletteOpened: false
			},
			list: addIndex([
				{
					title: "Black",
					img: "/img/bag-1-trim-black.png",
					thumbnail: "/img/thumb-1-trim-black.png"
				},
				{
					title: "white sand",
					img: "/img/bag-2-trim-white-sand.png",
					thumbnail: "/img/thumb-2-trim-white-sand.png"
				},
				{
					title: "Coral",
					img: "/img/bag-3-trim-coral.png",
					thumbnail: "/img/thumb-3-trim-coral.png"
				},
				{
					title: "Mink",
					img: "/img/bag-4-trim-mink.png",
					thumbnail: "/img/thumb-4-trim-mink.png"
				},
				{
					title: "Black 2",
					img: "/img/bag-5-trim-black-2.png",
					thumbnail: "/img/thumb-5-trim-black-2.png"
				},
				{
					title: "Sky",
					img: "/img/bag-6-trim-sky.png",
					thumbnail: "/img/thumb-6-trim-sky.png"
				},
				{
					title: "Brown",
					img: "/img/bag-7-trim-brown.png",
					thumbnail: "/img/thumb-7-trim-brown.png"
				},
				{
					title: "Plum",
					img: "/img/bag-8-trim-plum.png",
					thumbnail: "/img/thumb-8-trim-plum.png"
				},
				{
					title: "Olive",
					img: "/img/bag-9-trim-olive.png",
					thumbnail: "/img/thumb-9-trim-olive.png"
				},{
					title: "marigold snake",
					img: "/img/bag-10-trim-marigold-snake.png",
					thumbnail: "/img/thumb-10-trim-marigold-snake.png"
				},{
					title: "hay snake",
					img: "/img/bag-11-trim-hay-snake.png",
					thumbnail: "/img/thumb-11-trim-hay-snake.png"
				},{
					title: "lapis snake",
					img: "/img/bag-12-trim-lapis-snake.png",
					thumbnail: "/img/thumb-12-trim-lapis-snake.png"
				},{
					title: "violet snake",
					img: "/img/bag-13-trim-violet-snake.png",
					thumbnail: "/img/thumb-13-trim-violet-snake.png"
				},{
					title: "cherry snake",
					img: "/img/bag-14-trim-cherry-snake.png",
					thumbnail: "/img/thumb-14-trim-cherry-snake.png"
				},{
					title: "marigold croc",
					img: "/img/bag-15-trim-marigold-croc.png",
					thumbnail: "/img/thumb-15-trim-marigold-croc.png"
				},{
					title: "cornflower croc",
					img: "/img/bag-16-trim-cornflower-croc.png",
					thumbnail: "/img/thumb-16-trim-cornflower-croc.png"
				},{
					title: "violet croc",
					img: "/img/bag-17-trim-violet-croc.png",
					thumbnail: "/img/thumb-17-trim-violet-croc.png"
				},{
					title: "cherry croc",
					img: "/img/bag-18-trim-cherry-croc.png",
					thumbnail: "/img/thumb-18-trim-cherry-croc.png"
				}
			])
		}
	}
});

var data = Immutable.fromJS({
	bagMeta: {
		size: {
			meta: {
				type: "size",
				title: "Bag Size",
				isShow: true
			},
			list: addIndex([
				{
					type: "small",
					title: "Coach Swagger 20",
					htmlTitle: "<span>COACH</span><span>swagger 20</span>",
					img: "/img/bag_thumb_size.png",
					description: require("./html/bag-small-text.htm")
				},
				{
					type: "medium",
					title: "Coach Swagger 27",
					htmlTitle: "<span>COACH</span><span>swagger 27</span>",
					img: "/img/bag_thumb_size.png",
					description: require("./html/bag-medium-text.htm")
				},
				{
					type: "large",
					title: "Coach Swagger 37",
					htmlTitle: "<span>COACH</span><span>swagger 37</span>",
					img: "/img/bag_thumb_size.png",
					description: require("./html/bag-large-text.htm")
				}
			])
		}
	},
	selectedBagOptions: {
		body: undefined,
		metal: undefined,
		line: undefined,
		size: undefined
	}
});

module.exports = {
	getData(size) {
		//return data according to bag'size
		return data.set("bagData", bagDataBaseOnSize.get(size))
				.updateIn(["selectedBagOptions", "size"], function (oldSize) {
					return data.getIn(["bagMeta", "size", "list"]).find((item)=> {
						return item.get("type") == size;
					});
				});
	},
	ImageList: Immutable.fromJS(require("glob-filename-loader?publicPath=&root=source/client/img/!js/../img.preload"))

};
