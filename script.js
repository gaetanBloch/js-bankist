'use strict';

class Account {
  userName;
  balance;

  constructor(owner, movements, interestRate, pin) {
    this.owner = owner;
    this.movements = movements;
    this.interestRate = interestRate; // %
    this.pin = pin;
  }
}

const account1 = new Account(
  'Gaetan Bloch',
  [200, 450, -400, 3000, -650, -130, 70, 1300],
  1.2,
  1111,
);

const account2 = new Account(
  'Jessica Davis',
  [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  1.5,
  2222,
);

const account3 = new Account(
  'Steven Thomas Williams',
  [200, 450, -400, 3000, -650, -130, 70, 1300],
  0.7,
  3333,
);

const account4 = new Account(
  'Sarah Smith',
  [430, 1000, 700, 50, 90],
  1,
  4444,
);

const accounts = [account1, account2, account3, account4];

let currentAccount;
let sorted = false;

// Elements
const app = document.querySelector('.app');

const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

////////////////////
// Functions
////////////////////

// Movements
const displayMovements = (movements) => {
  // Clear the movements
  containerMovements.innerHTML = '';
  movements.forEach((movement, i) => {
    const type = movement < 0 ? 'withdrawal' : 'deposit';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
      <div class="movements__value">${movement} €</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Balance
const displayBalance = account => {
  account.balance = account.movements.reduce((acc, cur) => acc + cur);
  labelBalance.textContent = account.balance + ' €';
};

// Summary

const displaySummary = account => {
  displayIn(account);
  displayOut(account);
  displayInterests(account);
};

const displaySum = (movements, label, filter) =>
  label.textContent = Math.abs(movements
    .filter(mov => filter(mov))
    .reduce((acc, mov) => acc + mov)) + ' €';

//// IN
const displayIn = account =>
  displaySum(account.movements, labelSumIn, mov => mov > 0);

//// OUT
const displayOut = account =>
  displaySum(account.movements, labelSumOut, mov => mov < 0);

//// Interests
const displayInterests = account => {
  labelSumInterest.textContent = account
    .movements
    .filter(mov => mov > 0)
    .map(mov => mov * account.interestRate / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int) + ' €';
};

const displayUI = account => {
  displayMovements(account.movements);
  displayBalance(account);
  displaySummary(account);
};

// Login

//// User names
const createUserName = user =>
  user
    .trim()
    .toLowerCase()
    .split(' ')
    .map(name => name[0])
    .join('');

const createUserNames = accounts =>
  accounts.forEach(account => account.userName = createUserName(account.owner));

//// Credentials
const getCredentials = () =>
  accounts.find(account =>
    account.userName === inputLoginUsername.value &&
    account.pin === Number(inputLoginPin.value));

const login = event => {
  // Prevent the page to be reloaded on form submit
  event.preventDefault();

  const account = getCredentials();
  if (!account) {
    alert('Wrong credentials!');
    return;
  }

  console.log(account);
  currentAccount = account;

  app.style.opacity = '1';
  labelWelcome.textContent = 'Good Day, ' + account.owner.split(' ')[0];
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginUsername.blur();
  inputLoginPin.blur();

  displayUI(account);
};

// Transfers

const checkTransfer = (transferAccount, amount) => {
  if (!transferAccount) {
    alert('Transfer account does not exist');
    return false;
  }
  if (amount <= 0) {
    alert('Transfer amount must be superior to 0');
    return false;
  }
  if (amount > currentAccount.balance) {
    alert('You don\'t have enough in your account to make the transfer');
    return false;
  }
  if (transferAccount.userName === currentAccount.userName &&
    transferAccount.pin === currentAccount.pin) {
    alert('You cannot transfer money to your own account');
    return false;
  }
  return true;
};

const transfer = event => {
  // Prevent the page to be reloaded on form submit
  event.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const transferAccount = accounts.find(account =>
    account.userName === inputTransferTo.value);

  if (!checkTransfer(transferAccount, amount)) {
    return;
  }

  currentAccount.movements.push(-amount);
  transferAccount.movements.push(amount);
  displayUI(currentAccount);

  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferTo.blur();
  inputTransferAmount.blur();
};

// Loan money

const loan = event => {
  // Prevent the page to be reloaded on form submit
  event.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    displayUI(currentAccount);

    inputLoanAmount.value = '';
    inputLoanAmount.blur();

    return;
  }

  alert(`One of your deposit should at least ${amount * 0.1} €`);
};

// Close Account

const close = event => {
  // Prevent the page to be reloaded on form submit
  event.preventDefault();

  const index = accounts.findIndex(account =>
    account.userName === inputCloseUsername.value &&
    account.pin === Number(inputClosePin.value));

  if (index === -1) {
    alert('Could not find account to close');
    return;
  }

  if (currentAccount.userName === accounts[index].userName &&
    currentAccount.pin === accounts[index].pin) {
    containerApp.style.opacity = '0';
  }

  inputCloseUsername.value = inputClosePin.value = '';
  inputCloseUsername.blur();
  inputClosePin.blur();
  labelWelcome.textContent = 'Log in to get started';

  accounts.splice(index);
};

// Sorting movements

const sort = () => {
  if (sorted) {
    displayMovements(currentAccount.movements);
  } else {
    const movCp = [...currentAccount.movements];
    movCp.sort((a, b) => a - b);
    displayMovements(movCp);
  }
  sorted = !sorted;
};

// Initialize
const init = () => {
  createUserNames(accounts);
  btnLogin.addEventListener('click', login);
  btnTransfer.addEventListener('click', transfer);
  btnLoan.addEventListener('click', loan);
  btnClose.addEventListener('click', close);
  btnSort.addEventListener('click', sort);
};

init();