const finePointer = window.matchMedia("(pointer: fine)").matches;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (finePointer && !reduceMotion) {
  const cursor = document.querySelector(".cursor");
  const letters = [...document.querySelectorAll(".hero-title span")];
  const orbs = [...document.querySelectorAll(".orb")];
  let lastTrail = 0;

  window.addEventListener("pointermove", (event) => {
    const { clientX: x, clientY: y } = event;
    cursor.style.left = `${x}px`;
    cursor.style.top = `${y}px`;

    letters.forEach((letter) => {
      const rect = letter.getBoundingClientRect();
      const dx = x - (rect.left + rect.width / 2);
      const dy = y - (rect.top + rect.height / 2);
      const distance = Math.max(Math.hypot(dx, dy), 1);
      const pull = Math.max(0, 1 - distance / 360);
      letter.style.setProperty("--tx", `${dx * pull * 0.09}px`);
      letter.style.setProperty("--ty", `${dy * pull * 0.12}px`);
      letter.style.setProperty("--rot", `${dx * pull * 0.018}deg`);
    });

    const nx = x / innerWidth - .5;
    const ny = y / innerHeight - .5;
    orbs.forEach((orb, index) => {
      const direction = index ? -1 : 1;
      orb.style.setProperty("--mx", `${nx * 90 * direction}px`);
      orb.style.setProperty("--my", `${ny * 70 * direction}px`);
    });

    if (event.timeStamp - lastTrail > 45 && y < innerHeight) {
      const dot = document.createElement("i");
      dot.className = "trail-dot";
      dot.style.left = `${x - 3}px`;
      dot.style.top = `${y - 3}px`;
      document.body.append(dot);
      dot.addEventListener("animationend", () => dot.remove());
      lastTrail = event.timeStamp;
    }
  });

  document.querySelectorAll("a").forEach((link) => {
    link.addEventListener("pointerenter", () => cursor.classList.add("active"));
    link.addEventListener("pointerleave", () => cursor.classList.remove("active"));
  });

  document.querySelector(".hero").addEventListener("pointerleave", () => {
    letters.forEach((letter) => {
      letter.style.setProperty("--tx", "0px");
      letter.style.setProperty("--ty", "0px");
      letter.style.setProperty("--rot", "0deg");
    });
  });
}
