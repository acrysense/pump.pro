document.addEventListener('DOMContentLoaded', function () {
    // height 100vh fix for IOS
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    // height header
    const header = document.getElementById('header')
    let headerh = header ? header.getBoundingClientRect().height : 0;

    document.documentElement.style.setProperty('--headerh', `${headerh}px`);

    // resize
    window.addEventListener('resize', () => {
        let vh = window.innerHeight * 0.01;
        let headerh = header ? header.getBoundingClientRect().height : 0;
        
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        document.documentElement.style.setProperty('--headerh', `${headerh}px`);
    });
    
    // smooth scroll
    function currentYPosition() {
        // Firefox, Chrome, Opera, Safari
        if (self.pageYOffset) return self.pageYOffset;

        // Internet Explorer 6 - standards mode
        if (document.documentElement && document.documentElement.scrollTop)
            return document.documentElement.scrollTop;
        
        // Internet Explorer 6, 7 and 8
        if (document.body.scrollTop) return document.body.scrollTop;

        return 0;
    } 
    
    function elmYPosition(eID) {
        let elm = document.getElementById(eID);
        let y = elm.offsetTop;
        let node = elm;
        while (node.offsetParent && node.offsetParent != document.body) {
            node = node.offsetParent;
            y += node.offsetTop;
        } return y;
    }
    
    function smoothScroll(eID) {
        let startY = currentYPosition();
        let stopY = elmYPosition(eID) - 30;
        let distance = stopY > startY ? stopY - startY : startY - stopY;
        if (distance < 100) {
            scrollTo(0, stopY); return;
        }
        let speed = Math.round(distance / 100);
        if (speed >= 20) speed = 20;
        let step = Math.round(distance / 25);
        let leapY = stopY > startY ? startY + step : startY - step;
        let timer = 0;
        if (stopY > startY) {
            for (let i = startY; i < stopY; i += step ) {
                setTimeout('window.scrollTo(0, ' + leapY + ')', timer * speed);
                leapY += step; if (leapY > stopY) leapY = stopY; timer++;
            } return;
        }
        for (let i = startY; i > stopY; i -= step ) {
            setTimeout('window.scrollTo(0, ' + leapY + ')', timer * speed);
            leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
        }
    }

    // smooth scroll on links
    const allLinks = document.querySelectorAll('a[href^="#"]')

    if (allLinks) {
        allLinks.forEach(item => {
            item.addEventListener('click', (event) => {
                event.preventDefault()
        
                if (item.getAttribute('href').length > 1) {
                    smoothScroll(item.getAttribute('href').slice(1))
                }
            })
        })
    }
    
    // dropdown language
    const dropdownLanguage = document.querySelectorAll('.c-language__btn')

    const useItemChecker = (el, onClickOutside) => {
        const checkBodyClick = (e) => {
            let currentEl = e.target;

            while (currentEl) {
                if (currentEl === el) break;
                currentEl = currentEl.parentNode
            }

            if (!currentEl) {
                onClickOutside()
                removeBodyChecker()
            }
        }
        function setBodyChecker  ()  {
            document.documentElement.addEventListener('click', checkBodyClick)
        }
        function removeBodyChecker ()  {
            document.documentElement.removeEventListener('click', checkBodyClick)
        }
        return {setBodyChecker, removeBodyChecker}
    }

    if (dropdownLanguage) {
        dropdownLanguage.forEach(item => {
            const close = () => {
                item.closest('.c-language').classList.remove('c-language--active')
            }
            const itemChecker = useItemChecker(item.parentNode, close)

            item.addEventListener('click', (event) => {
                event.preventDefault()

                const canHover = window.matchMedia('(hover: none)').matches;
                const parent = item.closest('.c-language')

                if (canHover) {
                    if (!parent.classList.contains('c-language--active')) {
                        parent.classList.add('c-language--active')
                        itemChecker.setBodyChecker()
                    } else {
                        close()
                    }
                }
            })
        })
    }
    
    // menu
    const hamburger = document.getElementById('hamburger-toggle')

    if (hamburger) {
        hamburger.addEventListener('click', (event) => {
            event.preventDefault()

            if (!header.classList.contains('header--active')) {
                hamburger.classList.add('hamburger--active')
                header.classList.add('header--active')
                document.body.classList.add('scroll-disabled')
            } else {
                hamburger.classList.remove('hamburger--active')
                header.classList.remove('header--active')
                document.body.classList.remove('scroll-disabled')
            }
        })
    }

    // slides up/down/toggle
    let slideUpQna = (target, duration = 400) => {
        target.style.transitionProperty = 'height, margin, padding';
        target.style.transitionDuration = duration + 'ms';
        target.style.height = target.offsetHeight + 'px';
        target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        target.previousElementSibling.style.pointerEvents = 'none';
        window.setTimeout(() => {
            target.style.display = 'none';
            target.style.removeProperty('height');
            target.style.removeProperty('padding-top');
            target.style.removeProperty('padding-bottom');
            target.style.removeProperty('margin-top');
            target.style.removeProperty('margin-bottom');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            target.previousElementSibling.style.pointerEvents = 'auto';
        }, duration);
        target.parentNode.classList.remove('is--open');
    }

    let slideDownQna = (target, duration = 400) => {
        target.style.removeProperty('display');
        let display = window.getComputedStyle(target).display;
        if (display === 'none') display = 'block';
        target.style.display = display;
        let height = target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        target.offsetHeight;
        target.style.transitionProperty = "height, margin, padding";
        target.style.transitionDuration = duration + 'ms';
        target.style.height = height + 'px';
        target.style.removeProperty('padding-top');
        target.style.removeProperty('padding-bottom');
        target.style.removeProperty('margin-top');
        target.style.removeProperty('margin-bottom');
        target.previousElementSibling.style.pointerEvents = 'none';
        window.setTimeout(() => {
            target.style.removeProperty('height');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            target.previousElementSibling.style.pointerEvents = 'auto';
        }, duration);
        target.parentNode.classList.add('is--open');
    }

    let slideToggleQna = (target, duration = 400) => {
        if (window.getComputedStyle(target).display === 'none') {
            return slideDownQna(target, duration);
        } else {
            return slideUpQna(target, duration);
        }
    }

    // accordeon
    const accordeonTrigger = document.querySelectorAll('.c-accordeon__trigger')

    if (accordeonTrigger) {
        accordeonTrigger.forEach(item => {
            item.addEventListener('click', (event) => {
                event.preventDefault()

                if (!item.parentNode.classList.contains('is--open')) {
                    slideDownQna(item.nextElementSibling)
                } else {
                    slideUpQna(item.nextElementSibling)
                }
            })
        })
    }
    
    // animations
    AOS.init({
        duration: 1200,
        once: true,
    })
});