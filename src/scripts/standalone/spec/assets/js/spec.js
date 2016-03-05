var colors = [];
var fonts = [];

$.getJSON("json/data.json", function (data) {

    $.each(data, function (key, val) {

        console.log(key)

        if (key.toString() == "colors") {
            $.each(val, function (key2, val2) {
                colors.push(val2)
            });

        } else if (key.toString() == "fonts") {
            $.each(val, function (key2, val2) {
                fonts.push(val2)
            });
        }

    });

    console.log(fonts);



    $.each(colors, function (key, val) {

        //console.log('<li> <span style="background-color: #' + val['hexcode'] + '"></span><p>' + val['name'] + '</p></li>');

        $("#colors").append('<li> <span style="background: linear-gradient(rgba(' + val['r'] + ', ' + val['g'] + ', ' + val['b'] + ', ' + val['a'] + '), rgba(' + val['r'] + ', ' + val['g'] + ', ' + val['b'] + ', ' + val['a'] + ')), url(../img/opacitypattern.png)"></span><div class="colordescription"><div class="colorname">' + val['name'] + '</div><div>HEX ' + val['hexcode'].toLocaleUpperCase() + '</div><div>Opacity ' + val['a'] * 100 + '% </div><div>RGBa (' + val['r'] + ', ' + val['g'] + ', ' + val['b'] + ', ' + val['a'] + ')</div></div></li>');

        $("#color_variables").append('<li> $color-' + val['name'].replace(/[^a-zA-Z0-9 ]/g, "").replace(/ /g, "_").toLocaleLowerCase() + ': rgba(' + val['r'] + ', ' + val['g'] + ', ' + val['b'] + ', ' + val['a'] + ')</li>');

        //$("#colors").append('<li> <span style="background-color: hsla(' + val['h'] + ','+ val['s'] + '%,'+ val['b'] + '%,'+ val['a']  + ')"></span><div class="colordescription"><div class="colorname">' + val['name'] + '</div><div>HSLa ' + val['hexcode'] + '</div></div></li>');

        //<span style="background: linear-gradient(rgba(255, 0, 0), rgba(255, 0, 0)), url(../img/opacitypattern.png), opacity: val['a']"></span>

        //$("#colors").append('<li> <span style="background-color: #' + val['hexcode'] + '"></span><div class="colordescription"><div class="colorname">' + val['name'] + '</div><div>#' + val['hexcode'] + '</div></div></li>');

    });


    $.each(fonts, function (key, val) {

        //  console.log("LOG: " + val['colors'] + getRelatedColor(colors, 1));

        input = "";

        if (val['colors'] != null) {

            $.each(val['colors'], function (key2, val2) {

                relCol = getRelatedColor(colors, val2);
                relColName = getRelatedColorName(colors, val2);

                input += '<span class="circle" style="background-color: ' + relCol + '" data-toggle="tooltip" data-placement="bottom" title="' + relColName.toLocaleString().replace(/[^a-zA-Z0-9 ]/g, "").replace(/ /g, "_").toLocaleLowerCase() + '"></span>';
            });


        }



        console.log(input);

        $("tbody").append('<tr><td style="font-family:' + val['fontname'] + '; font-size: ' + val['size'] + 'px; font-weight:' + getFontWeight(val['style']) + '">' + val['fontname'] + ' ' + val['style'] + ' ' + val['size'] + ' px</td><td>' + val['name'] + '</td><td>' + input + '</td></tr>');

        //$("tbody").append('<tr><td style="font-family:' + val['fontname'] + '; font-size: ' + val['size'] + 'px; font-weight:' + getFontWeight(val['style']) + '">' + val['fontname'] + ' ' + val['style'] + ' ' + val['size'] + ' px</td><td><div class="input-group input-group-lg"><p class="show">' + val['name'] + '</p><input class="hidden" type="text" class="form-control" name="' + val['id'] + '" value="' + val['name'] + '" aria-describedby="basic-addon1"></div></td><td>' + input + '</td></tr>');




    });

    $('[data-toggle="tooltip"]').tooltip();

});


function getRelatedColor(colors, colorId) {

    var color;

    $.each(colors, function (key, val) {



        //  if (key.toString() == "id")
        if (val['id'] == colorId) {
            color = "rgba(" + val['r'] + ', ' + val['g'] + ', ' + val['b'] + ', ' + val['a'] + ")"; //val['hexcode'];
            console.log("FOUND: " + val['id'] + " " + val['hexcode']);
        }

    });

    return color;
}

function getRelatedColorName(colors, colorId) {

    var color;

    $.each(colors, function (key, val) {



        //  if (key.toString() == "id")
        if (val['id'] == colorId) {
            color = val['name'];
        }

    });

    return color;
}

function getFontWeight(weight) {

    if (weight.toLocaleLowerCase() == "normal")
        return 400;
    else if (weight.toLocaleLowerCase() == "bold")
        return 600;
    else if (weight.toLocaleLowerCase() == "medium")
        return 500;
    else if (weight.toLocaleLowerCase() == "light")
        return 300;
    else return 100;
}

function showInputFileds() {
    //console.log(val);
    $.each($(".tablewrapper input"), function (key, val) {
        $(val).addClass("show");
        $(val).removeClass("hidden");
        //console.log(val);
    })

    $.each($(".tablewrapper p"), function (key, val) {
        $(val).removeClass("show");
        $(val).addClass("hidden");
        //console.log(val);
    })
};

function saveInputFileds() {
    //console.log(val);
    $.each($(".tablewrapper input"), function (key, val) {
        $(val).addClass("hidden");
        $(val).removeClass("show");
        console.log($(val).attr("name"))
            //console.log(val);
    })

    $.each($(".tablewrapper p"), function (key, val) {
        $(val).removeClass("hidden");
        $(val).addClass("show");
        //console.log(val);
    })

    updateJson();
};

function updateJson() {
    var data = {
        a: 1
        , b: 2
        , c: 3
    };
    var json = JSON.stringify(data);
    var blob = new Blob([json], {
        type: "application/json"
    });
    var url = URL.createObjectURL(blob);

    var a = document.createElement('a');
    a.download = "backup.json";
    a.href = url;
    a.textContent = "Download backup.json";
}

$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})