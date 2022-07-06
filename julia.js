var canvas = document.getElementById("Canvas");
var canvasContext = canvas.getContext("2d");
var canvas2 = document.getElementById("Canvas2");
var canvasContext2 = canvas2.getContext("2d");
var zosh = 4;
var moveX = 0;
var moveY = 0;
var moveMag = 1;

//ポインター描画
function drawax() {
    canvasContext.strokeStyle = "#FFFFFF";     //ポインターの色は白
    canvasContext.beginPath();
    canvasContext.moveTo(0, canvas.height / 2);
    canvasContext.lineTo(canvas.width, canvas.height / 2);
    canvasContext.moveTo(canvas.width / 2, 0);
    canvasContext.lineTo(canvas.width / 2, canvas.height);
    canvasContext.stroke();
}

//倍率と移動座標を指定してジュリア集合生成
function exeJulia(mag, mx, my) {
    canvasContext.clearRect(0, 0, canvas.height, canvas.weight);      //生成するたびにキャンバスの内容を削除
    canvasContext.fillStyle = "#000000";                              //黒で埋め尽くす
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);        //
    canvasContext2.clearRect(0, 0, canvas.height, canvas.weight);
    canvasContext2.fillStyle = "#000000";
    canvasContext2.fillRect(0, 0, canvas.width, canvas.height);

    var n = document.getElementById("num").value;                     //計算回数
    var mM = document.getElementById("move").value;                   //軸移動する際の移動の度合い
    var r = document.getElementById("red").value;                     //赤要素
    var g = document.getElementById("green").value;                   //緑要素
    var b = document.getElementById("blue").value;                    //青要素
    var m = document.getElementById("square").value;                  //何乗か
    var re = document.getElementById("real").value;                   //実部
    var ime = document.getElementById("im").value;                    //虚部

    zosh = zosh * mag;                                                //ズームorズームアウトしたときの度合いを更新
    moveX = moveX + (mx * mM);                                        //移動xの度合いを更新
    moveY = moveY + (my * mM);                                        //移動yの度合いを更新
    julia(zosh, canvas.height, moveX, moveY, n, r, g, b, m, re, ime);     //上記の条件でジュリア集合を生成

    if (mag == 10) {
        document.getElementById("move").value = document.getElementById("move").value * 10;     //10倍ズームすれば移動の度合いの値を10倍
    } else if (mag == 0.5) {
        document.getElementById("move").value = document.getElementById("move").value * 0.5;    //0.5倍ズームすれば移動の度合いの値を0.5倍
    } else if (mag == 2.0) {
        document.getElementById("move").value = document.getElementById("move").value * 2.0;    //2倍ズームすれば移動の度合いの値を2倍
    } else if (mag == 0.1) {
        document.getElementById("move").value = document.getElementById("move").value * 0.1;    //0.1倍ズームすれば移動の度合いの値を0.1倍
    }

    canvasContext2.drawImage(canvas, 0, 0);                           //もう一つのキャンバスにコピー
    drawax();                                                         //ポインター表示
}

//倍率リセット
function reset() {
    document.getElementById("num").value = 500;                       //計算回数を500回にリセット
    document.getElementById("move").value = 500;                      //移動の度合いを500にリセット
    document.getElementById("real").value = -0.74;                    //実部を-0.74にセット
    document.getElementById("im").value = 0.12;                       //虚部を0.12にセット
    exeJulia(4 / zosh, 0, 0);                                      //実行
}

//何乗かしたときのxの値を返す
function calcSquareX(x, y, m) {
    if (m == 1) {                                                       //1乗の時
        return x;                                                       //(a+bi)^1の実部
    } else if (m == 2) {                                                 //2乗の時
        return Math.pow(x, 2) - Math.pow(y, 2);                         //(a+bi)^2の実部
    } else if (m == 3) {                                                 //3乗の時
        return Math.pow(x, 3) - 3 * x * Math.pow(y, 2);                 //(a+bi)^3の実部
    } else if (m == 4) {                                                 //4乗の時
        return Math.pow(x, 4) - 6 * Math.pow(x, 2) * Math.pow(y, 2) + Math.pow(y, 4);   //(a+bi)^4の実部
    }
}

//何乗かしたときのyの値を返す
function calcSquareY(x, y, m) {
    if (m == 1) {                                                       //1乗の時
        return y;                                                       //(a+bi)^1の虚部
    } else if (m == 2) {                                                 //2乗の時
        return 2 * x * y;                                                   //(a+bi)^2の虚部
    } else if (m == 3) {                                                 //3乗の時
        return 3 * Math.pow(x, 2) * y - Math.pow(y, 3);                 //(a+bi)^3の虚部
    } else if (m == 4) {                                                 //4乗の時
        return 4 * Math.pow(x, 3) * y - 4 * x * Math.pow(y, 3);         //(a+bi)^4の虚部
    }
}

//ジュリア集合生成のそのものの処理
function julia(size, pix, movex, movey, n, red, green, blue, m, re, im) {
    var x;
    var y;
    var a;
    var b;
    var X;
    var Y;

    for (var i = 0; i < pix; i++) {
        a = Number(re);                 //初期値を変動させる
        for (var j = 0; j < pix; j++) {
            b = Number(im);
            x = (i * size - (-1) * movex) / pix - size / 2;
            y = (j * size - (-1) * movey) / pix - size / 2;

            for (var k = 0; k < n; k++) {                                     //計算回数分計算する
                X = calcSquareX(x, y, m) + a;                               //漸化式を解く
                Y = calcSquareY(x, y, m) + b;
                x = X;
                y = Y;
                if (Math.pow(X, 2) + Math.pow(Y, 2) > 4.0) {       //発散していれば色付け
                    canvasContext.fillStyle = "rgb(" + k * red % 256 + "," + k * green % 256 + "," + k * blue % 256 + ")";    //計算回数によって色分け
                    canvasContext.fillRect(i, j, 1, 1);
                    break;
                }
            }
        }
    }
}

//画像保存処理
function saveImage() {
    var name = window.prompt("ファイル名を入力してください", "juliaImage.png");
    if (name != null) {
        if (canvas2.msToBlob) {
            var blob = canvas2.msToBlob();
            window.navigator.msSaveBlob(blob.name);
        } else {
            var a = document.createElement("a");
            a.href = canvas2.toDataURL("image/png");
            a.download = name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }
}