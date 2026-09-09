	const header = document.getElementById('header');
	const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
	onScroll();
	addEventListener('scroll', onScroll, {passive:true});

	const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
	const smooth = reduced ? 'auto' : 'smooth';

	// Horizontal rails: highlight cards + app screens
	const initRail = (track, btns) => {
		if (!track || btns.length < 2) return;
		const step = () => {
			const item = track.firstElementChild;
			const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
			return item.getBoundingClientRect().width + gap;
		};
		btns.forEach(btn => btn.addEventListener('click', () => {
			track.scrollBy({left: step() * Number(btn.dataset.dir), behavior: smooth});
		}));
		const sync = () => {
			const max = track.scrollWidth - track.clientWidth;
			btns[0].disabled = track.scrollLeft <= 1;
			btns[1].disabled = track.scrollLeft >= max - 1;
		};
		sync();
		track.addEventListener('scroll', sync, {passive:true});
		addEventListener('resize', sync);
	};

	initRail(document.getElementById('hlTrack'), document.querySelectorAll('.hl-btn'));
	initRail(document.getElementById('apRail'), document.querySelectorAll('.ap-btn'));

	// Scroll reveal
	const revealables = document.querySelectorAll('.reveal');
	if (reduced) {
		revealables.forEach(el => el.classList.add('in'));
	} else {
		const io = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (!entry.isIntersecting) return;
				const group = [...entry.target.parentElement.children].indexOf(entry.target);
				entry.target.style.transitionDelay = Math.min(group, 3) * 90 + 'ms';
				entry.target.classList.add('in');
				io.unobserve(entry.target);
			});
		}, {rootMargin: '0px 0px -12% 0px', threshold: .15});
		revealables.forEach(el => io.observe(el));
	}
