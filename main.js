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
    //obtain_variables(tipoip, mask, network, bits, broadcast, subnetted, clase, nhosts, havemask, nsubredes)
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
    printData(tipoip, mask, netaddress, bits, broadcast, subnetted, clase, nhosts, haveMask,nsubredes)
}
function checkForm() {
    var ipAndMask = obtainIpMask()
    var ip = ipAndMask[0]
    var mask = ipAndMask[1]
    var errorcount = 0, printerror = []
    console.log(ip)
    if (ip[0] < 0 || ip[0] > 255 || ip[0] == undefined) {
        printerror[0] = "El valor del primer octeto no está dentro del rango válido (0-255)."
        errorcount++
    }
    if (ip[1] < 0 || ip[1] > 255 || ip[1] == undefined) {
        printerror[1] = "El valor del segundo octeto no está dentro del rango válido (0-255)."
        errorcount++
    }
    if (ip[2] < 0 || ip[2] > 255 || ip[2] == undefined) {
        printerror[2] = "El valor del tercer octeto no está dentro del rango válido (0-255)."
        errorcount++
    }
    if (ip[3] < 0 || ip[3] > 255 || ip[3] == undefined) {
        printerror[3] = "El valor del cuarto octeto no está dentro del rango válido (0-255)."
        errorcount++
    }
    if (mask < 1 || mask > 32 || mask == undefined) {
        printerror[4] = "La máscara de subred no está dentro del rango válido (1-31)."
        errorcount++
    }
    if (errorcount == 0) main(ip, mask)
    else {
        for (i = 0; i < 5; i++) {
            var aux = printerror.join("\n")
            aux = aux.replace(/undefined/g,"\0")
        }
            alert("Se han detectado "+errorcount+" errores"+aux)
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