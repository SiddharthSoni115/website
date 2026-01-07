// ============================================
// DOM CACHE
// ============================================
const domCache = {
    navbar: null,
    sections: null,
    navLinks: null,
    canvas: null,
    ctx: null,
    
    init() {
        this.navbar = document.querySelector('.navbar');
        this.sections = document.querySelectorAll('section[id]');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.canvas = document.getElementById('neural-bg');
        this.ctx = this.canvas?.getContext('2d');
    }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============================================
// NEURAL NETWORK BACKGROUND (OPTIMIZED)
// ============================================
class NeuralNetwork {
    constructor() {
        this.canvas = domCache.canvas;
        if (!this.canvas) return;
        
        this.ctx = domCache.ctx;
        this.nodes = [];
        
        // Adaptive node count
        this.nodeCount = window.innerWidth < 768 ? 30 : 
                        window.innerWidth < 1200 ? 50 : 80;
        
        // FPS limiting
        this.fps = 30;
        this.frameInterval = 1000 / this.fps;
        this.lastFrameTime = 0;
        
        this.resize();
        this.createNodes();
        this.animate(0);
        
        window.addEventListener('resize', debounce(() => {
            this.nodeCount = window.innerWidth < 768 ? 30 : 
                           window.innerWidth < 1200 ? 50 : 80;
            this.resize();
            this.createNodes();
        }, 250));
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createNodes() {
        this.nodes = [];
        for (let i = 0; i < this.nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }
    }
    
    animate(currentTime) {
        if (currentTime - this.lastFrameTime < this.frameInterval) {
            requestAnimationFrame((time) => this.animate(time));
            return;
        }
        this.lastFrameTime = currentTime;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw nodes and connections
        this.nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;
            
            if (node.x < 0 || node.x > this.canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > this.canvas.height) node.vy *= -1;
            
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(99, 102, 241, 0.5)';
            this.ctx.fill();
        });
        
        // Draw connections
        this.nodes.forEach((node1, i) => {
            this.nodes.slice(i + 1).forEach(node2 => {
                const dx = node1.x - node2.x;
                const dy = node1.y - node2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(node1.x, node1.y);
                    this.ctx.lineTo(node2.x, node2.y);
                    this.ctx.strokeStyle = `rgba(99, 102, 241, ${0.2 * (1 - distance / 150)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame((time) => this.animate(time));
    }
}

// ============================================
// PARTICLE SYSTEM (OPTIMIZED)
// ============================================
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    const particleCount = window.innerWidth < 768 ? 10 : 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            background: rgba(99, 102, 241, 0.6);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 10}s linear infinite;
            box-shadow: 0 0 10px rgba(99, 102, 241, 0.8);
            will-change: transform;
        `;
        container.appendChild(particle);
    }
}

// ============================================
// TYPEWRITER EFFECT
// ============================================
class Typewriter {
    constructor(element, words, typingSpeed = 80, deletingSpeed = 50, delay = 2000) {
        this.element = element;
        this.words = words;
        this.typingSpeed = typingSpeed;
        this.deletingSpeed = deletingSpeed;
        this.delay = delay;
        this.wordIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        
        this.type();
    }
    
    type() {
        const currentWord = this.words[this.wordIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentWord.substring(0, this.charIndex - 1);
            this.charIndex--;
            
            if (this.charIndex === 0) {
                this.isDeleting = false;
                this.wordIndex = (this.wordIndex + 1) % this.words.length;
                setTimeout(() => this.type(), 500);
                return;
            }
        } else {
            this.element.textContent = currentWord.substring(0, this.charIndex + 1);
            this.charIndex++;
            
            if (this.charIndex === currentWord.length) {
                this.isDeleting = true;
                setTimeout(() => this.type(), this.delay);
                return;
            }
        }
        
        setTimeout(() => this.type(), 
            this.isDeleting ? this.deletingSpeed : this.typingSpeed);
    }
}

// ============================================
// NAVBAR (OPTIMIZED)
// ============================================
function setupNavbar() {
    if (!domCache.navbar) return;
    
    const scrollHandler = throttle(() => {
        if (window.scrollY > 100) {
            domCache.navbar.classList.add('scrolled');
        } else {
            domCache.navbar.classList.remove('scrolled');
        }
        
        // Active section highlight
        let current = '';
        domCache.sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop && 
                window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        domCache.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }, 100);
    
    window.addEventListener('scroll', scrollHandler, { passive: true });
}

// ============================================
// SMOOTH SCROLL
// ============================================
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const offset = 80;
                const targetPosition = target.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse?.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                }
            }
        });
    });
}

// ============================================
// AOS-LIKE SCROLL ANIMATION
// ============================================
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    document.querySelectorAll('[data-aos]').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        const delay = el.getAttribute('data-aos-delay');
        if (delay) {
            el.style.transitionDelay = `${delay}ms`;
        }
        
        observer.observe(el);
    });
}

// ============================================
// DATA: ACTIVE RESEARCH (ONLY 1 - Portfolio Optimization)
// ============================================
const activeResearch = [
    {
        icon: 'fa-chart-line',
        title: 'AI-Driven Portfolio Optimization',
        subtitle: 'M.Sc Thesis Research - Ongoing',
        description: 'Developing hybrid AI frameworks integrating Reinforcement Learning, Graph Neural Networks, and Large Language Models for portfolio optimization. Designing learning-based strategies for dynamic asset allocation, risk management, and interpretability under realistic market constraints.',
        metric: '23% Improvement in Risk-Adjusted Returns',
        tags: ['Reinforcement Learning', 'Graph Neural Networks', 'LLMs', 'Portfolio Optimization', 'Finance', 'Quantitative Analysis'],
        supervisor: 'Dr. Aparna Mehra, IIT Delhi',
        status: 'Active'
    }
];

// ============================================
// DATA: PROJECTS (INCLUDING COMPLETED RESEARCH)
// ============================================
const projects = [
    // Completed Research Projects
    {
        icon: 'fa-brain',
        title: 'Neural Solver for Dynamic Programming',
        description: 'Designed neural sequence models to learn optimal solutions for 0/1 Knapsack and dynamic programming problems. Built capacity-agnostic neural solvers demonstrating strong out-of-distribution generalization.',
        metric: '95% Accuracy on Unseen Instances',
        tags: ['Dynamic Programming', 'Sequence Models', 'PyTorch', 'Algorithm Design', 'Neural Networks'],
        supervisor: 'Prof. Rahul Garg, IIT Delhi',
        github: '#',
        isResearch: true
    },
    {
        icon: 'fa-shopping-cart',
        title: 'IndiaMART RecSys Challenge',
        description: 'Developed sequential recommender systems using GRU4Rec and Graph Neural Networks for large-scale e-commerce interaction data. Modeled temporal user-item behavior to improve ranking quality and user engagement.',
        metric: 'Top 10% | CTR@6: 0.342',
        tags: ['Recommender Systems', 'GRU4Rec', 'GNNs', 'Kaggle', 'E-commerce', 'Sequential Models'],
        supervisor: 'Prof. Rahul Garg, IIT Delhi',
        github: '#',
        isResearch: true
    },
    {
        icon: 'fa-file-medical',
        title: 'MedCalc-Bench: LLM Clinical Calculator',
        description: 'Fine-tuned 4B parameter LLM (Qwen) using QLoRA for medical calculations from unstructured patient notes. Designed prompt-engineering pipelines for numerical reasoning, unit conversion, and clinical inference.',
        metric: '92% Accuracy on Clinical Benchmarks',
        tags: ['LLM', 'Fine-Tuning', 'QLoRA', 'Healthcare AI', 'Medical NLP', 'Prompt Engineering'],
        supervisor: 'Prof. Rahul Garg, IIT Delhi',
        github: '#',
        isResearch: true
    },
    // Production ML Projects
    {
        icon: 'fa-robot',
        title: 'FinApp RAG Agent',
        description: 'Built a Retrieval-Augmented Generation system to answer natural language queries over financial CSV and PDF documents. Integrated LangChain, Gemini API, ChromaDB, and PyPDF for efficient semantic retrieval and session-based pipelines.',
        tags: ['LangChain', 'Gemini API', 'ChromaDB', 'RAG', 'Docker', 'PyPDF', 'Financial Analytics'],
        github: 'https://github.com/Raman-Brar-IITD/FinApp-RAG'
    },
    {
        icon: 'fa-smile-beam',
        title: 'Sentiment Analysis MLOps',
        description: 'Production-ready sentiment analysis with DVC versioning, MLflow tracking, and LIME explainability. Features automated CI/CD pipeline with Docker containerization and AWS deployment.',
        metric: '88% Accuracy on IMDB 50K',
        tags: ['DVC', 'MLflow', 'Flask', 'GitHub Actions', 'Docker', 'LIME', 'NLP', 'AWS'],
        github: 'https://github.com/Raman-Brar-IITD/Sentiment_analysis_MLOPS'
    },
    {
        icon: 'fa-hand-holding-usd',
        title: 'Loan Approval Prediction',
        description: 'FastAPI-powered ML application for loan approval predictions. Containerized deployment on AWS EC2/ECR with complete CI/CD automation and reproducible ML pipelines.',
        metric: '50% Reduction in Experimentation Time',
        tags: ['MLOps', 'FastAPI', 'Docker', 'GitHub Actions', 'AWS EC2', 'AWS ECR', 'CI/CD'],
        github: 'https://github.com/Raman-Brar-IITD/Loan_approval_MLOPS'
    },
    {
        icon: 'fa-eye',
        title: 'LipNet: Lip Reading System',
        description: 'Reproduced LipNet architecture (3D CNN + Bi-LSTM + CTC Loss) using TensorFlow/Keras on GRID corpus. Built Flask-based web demo with Google MediaPipe for accurate lip detection and preprocessing.',
        metric: '85% Accuracy on GRID Dataset',
        tags: ['Deep Learning', '3D CNN', 'Bi-LSTM', 'TensorFlow', 'Keras', 'Flask', 'DVC', 'Computer Vision'],
        github: 'https://github.com/Raman-Brar-IITD/LIPNET_Lip_reading_DL'
    },
    {
        icon: 'fa-users-slash',
        title: 'Customer Churn Prediction',
        description: 'End-to-end MLOps pipeline predicting customer churn with Flask web interface. Deployed on AWS with CI/CD automation and comprehensive model versioning.',
        metric: '94% Accuracy',
        tags: ['Python', 'Flask', 'Scikit-learn', 'AWS', 'MLOps', 'XGBoost', 'CI/CD'],
        github: 'https://github.com/Raman-Brar-IITD/Customer_Curn'
    }
];

// ============================================
// RENDER FUNCTIONS
// ============================================
function renderResearch() {
    const container = document.getElementById('research-container');
    if (!container) return;
    
    const fragment = document.createDocumentFragment();
    
    activeResearch.forEach((project, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', index * 100);
        
        card.innerHTML = `
            <div class="card-icon">
                <i class="fas ${project.icon}"></i>
            </div>
            <h3 class="card-title">${project.title}</h3>
            <p class="card-subtitle">${project.subtitle}</p>
            ${project.metric ? `<div class="card-metric">${project.metric}</div>` : ''}
            <p class="card-description">${project.description}</p>
            <div class="card-tags">
                ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="card-footer">
                <div class="card-supervisor">
                    <strong>Supervisor:</strong> ${project.supervisor}
                </div>
                <span class="status-badge">${project.status}</span>
            </div>
        `;
        
        fragment.appendChild(card);
    });
    
    container.innerHTML = '';
    container.appendChild(fragment);
    setupScrollAnimations();
}

function renderProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;
    
    const fragment = document.createDocumentFragment();
    
    projects.forEach((project, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', index * 100);
        
        card.innerHTML = `
            <div class="card-icon">
                <i class="fas ${project.icon}"></i>
            </div>
            <h3 class="card-title">${project.title}</h3>
            ${project.metric ? `<div class="card-metric">${project.metric}</div>` : ''}
            <p class="card-description">${project.description}</p>
            <div class="card-tags">
                ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            ${project.supervisor ? `
                <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.05);">
                    <div class="card-supervisor">
                        <strong>Supervisor:</strong> ${project.supervisor}
                    </div>
                </div>
            ` : ''}
            ${project.github && project.github !== '#' ? `
                <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="card-link">
                    <i class="fab fa-github"></i>
                    <span>View on GitHub</span>
                </a>
            ` : ''}
        `;
        
        fragment.appendChild(card);
    });
    
    container.innerHTML = '';
    container.appendChild(fragment);
    setupScrollAnimations();
}

// ============================================
// FETCH BLOG POSTS (FIXED WITH BETTER ERROR HANDLING)
// ============================================
async function fetchBlogPosts() {
    const container = document.getElementById('blog-container');
    if (!container) return;
    
    const query = `
        query Publication($host: String!) {
            publication(host: $host) {
                posts(first: 6) {
                    edges {
                        node {
                            title
                            brief
                            url
                            publishedAt
                            readTimeInMinutes
                        }
                    }
                }
            }
        }
    `;
    
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
        const response = await fetch('https://gql.hashnode.com/', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query,
                variables: { host: 'mlwithbrar.hashnode.dev' }
            }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.errors) {
            throw new Error(data.errors[0].message);
        }
        
        const posts = data.data?.publication?.posts?.edges || [];
        
        if (posts.length > 0) {
            const fragment = document.createDocumentFragment();
            
            posts.forEach(({ node }, index) => {
                const card = document.createElement('div');
                card.className = 'card';
                card.setAttribute('data-aos', 'fade-up');
                card.setAttribute('data-aos-delay', index * 100);
                
                const date = new Date(node.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
                
                card.innerHTML = `
                    <div class="card-icon">
                        <i class="fas fa-blog"></i>
                    </div>
                    <div class="blog-meta">
                        <span><i class="fas fa-calendar"></i> ${date}</span>
                        <span><i class="fas fa-clock"></i> ${node.readTimeInMinutes} min read</span>
                    </div>
                    <h3 class="card-title">${node.title}</h3>
                    <p class="card-description">${node.brief}</p>
                    <a href="${node.url}" target="_blank" rel="noopener noreferrer" class="card-link">
                        <span>Read Article</span>
                        <i class="fas fa-arrow-right"></i>
                    </a>
                `;
                
                fragment.appendChild(card);
            });
            
            container.innerHTML = '';
            container.appendChild(fragment);
            setupScrollAnimations();
        } else {
            showBlogFallback(container);
        }
        
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        clearTimeout(timeoutId);
        showBlogFallback(container);
    }
}

function showBlogFallback(container) {
    container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
            <div style="max-width: 500px; margin: 0 auto;">
                <i class="fas fa-blog" style="font-size: 48px; color: var(--primary); margin-bottom: 20px;"></i>
                <h4 style="margin-bottom: 16px; color: var(--text-primary);">Visit My Blog</h4>
                <p style="color: var(--text-secondary); margin-bottom: 24px;">
                    I write about AI, Machine Learning, and technology. Check out my latest articles on Hashnode.
                </p>
                <a href="https://mlwithbrar.hashnode.dev/" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   class="btn-primary"
                   style="display: inline-flex; text-decoration: none;">
                    <span>Visit Blog</span>
                    <i class="fas fa-external-link-alt"></i>
                </a>
            </div>
        </div>
    `;
}

// ============================================
// FORM VALIDATION & SUBMISSION
// ============================================
function setupFormValidation() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const statusDiv = document.getElementById('form-status');
        let isValid = true;
        
        // Clear previous states
        form.querySelectorAll('.form-control').forEach(input => {
            input.classList.remove('is-invalid', 'is-valid');
        });
        
        // Validate name
        const name = formData.get('name').trim();
        if (name.length < 2) {
            document.getElementById('name').classList.add('is-invalid');
            isValid = false;
        } else {
            document.getElementById('name').classList.add('is-valid');
        }
        
        // Validate email
        const email = formData.get('email').trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            document.getElementById('email').classList.add('is-invalid');
            isValid = false;
        } else {
            document.getElementById('email').classList.add('is-valid');
        }
        
        // Validate message
        const message = formData.get('message').trim();
        if (message.length < 10) {
            document.getElementById('message').classList.add('is-invalid');
            isValid = false;
        } else {
            document.getElementById('message').classList.add('is-valid');
        }
        
        if (!isValid) {
            statusDiv.className = 'form-status error';
            statusDiv.textContent = 'Please fill out all fields correctly.';
            return;
        }
        
        // Submit form
        try {
            statusDiv.className = 'form-status';
            statusDiv.textContent = 'Sending message...';
            
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });
            
            if (response.ok) {
                statusDiv.className = 'form-status success';
                statusDiv.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
                form.reset();
                form.querySelectorAll('.form-control').forEach(input => {
                    input.classList.remove('is-valid');
                });
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            statusDiv.className = 'form-status error';
            statusDiv.textContent = '✗ Failed to send message. Please try emailing me directly.';
        }
    });
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize DOM cache
    domCache.init();
    
    // Initialize background effects
    new NeuralNetwork();
    createParticles();
    
    // Initialize typewriter
    const typewriterElement = document.querySelector('.typing-text');
    if (typewriterElement) {
        new Typewriter(
            typewriterElement,
            [
                'AI/ML Researcher at IIT Delhi',
                'Building Intelligent Systems',
                'Specializing in Deep Learning',
                'MLOps & Production AI'
            ]
        );
    }
    
    // Setup navigation
    setupNavbar();
    setupSmoothScroll();
    
    // Render content
    renderResearch();
    renderProjects();
    fetchBlogPosts();
    
    // Setup form
    setupFormValidation();
    
    // Setup scroll animations
    setTimeout(() => setupScrollAnimations(), 100);
});

// ============================================
// CSS ANIMATION FOR FLOAT
// ============================================
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
    }
`;
document.head.appendChild(style);