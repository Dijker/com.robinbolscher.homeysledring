'use strict';

const Homey = require('homey');
const request = require('request');

class HomeyLEDRing extends Homey.Device {

	async onInit() {

		this.registerCapabilityListener('onoff', this.onCapabilityOnOff.bind(this));
		this.registerCapabilityListener('dim', this.onCapabilityDim.bind(this));

		this.api = await Homey.app.api;

		this.pollInterval = setInterval(() => {
			this.pollLEDRingState();
		}, 15000);
	}

	onCapabilityOnOff(onoff) {
		return this.setLEDRingBrightness(onoff ? this.getCapabilityValue('dim') : 0);
	}

	onCapabilityDim(dim) {
		this.setCapabilityValue('onoff', dim > 0);
		return this.setLEDRingBrightness(dim);
	}

	setLEDRingBrightness(value) {
		if (value < 0 || value > 1) return new Error('invalid_brightness_value');

		this.log('setLEDRingBrightness() -> set', value);

		return new Promise((resolve, reject) => {
			request({
				url: this.api._baseUrl +'api/manager/ledring/brightness',
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${this.api._token.value}`
				},
				json: {
					brightness: value,
				}
			}, (err, result) => {
				if (err) {
					this.error('setLEDRingBrightness() -> failed', err);
					return reject(err);
				}
				this.log('setLEDRingBrightness() -> success');
				return resolve(result);
			});
		});
	}

	pollLEDRingState() {
		request({
			url: this.api._baseUrl +'api/manager/ledring/brightness',
			method: 'GET',
			headers: {
				Authorization: `Bearer ${this.api._token.value}`
			},
			json: true,
		}, (err, result) => {
			if (err || !result || !result.hasOwnProperty('body') || !result.body.hasOwnProperty('result')) {
				return this.error('could not get led ring state');
			}

			// Update state of led ring device
			this.setCapabilityValue('onoff', !!(result.body.result > 0));
			this.setCapabilityValue('dim', result.body.result);
		});
	}

	onDeleted() {
		clearInterval(this.pollInterval);
	}
}

module.exports = HomeyLEDRing;