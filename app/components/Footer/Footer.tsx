import { useEffect } from "react";
import { initMagneticButtons } from "~/utils/magnetic.client";
import "../../styles/footer.scss";

export default function Footer() {
  const greeting = "Hii";

  useEffect(() => {
    initMagneticButtons();
  }, []);

  return (
    <footer className="_footer">
      <div className="_content">
        <h4 className="_heading">We could brainstorm a story together.</h4>
        <p className="_text">
          You heard from me, now I'd love to hear from you! Smack that button to
          fill shoot an email on over to mayurkashyap60@gmail.com
        </p>
        <a
          href="mailto:mayurkashyap60@gmail.com"
          className="_cta magnetic"
          rel="noopener noreferrer"
        >
          Say, {greeting}
        </a>
      </div>
      <div className="_copyright">
        <p className="_ctext">
          Loosely designed in
          <a
            href="https://www.figma.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Figma
          </a>
          and coded in
          <a
            href="https://code.visualstudio.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visual Studio Code
          </a>
          by yours truly. <br /> Built with HTML5 and CSS3, deployed with
          <a
            href="https://vercel.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vercel
          </a>
          . All text is set in the
          <a
            href="https://fonts.google.com/specimen/Manrope"
            target="_blank"
            rel="noopener noreferrer"
          >
            Manrope
          </a>
          and
          <a
            href="https://fonts.google.com/specimen/Space+Grotesk"
            target="_blank"
            rel="noopener noreferrer"
          >
            SpaceGrotesk
          </a>
          typeface.
        </p>
      </div>
    </footer>
  );
}
