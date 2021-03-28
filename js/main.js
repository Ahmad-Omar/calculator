// import Decimal from "./decimal"
const numbers = document.querySelectorAll(".number");
const operators = document.querySelectorAll(".operator");
const calcDisplay = document.querySelector(".display");
const equal = document.querySelector(".equal");
const resetButton = document.querySelector(".reset");
const negativePositive = document.querySelector(".negative-positive-operator");
const percentOperator = document.querySelector(".percent-operator");
const decimal = document.querySelector(".decimal");
const ILS_USD = document.querySelector(".ILS-USD");
const USD_ILS = document.querySelector(".USD-ILS");
const ILS_EUR = document.querySelector(".ILS-EUR");
const EUR_ILS = document.querySelector(".EUR-ILS");
const dot = document.querySelector(".dot");
const operatorDivide = document.querySelector(".operator-divide");
const operatorMultiply = document.querySelector(".operator-multiply");
const operatorSubtract = document.querySelector(".operator-subtract");
const operatorAdd = document.querySelector(".operator-add");
const operatorEqual = document.querySelector(".operator-equal");
let operatorSelected = false;

let calcArray = [];
let originalArray = [];
let previousOperator = '';
let isNumberClicked = false;
let isEqualClicked = false;
let isPercentClicked = false;
const operatorsPriorities = {
    '%': 2,
    'x': 1,
    '÷': 1,
    '+': 0,
    '-': 0
};

appendToInput = (number) => {
    if (calcDisplay.value === '0' || calcDisplay.value === "-0") {
        calcDisplay.value = number;
    } else {
        calcDisplay.value = `${calcDisplay.value}${number}`;
    }
};

pushToCalcArray = (element) => {
    calcArray.push(element);
};

deactivateOperatorButtons = () => {
    operators.forEach((operatorButton) => {
        operatorButton.classList.remove("active");
    });
};

resultLength = (resultValue) => {
    const res = (resultValue).toString();

    if (res.includes(".")) {
        if (res.split(".")[0].length >= 8) {
            calcDisplay.value = resultValue.toExponential(5)
        } else if (res.split(".")[0].length < 8) {
            calcDisplay.value = (resultValue).toFixed(11 - res.split(".")[0].length)
        }
    } else {
        if (res.length >= 9) {
            calcDisplay.value = resultValue.toExponential(6)
        } else {
            calcDisplay.value = resultValue
        }

    }
};

calculate = (operator, number1, number2) => {
    if (operator === '+') {
        return new Decimal(number1).plus(number2);
    } else if (operator === '-') {
        return new Decimal(number1).minus(number2);
    } else if (operator === 'x') {
        return new Decimal(number1).mul(number2);
    } else if (operator === '÷') {
        if (number2 === 0) {
            return 'Error';
        }
        return new Decimal(number1).dividedBy(new Decimal(number2));
    }
};

calculateAll = () => {
    var ops = [{
                'x': (a, b) => new Decimal(a).mul(b),
                '÷': (a, b) => new Decimal(a).dividedBy(new Decimal(b))
            },
            {
                '+': (a, b) => new Decimal(a).plus(b),
                '-': (a, b) => new Decimal(a).minus(b)
            }
        ],
        newCalc = [],
        currentOp;
    for (var i = 0; i < ops.length; i++) {
        for (var j = 0; j < calcArray.length; j++) {
            if (ops[i][calcArray[j]]) {
                currentOp = ops[i][calcArray[j]];
            } else if (currentOp) {
                newCalc[newCalc.length - 1] =
                    currentOp(newCalc[newCalc.length - 1], calcArray[j]);
                currentOp = null;
            } else {
                newCalc.push(calcArray[j]);
            }
        }
        calcArray = newCalc;
        newCalc = [];
    }
    return calcArray[0];
};

numberClickedHandler = (e) => {
    if (calcDisplay.value.length == 9) {
        if (operatorSelected) {
            calcDisplay.value = "";
            calcDisplay.value += e.target.textContent
            deactivateOperatorButtons();
        }
        return;

    }

    if (operatorSelected) {
        calcDisplay.value = "";
        deactivateOperatorButtons();
        operatorSelected = false;
    }

    const number = e.target.textContent;
    appendToInput(number);
    if (isEqualClicked) {
        calcArray.length = 0;
        originalArray.length = 0;
    }
    isNumberClicked = true;
    isEqualClicked = false;
};

equalHandler = () => {
    if (!isEqualClicked) {
        if (calcArray.length > 0 && '+-x÷%'.indexOf(calcArray[calcArray.length - 1]) !== -1 && !isNumberClicked) {
            // This means that an operator is clicked after another operator. So we will switch the last operator.
            calcArray.length = calcArray.length - 1;
            originalArray.length = originalArray.length - 1;
        } else {
            pushToCalcArray(parseFloat(calcDisplay.value));
            originalArray.push(calcDisplay.value);
        }

        if (calcArray.length > 2) {
            originalArray = [...calcArray];
            const result = calculateAll();
            resultLength(result);

        }
    } else {
        calcArray = [...calcArray, originalArray[originalArray.length - 2], originalArray[originalArray.length - 1]]
        originalArray = [...calcArray];
        const result = calculateAll();
        resultLength(result);

    }

    isNumberClicked = false;
    isEqualClicked = true;
};

operatorClickedHandler = (e) => {
    deactivateOperatorButtons();

    operatorSelected = true;
    e.target.classList.add("active");

    const operator = e.target.textContent;
    let updatePreviousOperator = true;

    if (operator === '=') {
        equalHandler();
        return;
    }

    if (calcArray.length > 0 && '+-x÷%'.indexOf(calcArray[calcArray.length - 1]) !== -1 && !isNumberClicked) {
        // This means that an operator is clicked after another operator. So we will switch the last operator.
        calcArray = [...originalArray];
        calcArray.length = calcArray.length - 1;
        originalArray.length = originalArray.length - 1;
    } else {
        if (calcArray.length > 0 && '+-x÷%'.indexOf(calcArray[calcArray.length - 1]) === -1) {

        } else {
            pushToCalcArray(parseFloat(calcDisplay.value));
        }
    }

    if (calcArray.length > 2) {
        previousOperator = calcArray[calcArray.length - 2];
        originalArray = [...calcArray];
        if (operatorsPriorities[operator] == 0) {
            const result = calculateAll();
            resultLength(result)

        } else if (operatorsPriorities[operator] == 1 && operatorsPriorities[previousOperator] == 1) {
            const result = calculate(calcArray[calcArray.length - 2], parseFloat(calcArray[calcArray.length - 3]), parseFloat(calcArray[calcArray.length - 1]));
            resultLength(result)
            calcArray.length = calcArray.length - 3
            pushToCalcArray(parseFloat(result));
        } else if (operatorsPriorities[operator] == 1 && operatorsPriorities[previousOperator] == 0) {
            resultLength(calcArray[calcArray.length - 1])

        }
    }
    if (operator === "%") {
        if (calcArray.length <= 1 || isEqualClicked) {
            calcDisplay.value = new Decimal(calcDisplay.value).dividedBy(100);
            calcArray.length = 0;
            originalArray.length = 0;

        } else if (calcArray.length > 2) {
            if (calcArray[calcArray.length - 2] == "x" || calcArray[calcArray.length - 2] == "÷") {
                calcDisplay.value = new Decimal(calcDisplay.value).dividedBy(100);
                calcArray[calcArray.length - 1] = parseFloat(calcDisplay.value);
            } else if (calcArray[calcArray.length - 2] == "+" || calcArray[calcArray.length - 2] == "-") {
                calcDisplay.value = new Decimal(calcArray[0]).mul(new Decimal(calcDisplay.value).dividedBy(100));
                calcArray[calcArray.length - 1] = parseFloat(calcDisplay.value);
            }
        }

    }


    pushToCalcArray(operator);
    originalArray.push(operator);
    isNumberClicked = false;
    isEqualClicked = false;
    console.log(`calcArray: ${calcArray}, originalArray: ${originalArray}`);
};

// Keyboard
document.addEventListener("keypress", (e) => {
    if (e.key >= 0 && e.key <= 9) {
        const numBtn = document.querySelector(`.num-${e.key}`);
        if (numBtn) {
            numBtn.click();
        }
    } else if (e.key == ".") {
        dot.click();
    } else if (e.key == "/") {
        operatorDivide.click();
    } else if (e.key == "*") {
        operatorMultiply.click();
    } else if (e.key == "+") {
        operatorAdd.click();
    } else if (e.key == "-") {
        operatorSubtract.click();
    } else if (e.key == "%") {
        operatorPercent.click();
    } else if (e.key == "=" || e.key == "Enter") {
        operatorEqual.click();
        e.preventDefault();
    }
})

// reset calculator display to zero
resetButton.addEventListener("click", () => {
    calcDisplay.value = 0;
    calcArray.length = 0;
    originalArray.length = 0;
    operators.forEach((operatorButton) => {
        operatorButton.classList.remove("active");
    })
})

numbers.forEach((number) => {
    number.addEventListener("click", (e) => {
        numberClickedHandler(e);
    })
});

operators.forEach((operator) => {
    operator.addEventListener("click", (e) => {
        operatorClickedHandler(e);
    })
})

// Decimal
decimal.addEventListener("click", (e) => {
    if (!calcDisplay.value.includes(".") && !operatorSelected) {
        calcDisplay.value += ".";
    } else if (operatorSelected) {
        calcDisplay.value = "";
        calcDisplay.value += `0.`
        deactivateOperatorButtons();
        operatorSelected = false;
    }
})

// Negative-Positive Sign
negativePositive.addEventListener("click", (e) => {
    if (calcDisplay.value.startsWith("-")) {
        calcDisplay.value = calcDisplay.value.replace("-", "");
    } else {
        calcDisplay.value = `-${calcDisplay.value}`;
    }
})

// Currency Convertor
ILS_USD.addEventListener("click", () => {
    if (calcDisplay.value !== "0") {
        resultLength(calcDisplay.value * 0.300503)

    }
})
USD_ILS.addEventListener("click", () => {
    if (calcDisplay.value !== "0") {
        resultLength(calcDisplay.value * 3.32775)
    }
})
ILS_EUR.addEventListener("click", () => {
    if (calcDisplay.value !== "0") {
        resultLength(calcDisplay.value * 0.252222)
    }
})
EUR_ILS.addEventListener("click", () => {
    if (calcDisplay.value !== "0") {
        resultLength(calcDisplay.value * 3.96476);
    }
})