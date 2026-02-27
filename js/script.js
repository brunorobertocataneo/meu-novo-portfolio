document.addEventListener('DOMContentLoaded', () => {
	const root = document.documentElement;
	const storedTheme = localStorage.getItem('theme');
	if (storedTheme === 'light' || storedTheme === 'dark') {
		root.setAttribute('data-theme', storedTheme);
	}

	const themeToggle = document.querySelector('[data-theme-toggle]');

	const updateThemeIcon = theme => {
		if (!themeToggle) return;
		const icon = themeToggle.querySelector('i');
		if (!icon) return;
		if (theme === 'light') {
			icon.classList.remove('fa-moon');
			icon.classList.add('fa-sun');
		} else {
			icon.classList.remove('fa-sun');
			icon.classList.add('fa-moon');
		}
	};

	if (themeToggle) {
		const current = root.getAttribute('data-theme') || 'dark';
		updateThemeIcon(current);

		themeToggle.addEventListener('click', () => {
			const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
			root.setAttribute('data-theme', next);
			localStorage.setItem('theme', next);
			updateThemeIcon(next);
		});
	}

	const subtitle = document.querySelector('[data-typing]');
	if (subtitle) {
		const text = subtitle.textContent.trim();
		subtitle.textContent = '';
		text.split('').forEach((letter, index) => {
			setTimeout(() => {
				subtitle.textContent += letter;
			}, 80 * index);
		});
	}

	const hamburger = document.querySelector('[data-toggle="nav"]');
	const nav = document.querySelector('[data-nav]');

	if (hamburger && nav) {
		hamburger.addEventListener('click', () => {
			const isOpen = nav.classList.toggle('is-open');
			hamburger.classList.toggle('is-open', isOpen);
			hamburger.setAttribute('aria-expanded', String(isOpen));
		});

		nav.querySelectorAll('a[href^="#"]').forEach(link => {
			link.addEventListener('click', () => {
				nav.classList.remove('is-open');
				hamburger.classList.remove('is-open');
				hamburger.setAttribute('aria-expanded', 'false');
			});
		});
	}

	document.querySelectorAll('a[href^="#"]').forEach(anchor => {
		anchor.addEventListener('click', event => {
			const href = anchor.getAttribute('href');
			if (!href || href === '#') return;

			const target = document.querySelector(href);
			if (!target) return;

			event.preventDefault();
			const navHeight = 70;
			const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

			window.scrollTo({
				top: targetTop,
				behavior: 'smooth',
			});
		});
	});

	document.querySelectorAll('[data-project-link]').forEach(card => {
		const href = card.getAttribute('data-project-link');
		if (!href) return;

		card.addEventListener('click', event => {
			const isAnchor = event.target.closest('a');
			if (isAnchor) return;
			window.open(href, '_blank');
		});
	});

	const hobbiesViewport = document.querySelector('.hobbies-viewport');
	const hobbiesTrack = document.querySelector('.hobbies-track');
	const hobbiesPrev = document.querySelector('.hobbies-control-prev');
	const hobbiesNext = document.querySelector('.hobbies-control-next');

	if (hobbiesViewport && hobbiesTrack && hobbiesPrev && hobbiesNext) {
		const cards = Array.from(hobbiesTrack.querySelectorAll('.hobby-card'));
		if (cards.length > 0) {
			const getStep = () => {
				if (cards.length < 2) return cards[0].getBoundingClientRect().width;
				const firstRect = cards[0].getBoundingClientRect();
				const secondRect = cards[1].getBoundingClientRect();
				return secondRect.left - firstRect.left;
			};

			let currentIndex = 0;
			let step = getStep();

			const goToIndex = index => {
				const total = cards.length;
				currentIndex = ((index % total) + total) % total;
				const targetLeft = currentIndex * step;
				hobbiesViewport.scrollTo({
					left: targetLeft,
					behavior: 'smooth',
				});
			};

			hobbiesNext.addEventListener('click', () => {
				goToIndex(currentIndex + 1);
			});

			hobbiesPrev.addEventListener('click', () => {
				goToIndex(currentIndex - 1);
			});

			window.addEventListener('resize', () => {
				step = getStep();
				goToIndex(currentIndex);
			});
		}
	}
});

