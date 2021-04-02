var header = "ABAKsf"
var s1 = header.replace(/\\n/ig, " ");
        var s2 = s1.replace(/ 2y2c  2y2c §bđã full /ig, "");
        var s3 = s2.replace(/§b|§l|§6/ig, "");
        var s4 = s3.replace(/{"text":"/ig, "");
        var s5 = s4.replace(/"}/ig, "");
        var s6 = s5.replace("thời", " - Thời");
        var s7 = s6.replace("vị", "Vị");
        console.log(s7)