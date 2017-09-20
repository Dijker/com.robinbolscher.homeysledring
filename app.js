'use strict';

const Homey = require('homey');
const { HomeyAPI } = require('athom-api');

class HomeysLEDRingApp extends Homey.App {
	
	onInit() {
		this.log(`${this.id} is running...`);
		this.api = HomeyAPI.forCurrentHomey();
	}
}

module.exports = HomeysLEDRingApp;