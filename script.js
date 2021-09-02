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
  titleInputItems = document.querySelectorAll('input[placeholder="Наименование"]'),
  depositBank = document.querySelector('.deposit-bank'),
  depositAmount = document.querySelector('.deposit-amount'),
  depositPercent = document.querySelector('.deposit-percent');

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
    
    if (this.checkState()) {
      localStorage.appData = JSON.stringify(this);  
      this.loadData();
      salaryAmount.value = this.budget;
      this.loadIncExp();
      this.loadAddIncExp();
      this.loadInfoDeposit();
      periodSelect.value = JSON.parse(localStorage.periodSelect);
      targetAmount.value = JSON.parse(localStorage.targetAmount);
      this.changePeriod.call(periodSelect);
      this.showResult();
      this.setStartSettings();
    } else {
      localStorage.clear();
      localStorage.appData = JSON.stringify(this);
    }
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
  setCookie(name, value, year, month, day, path, domain, secure) {
    document.cookie = `${name}=${value}; ${
      year ? 'expires=' + new Date(year, month, day).toGMTString() : ''}${
      path ? '; path' + path : ''}${
      domain ? '; domain' + domain : ''}${
      secure ? '; secure' + secure : ''}`;
  }
  loadData() {
    for (let key in this) {
        this[key] = JSON.parse(localStorage[key]);
    }
  }
  loadIncExp() {
    ['income', 'expenses'].forEach(className => {
      let index = 0;
      for ( let key in this[className]) {
        if(!incExpItems[className][index]) {
          this.cloneItem(className);
        }
        incExpItems[className][index].querySelector(`.${className}-title`).value = key;
        incExpItems[className][index].querySelector(`.${className}-amount`).value = this[className][key];
        index++;
        }
    });
  }
  loadAddIncExp() {
    additionalIncomeItems.forEach((item, index) => 
      item.value = this.addIncome[index] ? this.addIncome[index] : '');
    additionalExpensesItem.value = this.addExpenses.join(', ');
  }
  loadInfoDeposit() {
    if (this.deposit) {
      depositCheck.setAttribute('checked', true);
      this.depositHandler();
      depositBank.value = JSON.parse(localStorage.depositBank);
      this.changePercent.call(depositBank);
      depositPercent.value = JSON.parse(localStorage.percentDeposit);
      depositAmount.value = JSON.parse(localStorage.moneyDeposit);
    }
  }
  resetProperties() {
    const appData = JSON.parse(localStorage.appData);
    
    for (let key in appData) {
      this[key] = appData[key];
    }

    localStorage.clear();
    localStorage.appData = JSON.stringify(this);
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
    periodSelect.value = 1;
    depositBank.style.display = 'none';
    depositAmount.style.display = 'none';
    depositPercent.style.display = 'none';
    depositCheck.removeAttribute("disabled");
    depositBank.removeAttribute("disabled");
    depositBank.value = '';
    depositAmount.value = '';
    depositPercent.value = '';
    depositBank.removeEventListener('change', this.changePercent);
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
    depositCheck.setAttribute("disabled", true);
    depositBank.setAttribute("disabled", true);
    start.style.display = "none";
    cancel.style.display = "block";
  }
  saveState() {
    const today = new Date();
    today.setDate(today.getDate() + 1);

    const
      year = today.getFullYear(),
      month = today.getMonth(),
      day = today.getDay();

    for (let key in this) {
      if (key !== 'periodSelectListener') {
        this.setCookie(key, JSON.stringify(this[key]), year, month, day);
        localStorage[key] = JSON.stringify(this[key]);
      }
    }

    this.setCookie('depositBank', JSON.stringify(depositBank.value ), year, month, day);
    localStorage.depositBank = JSON.stringify(depositBank.value );
    this.setCookie('periodSelect', JSON.stringify(periodSelect.value ), year, month, day);
    localStorage.periodSelect = JSON.stringify(periodSelect.value );
    this.setCookie('targetAmount', JSON.stringify(targetAmount.value ), year, month, day);
    localStorage.targetAmount = JSON.stringify(targetAmount.value );
    this.setCookie('isLoad', JSON.stringify(true), year, month, day);
  }
  checkState() {
    const 
      cookieState =  document.cookie ? Object.assign(...document.cookie.split('; ').map(item => {
        const obj = {};

        obj[item.split('=')[0]] = item.split('=')[1];
        return obj;
      })) : '';
    if (cookieState.isLoad && (localStorage.length >= 16)) {
      for (let key in localStorage) {
        if (!localStorage.hasOwnProperty(key) || key === 'appData') {
          continue;
        }
        if (cookieState[key] !== localStorage[key]) {
          return false;
        }
      }
      return true;
    } else {
      return false;
    }
  }
  start() {
    this.budget = +salaryAmount.value;
    this.getAddIncExp();
    this.getPosExpenses();
    this.getIncomeMonth();
    this.getExpensesMonth();
    this.getPosIncome();
    this.getInfoDeposit();
    this.getBudget();
    this.showResult();

    this.setStartSettings();

    this.saveState();
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
  checkSalaryAmountValue() {
    if (salaryAmount.value !== "") {
      if (start.getAttribute("disabled") && (!this.deposit || depositPercent.value !== '') ) {
        start.removeAttribute("disabled");
      }
    } else {
      alert('Ошибка: поле "Месячный доход" должно быть заполнено!');
    }
  }
  checkDepositPercentValue() {
    if (depositPercent.value !== "" && (+depositPercent.value <= 100)) {
      if (start.getAttribute("disabled") && salaryAmount.value !== '') {
        start.removeAttribute("disabled");
      }
    } else {
      depositPercent.value = depositPercent.value ? 
        +depositPercent.value > 100 ?  
          depositPercent.value.slice(0, 2) : 0 : '';
      alert('Ошибка: введите корректное значение в поле проценты!');
    }
  }
  cloneItem(className) {
    const 
      cloneItem = incExpItems[className][0].cloneNode(true),
      cloneTitle = cloneItem.querySelector(`.${className}-title`),
      cloneAmount = cloneItem.querySelector(`.${className}-amount`);

    cloneTitle.value = "";
    cloneAmount.value = "";
    cloneTitle.addEventListener("input", this.cyrillicInput);
    cloneAmount.addEventListener("input", this.numericInput);
    incExpItems[className][0].parentNode.insertBefore(cloneItem, addBlockButtons[className]);
    if (incExpItems[className].length === 3) {
      addBlockButtons[className].style.display = "none";
    }
  }
  addIncExpBlock(event) {
    this.cloneItem(event.target.parentNode.className);
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
    const monthDeposit = this.moneyDeposit * (this.percentDeposit / 100);
    this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth + monthDeposit;
    this.budgetDay = Math.floor(this.budgetMonth / 30, 0);
  }
  getTargetMonth() {
    return Math.ceil(targetAmount.value / this.budgetMonth);
  }
  calcSavedMoney() {
    return this.budgetMonth * periodSelect.value;
  }
  getInfoDeposit() {
    if (this.deposit) {
      this.percentDeposit = depositPercent.value;
      this.moneyDeposit = depositAmount.value;
    }
  }
  changePercent() {
    const valueIndex = this.value;

    if (valueIndex === 'other') {
      depositPercent.value = '';
      depositPercent.style.display = 'inline-block';
      start.setAttribute("disabled", true);
    } else {
      depositPercent.style.display = 'none';
      depositPercent.value = valueIndex;
      if (start.getAttribute("disabled") && salaryAmount.value !== '') {
        start.removeAttribute("disabled");
      }
    }
  }
  depositHandler(event) {
    if (depositCheck.checked) {
      depositBank.style.display = 'inline-block';
      depositAmount.style.display = 'inline-block';
      start.setAttribute("disabled", true);
      this.deposit = true;
      depositBank.addEventListener('change', this.changePercent);
    } else {
      depositBank.style.display = 'none';
      depositAmount.style.display = 'none';
      depositBank.value = '';
      depositAmount.value = '';
      this.deposit = false;
      depositBank.removeEventListener('change', this.changePercent);
      if (start.getAttribute("disabled") && salaryAmount.value !== '') {
        start.removeAttribute("disabled");
      }
    }
  }
  eventsListeners() {
    start.setAttribute("disabled", true);
    start.addEventListener("click", this.start.bind(this));
    cancel.addEventListener("click", this.reset.bind(this));
    salaryAmount.addEventListener("input", this.checkSalaryAmountValue.bind(this));
    addBlockButtons.income.addEventListener("click", this.addIncExpBlock.bind(this));
    addBlockButtons.expenses.addEventListener("click", this.addIncExpBlock.bind(this));
    periodSelect.addEventListener("input", this.changePeriod);
    titleInputItems.forEach(item => item.addEventListener("input", this.cyrillicInput));
    sumInputItems.forEach(item => item.addEventListener("input", this.numericInput));
    depositPercent.addEventListener("input", this.numericInput);
    depositPercent.addEventListener("input", this.checkDepositPercentValue);
    depositCheck.addEventListener('change', this.depositHandler.bind(this));
  }
}

const appData = new AppData();