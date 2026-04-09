const display = document.getElementById("display");

function appendValue(value) {
  const lastChar = display.value.slice(-1);

  // Prevent multiple operators together
  if (isOperator(value) && isOperator(lastChar)) {
    display.value = display.value.slice(0, -1) + value;
    return;
  }

  // Prevent multiple dots in a single number
  if (value === ".") {
    const parts = display.value.split(/[\+\-\*\/%]/);
    const currentPart = parts[parts.length - 1];
    if (currentPart.includes(".")) {
      return;
    }
  }

  display.value += value;
}

function clearDisplay() {
  display.value = "";
}

function deleteLast() {
  display.value = display.value.slice(0, -1);
}

function isOperator(char) {
  return ["+", "-", "*", "/", "%"].includes(char);
}

function calculateResult() {
  try {
    let expression = display.value;

    if (!expression) return;

    // Remove ending operator
    if (isOperator(expression.slice(-1))) {
      expression = expression.slice(0, -1);
    }

    // Basic validation
    if (!/^[0-9+\-*/%.() ]+$/.test(expression)) {
      display.value = "Error";
      return;
    }

    const result = Function('"use strict"; return (' + expression + ')')();

    if (result === undefined || Number.isNaN(result) || !Number.isFinite(result)) {
      display.value = "Error";
      return;
    }

    display.value = result;
  } catch (error) {
    display.value = "Error";
  }
}

// Keyboard support
document.addEventListener("keydown", (event) => {
  const key = event.key;

  if ((key >= "0" && key <= "9") || ["+", "-", "*", "/", "%", "."].includes(key)) {
    appendValue(key);
  } else if (key === "Enter" || key === "=") {
    event.preventDefault();
    calculateResult();
  } else if (key === "Backspace") {
    deleteLast();
  } else if (key === "Escape" || key.toLowerCase() === "c") {
    clearDisplay();
  }
});