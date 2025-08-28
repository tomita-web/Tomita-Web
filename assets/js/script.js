// ハンバーガーメニュー（ドロワーメニュー）制御

document.addEventListener('DOMContentLoaded', () => {
  const drawerIcon    = document.getElementById('js-drawer-icon');
  const drawerContent = document.getElementById('js-drawer-content');
  const drawerLinks   = drawerContent.querySelectorAll('a[href]');
  let scrollY = 0;

  const openDrawer = () => {
    drawerIcon.classList.add('active');
    drawerContent.classList.add('active');

    // 背景スクロール固定（位置ずれ無し）
    scrollY = window.scrollY || window.pageYOffset;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
  };

  const closeDrawer = () => {
    drawerIcon.classList.remove('active');
    drawerContent.classList.remove('active');

    // スクロール固定解除（元の位置に戻す）
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollY);
  };

  const toggleDrawer = () => {
    if (drawerContent.classList.contains('active')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  };

  // ハンバーガー操作
  drawerIcon.addEventListener('click', (e) => {
    e.stopPropagation(); // ドキュメントへの伝播を防止
    toggleDrawer();
  });

  // 外側クリックで閉じる
  document.addEventListener('click', (e) => {
    // 開いていて、かつアイコン/中身の外をクリックしたら閉じる
    if (drawerContent.classList.contains('active') &&
        !drawerContent.contains(e.target) &&
        !drawerIcon.contains(e.target)) {
      closeDrawer();
    }
  });

  // Escキーで閉じる（アクセシビリティ向上）
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawerContent.classList.contains('active')) {
      closeDrawer();
    }
  });

  // メニュー内リンクを押したら必ず閉じる
  drawerLinks.forEach((a) => {
    a.addEventListener('click', () => {
      // アンカー(#news など)でも一旦閉じてからスクロールへ
      closeDrawer();
    }, { passive: true });
  });

  // ドロワー内のスクロールは許可、背景は不可にしたい時の保険
  drawerContent.addEventListener('wheel', (e) => e.stopPropagation(), { passive: true });
  drawerContent.addEventListener('touchmove', (e) => e.stopPropagation(), { passive: true });
});

// ヘッダーの透明化とスクロール制御
document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const hero = document.getElementById('hero');

    // ヘッダーの高さ分だけ判定を前倒し：ヒーローが見え終わる直前に切替
    const headerH = header.offsetHeight;
    const io = new IntersectionObserver(([entry]) => {
      // ヒーローがビューポート内に「交差している間」は over-hero クラスを付与
      header.classList.toggle('header--over-hero', entry.isIntersecting);
    }, {
      root: null,
      threshold: 0,
      rootMargin: `-${headerH}px 0px 0px 0px`
    });

    io.observe(hero);

    // 可変ヘッダーの場合に備えて高さをCSS変数に反映（任意）
    document.documentElement.style.setProperty('--header-h', `${headerH}px`);
  });

// パララックス効果 parallaxセクション
document.addEventListener('DOMContentLoaded', () => {
  const section = document.querySelector('.parallax');
  const bg = document.querySelector('.parallax__bg');
  if (!section || !bg) return;

  const speed = 0.25; // 動きの強さ（0.15〜0.4くらいで調整）

  const update = () => {
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;

    // 画面外のときは何もしない（無駄な再描画を防止）
    if (rect.bottom < 0 || rect.top > vh) return;

    // セクションの「ビューポート中心からのずれ量」を基準にする
    // → セクションが画面の中央に来たとき 0px（自然な開始位置）
    const deltaFromCenter = rect.top + rect.height / 2 - vh / 2;

    // 背景を遅らせて動かす（負方向に動かしたければ -speed に）
    bg.style.transform = `translateY(${deltaFromCenter * -speed}px)`;
  };

  // 初期反映
  update();

  // スクロール/リサイズで更新（パフォーマンス配慮でrAF）
  let ticking = false;
  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        update();
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
});