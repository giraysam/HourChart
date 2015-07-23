var HourChart = (function() {

	var chartDiv, scalaDiv, scalaHours, options;

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

	Object.prototype.extend = function(obj) {
       for (var i in obj) {
          if (obj.hasOwnProperty(i)) {
             this[i] = obj[i];
          }
       }
    };

	var init = function(_chartDiv) {
		var i, hours, hours_between_space, chart_div_w, hour_split, half_split;

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

		hours_between_space = (chart_div_w / 25);

		for(i = 0; i < 25; i++) {

			hours = document.createElement('span');
			hours.innerHTML = pad2(i);
			hours.style.fontSize = options.fontSize + 'px';
			hours.style.position = 'absolute';
			hours.style.top = '0px';
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

		insertElement(scalaHours);
		insertElement(scalaDiv);
	};

	var pad2 = function(number) {
		return (number < 10 ? '0' : '') + number;
	};

	var insertElement = function (element) {
		chartDiv.appendChild(element);
	};

	HourChart.prototype.insertElement = function(element) {
		insertElement(element);
	};

	return HourChart;

})();

var hour_chart = new HourChart('hour_chart_1');
