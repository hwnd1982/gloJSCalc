'use strict';

let
  expensesItems = document.querySelectorAll('.expenses-items'),
  incomeItems = document.querySelectorAll('.income-items');
const
  start = document.getElementById('start'),
  cancel = document.getElementById('cancel'),
  addIncomeBlockButton = document.querySelector('.income').getElementsByTagName('button')[0], 
  addExpensesBlockButton = document.querySelector('.expenses').getElementsByTagName('button')[0],
  depositCheck = document.querySelector('#deposit-check'),
  additionalIncomeItems = document.querySelectorAll('.additional_income-item'),
  budgetMonthValue = document.getElementsByClassName('budget_month-value')[0],
  budgetDayValue = document.getElementsByClassName('budget_day-value')[0],
  expensesMonthValue = document.getElementsByClassName('expenses_month-value')[0],
  additionalIncomeValue  = document.getElementsByClassName('additional_income-value')[0],
  additionalExpensesValue = document.getElementsByClassName('additional_expenses-value')[0],
  incomePeriodValue = document.getElementsByClassName('income_period-value')[0],
  targetMonthValue = document.getElementsByClassName('target_month-value')[0],
  salaryAmount = document.querySelector('.salary-amount'),
  incomeTitle = document.querySelector('input.income-title'),
  expensesTitle = document.querySelector('input.expenses-title'),
  additionalExpensesItem = document.querySelector('.additional_expenses-item'),
  targetAmount = document.querySelector('.target-amount'),
  periodSelect = document.querySelector('.period-select'),
  sumInputItems = document.querySelectorAll('input[placeholder="Сумма"]'),
  titleInputItems = document.querySelectorAll('input[placeholder="Наименование"]'),
  isNumber = function(num) {
    return !isNaN(parseFloat(num)) && isFinite(num);
  },
  checkSpaces = function(str) {
    return !str ? str : str.trim() !== '';
  },
  getDeclensionOfStringByNumber = function(num, expressions) { 
    switch (true) {
      case +((num += '').substr(-2)) > 10  &&  
        +((num += '').substr(-2)) <= 20 : 
          return num  + ' ' + expressions[2];
      case num % 10 === 0: return num  + ' ' + expressions[2];
      case num % 10 === 1: return num  + ' ' + expressions[0];
      case num % 10 < 5: return num  + ' ' + expressions[1];
      default: return num  + ' ' + expressions[2];
    }
  },
  appData = {
    budget: 0,
    income: {},
    incomeMonth: 0,
    addIncome: [],
    expenses: {},
    addExpenses: [],
    deposit: false,
    percentDeposit: 0,
    moneyDeposit: 0,
    budgetMonth: 0,
    expensesMonth: 0,
    budgetDay: 0,
    resetProperties: function () {
      let 
        appData = JSON.parse(localStorage.appData);
      for (let key in appData) {
        this[key] = appData[key];
      }
    },
    resetDataInputs: function() {
      document.querySelector('.data').querySelectorAll('input[type=text]').forEach(function(item) {
        item.removeAttribute('disabled');
        item.value = '';
      });
    },
    resetResultInputs: function() {
      document.querySelector('.result').querySelectorAll('input').forEach(function(item) {
        item.value = '';
      });
    },
    removeExpensesInputs: function() {
      document.querySelectorAll('.expenses-items').forEach(function(item, index) {
        if (index !== 0) {
          item.remove();
        }
      });
      expensesItems = document.querySelectorAll('.expenses-items');
      addExpensesBlockButton.style.display = 'block';
    },
    removeIncomeInputs: function() {
      document.querySelectorAll('.income-items').forEach(function(item, index) {
        if (index !== 0) {
          item.remove();
        }
      });
      incomeItems = document.querySelectorAll('.income-items');
      addIncomeBlockButton.style.display = 'block';
    },
    resetStartSettings: function() {
      depositCheck.checked = false;
      start.setAttribute('disabled', true);
      start.style.display = 'block';
      cancel.style.display = 'none';
      periodSelect.removeEventListener('input', this.periodSelectListener);
      cancel.removeEventListener('click', this.resetListener);
      periodSelect.setAttribute('disabled', true);
      periodSelect.value = 1;
      this.changePeriod();
    },
    reset: function() {
      this.resetProperties();
      this.removeExpensesInputs();
      this.removeIncomeInputs();
      this.resetDataInputs();
      this.resetResultInputs();
      this.resetStartSettings();
    },
    setStartSettings: function() {
      this.periodSelectListener = this.showResult.bind(this);
      periodSelect.addEventListener('input', this.periodSelectListener);
      document.querySelector('.data').querySelectorAll('input[type=text]').forEach(function(item) {
        item.setAttribute('disabled', true);
      });
      addExpensesBlockButton.style.display = 'none';
      addIncomeBlockButton.style.display = 'none';
      start.style.display = 'none';
      cancel.style.display = 'block';
      this.resetListener = this.reset.bind(this);
      cancel.addEventListener('click', this.resetListener);
    },
    start: function() {
      if (!localStorage.appData) {
        localStorage.appData = JSON.stringify(this);
      }
      this.budget = +salaryAmount.value;
      this.getIncome();
      this.getExpenses();
      this.getAddExpenses();
      this.getIncomeMonth();
      this.getExpensesMonth();
      this.getAddIncome();
      this.getBudget();
      this.showResult();
      this.setStartSettings();
    },
    cyrillicInput: function(event) {
      if (!event.key.match(/[?!,.а-яА-ЯёЁ\s]/) && event.key !== 'Backspace' && event.key !== 'Tab') {
        event.preventDefault();
      }
    },
    numericInput: function(event) {
      if (!event.key.match(/[\d]/) && event.key !== 'Backspace' && event.key !== 'Tab') {
        event.preventDefault();
      }
    },
    checkSalaryAmount: function() {
      if (salaryAmount.value !== '') {
        if (start.getAttribute('disabled')) {
          start.removeAttribute('disabled');
          periodSelect.removeAttribute('disabled');
          start.addEventListener('click', this.start.bind(this));
        }
      } else {
        alert('Ошибка, поле "Месячный доход" должно быть заполнено!');
      }
    },
    addExpensesBlock: function() {
      let cloneExpensesItem = expensesItems[0].cloneNode(true),
        cloneExpensesTitle = cloneExpensesItem.querySelector('.expenses-title'),
        cloneExpensesAmount = cloneExpensesItem.querySelector('.expenses-amount');
      
      cloneExpensesTitle.value = '';
      cloneExpensesAmount.value = '';
      cloneExpensesTitle.addEventListener('keydown', this.cyrillicInput);
      cloneExpensesAmount.addEventListener('keydown', this.numericInput);
      expensesItems[0].parentNode.insertBefore(cloneExpensesItem, addExpensesBlockButton);
      expensesItems = document.querySelectorAll('.expenses-items');
      if (expensesItems.length === 3) {
        addExpensesBlockButton.style.display = 'none';
      }
    },
    addIncomeBlock: function() {
      let cloneIncomeItem = incomeItems[0].cloneNode(true),
        cloneIncomeTitle = cloneIncomeItem.querySelector('.income-title'),
        cloneIncomAmount = cloneIncomeItem.querySelector('.income-amount');
      
      cloneIncomeTitle.value = '';
      cloneIncomAmount.value = '';
      cloneIncomeTitle.addEventListener('keydown', this.cyrillicInput);
      cloneIncomAmount.addEventListener('keydown', this.numericInput);
      incomeItems[0].parentNode.insertBefore(cloneIncomeItem, addIncomeBlockButton);
      incomeItems = document.querySelectorAll('.income-items');
      if (incomeItems.length === 3) {
        addIncomeBlockButton.style.display = 'none';
      }
    },
    changePeriod: function() {
      document.querySelector('.period-amount').textContent = periodSelect.value;
    },
    getExpenses: function() {
      expensesItems.forEach(function(item) {
        let 
          itemExpenses = item.querySelector('.expenses-title').value, 
          cashExpenses = item.querySelector('.expenses-amount').value;

          if (itemExpenses !== '' && cashExpenses !== '') {
            this.expenses[itemExpenses] = cashExpenses;
          }
      }, this);
    },
    getIncome: function() {
      incomeItems.forEach(function(item) {
        let 
          itemIncome = item.querySelector('.income-title').value, 
          cashIncome = item.querySelector('.income-amount').value;
          if (itemIncome !== '' && cashIncome !== '') {
            this.income[itemIncome] = cashIncome;
          }
      }, this);
    },
    showResult: function() {
      budgetMonthValue.value = this.budgetMonth;
      budgetDayValue.value = this.budgetDay;
      expensesMonthValue.value = this.expensesMonth;
      additionalExpensesValue.value = this.addExpenses.join(', ');
      additionalIncomeValue.value = this.addIncome.join(', ');
      targetMonthValue.value = this.getTargetMonth();
      incomePeriodValue.value = this.calcSavedMoney();
    },
    getAddExpenses: function() {
      let addExpenses = additionalExpensesItem.value.split(',');
      
      addExpenses.forEach(function(item) {
        item = item.trim();
        if (item !== '') {
          this.addExpenses.push(item);
        }
      }, this);
    },
    getAddIncome: function() {
      additionalIncomeItems.forEach(function(item) {
        let itemValue = item.value.trim();

        if (itemValue !== '') {
          this.addIncome.push(itemValue);
        }
      }, this);
    },
    getExpensesMonth: function() {
      this.expensesMonth = 0;
      for (let key in this.expenses) {
        this.expensesMonth += +this.expenses[key];
      }
    },
    getIncomeMonth: function() {
      this.incomeMonth = 0;
      for (let key in this.income) {
        this.incomeMonth += +this.income[key];
      }
    },
    getBudget: function() {
      this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth;
      this.budgetDay = Math.floor(this.budgetMonth / 30, 0);
    },
    getTargetMonth: function() {
      return Math.ceil(targetAmount.value / this.budgetMonth);
    },
    getStatusIncome: function() {
      switch (true) {
        case this.budgetDay > 1200:
          return('У вас высокий уровень дохода');
        case this.budgetDay <= 1200 && this.budgetDay >= 600:
          return('У вас средний уровень дохода');
        case this.budgetDay < 600 &&  this.budgetDay > 0:
          return('К сожалению, ваш уровень дохода ниже среднего');
        default:
          return('Что то пошло не так');
      }
    },
    getInfoDeposit: function() {
      if (this.deposit) {
        do {
          this.percentDeposit = prompt('Какой годовой процент,', 4);
        } while(!isNumber(this.percentDeposit));
        do {
          this.moneyDeposit = prompt('Какая сумма заложена?', 150000);
        } while(!isNumber(this.moneyDeposit));
        
      }
    }, 
    calcSavedMoney: function() {
      return this.budgetMonth * periodSelect.value;
    },
    initiation: function() {
      start.setAttribute('disabled', true);
      periodSelect.setAttribute('disabled', true);
      salaryAmount.addEventListener('input', this.checkSalaryAmount.bind(this));
      addExpensesBlockButton.addEventListener('click', this.addExpensesBlock);
      addIncomeBlockButton.addEventListener('click', this.addIncomeBlock);
      periodSelect.addEventListener('input', this.changePeriod);
      titleInputItems.forEach(function(item) {
        item.addEventListener('keydown', this.cyrillicInput);
      }, this);
      sumInputItems.forEach(function(item) {
        item.addEventListener('keydown', this.numericInput);
      }, this);
    }
  };

appData.initiation.call(appData);