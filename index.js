const header = document.getElementById('header');
const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
onScroll();
addEventListener('scroll', onScroll, {passive:true});

// Highlights slider
const track = document.getElementById('hlTrack');
const hlBtns = document.querySelectorAll('.hl-btn');
const step = () => {
	const card = track.querySelector('.card');
	const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
	return card.getBoundingClientRect().width + gap;
};
const smooth = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
hlBtns.forEach(btn => btn.addEventListener('click', () => {
	track.scrollBy({left: step() * Number(btn.dataset.dir), behavior: smooth});
}));
const syncBtns = () => {
	const max = track.scrollWidth - track.clientWidth;
	hlBtns[0].disabled = track.scrollLeft <= 1;
	hlBtns[1].disabled = track.scrollLeft >= max - 1;
};
syncBtns();
track.addEventListener('scroll', syncBtns, {passive:true});
addEventListener('resize', syncBtns);

// Scroll reveal
const revealables = document.querySelectorAll('.reveal');
if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
