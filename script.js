"use strict";

const 
  start = document.getElementById("start"),
  cancel = document.getElementById("cancel"),
  incExpItems = {
    income: document.getElementsByClassName("income-items"),
    expenses: document.getElementsByClassName("expenses-items")},
  addBlockButtons = {
    income: document.querySelector(".income").getElementsByTagName("button")[0],
    expenses: document.querySelector(".expenses").getElementsByTagName("button")[0]
  },
  depositCheck = document.querySelector("#deposit-check"),
  additionalIncomeItems = document.querySelectorAll(".additional_income-item"),
  budgetMonthValue = document.getElementsByClassName("budget_month-value")[0],
  budgetDayValue = document.getElementsByClassName("budget_day-value")[0],
  expensesMonthValue = document.getElementsByClassName("expenses_month-value")[0],
  additionalIncomeValue = document.getElementsByClassName("additional_income-value")[0],
  additionalExpensesValue = document.getElementsByClassName("additional_expenses-value")[0],
  incomePeriodValue = document.getElementsByClassName("income_period-value")[0],
  targetMonthValue = document.getElementsByClassName("target_month-value")[0],
  salaryAmount = document.querySelector(".salary-amount"),
  incomeTitle = document.querySelector("input.income-title"),
  expensesTitle = document.querySelector("input.expenses-title"),
  additionalExpensesItem = document.querySelector(".additional_expenses-item"),
  targetAmount = document.querySelector(".target-amount"),
  periodSelect = document.querySelector(".period-select"),
  sumInputItems = document.querySelectorAll('input[placeholder="Сумма"]'),
  titleInputItems = document.querySelectorAll('input[placeholder="Наименование"]');

class AppData {
  constructor() {
    this.budget = 0;
    this.income = {};
    this.incomeMonth = 0;
    this.addIncome = [];
    this.expenses = {};
    this.addExpenses = [];
    this.deposit = false;
    this.percentDeposit = 0;
    this.moneyDeposit = 0;
    this.budgetMonth = 0;
    this.expensesMonth = 0;
    this.budgetDay = 0;
    this.eventsListeners();
  }
  isNumber(num) {
    return !isNaN(parseFloat(num)) && isFinite(num);
  }
  checkSpaces(str) {
    return !str ? str : str.trim() !== "";
  }
  getDeclensionOfStringByNumber(num, expressions) {
    switch (true) {
      case +(num += "").substr(-2) > 10 && +(num += "").substr(-2) <= 20:
        return num + " " + expressions[2];
      case num % 10 === 0:
        return num + " " + expressions[2];
      case num % 10 === 1:
        return num + " " + expressions[0];
      case num % 10 < 5:
        return num + " " + expressions[1];
      default:
        return num + " " + expressions[2];
    }
  }
  resetProperties() {
    const appData = JSON.parse(localStorage.appData);

    for (let key in appData) {
      this[key] = appData[key];
    }
  }
  resetDataInputs() {
    document
      .querySelector(".data")
      .querySelectorAll("input[type=text]")
      .forEach(item => {
        item.removeAttribute("disabled");
        item.value = "";
      });
  }
  resetResultInputs() {
    document
      .querySelector(".result")
      .querySelectorAll("input")
      .forEach(item => item.value = "");
  }
  removeIncExpInputs() {
    ['income', 'expenses'].forEach(item => {
      document.querySelectorAll(`.${item}-items`).forEach((item, index) => {
        if (index !== 0) {
          item.remove();
        }
      });
      addBlockButtons[item].style.display = "block";
    });
  }
  resetStartSettings() {
    depositCheck.checked = false;
    start.setAttribute("disabled", true);
    start.style.display = "block";
    cancel.style.display = "none";
    periodSelect.removeEventListener("input", this.periodSelectListener);
    periodSelect.setAttribute("disabled", true);
    periodSelect.value = 1;
    this.changePeriod();
  }
  reset() {
    this.resetProperties();
    this.removeIncExpInputs();
    this.resetDataInputs();
    this.resetResultInputs();
    this.resetStartSettings();
  }
  setStartSettings() {
    this.periodSelectListener = this.showResult.bind(this);
    periodSelect.addEventListener("input", this.periodSelectListener);
    document.querySelector(".data").querySelectorAll("input[type=text]")
      .forEach(item => item.setAttribute("disabled", true));
    addBlockButtons.income.style.display = "none";
    addBlockButtons.expenses.style.display = "none";
    start.style.display = "none";
    cancel.style.display = "block";
  }
  start() {
    if (!localStorage.appData) {
      localStorage.appData = JSON.stringify(this);
    }
    this.budget = +salaryAmount.value;
    this.getAddIncExp();
    this.getPosExpenses();
    this.getIncomeMonth();
    this.getExpensesMonth();
    this.getPosIncome();
    this.getBudget();
    this.showResult();
    this.setStartSettings();
  }
  cyrillicInput(event) {
    const position = this.selectionStart;
    
    this.value = this.value.replace(/[^а-яА-ЯёЁ\s]/g,'');
    this.selectionEnd = event.data ? !event.data.match(/[а-яА-ЯёЁ\s]/) ? position - 1 : position : position;
  }
  numericInput(event) {
    const position = this.selectionStart;

    this.value = this.value.replace(/[^\d]/g,'');
    this.selectionEnd = event.data ? !event.data.match(/[\d]/) ? position - 1 : position : position;
  }
  checkSalaryAmount() {
    if (salaryAmount.value !== "") {
      if (start.getAttribute("disabled")) {
        start.removeAttribute("disabled");
        periodSelect.removeAttribute("disabled");
      }
    } else {
      alert('Ошибка, поле "Месячный доход" должно быть заполнено!');
    }
  }
  addIncExpBlock(event) {
    const 
      className = event.target.parentNode.className,
      cloneExpensesItem = incExpItems[className][0].cloneNode(true),
      cloneExpensesTitle = cloneExpensesItem.querySelector(`.${className}-title`),
      cloneExpensesAmount = cloneExpensesItem.querySelector(`.${className}-amount`);

    cloneExpensesTitle.value = "";
    cloneExpensesAmount.value = "";
    cloneExpensesTitle.addEventListener("input", this.cyrillicInput);
    cloneExpensesAmount.addEventListener("input", this.numericInput);
    incExpItems[className][0].parentNode.insertBefore(cloneExpensesItem, addBlockButtons[className]);
    if (incExpItems[className].length === 3) {
      addBlockButtons[className].style.display = "none";
    }
  }
  changePeriod() {
    document.querySelector(".period-amount").textContent = periodSelect.value;
  }
  getAddIncExp() {
    ['income', 'expenses'].forEach(className => 
      Array.from(incExpItems[className]).forEach(item => {
        const 
          itemTitle = item.querySelector(`.${className}-title`).value,
          itemAmount = item.querySelector(`.${className}-amount`).value;

        if (itemTitle !== "" && itemAmount !== "") {
          this[className][itemTitle] = itemAmount;
        }
    }));
  }
  showResult() {
    budgetMonthValue.value = this.budgetMonth;
    budgetDayValue.value = this.budgetDay;
    expensesMonthValue.value = this.expensesMonth;
    additionalExpensesValue.value = this.addExpenses.join(", ");
    additionalIncomeValue.value = this.addIncome.join(", ");
    targetMonthValue.value = this.getTargetMonth();
    incomePeriodValue.value = this.calcSavedMoney();
  }
  getPosExpenses() {
    const addExpenses = additionalExpensesItem.value.split(",");

    addExpenses.forEach(item => {
      item = item.trim();
      if (item !== "") {
        this.addExpenses.push(item);
      }
    });
  }
  getPosIncome() {
    additionalIncomeItems.forEach(item => {
      const itemValue = item.value.trim();

      if (itemValue !== "") {
        this.addIncome.push(itemValue);
      }
    });
  }
  getExpensesMonth() {
    this.expensesMonth = 0;
    for (let key in this.expenses) {
      this.expensesMonth += +this.expenses[key];
    }
  }
  getIncomeMonth() {
    this.incomeMonth = 0;
    for (let key in this.income) {
      this.incomeMonth += +this.income[key];
    }
  }
  getBudget() {
    this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth;
    this.budgetDay = Math.floor(this.budgetMonth / 30, 0);
  }
  getTargetMonth() {
    return Math.ceil(targetAmount.value / this.budgetMonth);
  }
  calcSavedMoney() {
    return this.budgetMonth * periodSelect.value;
  }
  eventsListeners() {
    start.setAttribute("disabled", true);
    start.addEventListener("click", this.start.bind(this));
    cancel.addEventListener("click", this.reset.bind(this));
    periodSelect.setAttribute("disabled", true);
    salaryAmount.addEventListener("input", this.checkSalaryAmount.bind(this));
    addBlockButtons.income.addEventListener("click", this.addIncExpBlock.bind(this));
    addBlockButtons.expenses.addEventListener("click", this.addIncExpBlock.bind(this));
    periodSelect.addEventListener("input", this.changePeriod);
    titleInputItems.forEach(item => item.addEventListener("input", this.cyrillicInput));
    sumInputItems.forEach(item => item.addEventListener("input", this.numericInput));
  }
}

const appData = new AppData();