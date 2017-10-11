/**
 * Created by Administrator on 2017/3/23.
 */
var easing = Deck.easing
var prefix = Deck.prefix

var transform = prefix('transform')
var transition = prefix('transition')
var transitionDelay = prefix('transitionDelay')
var boxShadow = prefix('boxShadow')

var translate = Deck.translate

var $container = document.getElementById('containerfanpai')
// var $topbar = document.getElementById('topbar')

// var $sort = document.createElement('button')
// var $shuffle = document.createElement('button')
// var $bysuit = document.createElement('button')
// var $fan = document.createElement('button')
// var $poker = document.createElement('button')

// $shuffle.textContent = '洗牌'
// $sort.textContent = 'Sort'
// $bysuit.textContent = 'By suit'
// $fan.textContent = 'Fan'
// $poker.textContent = '洗牌发牌'


// $topbar.appendChild($shuffle)
// $topbar.appendChild($sort)
// $topbar.appendChild($bysuit)
// $topbar.appendChild($fan)
// $topbar.appendChild($poker)

//隐藏掉暂时不用的
$("#topbar button:eq(1), #topbar button:eq(2),#topbar button:eq(3)").hide();
// var surplustimes = "<p id='surplus-times' style='width:50% ;float:right;color:#fff;'>剩余抽奖次数：3</p>";

//window.alert("ok");
// $("#topbar").append(surplustimes);


var deck = Deck()
// easter eggs start

var acesClicked = []
var kingsClicked = []

deck.cards.forEach(function (card, i) {
    // card.enableMoving()

    // card.$el.addEventListener('mousedown', onTouch)
    // card.$el.addEventListener('touchstart', onTouch)

    function onTouch() {
        var card

        if (i % 13 === 0) {
            acesClicked[i] = true
            if (acesClicked.filter(function (ace) {
                    return ace
                }).length === 4) {
                document.body.removeChild($topbar)
                deck.$el.style.display = 'none'
                setTimeout(function () {
                    startWinning()
                }, 250)
            }
        } else if (i % 13 === 12) {
            if (!kingsClicked) {
                return
            }
            kingsClicked[i] = true
            if (kingsClicked.filter(function (king) {
                    return king
                }).length === 4) {
                for (var j = 0; j < 3; j++) {
                    card = Deck.Card(52 + j)
                    card.mount(deck.$el)
                    card.$el.style[transform] = 'scale(0)'
                    card.enableMoving()
                    deck.cards.push(card)
                }
                deck.sort(true)
                kingsClicked = false
            }
        } else {
            acesClicked = []
            if (kingsClicked) {
                kingsClicked = []
            }
        }
    }
})

function startWinning() {
    var $winningDeck = document.createElement('div')
    $winningDeck.classList.add('deck')

    $winningDeck.style[transform] = translate(Math.random() * window.innerWidth - window.innerWidth / 2 + 'px', Math.random() * window.innerHeight - window.innerHeight / 2 + 'px')

    $container.appendChild($winningDeck)

    for (var i = 0; i < 52; i++) {
        addWinningCard($winningDeck, i)
    }

    setTimeout(startWinning, 500)
}

function addWinningCard($deck, i) {
    var card = Deck.Card(i)
    var delay = (52 - i) * 20

    var $xMovement = document.createElement('div')
    $xMovement.style.position = 'absolute'
    $xMovement.style[transform] = translate(0, 0)

    card.$el.style[boxShadow] = 'none'

    card.mount($xMovement)
    $deck.appendChild($xMovement)

    card.$el.style[transform] = translate(0, 0)

    setTimeout(function () {
        $xMovement.style[transition] = 'all 1s linear'
        $xMovement.style[transitionDelay] = delay / 1000 + 's'

        card.$el.style[transition] = 'all 1s ' + easing('cubicInOut')
        card.$el.style[transitionDelay] = delay / 1000 + 's'

        $xMovement.style[transform] = translate('-500px', 0)
        card.$el.style[transform] = translate(0, '500px')
    }, 0)
    setTimeout(function () {
        card.unmount()
    }, 1000 + delay)
}


// easter eggs end

//
// $shuffle.addEventListener('click', function () {
//     deck.shuffle()
//     deck.shuffle()
// })
// $sort.addEventListener('click', function () {
//     deck.sort()
// })
// $bysuit.addEventListener('click', function () {
//     deck.sort(true) // sort reversed
//     deck.bysuit()
// })
// $fan.addEventListener('click', function () {
//     deck.fan()
// })
// $poker.addEventListener('click', function () {
//     deck.shuffle();
//     deck.shuffle();
//     deck.shuffle();
//     deck.poker();
//     setTimeout(function () {
//         keepfanpai();
//     }, 4000);
// })

deck.mount($container)
deck.intro()
// deck.sort()

// for (var i = 0; i < 9; i++) {
//     doset1(i);
//     $('.spades').addClass('fanpai2');//
// }
//
// function doset1(i) {
//     if ($('.spades').eq(i).hasClass('fanpaisign')) {
//     } else {
//
//         $('.spades').eq(i).addClass('fanpai');
//         $('.spades').eq(i).removeClass('fanpai').addClass('fanpai1');
//         $('.spades').eq(i).find('.face').css('background-image', 'url(../../static/imgs_static/fanpai/jiang/ps4.png)');
//
//         setTimeout(function () {
//             // $('.spades').eq(i).find('.face').addClass('changeimg');
//         }, 200 * i)
//     }
// }


// secret message..


var randomDelay = 10000 + 60000 * Math.random();
$(function () {
    var frmwidth = $(".frm").width();
    $('html').css('fontSize', frmwidth / 20 + "px");
    deck.shuffle();
    deck.shuffle();
    deck.shuffle();
    deck.poker();

    // $('.spades').click(function () {
    //     // 获取该张的索引
    //     var index = $(this).index();
    //     var th = $(this);
    //     if ($(this).hasClass('fanpai')) {
    //         alert("该张牌已经被抽过！");
    //         return false;
    //     } else {
    //         $('.card').css('opacity', '0');
    //         th.css('opacity', '1');
    //         th.addClass('fanpai');
    //         setTimeout(function () {
    //             // th.removeClass('fanpai');
    //             th.css({
    //                 "transform": " " + th[0].style.transform + " rotate3d(0, 1, 0, 180deg) scale(1.05,1.05)"
    //             });
    //         }, 200)
    //         setTimeout(function () {
    //             $('.card').css('opacity', '1');
    //         }, 700)
    //     }
    // })
})

//保持翻牌样子
function keepfanpai() {
    var th = $('.fanpai');
    for (var i = 0; i < th.length; i++) {
        console.log(th.eq(i)[0].style.transform);
        th.eq(i).css({
            "transform": " " + th.eq(i)[0].style.transform + " rotate3d(0, 1, 0, 180deg) scale(1.05,1.05)"
        });
    }
}


//下面全是控制滚动文字
var stopscroll = false;
var scrollElem = document.getElementById("andyscroll");
var marqueesHeight = scrollElem.style.height;
scrollElem.onmouseover = new Function('stopscroll = true');
scrollElem.onmouseout = new Function('stopscroll = false');
var preTop = 0;
var currentTop = 0;
var stoptime = 0;
var leftElem = document.getElementById("scrollmessage");
scrollElem.appendChild(leftElem.cloneNode(true));
init_srolltext();

function init_srolltext() {
    scrollElem.scrollTop = 0;
    setInterval('scrollUp()', 60); //确定滚动速度的, 数值越小, 速度越快
}

function scrollUp() {
    if (stopscroll) return;
    currentTop += 2; //设为1, 可以实现间歇式的滚动; 设为2, 则是连续滚动
    if (currentTop == 19) {
        stoptime += 1;
        currentTop -= 1;
        if (stoptime == 180) {
            currentTop = 0;
            stoptime = 0;
        }
    } else {
        preTop = scrollElem.scrollTop;
        scrollElem.scrollTop += 1;
        if (preTop == scrollElem.scrollTop) {
            scrollElem.scrollTop = 0;
            scrollElem.scrollTop += 1;
        }
    }
}