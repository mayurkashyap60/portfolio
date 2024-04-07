$(document).ready(function () {
    console.log('working');

    //page scroll animation 
    const Locoscroll = new LocomotiveScroll({
        el: document.querySelector("[data-scroll-container]"),
        smooth: true,
        smartphone: {
            smooth: true
        }
    })
    //page scroll animation 

    // text animation 
    gsap.from(".letter", { rotationX: 36, opacity: 0, duration: 1.8, yPercent: 100, stagger: 0.75, ease: "Expo.easeOut" })
    gsap.fromTo('.displacement', {
        r: 0,
    }, {
        r: 300,
        // repeat: -1,
        duration: 6,
        ease: 'power3.inOut',
        yoyo: false,
    })
    // text animation 

    // projects section 

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
    var magnets = document.querySelectorAll('.magnetic')
    var strength = 90
    const mgButton = document.querySelector('._cta');
    let color1 = '#97c30a';
    let color2 = '#000';
    magnets.forEach((magnet) => {
        magnet.addEventListener('mousemove', moveMagnet);
        magnet.addEventListener('mouseout', function (event) {
            document.getElementById('_cta').style.backgroundColor = color2;
            TweenMax.to(event.currentTarget, 1, { x: 0, y: 0, ease: Power4.easeOut })
        });
    });
    function moveMagnet(event) {
        document.getElementById('_cta').style.backgroundColor = color1;
        var magnetButton = event.currentTarget
        var bounding = magnetButton.getBoundingClientRect()


        //console.log(magnetButton, bounding)

        TweenMax.to(magnetButton, 1, {
            x: (((event.clientX - bounding.left) / magnetButton.offsetWidth) - 0.5) * strength,
            y: (((event.clientY - bounding.top) / magnetButton.offsetHeight) - 0.5) * strength,
            ease: Power4.easeOut
        })

        //magnetButton.style.transform = 'translate(' + (((( event.clientX - bounding.left)/(magnetButton.offsetWidth))) - 0.5) * strength + 'px,'+ (((( event.clientY - bounding.top)/(magnetButton.offsetHeight))) - 0.5) * strength + 'px)';
    }
    // magnetic button

    //custom cursor
    // var cursorOutline = document.querySelector('.cursor_outline');
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
        // cursorOutline.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`;

    })

    cursorScale.forEach(link => {
        link.addEventListener('mousemove', () => {
            // cursor.classList.add('grow'); 
            if (link.classList.contains('small')) {
                //   cursor.classList.remove('grow');
                cursor.classList.add('grow-small');
                // document.getElementById('cursor_outline').classList.add('d-none')
            }
        });

        link.addEventListener('mouseleave', () => {
            // cursor.classList.remove('grow');
            cursor.classList.remove('grow-small');
            // document.getElementById('cursor_outline').classList.remove('d-none')
        });
    })
    //custom cursor

})