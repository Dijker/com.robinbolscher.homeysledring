'use strict';

const Homey = require('homey');

class HomeyLEDRingDriver extends Homey.Driver {
	onPairListDevices(data, callback) {
		return callback(null, [{
			name: 'Homey\'s LED Ring',
			data: {
				id: 'abcd'
			},
		}]);
	}
}

module.exports = HomeyLEDRingDriver;
