function createP(text) {
    var p = document.createElement("p");
    p.appendChild(document.createTextNode(text))
    return p;
}
function printData (tipoip, mask, network, bits, broadcast, subnetted, clase, nhosts, havemask, nsubredes) {
    var analisis = document.getElementById("analisis")
    var analisis2 = document.getElementById("analisis2")
    if (bits == undefined) bits = 0
    analisis.innerHTML = ""
    if (clase == "D" || clase == "E") {
        p = [
            createP ("Clase: "+clase),
            createP ("Tipo de dirección: "+tipoip),
            createP (mask)
        ]
    } else {
        if (havemask) {
            p = [
                createP ("Clase: "+clase),
                createP ("Segmentación: "+subnetted),
                createP ("Tipo de dirección: "+tipoip),
                createP ("Máscara de subred: "+mask),
                createP ("Dirección de subred: "+network),
                createP ("Dirección de broadcast: "+broadcast),
                createP ("Máx. de subredes posibles: "+nsubredes),
                createP ("Máx. de hosts por subred: "+nhosts),
                createP ("Se disponen de "+bits[1]+" bits de red, "+bits[2]+" bits para la segmentación y de "+bits[3]+" para direcciones de host"), 
            ]
        } else {
            p = [
                createP ("Clase: "+clase),
                createP (mask)
            ]
        }
    }
    var docFrag = document.createDocumentFragment();
    for(var i = 0; i < p.length; i++) {
      docFrag.appendChild(p[i]);
    }
    analisis.appendChild(docFrag)
    analisis.removeAttribute("hidden")
    analisis2.removeAttribute("hidden")
}
function resetForm () {
    document.getElementById("analisis").setAttribute("hidden","")
    document.getElementById("ip").value = ""
    document.getElementById("ip").removeAttribute("style")
}
function main (ip, mask) {
    
    var clase = IpClass(parseInt(ip[0]))
    var tipoip, nhosts, haveMask, nsubredes
    if (clase == "D" || clase == "E"){
        tipoip = "Reservada"
        mask = "ERROR: no se puede aplicar la máscara /"+mask+". No se puedea aplicar una mácara de subred a un bloque de direcciones reservadas."
    } else {
        if (
            (clase == "A" && mask < 8) || 
            (clase == "B" && mask < 16) ||
            (clase == "C" && mask < 24)
        ) {
            haveMask = false
            mask = "ERROR: la máscara de subred es inferior al número de bits de red. No se puede calcular."
        } else {
            haveMask = true
            var subnetted = isSubnetted(mask, clase)
            if (clase != "D" || clase != "E") {
                mask = calculateMask(mask)
                var netaddress = netAddress (ip, mask)
                var bits = numberOfBits (mask, subnetted, clase)
                var broadcast = broadcastAddress (netaddress, mask, bits[0])
                if (isPrivate(ip)) tipoip = "Privada"
                    else tipoip = "Pública"
                mask = [
                    bin2dec(mask[0]),
                    bin2dec(mask[1]),
                    bin2dec(mask[2]),
                    bin2dec(mask[3])
                ].join(".")
                netaddress = netaddress.join(".")
                broadcast = broadcast.join(".")
                if (subnetted) subnetted = "sí"
                else subnetted = "no"
                nhosts = Math.pow(2, bits[3]) - 2
                nsubredes = Math.pow(2, bits[2])
            } else mask = "No se puede calcular"
        }
    }
    printData(tipoip, mask, netaddress, bits, broadcast, subnetted, clase, nhosts, haveMask, nsubredes)
}
function checkForm() {
    var ipAndMask = obtainIpMask()
    var ip = ipAndMask[0]
    var mask = ipAndMask[1]

    try {
        for (var i = 0; i < ip.length; i++) {
            if (ip[i] == undefined || isNaN(ip[i]) || ip[i] == "") throw "Formato de dirección IP no válido."
            if (ip[i] < 0 || ip[i] > 255) throw "El valor de cada octeto debe estar en el rango 0-255."
        }
        if (mask == undefined || mask == "") throw "Formato de máscara de red no válido."
        if (mask < 0 || mask > 31) throw "El valor de la mácara de red debe estar en el rango 0-255."
        main(ip, mask)
    } catch(err) {
        alert(err)
    }
}
function checkInput() {
    var campo = document.getElementById("ip")
    var boton = document.getElementById("boton")
    var campo_value = campo.value
    for (i = 0; i < campo.length; i++) {
        if (campo_value.charAt(i) != /\d\.\//) {
            campo.setProperty("border", "1px solid red")
            boton.setAttribute("disabled","")
            console.log(error)
        }
    }
}