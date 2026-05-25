/* Animações do visual de perfil — HTML/CSS estáticos, só JavaScript no navegador. */
document.addEventListener('DOMContentLoaded', function () {
	var mount = document.querySelector('[data-profile-visual]');
	if (!mount) return;

	var rings = mount.querySelectorAll('[data-ring]');
	var photo = mount.querySelector('[data-profile-photo]');
	var cards = mount.querySelectorAll('[data-profile-card]');
	var svg = mount.querySelector('.profile-visual__rings');

	if (!photo || !svg || rings.length === 0) return;

	var center = 180;
	var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	var ringState = [];
	var i;

	for (i = 0; i < rings.length; i++) {
		ringState.push({
			el: rings[i],
			speed: parseFloat(rings[i].getAttribute('data-speed')) || 0.2,
			angle: i * 40
		});
	}

	var cardState = [];
	for (i = 0; i < cards.length; i++) {
		cardState.push({
			el: cards[i],
			phase: parseFloat(cards[i].getAttribute('data-float-phase')) || 0
		});

		cards[i].addEventListener('mouseenter', function () {
			this.setAttribute('data-hovered', 'true');
		});
		cards[i].addEventListener('mouseleave', function () {
			this.removeAttribute('data-hovered');
		});
	}

	function easeOutCubic(t) {
		return 1 - Math.pow(1 - t, 3);
	}

	var startTime = null;
	var entranceMs = 900;

	function tick(timestamp) {
		if (startTime === null) startTime = timestamp;
		var elapsed = timestamp - startTime;
		var t = Math.min(elapsed / entranceMs, 1);
		var entrance = easeOutCubic(t);
		var timeSec = elapsed * 0.001;

		if (!reducedMotion) {
			for (i = 0; i < ringState.length; i++) {
				ringState[i].angle += ringState[i].speed;
				ringState[i].el.setAttribute(
					'transform',
					'rotate(' + ringState[i].angle + ' ' + center + ' ' + center + ')'
				);
			}

			var photoScale = 1 + Math.sin(timeSec * 0.5) * 0.012;
			var photoY = Math.sin(timeSec * 0.45) * 2;
			photo.style.transform =
				'translateY(' + photoY + 'px) scale(' + photoScale * (0.92 + entrance * 0.08) + ')';
			photo.style.opacity = String(0.3 + entrance * 0.7);

			for (i = 0; i < cardState.length; i++) {
				var state = cardState[i];
				var floatY = Math.sin(timeSec * 1.1 + state.phase) * 5;
				var hoverScale = state.el.getAttribute('data-hovered') === 'true' ? 1.06 : 1;
				var stagger = easeOutCubic(Math.min(Math.max((elapsed - i * 120) / entranceMs, 0), 1));
				var enterY = (1 - stagger) * 18;

				state.el.style.transform =
					'translateY(' + (floatY + enterY) + 'px) scale(' + hoverScale * (0.85 + stagger * 0.15) + ')';
				state.el.style.opacity = String(0.2 + stagger * 0.8);
			}

			svg.style.opacity = String(0.15 + entrance * 0.85);
			svg.style.transform = 'scale(' + (0.88 + entrance * 0.12) + ')';
		} else {
			photo.style.opacity = '1';
			photo.style.transform = 'none';
			for (i = 0; i < cardState.length; i++) {
				cardState[i].el.style.opacity = '1';
				cardState[i].el.style.transform = 'none';
			}
			svg.style.opacity = '1';
		}

		requestAnimationFrame(tick);
	}

	requestAnimationFrame(tick);
});
