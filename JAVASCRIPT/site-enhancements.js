(() => {
    const logoPath = '../assets/images/Codex Image 3 Sept 2026, 11_12_04.png';
    const preloader = document.createElement('div');
    preloader.className = 'site-preloader';
    preloader.setAttribute('role', 'status');
    preloader.setAttribute('aria-label', 'Loading FoodieCart');

    const logo = document.createElement('img');
    logo.src = logoPath;
    logo.alt = '';
    preloader.append(logo);
    document.body.prepend(preloader);

    const finishLoading = () => {
        preloader.classList.add('is-hidden');
        window.setTimeout(() => preloader.remove(), 450);
    };

    window.addEventListener('load', finishLoading, { once: true });
    window.setTimeout(finishLoading, 1400);

    const revealTargets = document.querySelectorAll(
        '.hero, .categories, .tabbed, .masterpiece, .fromblog, .page-content > section, ' +
        '.delivery-section, .location-section, footer, .page, .hero-slideshow, #container, ' +
        '.agreement-shell, .agreement-content'
    );

    if ('IntersectionObserver' in window) {
        document.documentElement.classList.add('has-motion');
        const observer = new IntersectionObserver((entries, currentObserver) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    currentObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });

        revealTargets.forEach((target) => {
            target.classList.add('reveal-on-scroll');
            observer.observe(target);
        });
    }

    const searchForm = document.querySelector('header form.search');
    const searchInput = searchForm?.querySelector('input[type="search"]');
    const productSection = document.querySelector('.tabbed-item');
    const productCards = productSection
        ? Array.from(productSection.querySelectorAll('.products > .item > ul > li'))
        : [];

    if (!searchForm || !searchInput) return;

    searchForm.setAttribute('role', 'search');
    searchInput.setAttribute('aria-label', 'Search food products');
    searchInput.placeholder = 'Search dishes, ingredients, or categories...';

    const resultsStatus = productSection
        ? document.createElement('p')
        : null;

    if (resultsStatus) {
        resultsStatus.className = 'search-results-status';
        resultsStatus.setAttribute('aria-live', 'polite');
        productSection.before(resultsStatus);

        const suggestions = document.createElement('datalist');
        suggestions.id = 'food-product-suggestions';
        const names = new Set();
        productCards.forEach((card) => {
            const title = card.querySelector('.meta h2')?.textContent?.trim();
            if (title && !names.has(title.toLowerCase())) {
                names.add(title.toLowerCase());
                const option = document.createElement('option');
                option.value = title;
                suggestions.append(option);
            }
        });
        searchForm.append(suggestions);
        searchInput.setAttribute('list', suggestions.id);
    }

    const normalize = (value) => value.toLocaleLowerCase().normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();

    const isNearMatch = (term, word) => {
        if (word.includes(term) || term.includes(word)) return true;
        if (Math.abs(term.length - word.length) > 1 || term.length < 5 || word.length < 5) return false;

        let differences = 0;
        let left = 0;
        let right = 0;
        while (left < term.length && right < word.length) {
            if (term[left] === word[right]) {
                left += 1;
                right += 1;
            } else {
                differences += 1;
                if (differences > 1) return false;
                if (term.length > word.length) left += 1;
                else if (word.length > term.length) right += 1;
                else {
                    left += 1;
                    right += 1;
                }
            }
        }
        return differences + (left < term.length || right < word.length ? 1 : 0) <= 1;
    };

    const filterProducts = (rawQuery) => {
        if (!productSection || !resultsStatus) return false;
        const query = normalize(rawQuery);
        const terms = query.split(/\s+/).filter(Boolean);

        productSection.classList.toggle('is-searching', terms.length > 0);
        productSection.closest('.tabbed')?.classList.toggle('is-searching', terms.length > 0);
        let matches = 0;
        productCards.forEach((card) => {
            const title = card.querySelector('.meta h2')?.textContent || '';
            const category = card.querySelector('.meta .cat')?.textContent || '';
            const imageAlt = card.querySelector('img')?.alt || '';
            const searchableWords = normalize(`${title} ${category} ${imageAlt}`).split(/\s+/);
            const matchesQuery = terms.every((term) =>
                searchableWords.some((word) => isNearMatch(term, word))
            );
            card.hidden = !matchesQuery;
            if (matchesQuery) matches += 1;
        });

        resultsStatus.hidden = terms.length === 0;
        resultsStatus.textContent = matches
            ? `${matches} ${matches === 1 ? 'product' : 'products'} found`
            : 'No products found. Try another dish or category.';
        return true;
    };

    searchInput.addEventListener('input', () => filterProducts(searchInput.value));
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!filterProducts(searchInput.value)) {
            window.location.href = `Menu.html?q=${encodeURIComponent(searchInput.value.trim())}`;
        }
    });

    const query = new URLSearchParams(window.location.search).get('q');
    if (query) {
        searchInput.value = query;
        filterProducts(query);
        document.querySelector('.site')?.classList.add('showsearch');
    }
})();
