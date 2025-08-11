document.addEventListener('DOMContentLoaded', function() {
    const artworks = [
        { src: '1.jpg', caption: '2022 год. Карандаш и тушь' },
        { src: '2.jpg', caption: '2020 год, маркеры и линеры' },
        { src: '3.jpg', caption: '2023 год. Акварель и гуашь' },
        { src: '4.jpg', caption: '2023 год. Гуашь' },
        { src: '5.jpg', caption: '2021 год. Акварель и гуашь' },
        { src: '6.jpg', caption: '2025 год. Гуашь' },
        { src: '7.jpg', caption: '2024 год. Акрил' },
        { src: '8.jpg', caption: '2025 год. Акрил' },
        { src: '9.jpg', caption: '2024 год. Акварель' },
        { src: '10.jpg', caption: '2025 год. Гуашь' }
    ];

    const gallery = document.getElementById('gallery');
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    const modalImage = document.getElementById('modal-image');
    const modalCaption = document.getElementById('modal-caption');
    const modalClose = document.getElementById('modal-close');
    
    // --- АНИМАЦИЯ ЗАГОЛОВКА ---
    const animateSpan = (elementId, text, delay = 0) => {
        const el = document.getElementById(elementId);
        if (!el) return;
        el.innerHTML = text.split('').map((letter, index) =>
            `<span style="animation-delay: ${delay + index * 50}ms">${letter}</span>`
        ).join('');
    };

    const firstName = "Валеева";
    const lastName = "Валентина";
    animateSpan('animated-firstname', firstName, 0);
    animateSpan('animated-lastname', lastName, firstName.length * 50);

    // --- ЗАПОЛНЕНИЕ ГАЛЕРЕИ ---
    artworks.forEach((art, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item rounded-lg overflow-hidden shadow-lg cursor-pointer flex flex-col fade-in-on-scroll';
        item.style.animationDelay = `${index * 120}ms`;

        const imgContainer = document.createElement('div');
        imgContainer.className = 'w-full h-80 overflow-hidden';
        
        const img = document.createElement('img');
        img.src = art.src;
        img.alt = art.caption;
        img.className = 'gallery-image w-full h-full object-cover';
        img.onerror = function() { this.onerror=null; this.src='https://placehold.co/600x400/101010/e5e5e5?text=Image+Not+Found'; };
        
        imgContainer.appendChild(img);

        const captionDiv = document.createElement('div');
        captionDiv.className = 'p-5 text-gray-400 text-center';
        captionDiv.textContent = art.caption;

        item.appendChild(imgContainer);
        item.appendChild(captionDiv);
        gallery.appendChild(item);

        item.addEventListener('click', () => {
            modalImage.src = art.src;
            modalCaption.textContent = art.caption;
            modal.classList.remove('opacity-0', 'pointer-events-none');
            modalContent.classList.remove('scale-95');
        });
    });
    
    function closeModal() {
        modal.classList.add('opacity-0', 'pointer-events-none');
        modalContent.classList.add('scale-95');
    }

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // --- ЭФФЕКТ "АВРОРА" ---
    const aurora = document.querySelector('.aurora-background');
    document.body.addEventListener('mousemove', e => {
        aurora.style.setProperty('--x', e.clientX + 'px');
        aurora.style.setProperty('--y', e.clientY + 'px');
    });
    
    // --- АНИМАЦИЯ ПРИ ПРОКРУТКЕ ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in-on-scroll').forEach(el => {
        observer.observe(el);
    });
    
    // --- ИНТЕРАКТИВНЫЙ ФОН С ЧАСТИЦАМИ ---
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray;

    const mouse = {
        x: null,
        y: null,
        radius: 100 // Радиус влияния курсора
    };

    window.addEventListener('mousemove', function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = 'rgba(177, 171, 255, 0.2)'; // Сделаем частицы менее заметными
            ctx.fill();
        }
        update() {
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function initParticles() {
        particlesArray = [];
        // Оптимизация для мобильных: меньше частиц на маленьких экранах
        let numberOfParticles = (canvas.height * canvas.width) / (window.innerWidth < 768 ? 20000 : 9000);
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 0.4) - 0.2;
            let directionY = (Math.random() * 0.4) - 0.2;
            particlesArray.push(new Particle(x, y, directionX, directionY, size));
        }
    }

    function animateParticles() {
        requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connectParticles();
    }

    function connectParticles() {
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                    ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                
                if (distance < (canvas.width / 8) * (canvas.height / 8)) {
                    let dx = mouse.x - particlesArray[a].x;
                    let dy = mouse.y - particlesArray[a].y;
                    let mouseDistance = Math.sqrt(dx*dx + dy*dy);

                    if (mouseDistance < mouse.radius) {
                        ctx.strokeStyle = 'rgba(220, 210, 255, 0.5)';
                        ctx.lineWidth = 1;
                    } else {
                        let opacityValue = 1 - (distance / 20000);
                        ctx.strokeStyle = 'rgba(140, 131, 255,' + opacityValue * 0.1 + ')';
                        ctx.lineWidth = 1;
                    }
                    
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    window.addEventListener('resize', function() {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        initParticles();
    });

    window.addEventListener('mouseout', function() {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    initParticles();
    animateParticles();

    document.getElementById('current-year').textContent = new Date().getFullYear();
});