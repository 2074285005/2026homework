/* ================================================================
   西北民族大学 · 大一新生综合服务指南
   全局 JavaScript 交互逻辑
   作者：新生护航队 | 2026
   ================================================================ */

// ============================================================
// 1. 页面加载动画（全屏遮罩淡出）
// ============================================================
(function initLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hide');
    }, 500); // 短暂停留后淡出
  });
})();

// ============================================================
// 2. 导航栏滚动变色 & 当前页高亮
// ============================================================
(function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  // 滚动变色
  const onScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // 初始化一次

  // 当前页高亮：对比链接 href 与当前页文件名
  const currentFile = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === currentFile || (currentFile === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

// ============================================================
// 3. 滚动监听动画（IntersectionObserver）
// ============================================================
(function initScrollReveal() {
  // 通用入场元素
  const targets = document.querySelectorAll('.scroll-reveal, .about-text, .about-visual');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          // 卡片逐个延迟出现（入口卡片）
          if (entry.target.classList.contains('entry-card')) {
            entry.target.classList.add('animated');
          }
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach(el => observer.observe(el));
})();

// ============================================================
// 4. 首页全屏轮播横幅
// ============================================================
(function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const prevBtn = document.querySelector('.hero-prev');
  const nextBtn = document.querySelector('.hero-next');
  if (!slides.length) return;

  let current = 0;
  let timer;

  // 切换到指定索引
  const goTo = (idx) => {
    slides[current].classList.remove('active');
    dots[current] && dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current] && dots[current].classList.add('active');
  };

  // 自动轮播
  const startAuto = () => {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 3500);
  };

  // 初始化
  goTo(0);
  startAuto();

  // 箭头按钮
  prevBtn && prevBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });
  nextBtn && nextBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });

  // 圆点点击
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); startAuto(); });
  });

  // 视差效果：鼠标在横幅内移动，背景轻微偏移
  const heroBanner = document.querySelector('.hero-banner');
  if (heroBanner) {
    heroBanner.addEventListener('mousemove', (e) => {
      const rect = heroBanner.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 ~ 0.5
      const cy = (e.clientY - rect.top) / rect.height - 0.5;
      slides.forEach(slide => {
        slide.style.transform = `scale(1.04) translate(${cx * 18}px, ${cy * 10}px)`;
        slide.style.transition = 'transform 0.5s ease';
      });
    });
    heroBanner.addEventListener('mouseleave', () => {
      slides.forEach(slide => {
        slide.style.transform = '';
      });
    });
  }
})();

// ============================================================
// 5. 滚动视差（横幅区域向上位移）
// ============================================================
(function initParallax() {
  const heroContent = document.querySelector('.hero-content');
  if (!heroContent) return;

  const onScroll = () => {
    const scrolled = window.scrollY;
    // 视差系数 0.35，内容轻微上移
    heroContent.style.transform = `translateY(${scrolled * 0.35}px)`;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// ============================================================
// 6. 轻量粒子点缀（横幅区）
// ============================================================
(function initParticles() {
  const container = document.querySelector('.hero-particles');
  if (!container) return;

  const count = 22; // 控制数量，保证流畅
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${50 + Math.random() * 50}%;
      width: ${2 + Math.random() * 3}px;
      height: ${2 + Math.random() * 3}px;
      --drift: ${(Math.random() - 0.5) * 60}px;
      animation-duration: ${4 + Math.random() * 5}s;
      animation-delay: ${Math.random() * 4}s;
      opacity: ${0.3 + Math.random() * 0.5};
    `;
    container.appendChild(p);
  }
})();

// ============================================================
// 7. 返回顶部按钮
// ============================================================
(function initBackTop() {
  const btn = document.getElementById('back-top');
  if (!btn) return;

  // 滚动超过一屏时显示
  window.addEventListener('scroll', () => {
    if (window.scrollY > window.innerHeight * 0.8) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  }, { passive: true });

  // 点击回顶
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ============================================================
// 8. 二级锚点导航（滚动高亮 + 平滑跳转）
// ============================================================
(function initSubnav() {
  const subnavLinks = document.querySelectorAll('.subnav-link[data-target]');
  if (!subnavLinks.length) return;

  // 点击平滑滚动
  subnavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('data-target');
      const target = document.getElementById(targetId);
      if (!target) return;
      // 计算偏移（导航栏+二级导航高度）
      const offset = 68 + 50; // nav-h + subnav
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // 滚动监听当前区块高亮
  const sections = Array.from(subnavLinks).map(link => ({
    link,
    section: document.getElementById(link.getAttribute('data-target'))
  })).filter(item => item.section);

  const onScroll = () => {
    const scrollPos = window.scrollY + 140;
    sections.forEach(({ link, section }) => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (scrollPos >= top && scrollPos < bottom) {
        subnavLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ============================================================
// 9. FAQ 折叠面板
// ============================================================
(function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // 关闭所有（手风琴模式）
      items.forEach(i => i.classList.remove('open'));
      // 若之前未打开则打开
      if (!isOpen) item.classList.add('open');
    });
  });
})();

// ============================================================
// 10. 工具导航标签切换
// ============================================================
(function initTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');

      // 切换按钮状态
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // 切换面板（淡入）
      panels.forEach(panel => {
        if (panel.id === target) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });
})();

// ============================================================
// 11. 工具卡片教程折叠
// ============================================================
(function initGuide() {
  document.querySelectorAll('.tool-guide-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const content = btn.nextElementSibling;
      if (!content) return;
      const isOpen = content.classList.contains('open');
      content.classList.toggle('open');
      // 箭头旋转
      const arrow = btn.querySelector('.guide-arrow');
      if (arrow) arrow.style.transform = isOpen ? 'rotate(0)' : 'rotate(180deg)';
    });
  });
})();

// ============================================================
// 12. Toast 通知（全局方法）
// ============================================================
function showToast(msg, duration = 2500) {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
}

// ============================================================
// 13. 工具卡片点击弹窗提示
// ============================================================
(function initToolCardClick() {
  document.querySelectorAll('.tool-card[data-url]').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.tool-guide-btn') || e.target.closest('.tool-guide-content')) return;
      const url = card.getAttribute('data-url');
      const name = card.querySelector('.tool-name')?.textContent || '该系统';
      showToast(`🔗 即将前往：${name}`);
      setTimeout(() => {
        if (url && url !== '#') window.open(url, '_blank');
      }, 800);
    });
  });
})();

// ============================================================
// 14. 弹窗 Modal（全局打开/关闭）
// ============================================================
function openModal(icon, title, text) {
  let mask = document.getElementById('global-modal');
  if (!mask) {
    mask = document.createElement('div');
    mask.id = 'global-modal';
    mask.className = 'modal-mask';
    mask.innerHTML = `
      <div class="modal-box">
        <span class="modal-close" id="modal-close">✕</span>
        <div class="modal-icon" id="modal-icon"></div>
        <div class="modal-title" id="modal-title"></div>
        <div class="modal-text" id="modal-text"></div>
      </div>`;
    document.body.appendChild(mask);
    mask.addEventListener('click', (e) => {
      if (e.target === mask) closeModal();
    });
    document.getElementById('modal-close').addEventListener('click', closeModal);
  }
  document.getElementById('modal-icon').textContent = icon;
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-text').textContent = text;
  mask.classList.add('show');
}
function closeModal() {
  const mask = document.getElementById('global-modal');
  if (mask) mask.classList.remove('show');
}
// ESC 关闭弹窗
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// ============================================================
// 15. 入口卡片错落入场（首页）
// ============================================================
(function initEntryCards() {
  const cards = document.querySelectorAll('.entry-card');
  if (!cards.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // 找到当前卡片的索引，设置延迟
          const idx = Array.from(cards).indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add('animated');
          }, idx * 130);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  cards.forEach(card => observer.observe(card));
})();

// ============================================================
// 16. 二级标签导航（life/study/activity 页内锚点）
//     确保所有页面均可复用
// ============================================================

// ============================================================
// 17. 综测加分数据标签 Tooltip（activity 页）
// ============================================================
(function initScoreTooltip() {
  document.querySelectorAll('[data-tip]').forEach(el => {
    const wrap = document.createElement('span');
    wrap.className = 'tooltip-wrap';
    el.parentNode.insertBefore(wrap, el);
    wrap.appendChild(el);
    const tip = document.createElement('span');
    tip.className = 'tooltip';
    tip.textContent = el.getAttribute('data-tip');
    wrap.appendChild(tip);
  });
})();

// ============================================================
// 18. 星级评分互动（study 页）
// ============================================================
(function initStarRating() {
  document.querySelectorAll('.star-rating').forEach(ratingEl => {
    const stars = ratingEl.querySelectorAll('.star');
    const initialRating = parseInt(ratingEl.getAttribute('data-rating') || '0');

    // 初始渲染
    const renderStars = (n) => {
      stars.forEach((s, i) => {
        s.classList.toggle('lit', i < n);
      });
    };
    renderStars(initialRating);

    // 悬浮预览
    stars.forEach((star, idx) => {
      star.addEventListener('mouseenter', () => renderStars(idx + 1));
      star.addEventListener('mouseleave', () => renderStars(
        parseInt(ratingEl.getAttribute('data-selected') || initialRating)
      ));
      star.addEventListener('click', () => {
        ratingEl.setAttribute('data-selected', String(idx + 1));
        renderStars(idx + 1);
        showToast(`⭐ 已评 ${idx + 1} 星，感谢反馈！`);
      });
    });
  });
})();

// ============================================================
// 19. 页面切换过渡（各页面跳转前淡出）
// ============================================================
(function initPageTransition() {
  document.querySelectorAll('a[href$=".html"]').forEach(link => {
    // 排除新标签、锚点、外部链接
    if (link.target === '_blank' || link.href.includes('#')) return;
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('//')) return;
      e.preventDefault();
      document.body.style.transition = 'opacity 0.35s ease';
      document.body.style.opacity = '0';
      setTimeout(() => { window.location.href = href; }, 360);
    });
  });
})();

// ============================================================
// 20. 浮动背景色彩渐变（首页 body 动态渐变 - 性能友好版）
// ============================================================
(function initBgGradient() {
  // 仅首页执行
  if (!document.querySelector('.hero-banner')) return;
  // 已由 CSS 实现静态渐变，JS 仅做微型色彩循环点缀
  let hue = 215;
  const tick = () => {
    hue = hue > 235 ? 215 : hue + 0.03;
    document.body.style.setProperty('--bg2', `hsl(${hue}, 68%, 95%)`);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
})();

// ============================================================
// 21. 鼠标光标轻量高亮跟随（首页可选，极轻量）
// ============================================================
(function initCursorGlow() {
  // 仅创建一个光圈 div，不影响性能
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9998;
    width: 300px; height: 300px; border-radius: 50%;
    background: radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.15s ease, top 0.15s ease;
    mix-blend-mode: screen;
  `;
  document.body.appendChild(glow);
  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
})();

// ============================================================
// 22. 全站统一：所有内容卡片滚动入场
// ============================================================
(function initCardReveal() {
  const cards = document.querySelectorAll('.card, .step-item, .club-card, .tool-card, .info-item, .alert-card');
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.animationDelay = (i % 6) * 0.08 + 's';
        entry.target.classList.add('scroll-reveal', 'in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });

  cards.forEach(card => {
    // 仅对尚未有 scroll-reveal 类的卡片添加
    if (!card.classList.contains('scroll-reveal')) {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    }
    observer.observe(card);
  });
})();
