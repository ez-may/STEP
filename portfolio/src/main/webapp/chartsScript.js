// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// required library loading to use the API
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

/**
 * Creates a basic chart and displays it on the page.
 **/
function drawChart() {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Task');
    data.addColumn('number', 'Hours per Day');
    data.addRows([
        ['Dont Starve Together', 146],
        ['Monster Hunter World', 156],
        ['Overcooked!2', 10],
        ['Oxygen Not Included', 234],
        ['Sid Meirers Civilization 6', 50]
    ]);       

    const options = {
        pieHole: 0.4,
        title: "My favorite Games On Steam",
    };

    const chart = new google.visualization.PieChart(
        document.getElementById("games-on-steam-chart"));
    chart.draw(data, options);
}