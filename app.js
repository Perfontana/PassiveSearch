class UI {
  form = document.querySelector("#main-form");
  a = document.querySelector("#input-a");
  b = document.querySelector("#input-b");
  n = document.querySelector("#input-n");
  min_max = document.querySelector("#input-extremum");
  result = document.querySelector("#span-result");
  func = document.querySelector("#input-function");

  getA() {
    return parseInt(this.a.value);
  }

  getB() {
    return parseInt(this.b.value);
  }

  getN() {
    return parseInt(this.n.value);
  }

  getFunc() {
    return this.func.value;
  }

  setResult(value) {
    this.result.textContent = value;
  }

  isMinimum() {
    return this.min_max.checked;
  }

  onSubmit(f) {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      f();
    });
  }
}

const ui = new UI();

ui.onSubmit(draw);

function max(y1, y2) {
  return y1 > y2;
}
function min(y1, y2) {
  return y1 < y2;
}

function draw(e) {
  if (isInvalid()) return;
  try {
    const expression = ui.getFunc();
    const expr = math.compile(expression);

    let predicate = ui.isMinimum() ? min : max;

    let result = passiveSearch(
      ui.getA(),
      ui.getB(),
      ui.getN(),
      expr,
      predicate
    );

    ui.setResult(result);

    const step = (ui.getB() - ui.getA()) / (ui.getN() + 1);
    const xValues = math.range(ui.getA(), ui.getB(), step, true).toArray();
    const yValues = xValues.map(function (x) {
      return expr.evaluate({ x: x });
    });

    const trace1 = {
      x: xValues,
      y: yValues,
      type: "scatter",
    };
    const data = [trace1];
    Plotly.newPlot("plot", data);
  } catch (err) {
    console.error(err);
    alert(err);
  }
}

function isInvalid() {
  let result = false;
  result = result || ui.getA() > ui.getB();
  if (ui.getA() > ui.getB()) {
    alert("Граница a должна быть меньше, чем граница b.");
    result = true;
  }
  if (ui.getN() < 1) {
    alert("Количество итераций должно быть больше нуля.");
    result = true;
  }
  return result;
}

function passiveSearch(a, b, n, fun, predicate) {
  const step = (b - a) / (n + 1);
  let currentX = a + step;
  let result = fun.evaluate({ x: currentX });
  for (let i = 0; i < n; i++) {
    let currentY = fun.evaluate({ x: currentX });
    if (predicate(currentY, result)) result = currentY;
    currentX += step;
  }
  return result;
}
