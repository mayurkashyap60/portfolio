import "../../styles/global.scss";
import { NavLink } from "react-router";

export default function Hero() {
  return (
    <>
      <section className="_profile">
        <div className="_profile_img">
          <img src="/images/mayur.jpg" alt="profile" className="_image" />
        </div>
        <div className="_content">
          <h1 className="_name">Mayur Kashyap</h1>
          <h2 className="_designation">Senior Software Engineer</h2>
          <p className="_description">
            I'm a Senior Software Engineer with strong expertise in Front-End
            Development and UI/UX Design in web technologies, building
            innovative digital experiences.
          </p>
        </div>
        <a href="/pdf/mayur_resume.pdf" target="_blank" className="_resume">
          Resume
        </a>
      </section>
      <section className="_about">
        <div className="_content">
          <h3 className="_heading">About me</h3>
          <p className="_text">
            My name is Mayur, a Senior Software Engineer and India-based
            freelance digital product developer. I think great code speaks a
            story - one that links technology to human experiences.
          </p>
          <p className="_text">
            With 7+ years of professional experience, I am an expert at
            designing scalable web applications, user-friendly interfaces, and
            contemporary digital products that address real-world problems. My
            work crosses strong UI/UX knowledge with extensive technical
            know-how to provide solutions that are both effective and
            interactive.
          </p>
          <p className="_text">
            I love turning concepts into clean, efficient, and high-performance
            products. Whether I'm designing user experiences or building
            intricate back-end logic, I believe in crafting effortless
            technology that people actually love.
          </p>
        </div>
      </section>
      <section className="_experience">
        <div className="_content">
          <h3 className="_heading">Experience</h3>
          <div className="_exp_boxes">
            <div className="_exp_box">
              <div className="_exp_icon">
                <img
                  src="/images/icons/game.png"
                  width="28"
                  className="img-fluid"
                  alt="icon"
                />
              </div>
              <div className="_exp_data">
                <h4 className="_exp_heading">Engineer</h4>
                <p className="_exp_text">
                  Sr. Software Engineer <span className="_dot">.</span> 2025 -
                  Present
                </p>
              </div>
            </div>
            <div className="_exp_box">
              <div className="_exp_icon">
                <img
                  src="/images/icons/game.png"
                  width="28"
                  className="img-fluid"
                  alt="icon"
                />
              </div>
              <div className="_exp_data">
                <h4 className="_exp_heading">Manager</h4>
                <p className="_exp_text">
                  UI/UX Developer <span className="_dot">.</span> 2022 - 2025
                </p>
              </div>
            </div>
            <div className="_exp_box">
              <div className="_exp_icon">
                <img
                  src="/images/icons/game.png"
                  width="28"
                  className="img-fluid"
                  alt="icon"
                />
              </div>
              <div className="_exp_data">
                <h4 className="_exp_heading">Developer</h4>
                <p className="_exp_text">
                  Web Developer <span className="_dot">.</span> 2020 - 2022
                </p>
              </div>
            </div>
            <div className="_exp_box">
              <div className="_exp_icon">
                <img
                  src="/images/icons/game.png"
                  width="28"
                  className="img-fluid"
                  alt="icon"
                />
              </div>
              <div className="_exp_data">
                <h4 className="_exp_heading">Developer</h4>
                <p className="_exp_text">
                  WordPress Developer <span className="_dot">.</span> 2019 -
                  2020
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="_skills">
        <div className="_content">
          <h3 className="_heading">Tech Stack & Expertise</h3>
          <div className="_icon_box">
            <div className="_box">
              <img src="/images/icons/1.png" className="_icon" alt="icon" />
              <h6 className="_heading">HTML</h6>
            </div>
            <div className="_box">
              <img src="/images/icons/2.png" className="_icon" alt="icon" />
              <h6 className="_heading">CSS</h6>
            </div>
            <div className="_box">
              <img src="/images/icons/3.png" className="_icon" alt="icon" />
              <h6 className="_heading">Javascript</h6>
            </div>
            <div className="_box">
              <img src="/images/icons/4.png" className="_icon" alt="icon" />
              <h6 className="_heading">React</h6>
            </div>
            <div className="_box">
              <img src="/images/icons/figma.png" className="_icon" alt="icon" />
              <h6 className="_heading">Figma</h6>
            </div>
            <div className="_box">
              <img src="/images/icons/5.png" className="_icon" alt="icon" />
              <h6 className="_heading">Node JS</h6>
            </div>
            <div className="_box">
              <img src="/images/icons/6.png" className="_icon" alt="icon" />
              <h6 className="_heading">MongoDB</h6>
            </div>
            <div className="_box">
              <img src="/images/icons/7.png" className="_icon" alt="icon" />
              <h6 className="_heading">Express JS</h6>
            </div>
            <div className="_box">
              <img src="/images/icons/8.png" className="_icon" alt="icon" />
              <h6 className="_heading">GraphQL</h6>
            </div>
          </div>
        </div>
      </section>
      <section className="_brands">
        <div className="_content">
          <h3 className="_heading">Brands</h3>
          <p className="_text">
            Worked with brands as contributing to the design, development, and
            implementation of digital solutions to enhance brand presence and
            user engagement.
          </p>
          <div className="_logos__marquee">
            <div className="_marquee__logos">
              <img
                src="/images/brands/1.png"
                width="175"
                loading="eager"
                alt="brands"
                className="intro-logos_logo"
              />
              <img
                src="/images/brands/2.png"
                width="175"
                loading="eager"
                alt="brands"
                className="intro-logos_logo"
              />
              <img
                src="/images/brands/3.png"
                width="175"
                loading="eager"
                alt="brands"
                className="intro-logos_logo"
              />
              <img
                src="/images/brands/4.png"
                width="175"
                loading="eager"
                alt="brands"
                className="intro-logos_logo"
              />
              <img
                src="/images/brands/5.png"
                width="175"
                loading="lazy"
                alt="brands"
                className="intro-logos_logo"
              />
              <img
                src="/images/brands/6.png"
                width="175"
                loading="eager"
                alt="brands"
                className="intro-logos_logo"
              />
              <img
                src="/images/brands/7.png"
                width="175"
                loading="eager"
                alt="brands"
                className="intro-logos_logo cc-pwc"
              />
              <img
                src="/images/brands/8.png"
                width="175"
                loading="lazy"
                alt="brands"
                className="intro-logos_logo"
              />
              <img
                src="/images/brands/9.png"
                width="175"
                loading="lazy"
                alt="brands"
                className="intro-logos_logo"
              />
              <img
                src="/images/brands/10.png"
                width="175"
                loading="eager"
                alt="brands"
                className="intro-logos_logo"
              />
              <img
                src="/images/brands/11.png"
                width="175"
                loading="eager"
                alt="brands"
                className="intro-logos_logo"
              />
              <img
                src="/images/brands/12.png"
                width="175"
                loading="eager"
                alt="brands"
                className="intro-logos_logo"
              />
              <img
                src="/images/brands/13.png"
                width="175"
                loading="eager"
                alt="brands"
                className="intro-logos_logo"
              />
              <img
                src="/images/brands/15.png"
                width="175"
                loading="eager"
                alt="brands"
                className="intro-logos_logo"
              />
              <img
                src="/images/brands/16.png"
                width="175"
                loading="eager"
                alt="brands"
                className="intro-logos_logo"
              />
              <img
                src="/images/brands/17.png"
                width="175"
                loading="eager"
                alt="brands"
                className="intro-logos_logo"
              />
              <img
                src="/images/brands/18.png"
                width="175"
                loading="eager"
                alt="brands"
                className="intro-logos_logo"
              />
              <img
                src="/images/brands/19.png"
                width="175"
                loading="eager"
                alt="brands"
                className="intro-logos_logo"
              />
              <img
                src="/images/brands/20.png"
                width="175"
                loading="eager"
                alt="brands"
                className="intro-logos_logo"
              />
              <img
                src="/images/brands/21.png"
                width="175"
                loading="eager"
                alt="brands"
                className="intro-logos_logo"
              />
            </div>
            <div className="_marquee__logos" aria-hidden="true">
              <img
                src="/images/brands/1.png"
                width="175"
                loading="eager"
                alt="brands"
                className="intro-logos_logo"
              />
              <img
                src="/images/brands/2.png"
                width="175"
                loading="eager"
                alt="brands"
                className="intro-logos_logo"
              />
              <img
                src="/images/brands/3.png"
                width="175"
                loading="eager"
                alt="brands"
                className="intro-logos_logo"
              />
              <img
                src="/images/brands/4.png"
                width="175"
                loading="eager"
                alt="brands"
                className="intro-logos_logo"
              />
              <img
                src="/images/brands/5.png"
                width="175"
                loading="lazy"
                alt="brands"
                className="intro-logos_logo"
              />
              <img
                src="/images/brands/6.png"
                width="175"
                loading="eager"
                alt="brands"
                className="intro-logos_logo"
              />
              <img
                src="/images/brands/7.png"
                width="175"
                loading="eager"
                alt="brands"
                className="intro-logos_logo cc-pwc"
              />
              <img
                src="/images/brands/8.png"
                width="175"
                loading="lazy"
                alt="brands"
                className="intro-logos_logo"
              />
              <img
                src="/images/brands/9.png"
                width="175"
                loading="lazy"
                alt="brands"
                className="intro-logos_logo"
              />
              <img
                src="/images/brands/10.png"
                width="175"
                loading="eager"
                alt="brands"
                className="intro-logos_logo"
              />
              <img
                src="/images/brands/11.png"
                width="175"
                loading="eager"
                alt="brands"
                className="intro-logos_logo"
              />
              <img
                src="/images/brands/12.png"
                width="175"
                loading="eager"
                alt="brands"
                className="intro-logos_logo"
              />
              <img
                src="/images/brands/13.png"
                width="175"
                loading="eager"
                alt="brands"
                className="intro-logos_logo"
              />
              <img
                src="/images/brands/15.png"
                width="175"
                loading="eager"
                alt="brands"
                className="intro-logos_logo"
              />
              <img
                src="/images/brands/16.png"
                width="175"
                loading="eager"
                alt="brands"
                className="intro-logos_logo"
              />
              <img
                src="/images/brands/17.png"
                width="175"
                loading="eager"
                alt="brands"
                className="intro-logos_logo"
              />
              <img
                src="/images/brands/18.png"
                width="175"
                loading="eager"
                alt="brands"
                className="intro-logos_logo"
              />
              <img
                src="/images/brands/19.png"
                width="175"
                loading="eager"
                alt="brands"
                className="intro-logos_logo"
              />
              <img
                src="/images/brands/20.png"
                width="175"
                loading="eager"
                alt="brands"
                className="intro-logos_logo"
              />
              <img
                src="/images/brands/21.png"
                width="175"
                loading="eager"
                alt="brands"
                className="intro-logos_logo"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
