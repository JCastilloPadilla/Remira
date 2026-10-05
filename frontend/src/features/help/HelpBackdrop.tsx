export function HelpBackdrop() {
  return (
    <div className="help-backdrop" aria-hidden="true">
      <img className="help-background-garden" src="/illustrations/guide-garden-v1.webp" alt="" width={600} height={900} loading="lazy" />
      {[1, 2, 3, 4, 5].map((number) => (
        <img key={number} className={`help-background-envelope help-background-envelope--${number}`} src="/illustrations/journey-envelope-v1.webp" alt="" width={240} height={128} loading="lazy" />
      ))}
      {[1, 2].map((number) => (
        <div key={number} className={`help-flight help-flight--${number}`}>
          <svg viewBox="0 0 180 700" fill="none" preserveAspectRatio="none">
            <path d="M 90 10 C 160 90 25 100 45 180 C 70 280 170 190 110 150 C 30 95 0 320 70 400 C 160 480 25 550 90 690" vectorEffect="non-scaling-stroke" />
          </svg>
          <img src="/illustrations/journey-plane-v1.webp" alt="" width={360} height={157} loading="lazy" />
        </div>
      ))}
    </div>
  );
}
