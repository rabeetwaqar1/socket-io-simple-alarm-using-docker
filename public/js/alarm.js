
const socket = io();

let htmlContent = '';
let counter = 1;
socket.on('connect', (data) => {
    console.log('Connected');
});
socket.on('disconnect', (data) => {
    console.log('Disconnected');
});


socket.on('alarm', (data) => {
    let content = appendHTML(data);
    document.getElementById('alarms').innerHTML += content;
});

function clearDiv(){
    document.getElementById('alarms').innerHTML = '';
}

function clearDivIndex(i){
    document.getElementById('counter_'+i).innerHTML = '';
}

function appendHTML(data) {

    let htmlContent = '';
    htmlContent = '<div id="counter_'+counter+'">';
    htmlContent += '<b>#' + counter +'</b><b onclick="clearDivIndex('+counter+')" style="cursor: pointer; float:right;">X</b>';
    if (data.priority && data.priority === 1) {
        htmlContent += '<li class="list-group-item list-group-item-danger">Datasource <span style="float:right">' + data.datasource.name + '</span></li>';        
        htmlContent += '<li class="list-group-item list-group-item-danger">Priority <span style="float:right">' + data.priority + '</span></li>';
    } else {
        htmlContent += '<li class="list-group-item ">Datasource <span style="float:right">' + data.datasource.name + '</span></li>';
        htmlContent += '<li class="list-group-item">Priority <span style="float:right">' + data.priority + '</span></li>';
    }
    htmlContent += '<li class="list-group-item">Company <span style="float:right">' + data.companyId + '</span></li>';
    htmlContent += '<li class="list-group-item">Station <span style="float:right">' + data.stationId + '</span></li>';
    htmlContent += '<li class="list-group-item">Camera <span style="float:right">' + data.cameraId + '</span></li>';
    htmlContent += '<li class="list-group-item">Message <span style="float:right">' + data.message + '</span></li>';
  
    htmlContent += '</ul>'
    htmlContent += '</div>';
    htmlContent += '</div>';

    counter = counter + 1;

    return htmlContent;

}