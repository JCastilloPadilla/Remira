import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./correspondence-journey.css";

gsap.registerPlugin(useGSAP, MotionPathPlugin, ScrollTrigger);

const letters = [0, 1, 2, 3];

export function CorrespondenceJourney() {
  const layerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const layer = layerRef.current;
    const page = layer?.closest<HTMLElement>(".landing-page");
    if (!layer || !page) return;

    const media = gsap.matchMedia();
    media.add({
      wide: "(min-width: 768px)",
      compact: "(max-width: 767px)",
      reduced: "(prefers-reduced-motion: reduce)",
    }, ({ conditions }) => {
      if (conditions?.reduced) return;
      const compact = Boolean(conditions?.compact);
      const plane = layer.querySelector<HTMLElement>(".journey-plane");
      const envelopes = gsap.utils.toArray<HTMLElement>(".journey-envelope", layer);
      const hero = page.querySelector<HTMLElement>(".landing-hero-art");
      const scene = page.querySelector<HTMLElement>(".landing-footer-scene");
      if (!plane || !hero || !scene) return;

      let animation: gsap.Context | undefined;
      let frame = 0;
      let previousSize = "";
      let entered = false;

      const build = () => {
        animation?.revert();
        animation = gsap.context(() => {
          const width = page.clientWidth;
          const top = page.getBoundingClientRect().top;
          const heroRect = hero.getBoundingClientRect();
          const sceneRect = scene.getBoundingClientRect();
          const heroBottom = heroRect.bottom - top;
          const sceneTop = sceneRect.top - top;
          const footerImage = scene.querySelector("img")!;
          const artRect = footerImage.getBoundingClientRect();
          const artHeight = artRect.height;
          const artTop = artRect.top - top;
          const contentWidth = page.querySelector(".landing-process")!.clientWidth;
          const gutter = (width - contentWidth) / 2;
          const rail = Math.max(12, gutter / 2);
          const planeSize = Math.min(90, Math.max(24, gutter * 0.7));
          const envelopeSize = Math.min(60, Math.max(20, gutter * 0.44));
          const start = heroBottom - heroRect.height * 0.25;
          const finish = artTop + artHeight * 0.58;
          const right = width - rail;
          const distance = sceneTop - heroBottom;
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: page,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.6,
            },
          });

          gsap.set(plane, {
            width: planeSize, x: width * 0.87, y: start,
            xPercent: -50, yPercent: -50, autoAlpha: 0,
          });
          timeline.to(plane, {
            duration: 1,
            ease: "none",
            motionPath: {
              path: [
                { x: width * 0.87, y: start },
                { x: right, y: heroBottom + 50 },
                { x: right - rail * 0.16, y: heroBottom + distance * 0.3 },
                { x: right + rail * 0.12, y: heroBottom + distance * 0.6 },
                { x: right, y: sceneTop + 30 },
                { x: width * 0.82, y: finish },
              ],
              curviness: 0.8,
              autoRotate: true,
            },
          }, 0);
          timeline.to(plane, { autoAlpha: 1, duration: 0.05 }, 0.015);

          envelopes.forEach((envelope, index) => {
            if (compact && index > 1) {
              gsap.set(envelope, { autoAlpha: 0 });
              return;
            }
            const left = index % 2 === 0;
            const side = left ? rail : right;
            const offset = index * 34;
            const endX = width * [0.22, 0.7, 0.35, 0.9][index];
            gsap.set(envelope, {
              width: envelopeSize * (index > 1 ? 0.8 : 1),
              x: width * (left ? 0.12 : 0.9),
              y: start + offset,
              xPercent: -50,
              yPercent: -50,
              autoAlpha: 1,
            });
            timeline.to(envelope, {
              duration: 1,
              ease: "none",
              rotation: left ? 24 : -20,
              motionPath: {
                path: [
                  { x: width * (left ? 0.12 : 0.9), y: start + offset },
                  { x: side, y: heroBottom + 90 + offset },
                  { x: side + (left ? 1 : -1) * rail * 0.2, y: heroBottom + distance * 0.4 + offset },
                  { x: side, y: heroBottom + distance * 0.75 + offset },
                  { x: side, y: sceneTop + 60 + offset },
                  { x: endX, y: artTop + artHeight * (0.75 + index * 0.045) },
                ],
                curviness: 0.6,
              },
            }, 0);

            const image = envelope.querySelector("img");
            if (!entered) {
              gsap.fromTo(image, { y: -65, rotation: left ? -16 : 16, autoAlpha: 0 }, {
                y: 0, rotation: 0, autoAlpha: 1, duration: 1.8,
                delay: 0.35 + index * 0.2, ease: "power2.out",
              });
            } else {
              gsap.set(image, { y: 0, rotation: 0, autoAlpha: 1 });
            }
          });
          entered = true;
          ScrollTrigger.refresh();
        }, layer);
      };

      const observer = new ResizeObserver(() => {
        const size = `${page.clientWidth}:${page.clientHeight}`;
        if (size === previousSize) return;
        previousSize = size;
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(build);
      });
      observer.observe(page);
      return () => {
        observer.disconnect();
        cancelAnimationFrame(frame);
        animation?.revert();
      };
    });
    return () => media.revert();
  }, { scope: layerRef });

  return (
    <div ref={layerRef} className="correspondence-journey" aria-hidden="true">
      <div className="journey-plane">
        <img src="/illustrations/journey-plane-v1.webp" alt="" width={360} height={157} />
      </div>
      {letters.map((letter) => (
        <div key={letter} className="journey-envelope">
          <img src="/illustrations/journey-envelope-v1.webp" alt="" width={240} height={128} />
        </div>
      ))}
    </div>
  );
}
