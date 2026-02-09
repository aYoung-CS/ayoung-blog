
document.addEventListener('DOMContentLoaded', () => {
    const headings = Array.from(document.querySelectorAll('main h1, main h2, main h3, main h4, main h5, main h6'));
    const tocLinks = Array.from(document.querySelectorAll('.toc-list a'));
    const backToTopBtn = document.getElementById('back-to-top');
    
    let isClicking = false; 

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    const unlockScroll = () => {
        if (isClicking) {
            isClicking = false;
            syncToc();
        }
    };
    window.addEventListener('wheel', unlockScroll);
    window.addEventListener('touchmove', unlockScroll);
    window.addEventListener('keydown', unlockScroll);

    tocLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            isClicking = true;
            updateTocUI(link.parentElement);
        });
    });

    function syncToc() {
        const scrollY = window.scrollY;
        
        if (backToTopBtn) {
            if (scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }

        if (tocLinks.length === 0 || isClicking) return;

        if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 50) {
            if (headings.length > 0) {
                const lastId = headings[headings.length - 1].id;
                const activeLink = tocLinks.find(link => link.getAttribute('href') === '#' + lastId);
                if (activeLink) {
                    updateTocUI(activeLink.parentElement);
                    return;
                }
            }
        }

        const threshold = 150;
        let currentId = '';

        for (let h of headings) {
            if (h.offsetTop - scrollY < threshold) {
                currentId = h.id;
            } else {
                break; 
            }
        }

        if (!currentId && headings.length > 0 && window.scrollY < 300) {
            currentId = headings[0].id;
        }

        if (currentId) {
            const activeLink = tocLinks.find(link => link.getAttribute('href') === '#' + currentId);
            if (activeLink) {
                updateTocUI(activeLink.parentElement);
            }
        }
    }

    function updateTocUI(activeLi) {
        document.querySelectorAll('.toc-item').forEach(item => {
            item.classList.remove('active');
            if (parseInt(item.dataset.level) > 2) {
                item.classList.remove('visible');
            }
        });

        activeLi.classList.add('active');
        activeLi.classList.add('visible'); 

        let runner = activeLi;
        if (parseInt(activeLi.dataset.level) > 2) {
            let prev = activeLi.previousElementSibling;
            while (prev) {
                if (parseInt(prev.dataset.level) <= 2) {
                    runner = prev;
                    break;
                }
                prev = prev.previousElementSibling;
            }
        }
        
        if (runner) {
            let next = runner.nextElementSibling;
            while (next) {
                if (parseInt(next.dataset.level) <= 2) break;
                next.classList.add('visible');
                next = next.nextElementSibling;
            }
        }
    }

    if (tocLinks.length > 0 || backToTopBtn) {
        syncToc();
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    syncToc();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
});
