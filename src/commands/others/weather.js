const Commands = require('../../structures/new/Command.js');
const weather = require('weather-js');
const Canvas = require('canvas');
const info = {
	name: 'weather',
	description: 'shows you the weather of that city/location',
	examples: ['weather berlin', 'weather New York']
};

class WeatherCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	run(msg, params) {
		if (params.length < 1) return msg.reply('You must add a word to search for');
		weather.find({ search: params.join(' '), degreeType: 'C' }, async (err, result) => {
			if (err || !result || !result[0]) return msg.channel.send('Something went wrong! did you spell the city name right?');
			let realResult = result[0];
			Canvas.registerFont('./materials/fonts/Roboto-Regular.ttf', { family: 'Roboto' });
			const { Image } = Canvas;
			const canvas = Canvas.createCanvas(400, 180);
			const ctx = canvas.getContext('2d');
			let base = new Image();
			let humidity = new Image();
			let windspeed = new Image();
			const { readFileAsync } = this;
			try {
				base.src = await readFileAsync('./materials/pictures/weather.png');
				humidity.src = await readFileAsync('./materials/icons/humidity.png');
				windspeed.src = await readFileAsync('./materials/icons/wind.png');
			} catch (error) {
				return msg.channel.send('Something went wrong while reading a file! try again and if the error still happens contact my owner!');
			}

			// Enviroment stuff
			ctx.drawImage(base, 0, 0, base.width, base.height);
			let fontColor = '#FFFFFF';
			ctx.scale(1, 1);
			ctx.patternQuality = 'billinear';
			ctx.filter = 'bilinear';
			ctx.antialias = 'subpixel';

			// City Name
			ctx.font = '20px Roboto';
			ctx.fillStyle = fontColor;
			ctx.fillText(realResult.location.name, 35, 50);

			// Temperature
			ctx.font = "48px 'Roboto'";
			ctx.fillStyle = fontColor;
			ctx.fillText(`${realResult.current.temperature}°C`, 35, 140);

			// Condition
			ctx.font = "16px 'Roboto'";
			ctx.textAlign = 'right';
			ctx.fillText(realResult.current.skytext, 370, 142);

			// Humidity Image
			ctx.drawImage(humidity, 358, 88);

			// Windspeed Image
			ctx.drawImage(windspeed, 358, 104, windspeed.width / 2, windspeed.height / 2);

			// Humidity & wind speed
			ctx.font = "16px 'Roboto'";
			ctx.fillText(`${realResult.current.humidity}%`, 353, 100);
			ctx.fillText(`${realResult.current.windspeed}`, 353, 121);

			// Send the Message
			msg.channel.send({
				files: [
					{
						attachment: canvas.toBuffer(),
						name: 'weather.png'
					}
				]
			});
		});
	}
}

module.exports = WeatherCommand;
