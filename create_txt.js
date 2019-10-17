function generatedownload () {
    document.getElementById("downloadbutton").addEventListener("click", function(){
        // Generate download of hello.txt file with some content
        var text = createText()
        var filename = "analisis.txt";
        download(filename, text);
    }, false);
}
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}
function createText () {
    var info = obtain_info()
    var ip = document.getElementById("ip").value
    ip = ip.substr(0, ip.indexOf("/"))
    info = info.replace(/<p>/g,"--> ")
    info = info.replace(/<\/p>/g,"\n")
    var output1 = "--> Dirección IP: "+ip+"\n"+info
    var output2 = "--------- SEGMENTACIÓN -----------"
    var output = output1 + output2
    /*var ipandmask = document.getElementById("ip").value
    var ip = ipandmask.substr(0,ipandmask.indexOf("/"))
    var mask = ipandmask.substr(ipandmask.indexOf("/")+1,ipandmask.length)
    console.log(mask)
    var mask = calculateMask(mask)
    var output = ip+"\n"+mask*/
    return output
}
function obtain_info () {
    var getinfo = document.getElementById("analisis").innerHTML
    return getinfo
}