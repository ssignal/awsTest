// xml api (http://zenith.accu-weather.com/widget/zenith/weather-data.asp?slat=42.04&slon=-87.83&metric=0) to json (accuweather.json)
// node tools/test/parseWeather
/*
return accuweather.json fromat
{
  "lastUpdateTime": 1605074464505,
  "conditionIndex": 38,
  "conditionText": "Mostly Cloudy",
  "temperature": "46F",
  "wind": "WSW 9mph",
  "humidity": "73%",
  "uvIndex": 0,
  "sunrise": "6:41 AM",
  "sunset": "4:30 PM",
  "predictions": [{
      "day": "Wednesday",
      "conditionIndex": 1,
      "highTemp": "48F",
      "lowTemp": "33F"
    },
    {
      "day": "Thursday",
      "conditionIndex": 2,
      "highTemp": "55F",
      "lowTemp": "31F"
    },
    {
      "day": "Friday",
      "conditionIndex": 2,
      "highTemp": "42F",
      "lowTemp": "29F"
    },
    {
      "day": "Saturday",
      "conditionIndex": 18,
      "highTemp": "46F",
      "lowTemp": "44F"
    }
  ]
}
*/

require('../../src/global');
const parseWeather = require('libs/weather/weatherParser');
const Promise = require('bluebird');

console.log('parseWeather start!');

const xml = `
<?xml version="1.0"  encoding="iso-8859-1"?>
<adc_database xmlns="http://www.accuweather.com">
    <units>
        <temp>F</temp>
        <dist>MI</dist>
        <speed>MPH</speed>
        <pres>IN</pres>
        <prec>IN</prec>
    </units>
    <local>
        <city>Chicago</city>
        <state>IL</state>
        <lat>42.03</lat>
        <lon>-87.81</lon>
        <time>01:43</time>
        <timeZone>-6</timeZone>
        <obsDaylight>1</obsDaylight>
        <isDaylight>False</isDaylight>
    </local>
    <watchwarnareas zone="ILZ014" county="ILC031" isactive="0">
        <url>http://www.accuweather.com/watches-warnings.asp?partner=zenith&amp;zipcode=60701&amp;county=ILC031&amp;zone=ILZ014</url>
    </watchwarnareas>
    <currentconditions>
        <url>http://www.accuweather.com/index-forecast.asp?partner=zenith&amp;zipcode=60701</url>
        <observationtime>1:43 AM</observationtime>
        <pressure state="Rising">29.84</pressure>
        <temperature>42</temperature>
        <realfeel>37</realfeel>
        <humidity>71%</humidity>
        <weathertext>Mostly Cloudy</weathertext>
        <weathericon>38</weathericon>
        <windgusts>19</windgusts>
        <windspeed>8</windspeed>
        <winddirection>WSW</winddirection>
        <visibility>10</visibility>
        <precip>0.00</precip>
        <uvindex index="0">Low</uvindex>
        <dewpoint>33</dewpoint>
        <cloudcover>76%</cloudcover>
        <apparenttemp>45</apparenttemp>
        <windchill>37</windchill>
    </currentconditions>
    <images>
        <url>http://www.accuweather.com/radar-state.asp?partner=zenith&amp;zipcode=60701&amp;level=state&amp;type=re&amp;site=il_&amp;anim=0</url>
        <radar>
            <imgurl>http://sirocco.accuweather.com/nx_mosaic_108x81c/re/inmreil_.gif</imgurl>
            <imgurl>http://sirocco.accuweather.com/nx_mosaic_160x120d/re/inmreil_.gif</imgurl>
            <imgurl>http://sirocco.accuweather.com/nx_mosaic_234x175c/re/inmreil_.gif</imgurl>
            <imgurl>http://sirocco.accuweather.com/nx_mosaic_320x240_public/re/inmreil_.gif</imgurl>
            <imgurl>http://sirocco.accuweather.com/adc_nxmos_400x300c/re/inmreil_.gif</imgurl>
        </radar>
    </images>
    <forecast>
        <url>http://www.accuweather.com/forecast.asp?partner=zenith&amp;zipcode=60701</url>
        <day number="1">
            <url>http://www.accuweather.com/forecast-details.asp?partner=zenith&amp;zipcode=60701&amp;fday=2</url>
            <obsdate>11/11/2020</obsdate>
            <daycode>Wednesday</daycode>
            <sunrise>6:39 AM</sunrise>
            <sunset>4:31 PM</sunset>
            <daytime>
                <txtshort>Sunny and cooler</txtshort>
                <txtlong>Cooler with plenty of sunshine</txtlong>
                <weathericon>01</weathericon>
                <hightemperature>48</hightemperature>
                <lowtemperature>33</lowtemperature>
                <realfeelhigh>49</realfeelhigh>
                <realfeellow>28</realfeellow>
                <windspeed>6</windspeed>
                <winddirection>W</winddirection>
                <windgust>12</windgust>
                <maxuv>3</maxuv>
                <rainamount>0.00</rainamount>
                <snowamount>0.0</snowamount>
                <iceamount>0.00</iceamount>
                <precipamount>0.00</precipamount>
                <tstormprob>0</tstormprob>
            </daytime>
            <nighttime>
                <txtshort>Mainly clear</txtshort>
                <txtlong>Mainly clear</txtlong>
                <weathericon>34</weathericon>
                <hightemperature>48</hightemperature>
                <lowtemperature>33</lowtemperature>
                <realfeelhigh>41</realfeelhigh>
                <realfeellow>33</realfeellow>
                <windspeed>4</windspeed>
                <winddirection>SW</winddirection>
                <windgust>5</windgust>
                <maxuv>3</maxuv>
                <rainamount>0.00</rainamount>
                <snowamount>0.0</snowamount>
                <iceamount>0.00</iceamount>
                <precipamount>0.00</precipamount>
                <tstormprob>0</tstormprob>
            </nighttime>
        </day>
        <day number="2">
            <url>http://www.accuweather.com/forecast-details.asp?partner=zenith&amp;zipcode=60701&amp;fday=3</url>
            <obsdate>11/12/2020</obsdate>
            <daycode>Thursday</daycode>
            <sunrise>6:41 AM</sunrise>
            <sunset>4:30 PM</sunset>
            <daytime>
                <txtshort>Mostly sunny</txtshort>
                <txtlong>Mostly sunny</txtlong>
                <weathericon>02</weathericon>
                <hightemperature>55</hightemperature>
                <lowtemperature>31</lowtemperature>
                <realfeelhigh>55</realfeelhigh>
                <realfeellow>34</realfeellow>
                <windspeed>5</windspeed>
                <winddirection>SSW</winddirection>
                <windgust>8</windgust>
                <maxuv>2</maxuv>
                <rainamount>0.00</rainamount>
                <snowamount>0.0</snowamount>
                <iceamount>0.00</iceamount>
                <precipamount>0.00</precipamount>
                <tstormprob>1</tstormprob>
            </daytime>
            <nighttime>
                <txtshort>Partly cloudy</txtshort>
                <txtlong>Partly cloudy</txtlong>
                <weathericon>35</weathericon>
                <hightemperature>55</hightemperature>
                <lowtemperature>31</lowtemperature>
                <realfeelhigh>45</realfeelhigh>
                <realfeellow>26</realfeellow>
                <windspeed>7</windspeed>
                <winddirection>WSW</winddirection>
                <windgust>11</windgust>
                <maxuv>2</maxuv>
                <rainamount>0.00</rainamount>
                <snowamount>0.0</snowamount>
                <iceamount>0.00</iceamount>
                <precipamount>0.00</precipamount>
                <tstormprob>0</tstormprob>
            </nighttime>
        </day>
        <day number="3">
            <url>http://www.accuweather.com/forecast-details.asp?partner=zenith&amp;zipcode=60701&amp;fday=4</url>
            <obsdate>11/13/2020</obsdate>
            <daycode>Friday</daycode>
            <sunrise>6:42 AM</sunrise>
            <sunset>4:29 PM</sunset>
            <daytime>
                <txtshort>Mostly sunny and cooler</txtshort>
                <txtlong>Mostly sunny and cooler</txtlong>
                <weathericon>02</weathericon>
                <hightemperature>42</hightemperature>
                <lowtemperature>29</lowtemperature>
                <realfeelhigh>39</realfeelhigh>
                <realfeellow>23</realfeellow>
                <windspeed>7</windspeed>
                <winddirection>NW</winddirection>
                <windgust>11</windgust>
                <maxuv>2</maxuv>
                <rainamount>0.00</rainamount>
                <snowamount>0.0</snowamount>
                <iceamount>0.00</iceamount>
                <precipamount>0.00</precipamount>
                <tstormprob>0</tstormprob>
            </daytime>
            <nighttime>
                <txtshort>Cold with increasing clouds</txtshort>
                <txtlong>Cold with increasing clouds</txtlong>
                <weathericon>38</weathericon>
                <hightemperature>42</hightemperature>
                <lowtemperature>29</lowtemperature>
                <realfeelhigh>34</realfeelhigh>
                <realfeellow>28</realfeellow>
                <windspeed>4</windspeed>
                <winddirection>ENE</winddirection>
                <windgust>9</windgust>
                <maxuv>2</maxuv>
                <rainamount>0.00</rainamount>
                <snowamount>0.0</snowamount>
                <iceamount>0.00</iceamount>
                <precipamount>0.00</precipamount>
                <tstormprob>0</tstormprob>
            </nighttime>
        </day>
        <day number="4">
            <url>http://www.accuweather.com/forecast-details.asp?partner=zenith&amp;zipcode=60701&amp;fday=5</url>
            <obsdate>11/14/2020</obsdate>
            <daycode>Saturday</daycode>
            <sunrise>6:43 AM</sunrise>
            <sunset>4:28 PM</sunset>
            <daytime>
                <txtshort>Rain; breezy in the afternoon</txtshort>
                <txtlong>Occasional rain; breezy in the afternoon</txtlong>
                <weathericon>18</weathericon>
                <hightemperature>46</hightemperature>
                <lowtemperature>44</lowtemperature>
                <realfeelhigh>34</realfeelhigh>
                <realfeellow>22</realfeellow>
                <windspeed>11</windspeed>
                <winddirection>ESE</winddirection>
                <windgust>20</windgust>
                <maxuv>1</maxuv>
                <rainamount>0.33</rainamount>
                <snowamount>0.0</snowamount>
                <iceamount>0.00</iceamount>
                <precipamount>0.33</precipamount>
                <tstormprob>2</tstormprob>
            </daytime>
            <nighttime>
                <txtshort>Cloudy with showers around</txtshort>
                <txtlong>Considerable cloudiness with a couple of showers</txtlong>
                <weathericon>12</weathericon>
                <hightemperature>46</hightemperature>
                <lowtemperature>44</lowtemperature>
                <realfeelhigh>44</realfeelhigh>
                <realfeellow>35</realfeellow>
                <windspeed>7</windspeed>
                <winddirection>SSW</winddirection>
                <windgust>13</windgust>
                <maxuv>1</maxuv>
                <rainamount>0.17</rainamount>
                <snowamount>0.0</snowamount>
                <iceamount>0.00</iceamount>
                <precipamount>0.17</precipamount>
                <tstormprob>20</tstormprob>
            </nighttime>
        </day>
    </forecast>
    <copyright>Copyright 2020 AccuWeather.com</copyright>
    <use>This document is intended only for use by authorized licensees of AccuWeather.com. Unauthorized use is prohibited. All Rights Reserved.</use>
    <product>zenith (an lg company)</product>
    <redistribution>Redistribution Prohibited.</redistribution>
</adc_database>
`;

Promise.resolve().then(async() => {
    const ret = await parseWeather.parse(xml);
    console.log(JSON.stringify(ret));
    console.log('parseWeather finish!');
}).catch(err => {
    console.error(`Error : ${err.message}`);
});
