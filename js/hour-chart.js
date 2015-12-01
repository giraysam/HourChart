var HourChart = (function() {

	var chartDiv, scalaDiv, scalaHours, options;

	options = {
		fontSize: 12,
		hourBackground: '#EDECEC',
		chartBackground: '#DAD9D9',
		hourSplitBackground: '#ffffff',
		halfSplitBackground: '#ffffff',
		delay: 1
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
			total_minutes, _width;

			start_date_minutes = end_date_minutes = 0;

			hours_between_space = calculateHoursBetweenSpace(chartDiv.offsetWidth);
			minutes_between_space = calculateMinutesBetweenSpace(hours_between_space);

			scala_width = 25 * hours_between_space;

			date_diff = getDateDiff(start_date, end_date);

			if (date_diff < 0) {
				start_date_minutes = 0; 
				end_date_minutes = 0;
			}
			else if (date_diff > 0) {
				start_date_minutes = 0;
				end_date_minutes = 24 * date_diff * 60;
			}

			start_minutes = start_date_minutes + parseInt(start_date.getHours() * 60) + parseInt(start_date.getMinutes());
			end_minutes = end_date_minutes + parseInt(end_date.getHours() * 60) + parseInt(end_date.getMinutes());

			total_minutes = end_minutes - start_minutes;

			start_x = (start_minutes * minutes_between_space) + (hours_between_space / 2);
			end_x = (end_minutes * minutes_between_space) + (hours_between_space / 2);

			bar = new HoursBar(item_options);
			bar.hour_bar.className = _chartDiv + "_hour_bar";

			if (date_diff < 0) {
				bar.setPosition(start_x);
				_width = scala_width - start_x;
				// bar.setWidth(_width);
			}
			else if (date_diff > 0) {
				bar.setPosition(start_x);
				_width = scala_width - start_x;
				// bar.setWidth(_width);
			}
			else {
				bar.setPosition(start_x);
				_width = end_x - start_x;
				// bar.setWidth(_width);
			}

			if(typeof item_options !== 'undefined' && item_options.onClick) {
				bar.hour_bar.style.cursor = 'pointer';
				bar.hour_bar.onclick = function() {
					item_options.onClick();
				};
			}

			if (typeof item_options !== 'undefined' && item_options.background) {
				bar.hour_bar.style.backgroundColor = item_options.background;
			}

			scalaDiv = document.getElementById('scala_' + _chartDiv);
			insertElement(scalaDiv, bar.hour_bar);
		
			move(bar.hour_bar, (_width - 1), quad, options.delay * 1000);
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
		scalaDiv.id = "scala_" + _chartDiv; 

		scalaHours.style.backgroundColor = options.hourBackground;
		scalaHours.style.width = chart_div_w + 'px';
		scalaHours.style.height = '30px';
		scalaHours.id = "sh_" + _chartDiv;

		hours_between_space = calculateHoursBetweenSpace(chart_div_w);

		for(i = 0; i < 25; i++) {

			hours = document.createElement('span');
			hours.innerHTML = pad2(i);
			hours.style.fontSize = options.fontSize + 'px';
			hours.style.position = 'absolute';
			hours.style.top = '5px';
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
