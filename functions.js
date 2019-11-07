function obtainIpMask () {
    var ip = document.getElementById("ip").value
    var aux = ip.substr(0, ip.indexOf("/"))
    var mask = ip.substr(ip.indexOf("/")+1, ip.length)
    var arr = aux.split(".")
    return [arr, mask]  
}
function IpClass (oct1) {
    var clase = ""
    if (oct1 >= 0 && oct1 <= 127) {
        clase = "A"
    } else if (oct1 >= 128 && oct1 <= 191) {
            clase = "B"
        } else if (oct1 >= 192 && oct1 <= 223) {
                clase = "C"
            } else if (oct1 >= 224 && oct1 <= 239) {
                    clase = "D"
                } else if (oct1 >= 240 && oct1 <= 253) {
                        clase = "E"
                    }
    return clase
}
function calculateMask (mask) {
    var aux = ""
    for (i = 0; i < mask; i++) aux += "1"
    for (i = mask; i < 32; i++) aux += "0"
    mask = aux.match(/.{1,8}/g)
    return mask
}
function isSubnetted (mask, clase) {
    var subnetted = true
    if (mask == 8 && clase =="A") subnetted = false
        else if (mask == 16 && clase == "B") subnetted = false
            else if (mask == 24 && clase == "C") subnetted = false
    return subnetted
}
function netAddress (ip, mask) {
    var netAddress = []
    mask = [bin2dec(mask[0]),bin2dec(mask[1]),bin2dec(mask[2]),bin2dec(mask[3])]
    netAddress[0] = ip[0] & mask[0]
    netAddress[1] = ip[1] & mask[1]
    netAddress[2] = ip[2] & mask[2]
    netAddress[3] = ip[3] & mask[3]
    return netAddress
}
//Convertir un número de binario a decimal: parseInt(num, baseFrom).toString(baseTo)
function bin2dec(num) {
    return parseInt(num, 2).toString(10);
}
function dec2bin(num) {
    return parseInt(num, 10).toString(2).padStart(8,"0");
}
//function dec2bin(oct){
  //  return (oct >>> 0).toString(2).padStart(8,'0')
    //padStart(8,'0') fuerza que el resultado contenga 8 dígitos, poniendo ceross donde no existan.

/*La siguiente función calcula el número de bits para red, subred y host según la máscara
de subred*/
function numberOfBits (mask, subnetted, clase) {
    var totalnetbits = 0, hostbits = 0, subnetbits = 0, netbits = 0
    var mask = mask.join('').toString()
    for (i = 0; i < mask.length; i++) { //Con la máscara de subred y la de red por defecto en
        if (mask.charAt(i) == "1") {    //formato binario, los bits a '1' son de red (red+subred)
            totalnetbits += 1                       //y los bits a '0' son de host.
        } else hostbits += 1
    }
    if (subnetted) {
        switch (clase) {
            case "A":
                subnetbits = calculateSubnetBits(8, mask)
                break
            case "B":
                subnetbits = calculateSubnetBits(16, mask)
                break
            case "C":
                subnetbits = calculateSubnetBits(24, mask)
                break
        }
    }
    netbits = totalnetbits - subnetbits
    console.log('net bits: '+netbits)
    console.log('subnet bits: '+subnetbits)
    console.log('host bits: '+hostbits)
    return [totalnetbits, netbits, subnetbits, hostbits]
}
function calculateSubnetBits (bits, mask) {
    var subnet = 0
    for (i = bits; i < 32; i++ )
       if (mask.charAt(i) == "1")  subnet += 1
    return subnet
}
function broadcastAddress (net, mask, totalbits) {
    var aux, broadcast, broadcast1 = "", broadcast2 = ""
    net = [
        dec2bin(net[0]),
        dec2bin(net[1]),
        dec2bin(net[2]),
        dec2bin(net[3])
    ].join('').toString()
    broadcast1 = net.substr(0,totalbits)
    mask = mask.join('').toString()
    for (i = totalbits; i < 32; i++) {
        if (mask.charAt(i) == "1") broadcast2 += "0"
        else broadcast2 += "1"
    }
    aux = (broadcast1 + broadcast2).match(/.{1,8}/g)
    console.log('aux: '+aux)
    broadcast = [
        bin2dec(aux[0]),
        bin2dec(aux[1]),
        bin2dec(aux[2]),
        bin2dec(aux[3])
    ]
    return broadcast   
}
function isPrivate (ip) {
    var private = false
    if (ip[0] == 10) private = true
    else if (ip[0] == 172 && (ip[1] <= 16 && ip[1] <= 31)) private = true
    else if (ip[0] == 192 && ip[1] == 168) private = true
    return private
}