/**
 * Created by Administrator on 2017/5/11.
 */
(function () {
    var ver = "1.0.1";
    try {
        ver = opener.QC.getVersion();
    } catch (e) {
    }
    ver = ver ? "-" + ver : ver;
    var qc_script;
    var reg = /qc_loader\.js/i;
    var scripts = document.getElementsByTagName("script");
    for (var i = 0, script, l = scripts.length; i < l; i++) {
        script = scripts[i];
        var src = script.src || "";
        var mat = src.match(reg);
        if (mat) {
            qc_script = script;
            break;
        }
    }
    var s_src = 'https://qzonestyle.gtimg.cn/qzone/openapi/qc' + ver + '.js';
    var arr = ['src=' + s_src + ''];
    for (var i = 0, att; i < qc_script.attributes.length; i++) {
        att = qc_script.attributes[i];
        if (att.name != "src" && att.specified) {
            arr.push([att.name.toLowerCase(), '"' + att.value + '"'].join("="));
        }
    }
    if (document.readyState != 'complete') {
        document.write('<script ' + arr.join(" ") + ' ><' + '/script>');
    } else {
        var s = document.createElement("script"), attr;
        s.type = "text/javascript";
        s.src = s_src;
        for (var i = arr.length; i--;) {
            attr = arr[i].split("=");
            if (attr[0] == "data-appid" || attr[0] == "data-redirecturi" || attr[0] == "data-callback") {
                s.setAttribute(attr[0], attr[1].replace(/\"/g, ""));
            }
        }
        var h = document.getElementsByTagName("head");
        if (h && h[0]) {
            h[0].appendChild(s);
        }
    }
})();
/*  |xGv00|c41a0054e10e6c99d6396d40e369e1a0 */