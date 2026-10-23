import { useEffect, useId, useRef } from 'react';
import cleanDesktop from '@/assets/hero-network-clean-desktop-2026.webp';
import cleanMobile from '@/assets/hero-network-clean-mobile-2026.webp';

type Point = readonly [number, number];
type Network = {
  width: number;
  height: number;
  points: readonly Point[];
  walk: readonly number[];
  paintedLines: readonly string[];
  paintedPoints: readonly Point[];
  repair: string;
};

const networks: Record<'desktop' | 'mobile', Network> = {
  desktop: {
    width: 1672,
    height: 941,
    // One landing on each visible clinic roof, never in the gardens between.
    points: [
      [740, 655], // Lower-left clinic.
      [1190, 495], // Middle clinic.
      [1420, 623], // Foreground-right clinic.
      [1540, 386], // Upper-right clinic.
    ],
    walk: [0, 1, 3, 0, 2, 3],
    // Painted glows stay fixed in the source image even when landings move.
    paintedPoints: [[689, 647], [1056, 478], [1273, 634], [1480, 522]],
    paintedLines: [
      'M 1056 478 C 1086 447 1120 416 1150 400 S 1215 376 1250 377 S 1320 384 1350 400 S 1421 448 1450 482 L 1480 522',
      'M 1056 478 C 1140 385 1190 443 1273 634',
      'M 920 662 C 974 540 1050 428 1150 431 C 1240 428 1328 470 1375 536',
      'M 1480 522 C 1395 514 1328 562 1273 634',
      'M 1273 634 C 1170 566 1090 539 1000 542 S 851 546 800 580 S 719 619 689 647',
      'M 689 647 C 823 602 958 585 1056 478',
    ],
    repair: cleanDesktop,
  },
  mobile: {
    width: 941,
    height: 1672,
    points: [
      [255, 1048], // Bottom-left tiled clinic roof.
      [725, 821], // Foreground-right clinic.
      [310, 757], // Small middle-left clinic.
      [585, 618], // Middle clinic.
      [844, 468], // Upper-right clinic.
    ],
    walk: [0, 1, 2, 0, 3, 1, 4, 2, 3, 4],
    paintedPoints: [[453, 1056], [481, 1012], [200, 753], [470, 610], [803, 683], [733, 481]],
    paintedLines: [
      'M 733 481 Q 600 400 470 610',
      'M 470 610 C 590 514 731 558 803 683',
      'M 470 610 C 363 639 266 674 200 753',
      'M 200 753 C 293 632 401 635 470 663',
      'M 350 760 C 385 687 435 633 470 610',
      'M 481 1012 C 493 847 639 735 803 683',
      'M 453 1056 C 529 857 663 747 803 683',
    ],
    repair: cleanMobile,
  },
};

// Separate, upward-swooping hops read as energy handed from clinic to clinic,
// rather than a light orbiting the scene. Dot and revealed line share each arc.
function connectionArc(from: Point, to: Point) {
  const distance = Math.hypot(to[0] - from[0], to[1] - from[1]);
  const lift = Math.min(145, Math.max(18, distance * 0.25));
  return `M ${from.join(' ')} Q ${(from[0] + to[0]) / 2} ${Math.min(from[1], to[1]) - lift} ${to.join(' ')}`;
}

const fadeEase = (progress: number) => (1 - Math.cos(Math.PI * progress)) / 2;

function HeroConnections({ format, playing }: { format: 'desktop' | 'mobile'; playing: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const elapsedRef = useRef(0);
  const id = useId().replace(/:/g, '');
  const network = networks[format];
  // Cross-link the actual clinics, revisiting roof anchors via new branches.
  // Intersections belong to the lines; every landing belongs to a building.
  const links = network.walk.slice(0, -1).map((from, index) => {
    const to = network.walk[index + 1];
    return { from, to, arc: connectionArc(network.points[from], network.points[to]) };
  });

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const routes = [...svg.querySelectorAll<SVGPathElement>('.home-hero__route')];
    const glows = [...svg.querySelectorAll<SVGPathElement>('.home-hero__trail-glow')];
    const arrivals = [...svg.querySelectorAll<SVGCircleElement>('.home-hero__arrival')];
    const traveler = svg.querySelector<SVGGElement>('.home-hero__traveler');
    const ball = svg.querySelector<SVGGElement>('.home-hero__ball');
    if (!routes.length || !traveler) return;
    const lengths = routes.map((route) => route.getTotalLength());
    const endpoints = routes.map((route) => ({ from: Number(route.dataset.from), to: Number(route.dataset.to) }));
    const visibleFormat = window.matchMedia(format === 'mobile' ? '(max-width: 768px)' : '(min-width: 769px)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    // Quicker hops, with one constant arc-length speed for every connection.
    // No per-hop easing or duration clamps that accelerate the longer hops.
    const travelSpeed = (410 / 1.65) * 1.4;
    const durations = lengths.map((length) => length / travelSpeed);
    const forwardOrder = routes.map((_, index) => index);
    const backwardOrder = [...forwardOrder].reverse();
    const schedule = (order: number[], reversed = false) => {
      let cursor = 0;
      return order.map((index) => {
        const start = cursor;
        cursor += durations[index];
        const { from, to } = endpoints[index];
        return { index, start, end: cursor, from: reversed ? to : from, to: reversed ? from : to };
      });
    };
    const forward = schedule(forwardOrder);
    const backward = schedule(backwardOrder, true);
    const drawingDuration = durations.reduce((total, duration) => total + duration, 0);
    const holdDuration = 1;
    const dissolveDuration = 1.2;
    const passDuration = drawingDuration + holdDuration + dissolveDuration;
    let frameId = 0;
    let previousTime: number | null = null;

    function drawFrame(timestamp: number) {
      if (previousTime !== null) elapsedRef.current += Math.min(timestamp - previousTime, 80) / 1000;
      previousTime = timestamp;
      const pass = Math.floor(elapsedRef.current / passDuration);
      const local = elapsedRef.current % passDuration;
      const goingForward = pass % 2 === 0;
      const hops = goingForward ? forward : backward;
      const drawing = local < drawingDuration;
      const activeHop = drawing ? hops.findIndex((hop) => local < hop.end) : hops.length - 1;
      const hop = hops[activeHop];
      const progress = drawing ? Math.min(1, Math.max(0, (local - hop.start) / durations[hop.index])) : 1;
      const dissolve = Math.min(1, Math.max(0, (local - drawingDuration - holdDuration) / dissolveDuration));
      const opacity = 1 - fadeEase(dissolve);
      const point = routes[hop.index].getPointAtLength(lengths[hop.index] * (goingForward ? progress : 1 - progress));

      traveler!.setAttribute('transform', `translate(${point.x} ${point.y})`);
      traveler!.style.opacity = String(0.95 * opacity * Math.min(1, local / 0.16));
      // A quick impact/rebound changes only the ball's shape, never its center
      // or travel speed. It lands on the roof and immediately takes the next arc.
      const bounceAge = (drawing ? local - hop.start : local - drawingDuration) / 0.16;
      const bounce = bounceAge >= 0 && bounceAge < 1 ? Math.sin(Math.PI * bounceAge) * (1 - bounceAge) * 0.28 : 0;
      ball?.setAttribute('transform', `scale(${1 + bounce} ${1 - bounce * 0.65})`);
      svg!.dataset.direction = goingForward ? 'forward' : 'backward';
      svg!.dataset.pass = String(pass);
      svg!.dataset.routeIndex = String(hop.index);
      svg!.dataset.progress = String(progress);
      svg!.dataset.phase = drawing ? 'drawing' : dissolve > 0 ? 'dissolving' : 'linked';

      // Completed hops stay fully lit. Clear the whole network only after
      // reaching the far endpoint; the next pass then draws it in reverse.
      hops.forEach(({ index }, order) => {
        const revealed = order < activeHop || !drawing ? 1 : order === activeHop ? progress : 0;
        [routes[index], glows[index]].forEach((stroke) => {
          stroke.style.strokeDashoffset = String((goingForward ? 1 : -1) * (1 - revealed));
          stroke.style.opacity = revealed > 0 ? String(opacity) : '0';
        });
      });
      arrivals.forEach((pulse, index) => {
        let arrivedAt = hops[0].from === index ? 0 : -Infinity;
        hops.forEach((completed) => {
          if (completed.to === index && local >= completed.end) arrivedAt = completed.end;
        });
        const age = (local - arrivedAt) / 0.52;
        pulse.setAttribute('r', String(7 + Math.max(0, Math.min(1, age)) * 16));
        pulse.style.opacity = age >= 0 && age < 1 ? String((1 - age) * 0.65 * opacity) : '0';
      });
      frameId = window.requestAnimationFrame(drawFrame);
    }

    function syncPlayback() {
      window.cancelAnimationFrame(frameId);
      previousTime = null;
      if (playing && visibleFormat.matches && !reducedMotion.matches) {
        frameId = window.requestAnimationFrame(drawFrame);
      }
    }
    syncPlayback();
    visibleFormat.addEventListener('change', syncPlayback);
    reducedMotion.addEventListener('change', syncPlayback);
    return () => {
      window.cancelAnimationFrame(frameId);
      visibleFormat.removeEventListener('change', syncPlayback);
      reducedMotion.removeEventListener('change', syncPlayback);
    };
  }, [format, playing]);

  return (
    <svg ref={svgRef} viewBox={`0 0 ${network.width} ${network.height}`} preserveAspectRatio="xMidYMid slice"
      className={`home-hero__connections home-hero__connections--${format}`} aria-hidden="true" focusable="false">
      <defs>
        <filter id={`${id}-feather`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <mask id={`${id}-repair`} maskUnits="userSpaceOnUse" x="0" y="0" width={network.width} height={network.height}>
          <g filter={`url(#${id}-feather)`} fill="white" stroke="white" strokeWidth="38" strokeLinecap="round">
            {network.paintedLines.map((path) => <path key={path} d={path} fill="none" />)}
            {network.paintedPoints.map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="8" />)}
          </g>
        </mask>
      </defs>
      {/* Repair only painted connectors, never replace the original whole scene. */}
      <image className="home-hero__line-repair" href={network.repair} width={network.width} height={network.height}
        preserveAspectRatio="none" mask={`url(#${id}-repair)`} />
      {links.map(({ from, to, arc }, index) => (
        <g key={`${from}-${to}`} className="home-hero__trail" data-link={index}>
          <path className="home-hero__trail-glow" d={arc} pathLength="1" />
          <path className="home-hero__route home-hero__trail-core" d={arc} pathLength="1" data-from={from} data-to={to} />
        </g>
      ))}
      {network.points.map(([cx, cy], index) => (
        <g key={`${cx}-${cy}`} className="home-hero__point" data-point={index}>
          <circle cx={cx} cy={cy} r="7" className="home-hero__arrival" />
          <circle cx={cx} cy={cy} r="10" className="home-hero__point-glow" />
          <circle cx={cx} cy={cy} r="3.6" className="home-hero__point-core" />
        </g>
      ))}
      <g className="home-hero__traveler">
        <g className="home-hero__ball">
          <circle r="14" fill="#8bd7ff" opacity="0.16" />
          <circle r="8" fill="#b9ebff" opacity="0.3" />
          <circle r="4.2" fill="#f5fdff" />
        </g>
      </g>
    </svg>
  );
}

export default HeroConnections;
