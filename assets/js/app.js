$(document).ready(function () {
    console.log('working');

    // text animation 
    gsap.from(".letter", { rotationX: 36, opacity: 0, duration: 1.8, yPercent: 100, stagger: 0.75, ease: "Expo.easeOut" })
    // text animation 

    // projects section 
    var $cursor = $(".cursor"),
        $overlay = $(".project-overlay");
    function moveCircle(e) {
        TweenLite.to($cursor, 0.5, {
            css: {
                left: e.pageX,
                top: e.pageY
            },
            delay: 0.03
        });
    }
    $(".hover_img1").hover(function () {
        $(".cursor").css({ "background-image": "url(https://i.pinimg.com/564x/85/24/d7/8524d785a8427617d475bf02d51710fc.jpg)" });
    });
    $(".hover_img2").hover(function () {
        $(".cursor").css({ "background-image": "url(https://i.pinimg.com/564x/97/59/85/9759859a26a8f8195d1c4dd92f00cb73.jpg)" });
    });
    $(".hover_img3").hover(function () {
        $(".cursor").css({ "background-image": "url(https://i.pinimg.com/564x/9c/52/81/9c528158c74da06541565671cfc2644b.jpg)" });
    });
    $(".hover_img4").hover(function () {
        $(".cursor").css({ "background-image": "url(https://i.pinimg.com/564x/38/18/c3/3818c31969226e29a9dabd5e3cd0802a.jpg)" });
    });
    var flag = false;
    $($overlay).mousemove(function () {
        flag = true;
        TweenLite.to($cursor, 0.3, { scale: 1, autoAlpha: 1 });
        $($overlay).on("mousemove", moveCircle);
    });
    $($overlay).mouseout(function () {
        flag = false;
        TweenLite.to($cursor, 0.3, { scale: 0.1, autoAlpha: 0 });
    });
    // projects section 

    // marquee animation 

    const boxes = gsap.utils.toArray(".lines");

    // Setup the tween
    const loop = horizontalLoop(boxes, {
        paused: true, // Sets the tween to be paused initially
        repeat: -1 // Makes sure the tween runs infinitely
    });
    // Start the tween
    loop.play() // Call to start playing the tween

    function horizontalLoop(items, config) {
        // $('.wrapper').attr('speed').val()
        var myVal = $('.marquee_wrapper').attr('speed');
        var manageSpeed = myVal;
        // function bigImg(x) {
        //     $(x).attr('speed', 0)
        // }
        items = gsap.utils.toArray(items);
        config = config || {};
        let tl = gsap.timeline({ repeat: config.repeat, paused: config.paused, defaults: { ease: "none" }, onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100) }),
            length = items.length,
            startX = items[0].offsetLeft,
            times = [],
            widths = [],
            xPercents = [],
            curIndex = 0,
            pixelsPerSecond = (config.speed || manageSpeed) * 100,
            snap = config.snap === false ? v => v : gsap.utils.snap(config.snap || 1),
            totalWidth, curX, distanceToStart, distanceToLoop, item, i;
        gsap.set(items, {
            xPercent: (i, el) => {
                let w = widths[i] = parseFloat(gsap.getProperty(el, "width", "px"));
                xPercents[i] = snap(parseFloat(gsap.getProperty(el, "x", "px")) / w * 100 + gsap.getProperty(el, "xPercent"));
                return xPercents[i];
            }
        });
        gsap.set(items, { x: 0 });
        totalWidth = items[length - 1].offsetLeft + xPercents[length - 1] / 100 * widths[length - 1] - startX + items[length - 1].offsetWidth * gsap.getProperty(items[length - 1], "scaleX") + (parseFloat(config.paddingRight) || 0);
        for (i = 0; i < length; i++) {
            item = items[i];
            curX = xPercents[i] / 100 * widths[i];
            distanceToStart = item.offsetLeft + curX - startX;
            distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
            tl.to(item, { xPercent: snap((curX - distanceToLoop) / widths[i] * 100), duration: distanceToLoop / pixelsPerSecond }, 0)
                .fromTo(item, { xPercent: snap((curX - distanceToLoop + totalWidth) / widths[i] * 100) }, { xPercent: xPercents[i], duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, immediateRender: false }, distanceToLoop / pixelsPerSecond)
                .add("label" + i, distanceToStart / pixelsPerSecond);
            times[i] = distanceToStart / pixelsPerSecond;
        }
        function toIndex(index, vars) {
            vars = vars || {};
            (Math.abs(index - curIndex) > length / 2) && (index += index > curIndex ? -length : length); // always go in the shortest direction
            let newIndex = gsap.utils.wrap(0, length, index),
                time = times[newIndex];
            if (time > tl.time() !== index > curIndex) { // if we're wrapping the timeline's playhead, make the proper adjustments
                vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
                time += tl.duration() * (index > curIndex ? 1 : -1);
            }
            curIndex = newIndex;
            vars.overwrite = true;
            return tl.tweenTo(time, vars);
        }
        tl.next = vars => toIndex(curIndex + 1, vars);
        tl.previous = vars => toIndex(curIndex - 1, vars);
        tl.current = () => curIndex;
        tl.toIndex = (index, vars) => toIndex(index, vars);
        tl.times = times;
        tl.progress(1, true).progress(0, true); // pre-render for performance
        if (config.reversed) {
            tl.vars.onReverseComplete();
            tl.reverse();
        }
        return tl;
    }
    // marquee animation 

    // magnetic button  
    function magneticButton() {
        let color = '#97c30a';
        let color2 = '#000';
        const button = document.querySelector('._cta');
        let boundingRect = button.getBoundingClientRect();
        window.addEventListener('resize', () => {
            boundingRect = button.getBoundingClientRect();
        });
        button.addEventListener('mousemove', (e) => {
            // alert(this)
            // document.getElementById('_cta').style.backgroundColor = "red";
            const mousePosX = e.x - boundingRect.left;
            const mousePosY = e.y - boundingRect.top;
            gsap.to(button, {
                x: (mousePosX - boundingRect.width / 2) * 0.4,
                y: (mousePosY - boundingRect.height / 2) * 0.4,
                duration: 0.7,
                ease: 'power3.out',
                backgroundColor: color,
            });
            document.getElementById('cursor_outline').classList.add('d-none')

        });
        button.addEventListener('mouseleave', () => {

            gsap.to(button, {
                x: 0,
                y: 0,
                duration: 0.7,
                ease: 'elastic.out(1,0.3)',
                backgroundColor: color2
            });
            document.getElementById('cursor_outline').classList.remove('d-none')
        });
    }
    var contactTop = $('section#contact').offset().top;
    $(window).scroll(function () {
        var scrollWindowTop = $(window).scrollTop() + 60;
        if (scrollWindowTop >= contactTop) {
            magneticButton()
            console.log('DDDD');
        }
    });
    // magnetic button

    //custom cursor
    var cursorOutline = document.querySelector('.cursor_outline');
    let cursor = document.querySelector('.cursor2');
    let cursorScale = document.querySelectorAll('.cursor-scale');
    let mouseX = 0;
    let mouseY = 0;

    gsap.to({}, 0.016, {
        repeat: -1,
        onRepeat: function () {
            gsap.set(cursor, {
                css: {
                    left: mouseX,
                    top: mouseY,
                }
            })
        }
    });

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        var x = e.clientX;
        var y = e.clientY;
        cursorOutline.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`;

    })

    cursorScale.forEach(link => {
        link.addEventListener('mousemove', () => {
            // cursor.classList.add('grow'); 
            if (link.classList.contains('small')) {
                //   cursor.classList.remove('grow');
                cursor.classList.add('grow-small');
                document.getElementById('cursor_outline').classList.add('d-none')
            }
        });

        link.addEventListener('mouseleave', () => {
            // cursor.classList.remove('grow');
            cursor.classList.remove('grow-small');
            document.getElementById('cursor_outline').classList.remove('d-none')
        });
    })
    //custom cursor

})