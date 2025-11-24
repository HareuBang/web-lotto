let purchaseLottosInput = [];
let winningNumbers = [];

const createRandomLotto = () => {
  const numbers = new Set();
  while (numbers.size < 6) {
    numbers.add(Math.floor(Math.random() * 45) + 1);
  }
  return [...numbers].sort((a, b) => a - b);
};

const publishLottos = (amount) => {
  const price = 1000;
  const count = Math.floor(amount / price);

  const lottos = [];
  for (let i = 0; i < count; i++) {
    lottos.push(createRandomLotto());
  }
  return lottos;
};

const submitPurchaseAmount = (amount) => {
  if (amount < 1000) {
    alert("1000원 이상 입력해주세요!");
    return;
  }

  purchaseLottosInput = publishLottos(amount);

  transitionToChapter2();
  renderLottoToTicket(purchaseLottosInput);
};

const transitionToChapter2 = () => {
  const purchaseWrapper = document.getElementById("left-purchase-wrapper");
  const ticketWrapper = document.getElementById("left-ticket-wrapper");

  const purchaseImageWrapper = document.getElementById(
    "right-purchase-wrapper"
  );
  const winningWrapper = document.getElementById("winning-wrapper");

  purchaseWrapper.style.opacity = "0";
  purchaseWrapper.style.transform = "translateY(-50px)";

  setTimeout(() => {
    ticketWrapper.style.bottom = "0";
  }, 300);

  purchaseImageWrapper.style.opacity = "0";

  setTimeout(() => {
    purchaseImageWrapper.style.display = "none";
    winningWrapper.style.display = "flex";
    winningWrapper.style.opacity = "1";
  }, 500);
};

const getBallColor = (num) => {
  if (num <= 10) return "b-1";
  if (num <= 20) return "b-2";
  if (num <= 30) return "b-3";
  if (num <= 40) return "b-4";
  return "b-5";
};

const renderLottoToTicket = (purchaseLottos) => {
  const lottoListArea = document.getElementById("lotto-list-area");
  lottoListArea.innerHTML = "";

  purchaseLottos.forEach((lotto) => {
    const row = document.createElement("div");
    row.className = "lotto-row";

    const ballsWrapper = document.createElement("div");
    lotto.forEach((number) => {
      const ball = document.createElement("span");
      ball.className = `ball ${getBallColor(number)}`;
      ball.innerText = number;
      ballsWrapper.appendChild(ball);
    });

    row.appendChild(ballsWrapper);
    lottoListArea.appendChild(row);
  });
};

const handleInputkeyDown = (event, input) => {
  if (event.key === "Enter") {
    event.preventDefault();

    submitPurchaseAmount(Number(input.value));
  }
};

const validateWinningNumbers = (numbers) => {
  if (numbers.length !== 6) throw new Error("당첨 번호는 6개여야 합니다.");

  const nums = numbers.map(Number);
  const set = new Set(nums);

  if (set.size !== 6) throw new Error("당첨 번호에 중복이 있습니다.");

  nums.forEach((num) => {
    if (num < 1 || num > 45)
      throw new Error("당첨 번호는 1~45 사이여야 합니다.");
  });

  return nums;
};

const validateBonusNumber = (bonus, winningNumbers) => {
  const ball = Number(bonus);

  if (isNaN(ball) || ball < 1 || ball > 45)
    throw new Error("보너스 번호는 1~45 사이여야 합니다.");

  if (winningNumbers.includes(ball))
    throw new Error("보너스 번호는 당첨번호와 달라야 합니다.");

  return ball;
};

const getRank = (lotto, winningNumbers, bonusNumber) => {
  const matchCount = lotto.filter((n) => winningNumbers.includes(n)).length;

  const hasBonus = lotto.includes(bonusNumber);

  if (matchCount === 6) return 1;
  if (matchCount === 5 && hasBonus) return 2;
  if (matchCount === 5) return 3;
  if (matchCount === 4) return 4;
  if (matchCount === 3) return 5;

  return 0;
};

const RANK_PRIZE = {
  1: 2000000000,
  2: 30000000,
  3: 1500000,
  4: 50000,
  5: 5000,
};

const winningInputs = document.querySelectorAll(
  "#inputs-wrapper .winning-input"
);
const bonusInputWrapper = document.getElementById("bonus-input-wrapper");
const bonusInput = document.querySelector(".bonus-input");
const winningCheckBtn = document.getElementById("winning-check-btn");
const errorMessage = document.querySelector(".error-message");
const winningWrapper = document.getElementById("winning-wrapper");
const winningResultWrapper = document.querySelector(".winning-result-wrapper");
const resetBtn = document.getElementById("reset-btn");

winningInputs.forEach((input, idx) => {
  input.addEventListener("input", () => {
    errorMessage.textContent = "";

    winningNumbers = [...winningInputs].map((input) => input.value.trim());
    const allFilled = winningNumbers.every((num) => num.length > 0);

    if (input.value.length === 2) {
      const next = winningInputs[idx + 1];
      next ? next.focus() : bonusInput.focus();
    }

    if (!allFilled) return;

    try {
      validateWinningNumbers(winningNumbers);
      bonusInputWrapper.style.display = "flex";
    } catch (error) {
      errorMessage.textContent = error.message;
    }
  });
});

bonusInput.addEventListener("input", () => {
  errorMessage.textContent = "";
  const bonus = bonusInput.value.trim();

  try {
    validateBonusNumber(bonus, winningNumbers);
    winningCheckBtn.style.display = "block";
  } catch (error) {
    errorMessage.textContent = error.message;
  }
});

const renderWinningResult = (winningNumbers, bonusNumber) => {
  const winningNumbersSpan = document.getElementById(
    "winning-result-lotto-numbers"
  );
  winningNumbersSpan.textContent = `${winningNumbers.join(
    ", "
  )} + ${bonusNumber}`;

  const prizeCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  purchaseLottosInput.forEach((lotto) => {
    const rank = getRank(lotto, winningNumbers, bonusNumber);
    if (rank) prizeCount[rank]++;
  });

  for (let i = 1; i <= 5; i++) {
    const countEl = document.getElementById(`prize-count_${i}`);
    countEl.textContent = prizeCount[i];
  }

  const totalPrize = Object.entries(prizeCount).reduce((sum, [rank, count]) => {
    return sum + (RANK_PRIZE[rank] || 0) * count;
  }, 0);

  const purchaseAmount = purchaseLottosInput.length * 1000;
  document.getElementById("total-roi-value").textContent = `${(
    (totalPrize / purchaseAmount) *
    100
  ).toFixed(2)}%`;
};

winningCheckBtn.addEventListener("click", () => {
  try {
    const validatedWinning = validateWinningNumbers(winningNumbers);
    const bonus = validateBonusNumber(
      bonusInput.value.trim(),
      validatedWinning
    );

    winningWrapper.style.opacity = "0";
    winningResultWrapper.classList.add("slide-active");

    renderWinningResult(validatedWinning, bonus);
  } catch (error) {
    errorMessage.textContent = error.message;
  }
});

resetBtn.addEventListener("click", () => location.reload());
