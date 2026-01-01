import gsap from "gsap";

export function initMagneticButtons() {
  const magnets = document.querySelectorAll<HTMLElement>(".magnetic");
  const strength = 90;

  magnets.forEach((magnet) => {
    const handleMouseMove = (event: MouseEvent) => {
      const bounding = magnet.getBoundingClientRect();

      gsap.to(magnet, {
        x:
          ((event.clientX - bounding.left) / magnet.offsetWidth - 0.5) *
          strength,
        y:
          ((event.clientY - bounding.top) / magnet.offsetHeight - 0.5) *
          strength,
        ease: "power4.out",
        duration: 1,
      });
    };

    const handleMouseOut = () => {
      gsap.to(magnet, {
        x: 0,
        y: 0,
        ease: "power4.out",
        duration: 1,
      });
    };

    magnet.addEventListener("mousemove", handleMouseMove);
    magnet.addEventListener("mouseleave", handleMouseOut);
  });
}
