/*jslint nomen: true, plusplus: true */
/*globals alert, console*/


var HourChart = (function () {
    'use strict';

	var chartDiv, scalaDiv, scalaHours, options, init,
        pad2, insertElement, getHourSpace, getMinuteSpace, calculateTimeDiff,
        HoursBar, logger;

	options = {
		fontSize: 12,
		hourBackground: '#EDECEC',
		chartBackground: '#DAD9D9',
		hourSplitBackground: '#ffffff',
		halfSplitBackground: '#ffffff'
	};

	function HourChart(_chartDiv, _options) {

		if (!_chartDiv) {
			alert('div not found');
			return false;
		}

		options.extend(_options);

		init(_chartDiv);
	}

	init = function (_chartDiv) {
		var i, hours, hour_space, chart_div_w, hour_split, half_split;

		chartDiv = document.getElementById(_chartDiv);

		chart_div_w = chartDiv.offsetWidth;

		scalaDiv = document.createElement('div');
		scalaHours = document.createElement('div');

		scalaDiv.style.backgroundColor = options.chartBackground;
		scalaDiv.style.width = chart_div_w + 'px';
		scalaDiv.style.height = '30px';
		scalaDiv.style.position = 'relative';

		scalaHours.style.backgroundColor = options.hourBackground;
		scalaHours.style.width = chart_div_w + 'px';
		scalaHours.style.height = '20px';

		hour_space = getHourSpace(chart_div_w);

		for (i = 0; i < 25; i++) {

			hours = document.createElement('span');
			hours.innerHTML = pad2(i);
			hours.style.fontSize = options.fontSize + 'px';
			hours.style.position = 'absolute';
			hours.style.top = '0px';
			hours.style.left = (((i * hour_space) + hour_space / 2) - options.fontSize / 2) + 'px';

			scalaHours.appendChild(hours);

			hour_split = document.createElement('div');
			hour_split.style.width = '2px';
			hour_split.style.height = '10px';
			hour_split.style.position = 'absolute';
			hour_split.style.backgroundColor = options.hourSplitBackground;
			hour_split.style.top = '0px';
			hour_split.style.left = ((i * hour_space) + hour_space / 2) + 'px';

			scalaDiv.appendChild(hour_split);
		}

		for (i = 1; i < 25; i++) {

			half_split = document.createElement('div');
			half_split.style.width = '2px';
			half_split.style.height = '5px';
			half_split.style.position = 'absolute';
			half_split.style.backgroundColor = options.halfSplitBackground;
			half_split.style.top = '0px';
			half_split.style.left = (i * hour_space) + 'px';

			scalaDiv.appendChild(half_split);
		}

		insertElement(chartDiv, scalaHours);
		insertElement(chartDiv, scalaDiv);
	};

    HoursBar = (function () {

		var item_options;

		item_options = {
			onClick: function () {},
			background: 'blue'
		};

		function HoursBar(_item_options) {

			this.hour_bar = null;

			this.hour_bar = document.createElement('div');
			this.hour_bar.style.height = '20px';
			this.hour_bar.style.opacity = '0.5';
			this.hour_bar.style.filter = 'alpha(opacity = 50)';
			this.hour_bar.style.backgroundColor = item_options.background;
			this.hour_bar.style.position = 'absolute';
		}

		HoursBar.prototype.setPosition = function (position_x) {
			this.hour_bar.style.top = '5px';
			this.hour_bar.style.left = position_x + 'px';
		};

		HoursBar.prototype.setWidth = function (_width) {
			this.hour_bar.style.width = _width + 'px';
		};

		return HoursBar;

	}());

	Object.prototype.extend = function (obj) {
        var i;

        for (i in obj) {
            if (obj.hasOwnProperty(i)) {
                this[i] = obj[i];
            }
        }
    };

    pad2 = function (number) {
		return (number < 10 ? '0' : '') + number;
	};

	insertElement = function (target, element) {
		target.appendChild(element);
	};

	getHourSpace = function (chart_w) {
		return (chart_w / 25);
	};

	getMinuteSpace = function (hour_space) {
		return (hour_space / 60);
	};

	calculateTimeDiff = function (start_date, end_date) {
		return Math.round(end_date - start_date) / 60000;
	};

	HourChart.prototype.add = function (start_date, end_date, item_options) {
		var bar, minute_space, minutes, hour_space, bar_x, total_minutes,
			tmp_start_date, tmp_end_date, minute_width;

		hour_space = getHourSpace(chartDiv.offsetWidth);
		minute_space = getMinuteSpace(hour_space);

		minutes = calculateTimeDiff(start_date, end_date);

		minute_width = (minutes * minute_space);

		total_minutes = parseInt(start_date.getHours() * 60, 10) + parseInt(start_date.getMinutes(), 10);

		bar_x = (minutes * minute_space) + (hour_space / 2);

		bar = new HoursBar(item_options);
		bar.setPosition(bar_x);

		bar.setWidth(minute_width);

		if (typeof item_options !== 'undefined' && item_options.onClick) {
			bar.hour_bar.style.cursor = 'pointer';
			bar.hour_bar.onclick = function () {
				item_options.onClick();
			};
		}

		if (typeof item_options !== 'undefined' && item_options.background) {
			bar.hour_bar.style.backgroundColor = item_options.background;
		}

		insertElement(scalaDiv, bar.hour_bar);
	};

	return HourChart;
}());

var hour_chart = new HourChart('hour_chart_1');

hour_chart.add(new Date(2015,2,5,18,10,0), new Date(2015,2,5,19,12,59));
