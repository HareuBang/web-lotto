// index
const cards = Array.from(document.querySelectorAll(".card")).reverse();
const bottomCard = cards.at(-1);
const movableCards = cards.slice(0, -1);

let stack = [...movableCards];
let upCards = [];
let isAnimation = false;

// IntersectionObserver
const credits = document.querySelector("#credits");
let creditsFullVisible = false;

if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        creditsFullVisible = entry.intersectionRatio >= 0.99;
      });
    },
    {
      root: null,
      threshold: [0, 0.5, 0.99, 1],
    }
  );

  io.observe(credits);
} else {
  const fallbackCheck = () => {
    const rect = credits.getBoundingClientRect();
    const windowInnerHeight = window.innerHeight;
    creditsFullVisible =
      rect.top >= -0.01 * windowInnerHeight &&
      rect.bottom <= 1.01 * windowInnerHeight;
  };

  fallbackCheck();
  window.addEventListener("resize", fallbackCheck);
  window.addEventListener("scroll", fallbackCheck, { passive: true });
}

const popCard = () => {
  if (stack.length === 0) return;

  isAnimation = true;

  const card = stack[0];
  upCards.unshift(card);

  card.style.transition =
    "transform 0.55s cubic-bezier(.25,.8,.25,1), opacity 0.45s ease";
  card.style.transform = "translateY(-120%) rotate(-8deg)";
  card.style.opacity = "0";

  stack.shift();

  setTimeout(() => {
    isAnimation = false;
  }, 550);
};

const pushCard = () => {
  if (upCards.length === 0) return;

  isAnimation = true;

  const card = upCards.shift();

  card.style.transition =
    "transform 0.55s cubic-bezier(.25,.8,.25,1), opacity 0.45s ease";
  card.style.transform = "";
  card.style.opacity = "1";

  stack.unshift(card);

  setTimeout(() => {
    isAnimation = false;
  }, 550);
};

// wheel
window.addEventListener(
  "wheel",
  (event) => {
    if (isAnimation) return;

    if (!creditsFullVisible) {
      return;
    }

    if (event.deltaY > 0) {
      if (stack.length > 0) {
        event.preventDefault();

        popCard();
        return;
      }
    }

    if (event.deltaY < 0) {
      if (upCards.length > 0) {
        event.preventDefault();

        pushCard();
        return;
      }
    }
  },
  { passive: false }
);
