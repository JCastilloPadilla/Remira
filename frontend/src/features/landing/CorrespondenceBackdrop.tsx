import "./correspondence-backdrop.css";

const envelopes = [0, 1, 2, 3, 4, 5];

export function CorrespondenceBackdrop() {
  return (
    <div className="correspondence-backdrop" aria-hidden="true">
      {["right", "left"].map((side) => (
        <div key={side} className={`backdrop-flight backdrop-flight--${side}`}>
          <svg viewBox="0 0 140 600" preserveAspectRatio="none" fill="none">
            <path
              d="M 70 8 C 15 72 135 106 112 180 C 95 237 15 202 28 158 C 53 92 136 283 111 400 C 87 489 29 460 49 515 C 55 543 94 561 70 590"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <img className="backdrop-plane" src="/illustrations/journey-plane-v1.webp" alt="" width={360} height={157} />
        </div>
      ))}
      {envelopes.map((envelope) => (
        <img
          key={envelope}
          className={`backdrop-envelope backdrop-envelope--${envelope + 1}`}
          src="/illustrations/journey-envelope-v1.webp"
          alt=""
          width={240}
          height={128}
        />
      ))}
    </div>
  );
}
