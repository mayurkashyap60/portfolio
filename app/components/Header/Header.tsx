import "../../styles/header.scss";

export default function Header() {
  return (
    <header>
      <nav>
        <div className="_navbar_wrapper">
          <div className="_logo">
            <img
              src="/images/MK-Logo-Text-w.png"
              width="124"
              className="img-fluid"
              alt="logo"
            />
          </div>

          <div className="_socials">
            <ul className="_social">
              <li>
                <a
                  title="Github"
                  href="https://github.com/mayurkashyap60"
                  className="platform"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/images/icons/github.png"
                    width="24"
                    className="img-fluid"
                    alt="github"
                  />
                </a>
              </li>
              <li>
                <a
                  title="Linkedin"
                  href="https://www.linkedin.com/in/mayur-kashyap"
                  className="platform"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/images/icons/linkedin.png"
                    width="24"
                    className="img-fluid"
                    alt="linkedin"
                  />
                </a>
              </li>
              <li>
                <a
                  title="Email"
                  href="mailto:mayurkashyap60@gmail.com"
                  className="platform"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/images/icons/email.png"
                    width="24"
                    className="img-fluid"
                    alt="email"
                  />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
