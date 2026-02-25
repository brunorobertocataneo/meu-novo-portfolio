document.addEventListener('DOMContentLoaded', () => {
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
});

