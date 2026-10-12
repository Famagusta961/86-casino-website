import Image from "next/image";

export function PitCoreRecognition({
  placement,
}: {
  placement: "footer" | "about";
}) {
  const headingId = `pitcore-${placement}-heading`;
  return (
    <section
      className={`pitcore-recognition pitcore-${placement}`}
      aria-labelledby={headingId}
    >
      <a
        className="pitcore-logo"
        href="https://www.pitcore.io"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit PitCore (opens in a new tab)"
      >
        <Image
          src="/brand/pitcore-logo.svg"
          alt="PitCore — Casino Management System"
          width={981}
          height={760}
        />
      </a>
      <div className="pitcore-copy">
        <h2 id={headingId}>86 Casino uses PitCore</h2>
        <p>Supporting our casino’s daily operations.</p>
        <a
          className="pitcore-website"
          href="https://www.pitcore.io"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit www.pitcore.io (opens in a new tab)"
        >
          Visit www.pitcore.io <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}
