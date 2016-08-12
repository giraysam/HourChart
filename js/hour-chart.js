var HourChart = (function() {

	var chartDiv, scalaDiv, scalaHours, options;

	options = {
		fontSize: 12,
		hourBackground: '#EDECEC',
		chartBackground: '#DAD9D9',
		hourSplitBackground: '#ffffff',
		halfSplitBackground: '#ffffff',
		delay: 1,
		hourText: "saat",
		minuteText: "dakika",
		dayText: "gün"
	};

	function HourChart(_chartDiv, _options) {

		if (!_chartDiv) {
			throw("Chart div not found");
		}

		extend(options, _options);

		/**
		 * to calculate x position for hour.
		 *
		 * x = x position
		 * H = Hour
		 * MD = Minute Distance
		 * HD = Hour Distance
		 *
		 * x = ((H*60) * MD) +(HD / 2)
		 */
		this.add = function(start_date, end_date, item_options) {
			var bar, hours_between_space, start_minutes, end_minutes, scala_width,
			start_x, end_x, date_diff, start_date_minutes, end_date_minutes,
			total_day, total_hour, total_minutes, _width;

			start_date_minutes = end_date_minutes = total_minutes = total_hour = total_day = 0;

			hours_between_space = calculateHoursBetweenSpace(chartDiv.offsetWidth);
			minutes_between_space = calculateMinutesBetweenSpace(hours_between_space);

			scala_width = 25 * hours_between_space;

			date_diff = getDateDiff(start_date, end_date);

			start_minutes = parseInt(start_date.getHours() * 60) + parseInt(start_date.getMinutes());
			end_minutes = parseInt(end_date.getHours() * 60) + parseInt(end_date.getMinutes());

			total_hour = 24 - start_date.getHours();
			total_hour = total_hour + end_date.getHours();

			if (total_hour >= 24) {
				total_hour = total_hour - 24;
			} else {
				date_diff = 0;
			}

			total_day = Math.abs(date_diff * 24);
			total_hour = total_day + total_hour;

			total_minutes = 60 - start_date.getMinutes();
			total_minutes = total_minutes + end_date.getMinutes();

			if (total_minutes >= 60) {
				total_minutes = total_minutes - 60;
			}

			total_minutes = (total_hour * 60) + total_minutes;

			_width = total_minutes * minutes_between_space;

			if (date_diff < 0) {
				start_x = ((end_minutes * minutes_between_space) + (hours_between_space / 2) + 1);
				start_x = (_width - start_x) * -1;

			} else {
				start_x = ((start_minutes * minutes_between_space) + (hours_between_space / 2) + 1);
			}

			bar = new HoursBar(item_options);
			bar.hour_bar.className = _chartDiv + "_hour_bar";

			bar.hour_bar.setAttribute('title',
				timeToText(total_minutes) + " " +
				pad2(start_date.getHours()) + ":" + pad2(start_date.getMinutes()) + " - " +
				pad2(end_date.getHours()) + ":" + pad2(end_date.getMinutes())
			);

			bar.setPosition(start_x);

			if(typeof item_options !== 'undefined' && item_options.onClick) {
				if (item_options.onClick.handle) {
					var params = item_options.onClick.params || [];
					
					bar.hour_bar.style.cursor = 'pointer';
					bar.hour_bar.onclick = function() {
						item_options.onClick.handle.apply(this, params);
					};
				}
			}

			if (typeof item_options !== 'undefined' && item_options.background) {
				bar.hour_bar.style.backgroundColor = item_options.background;
			}

			scalaDiv = document.getElementById('scala_' + _chartDiv);
			insertElement(scalaDiv, bar.hour_bar);

			move(bar.hour_bar, (_width), quad, options.delay * 1000);
		};

		this.clear = function () {
			var hour_bars, i;

			hour_bars = document.body.querySelectorAll('.' + _chartDiv + '_hour_bar');

			for(i = 0; i < hour_bars.length; i++) {
				hour_bars[i].parentElement.removeChild(hour_bars[i]);
			}

		};

		init(_chartDiv);
	}

	var init = function(_chartDiv) {
		var i, hours, hours_between_space, chart_div_w, hour_split, half_split,
		tmp_hour, tmp_scala;

		chartDiv = document.getElementById(_chartDiv);

		if (chartDiv === null) {
			throw("Chart div not found");
		}

		chart_div_w = chartDiv.offsetWidth;

		scalaDiv = document.createElement('div');
		scalaHours = document.createElement('div');

		scalaDiv.style.backgroundColor = options.chartBackground;
		scalaDiv.style.width = chart_div_w + 'px';
		scalaDiv.style.height = '30px';
		scalaDiv.style.position = 'relative';
		scalaDiv.style.overflow = 'hidden';
		scalaDiv.id = "scala_" + _chartDiv;

		scalaHours.style.backgroundColor = options.hourBackground;
		scalaHours.style.width = chart_div_w + 'px';
		scalaHours.style.height = '20px';
		scalaHours.id = "sh_" + _chartDiv;

		hours_between_space = calculateHoursBetweenSpace(chart_div_w);

		for(i = 0; i < 25; i++) {

			hours = document.createElement('span');
			hours.innerHTML = pad2(i);
			hours.style.fontSize = options.fontSize + 'px';
			hours.style.position = 'absolute';
			hours.style.top = '2px';
			hours.style.left = (((i * hours_between_space) + hours_between_space / 2) - options.fontSize / 2) +'px';

			scalaHours.appendChild(hours);

			hour_split = document.createElement('div');
			hour_split.style.width = '2px';
			hour_split.style.height = '10px';
			hour_split.style.position = 'absolute';
			hour_split.style.backgroundColor = options.hourSplitBackground;
			hour_split.style.top = '0px';
			hour_split.style.left = ((i * hours_between_space) + hours_between_space / 2) +'px';

			scalaDiv.appendChild(hour_split);
		}

		for(i = 1; i < 25; i++) {

			half_split = document.createElement('div');
			half_split.style.width = '2px';
			half_split.style.height = '5px';
			half_split.style.position = 'absolute';
			half_split.style.backgroundColor = options.halfSplitBackground;
			half_split.style.top = '0px';
			half_split.style.left = (i * hours_between_space) +'px';

			scalaDiv.appendChild(half_split);
		}

		tmp_hour = document.getElementById('sh_' + _chartDiv);
		tmp_scala = document.getElementById('scala_' + _chartDiv);

		if(!tmp_hour) {
			insertElement(chartDiv, scalaHours);
		}

		if (!tmp_scala) {
			insertElement(chartDiv, scalaDiv);
		}
	};

	var extend = function(obj, props) {
		for(var prop in props) {
			if(props.hasOwnProperty(prop)) {
				obj[prop] = props[prop];
			}
    	}
	};

	var animate = function (opts) {
		var start = new Date

		var id = setInterval(function() {
		var timePassed = new Date - start
		var progress = timePassed / opts.duration

		if (progress > 1) progress = 1

			var delta = opts.delta(progress)
			opts.step(delta)

			if (progress == 1) {
				clearInterval(id)
			}
		}, opts.delay || 10);
	};

	var move = function (element, to, delta, duration) {

		animate({
			delay: 10,
			duration: duration || 1000, // 1 sec by default
			delta: delta,
			step: function(delta) {
				element.style.width = to*delta + "px";
			}
		});
	};

	var timeToText = function (minute) {
		var _minute = parseInt(minute),
			_hour = 0,
			_diff = 0,
			_format = "";

		if (_minute < 60) {
			_format = _minute +  " " + options.minuteText;
		}
		else if (_minute >= 60 && _minute < 1440) {
			_hour = Math.floor(_minute / 60);
			_minute = _minute - (_hour * 60);
			
			_format = _hour + " " +options.hourText;

			if (_minute)
				_format += " " + _minute + " " + options.minuteText;
		}
		else {
			_day = Math.floor(_minute / 24 / 60);
			_hour = Math.floor(_minute / 60) - (_day * 24);
			_minute = _minute - (_day * 24 * 60) - (_hour * 60);
			
			_format = _day + " " + options.dayText;
			
			if (_hour)
			  _format += " " + _hour + " " + options.hourText;
			
			if (_minute)
			  _format += " " + _minute + " " + options.minuteText;
		}

		return _format;
	};

	var circ = function (progress) {
		return 1 - Math.sin(Math.acos(progress));
	};

	var quad = function (progress) {
		return Math.pow(progress, 0.5);
	};

	var pad2 = function(number) {
		return (number < 10 ? '0' : '') + number;
	};

	var insertElement = function (target, element) {
		target.appendChild(element);
	};

	var calculateHoursBetweenSpace = function (chart_w) {
		return (chart_w / 25);
	};

	var calculateMinutesBetweenSpace = function(hour_between_space) {
		return (hour_between_space / 60);
	};

	var getDateDiff = function(start_date, end_date) {
		return (start_date.getDate() - end_date.getDate());
	};

	var HoursBar = (function(){

		var item_options;

		item_options = {
			onClick: function() {},
			background: 'blue'
		};

		function HoursBar(_item_options) {

			this.hour_bar = null;

			this.hour_bar = document.createElement('div');
			this.hour_bar.style.height = '20px';
			this.hour_bar.style.opacity = '0.65';
			this.hour_bar.style.filter = 'alpha(opacity = 65)';
			this.hour_bar.style.backgroundColor = item_options.background;
			this.hour_bar.style.position = 'absolute';
		}

		HoursBar.prototype.setPosition = function(position_x) {
			this.hour_bar.style.top = '5px';
			this.hour_bar.style.left = position_x + 'px';
		};

		HoursBar.prototype.setWidth = function(_width) {
			this.hour_bar.style.width = _width + 'px';
		};

		return HoursBar;

	})();

	return HourChart;

})();
