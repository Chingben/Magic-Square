const form = document.querySelector("#magicForm");
const orderInput = document.querySelector("#orderInput");
const randomBtn = document.querySelector("#randomBtn");
const solutionTabs = document.querySelector("#solutionTabs");
const magicSquare = document.querySelector("#magicSquare");
const verificationGrid = document.querySelector("#verificationGrid");
const magicSumEl = document.querySelector("#magicSum");
const solutionCountEl = document.querySelector("#solutionCount");
const methodNameEl = document.querySelector("#methodName");
const currentTitle = document.querySelector("#currentTitle");
const limitNote = document.querySelector("#limitNote");
const copyBtn = document.querySelector("#copyBtn");
const lessonBtn = document.querySelector("#lessonBtn");
const lessonPanel = document.querySelector("#lessonPanel");
const lessonTitle = document.querySelector("#lessonTitle");
const lessonContent = document.querySelector("#lessonContent");
const toast = document.querySelector("#toast");

let solutions = [];
let activeIndex = 0;
let currentMethod = "";
let lessonOpen = false;
const DISPLAY_LIMIT = 20;

function magicConstant(n) {
  return (n * (n * n + 1)) / 2;
}

function emptySquare(n) {
  return Array.from({ length: n }, () => Array(n).fill(0));
}

function oddMagic(n, startRow = 0, startCol = Math.floor(n / 2)) {
  const square = emptySquare(n);
  let row = startRow;
  let col = startCol;

  for (let value = 1; value <= n * n; value += 1) {
    square[row][col] = value;
    const nextRow = (row - 1 + n) % n;
    const nextCol = (col + 1) % n;

    if (square[nextRow][nextCol]) {
      row = (row + 1) % n;
    } else {
      row = nextRow;
      col = nextCol;
    }
  }

  return square;
}

function doublyEvenMagic(n) {
  const square = emptySquare(n);
  const max = n * n + 1;

  for (let row = 0; row < n; row += 1) {
    for (let col = 0; col < n; col += 1) {
      const value = row * n + col + 1;
      const keep = row % 4 === col % 4 || (row % 4) + (col % 4) === 3;
      square[row][col] = keep ? value : max - value;
    }
  }

  return square;
}

function singlyEvenMagic(n) {
  const half = n / 2;
  const subSquare = oddMagic(half);
  const square = emptySquare(n);
  const add = half * half;
  const offsets = [0, 2, 3, 1];

  for (let row = 0; row < half; row += 1) {
    for (let col = 0; col < half; col += 1) {
      const base = subSquare[row][col];
      square[row][col] = base + offsets[0] * add;
      square[row][col + half] = base + offsets[1] * add;
      square[row + half][col] = base + offsets[2] * add;
      square[row + half][col + half] = base + offsets[3] * add;
    }
  }

  const leftCols = Math.floor((n - 2) / 4);
  const rightCols = Math.floor((n - 2) / 4) - 1;

  for (let row = 0; row < half; row += 1) {
    for (let col = 0; col < leftCols; col += 1) {
      swap(square, row, col, row + half, col);
    }
    for (let col = n - rightCols; col < n; col += 1) {
      swap(square, row, col, row + half, col);
    }
  }

  swap(square, Math.floor(half / 2), 0, Math.floor(half / 2) + half, 0);
  swap(square, Math.floor(half / 2), leftCols, Math.floor(half / 2) + half, leftCols);

  return square;
}

function swap(square, rowA, colA, rowB, colB) {
  const temp = square[rowA][colA];
  square[rowA][colA] = square[rowB][colB];
  square[rowB][colB] = temp;
}

function transpose(square) {
  return square[0].map((_, col) => square.map((row) => row[col]));
}

function reverseRows(square) {
  return [...square].reverse().map((row) => [...row]);
}

function reverseCols(square) {
  return square.map((row) => [...row].reverse());
}

function rotate90(square) {
  return reverseCols(transpose(square));
}

function rotate180(square) {
  return rotate90(rotate90(square));
}

function rotate270(square) {
  return rotate90(rotate180(square));
}

function complement(square) {
  const n = square.length;
  const max = n * n + 1;
  return square.map((row) => row.map((value) => max - value));
}

function pairedSwap(square, mask) {
  const result = square.map((row) => [...row]);
  const n = result.length;
  const pairCount = Math.floor(n / 2);

  for (let pair = 0; pair < pairCount; pair += 1) {
    if ((mask & (1 << pair)) === 0) continue;

    const opposite = n - pair - 1;
    [result[pair], result[opposite]] = [result[opposite], result[pair]];

    for (let row = 0; row < n; row += 1) {
      [result[row][pair], result[row][opposite]] = [result[row][opposite], result[row][pair]];
    }
  }

  return result;
}

function keyFor(square) {
  return square.flat().join(",");
}

function uniqueSolutions(candidates) {
  const seen = new Set();
  const unique = [];

  candidates.forEach((candidate) => {
    const key = keyFor(candidate.square);
    if (!seen.has(key) && isMagic(candidate.square)) {
      seen.add(key);
      unique.push(candidate);
    }
  });

  return unique;
}

function transformSet(base, sourceLabel) {
  return [
    { square: base, label: sourceLabel },
    { square: rotate90(base), label: `${sourceLabel} + 顺时针旋转 90 度` },
    { square: rotate180(base), label: `${sourceLabel} + 旋转 180 度` },
    { square: rotate270(base), label: `${sourceLabel} + 逆时针旋转 90 度` },
    { square: reverseRows(base), label: `${sourceLabel} + 上下翻转` },
    { square: reverseCols(base), label: `${sourceLabel} + 左右翻转` },
    { square: transpose(base), label: `${sourceLabel} + 沿主对角线翻转` },
    { square: reverseRows(transpose(base)), label: `${sourceLabel} + 沿副对角线翻转` },
  ];
}

function variations(base, n) {
  const seeds = [{ square: base, label: "基础构造" }];

  if (n % 2 === 1) {
    for (let row = 0; row < n; row += 1) {
      for (let col = 0; col < n; col += 1) {
        seeds.push({ square: oddMagic(n, row, col), label: `从第 ${row + 1} 行第 ${col + 1} 格起步` });
      }
    }
  }

  const candidates = [];
  seeds.forEach((seed) => {
    const transformed = transformSet(seed.square, seed.label);
    transformed.forEach((item) => {
      candidates.push(item);
      candidates.push({ square: complement(item.square), label: `${item.label} + 互补变换` });
    });
  });

  const symmetricLimit = Math.min(1 << Math.floor(n / 2), 64);
  transformSet(base, "基础构造").forEach((item) => {
    for (let mask = 1; mask < symmetricLimit; mask += 1) {
      candidates.push({ square: pairedSwap(item.square, mask), label: `${item.label} + 对称行列交换` });
    }
  });

  return uniqueSolutions(candidates);
}

function buildBase(n) {
  if (n % 2 === 1) {
    return { square: oddMagic(n), method: "奇数阶星跃法" };
  }
  if (n % 4 === 0) {
    return { square: doublyEvenMagic(n), method: "双偶阶镜像法" };
  }
  return { square: singlyEvenMagic(n), method: "单偶阶拼合法" };
}

function isMagic(square) {
  const n = square.length;
  const target = magicConstant(n);
  const values = square.flat();
  const expected = new Set(Array.from({ length: n * n }, (_, index) => index + 1));

  if (values.length !== expected.size || values.some((value) => !expected.delete(value))) {
    return false;
  }

  const lines = getLines(square);
  return lines.every((line) => line.values.reduce((sum, value) => sum + value, 0) === target);
}

function getLines(square) {
  const n = square.length;
  const lines = [];

  square.forEach((row, index) => {
    lines.push({ label: `第 ${index + 1} 行`, values: row });
  });

  for (let col = 0; col < n; col += 1) {
    lines.push({ label: `第 ${col + 1} 列`, values: square.map((row) => row[col]) });
  }

  lines.push({ label: "主对角线", values: square.map((row, index) => row[index]) });
  lines.push({ label: "副对角线", values: square.map((row, index) => row[n - index - 1]) });

  return lines;
}

function renderTabs() {
  solutionTabs.innerHTML = "";
  solutions.forEach((solution, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `tab-btn${index === activeIndex ? " active" : ""}`;
    button.innerHTML = `<span>方案 ${index + 1}</span><span>${solution.label.includes("互补") ? "互补" : "可验证"}</span>`;
    button.addEventListener("click", () => {
      activeIndex = index;
      lessonOpen = false;
      render();
    });
    solutionTabs.appendChild(button);
  });
}

function renderSquare(square) {
  const n = square.length;
  magicSquare.style.setProperty("--n", n);
  magicSquare.innerHTML = "";

  square.flat().forEach((value) => {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.textContent = value;
    magicSquare.appendChild(cell);
  });
}

function renderVerification(square) {
  const target = magicConstant(square.length);
  verificationGrid.innerHTML = "";
  getLines(square).forEach((line) => {
    const total = line.values.reduce((sum, value) => sum + value, 0);
    const item = document.createElement("div");
    item.className = "verify-item";
    item.innerHTML = `<strong>${line.label}</strong>${line.values.join(" + ")} = ${total}${total === target ? " ✓" : ""}`;
    verificationGrid.appendChild(item);
  });
}

function firstPlacements(square, count = 8) {
  const n = square.length;
  const positions = [];

  for (let value = 1; value <= Math.min(n * n, count); value += 1) {
    for (let row = 0; row < n; row += 1) {
      const col = square[row].indexOf(value);
      if (col !== -1) {
        positions.push(`${value} 放在第 ${row + 1} 行第 ${col + 1} 格`);
        break;
      }
    }
  }

  return positions;
}

function sequentialSquare(n) {
  return Array.from({ length: n }, (_, row) => Array.from({ length: n }, (_, col) => row * n + col + 1));
}

function oddPartial(n, count) {
  const square = emptySquare(n);
  let row = 0;
  let col = Math.floor(n / 2);

  for (let value = 1; value <= Math.min(count, n * n); value += 1) {
    square[row][col] = value;
    const nextRow = (row - 1 + n) % n;
    const nextCol = (col + 1) % n;

    if (square[nextRow][nextCol]) {
      row = (row + 1) % n;
    } else {
      row = nextRow;
      col = nextCol;
    }
  }

  return square;
}

function doublyEvenKeepMask(n) {
  return Array.from({ length: n }, (_, row) =>
    Array.from({ length: n }, (_, col) => row % 4 === col % 4 || (row % 4) + (col % 4) === 3),
  );
}

function singlyEvenBeforeSwap(n) {
  const half = n / 2;
  const subSquare = oddMagic(half);
  const square = emptySquare(n);
  const add = half * half;
  const offsets = [0, 2, 3, 1];

  for (let row = 0; row < half; row += 1) {
    for (let col = 0; col < half; col += 1) {
      const base = subSquare[row][col];
      square[row][col] = base + offsets[0] * add;
      square[row][col + half] = base + offsets[1] * add;
      square[row + half][col] = base + offsets[2] * add;
      square[row + half][col + half] = base + offsets[3] * add;
    }
  }

  return square;
}

function highlightWhere(square, predicate, className) {
  const marks = {};
  square.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      if (predicate(value, rowIndex, colIndex)) {
        marks[`${rowIndex},${colIndex}`] = className;
      }
    });
  });
  return marks;
}

function changedMarks(before, after) {
  return highlightWhere(after, (value, row, col) => before[row][col] !== value, "changed");
}

function keptMarks(mask) {
  const marks = {};
  mask.forEach((row, rowIndex) => {
    row.forEach((keep, colIndex) => {
      marks[`${rowIndex},${colIndex}`] = keep ? "keep" : "changed";
    });
  });
  return marks;
}

function renderMiniBoard(container, boardConfig) {
  const wrap = document.createElement("div");
  wrap.className = "mini-board-wrap";

  if (boardConfig.title) {
    const title = document.createElement("div");
    title.className = "mini-board-title";
    title.textContent = boardConfig.title;
    wrap.appendChild(title);
  }

  const board = document.createElement("div");
  board.className = "mini-board";
  board.style.setProperty("--n", boardConfig.square.length);

  boardConfig.square.flat().forEach((value, flatIndex) => {
    const n = boardConfig.square.length;
    const row = Math.floor(flatIndex / n);
    const col = flatIndex % n;
    const cell = document.createElement("div");
    const mark = boardConfig.marks?.[`${row},${col}`] || "";
    cell.className = `mini-cell${mark ? ` ${mark}` : ""}${value ? "" : " empty"}`;
    cell.textContent = value || "";
    board.appendChild(cell);
  });

  wrap.appendChild(board);
  container.appendChild(wrap);
}

function lessonSteps(solution) {
  const square = solution.square;
  const n = square.length;
  const sum = magicConstant(n);

  if (currentMethod === "奇数阶星跃法") {
    const baseSquare = oddMagic(n);
    const basePath = firstPlacements(baseSquare).join("；");
    return [
      {
        text: `这是一张 ${n} 阶幻方，因为 ${n} 是奇数，所以我们用“奇数阶星跃法”。目标幻和是 ${sum}。先把 1 放在第一行中间格。`,
        boards: [{ title: "先放 1", square: oddPartial(n, 1), marks: highlightWhere(oddPartial(n, 1), (value) => value === 1, "current") }],
      },
      {
        text: "接下来每次都试着往右上角跳一格；如果跳出边界，就从另一边绕回来。下面先看前 5 个数字怎样落位。",
        boards: [{ title: "从 1 走到 5", square: oddPartial(n, 5), marks: highlightWhere(oddPartial(n, 5), (value) => value > 0, "current") }],
      },
      {
        text: "如果右上角已经有数字了，就不要挤进去，直接从刚才那个数字的下面一格继续写。按这个节奏一直写到最后。",
        boards: [{ title: "基础构造完成", square: baseSquare, marks: highlightWhere(baseSquare, (value) => value <= Math.min(8, n * n), "keep") }],
      },
      {
        text: `基础表的前几个落点是：${basePath}。绿色数字就是老师会重点带学生追踪的起步路线。`,
        boards: [{ title: "当前方案", square, marks: solution.label === "基础构造" ? {} : changedMarks(baseSquare, square) }],
      },
      {
        text: solution.label === "基础构造" ? "当前方案就是这个基础构造。" : `当前方案是在基础构造之后做了一个保持幻和不变的变换：${solution.label}。旋转、翻转、互补数都不会破坏每行每列的总和。`,
        boards: [{ title: "最终填写", square, marks: {} }],
      },
    ];
  }

  if (currentMethod === "双偶阶镜像法") {
    const before = sequentialSquare(n);
    const after = doublyEvenMagic(n);
    const mask = doublyEvenKeepMask(n);
    return [
      {
        text: `这是一张 ${n} 阶幻方，因为 ${n} 能被 4 整除，所以我们用“双偶阶镜像法”。目标幻和是 ${sum}。`,
        boards: [{ title: "空表要填成这样大小", square: emptySquare(n), marks: {} }],
      },
      {
        text: `第一步很简单：按普通顺序从左到右、从上到下写 1 到 ${n * n}。这不是答案，只是准备好的 Before 表。`,
        boards: [{ title: "Before：顺序填写", square: before, marks: {} }],
      },
      {
        text: "第二步看每个 4×4 小区块：两条对角线上的格子保留原数，其他格子改成它的“镜像伙伴”。绿色是保留，粉色是要改变。",
        boards: [{ title: "标记保留与改变", square: before, marks: keptMarks(mask) }],
      },
      {
        text: `镜像伙伴的口诀是：一个数 a 换成 ${n * n + 1} - a。比如 1 的伙伴是 ${n * n}，2 的伙伴是 ${n * n - 1}。`,
        boards: [
          { title: "Before", square: before, marks: keptMarks(mask) },
          { title: "After", square: after, marks: changedMarks(before, after) },
        ],
      },
      {
        text: solution.label === "基础构造" ? "当前方案就是这个基础构造。" : `当前方案又用了一个安全变换：${solution.label}。它只是重新摆放已经正确的结构，所以验证结果仍然相同。`,
        boards: [{ title: "当前方案", square, marks: solution.label === "基础构造" ? {} : changedMarks(after, square) }],
      },
    ];
  }

  const half = n / 2;
  const subSquare = oddMagic(half);
  const beforeSwap = singlyEvenBeforeSwap(n);
  const afterSwap = singlyEvenMagic(n);
  return [
    {
      text: `这是一张 ${n} 阶幻方，因为 ${n} 是偶数但不能被 4 整除，所以我们用“单偶阶拼合法”。目标幻和是 ${sum}。`,
      boards: [{ title: `${half} 阶奇数幻方骨架`, square: subSquare, marks: highlightWhere(subSquare, (value) => value > 0, "keep") }],
    },
    {
      text: `先把大方格分成 4 个 ${half}×${half} 的小方格，每个小方格都放入同一个骨架。`,
      boards: [{ title: "四象限骨架", square: beforeSwap.map((row) => row.map((value) => ((value - 1) % (half * half)) + 1)), marks: {} }],
    },
    {
      text: `给四个区域加上不同的数：左上不加；右上加 ${2 * half * half}；左下加 ${3 * half * half}；右下加 ${half * half}。`,
      boards: [{ title: "交换前", square: beforeSwap, marks: highlightWhere(beforeSwap, (value, row, col) => row >= half || col >= half, "changed") }],
    },
    {
      text: "然后按规则交换左边几列和右边几列的上下对应格，再交换中间附近两个关键格。粉色表示这一步发生了交换。",
      boards: [
        { title: "Before", square: beforeSwap, marks: changedMarks(afterSwap, beforeSwap) },
        { title: "After", square: afterSwap, marks: changedMarks(beforeSwap, afterSwap) },
      ],
    },
    {
      text: solution.label === "基础构造" ? "当前方案就是这个基础构造。" : `当前方案还做了一个保持幻和不变的变换：${solution.label}。你可以把它看成把一张已经正确的星图换个方向观察。`,
      boards: [{ title: "当前方案", square, marks: solution.label === "基础构造" ? {} : changedMarks(afterSwap, square) }],
    },
  ];
}

function renderLesson(solution) {
  lessonPanel.hidden = !lessonOpen;
  lessonBtn.textContent = lessonOpen ? "收起讲解" : "详细讲解";
  if (!lessonOpen) return;

  lessonTitle.textContent = `${currentMethod}：方案 ${activeIndex + 1}`;
  lessonContent.innerHTML = "";
  lessonSteps(solution).forEach((step, index) => {
    const item = document.createElement("section");
    item.className = "lesson-step";
    item.innerHTML = `<strong>第 ${index + 1} 步</strong><p>${step.text}</p>`;
    if (step.boards?.length) {
      const boards = document.createElement("div");
      boards.className = "mini-board-grid";
      step.boards.forEach((board) => renderMiniBoard(boards, board));
      item.appendChild(boards);
    }
    lessonContent.appendChild(item);
  });
}

function render() {
  const solution = solutions[activeIndex];
  const square = solution.square;
  currentTitle.textContent = `方案 ${activeIndex + 1}`;
  renderTabs();
  renderSquare(square);
  renderVerification(square);
  renderLesson(solution);
}

function generate(n) {
  const { square, method } = buildBase(n);
  const candidates = variations(square, n);
  solutions = candidates.slice(0, DISPLAY_LIMIT);
  activeIndex = 0;
  currentMethod = method;
  lessonOpen = false;

  magicSumEl.textContent = magicConstant(n);
  solutionCountEl.textContent = solutions.length;
  methodNameEl.textContent = method;
  limitNote.textContent = candidates.length > DISPLAY_LIMIT ? "候选超过 20 种，展示 Top 20" : `展示 ${solutions.length} 种有效方案`;

  render();
}

function normalizeOrder(value) {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n) || n < 3) return 3;
  return Math.min(n, 99);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1400);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const n = normalizeOrder(orderInput.value);
  orderInput.value = n;
  generate(n);
});

randomBtn.addEventListener("click", () => {
  const n = 3 + Math.floor(Math.random() * 10);
  orderInput.value = n;
  generate(n);
});

copyBtn.addEventListener("click", async () => {
  const text = solutions[activeIndex].square.map((row) => row.join(" ")).join("\n");
  try {
    await navigator.clipboard.writeText(text);
    showToast("当前幻方已复制");
  } catch {
    showToast("复制失败，请手动选择");
  }
});

lessonBtn.addEventListener("click", () => {
  lessonOpen = !lessonOpen;
  renderLesson(solutions[activeIndex]);
});

generate(3);
