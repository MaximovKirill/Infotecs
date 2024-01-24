// Импорт данных из JSON
import dataArr from '../json/data.json' assert {type: "json"};

(() => {
  // Функция форматирования поля about (обрезание и "...")
  function toCutString(text, element) {
    let list = text.split(' ');
    while (element.scrollHeight > element.offsetHeight) {
      list.pop();
      element.textContent = list.join(' ') + '...';
     };
  };

  // Функция сортировки
  function sort(arr, prop, postProp = '0', dir = false) {
    if (postProp === '0') {
      arr.sort((a, b) => (!dir ? a[prop] < b[prop] : a[prop] > b[prop]) ? -1 : 1);
    } else {
        arr.sort((a, b) => (!dir ? a[prop][postProp] < b[prop][postProp] : a[prop][postProp] > b[prop][postProp]) ? -1 : 1);
      };
  };

  // Функция закрытия диалогового окна
  function toCloseDialog(dialog, inputFirstName, inputLastName, inputAbout, inputEyeColor) {
    inputFirstName = "";
    inputLastName = "";
    inputAbout = "";
    inputEyeColor = "";
    dialog.close();
    document.body.classList.remove('scroll-lock');
  };

  // Функция получения новой строки таблицы
  function getClient(dataElement = {}) {
    let row = document.createElement('tr');
    let col1 = document.createElement('td');
    let col2 = document.createElement('td');
    let col3 = document.createElement('td');
    let col4 = document.createElement('td');
    let wrapCol3 = document.createElement('div');

    row.append(col1);
    row.append(col2);
    row.append(col3);
    col3.append(wrapCol3);
    row.append(col4);

    row.classList.add('table__tr');
    col1.classList.add('table__td', 'table__td_firstname');
    col2.classList.add('table__td', 'table__td_lastname');
    col3.classList.add('table__td', 'table__td_about', 'about');
    wrapCol3.classList.add('about__wrap');
    col4.classList.add('table__td', 'table__td_eyecolor');

    // Столбец Имя
    col1.textContent = dataElement.name.firstName;

    // Столбец Фамилия
    col2.textContent = dataElement.name.lastName;

    // Столбец Описание
    wrapCol3.textContent = dataElement.about;

    // Столбец Цвет глаз
    col4.textContent = dataElement.eyeColor;
    col4.style.setProperty('background-color', `${dataElement.eyeColor}`);

    // Открытие диалогового окна изменения данных строки
    row.onclick = () => {
      let dialog = document.querySelector('.dialog');
      dialog.showModal();
      document.body.classList.add('scroll-lock');
      // Заполнение полей в диалоговом окне
      let inputFirstName = document.querySelector('.dialog__input_firstname');
      let inputLastName = document.querySelector('.dialog__input_lastname');
      let inputAbout = document.querySelector('.dialog__input_about');
      let inputEyeColor = document.querySelector('.dialog__input_eyecolor');
      inputFirstName.value = `${dataElement.name.firstName}`;
      inputLastName.value = `${dataElement.name.lastName}`;
      inputAbout.value = `${dataElement.about}`;
      inputEyeColor.value = `${dataElement.eyeColor}`;
      // Сохранение изменений (сохранение отображения, JSON не перезеписывается)
      let dialogBtnSave = document.querySelector('.dialog__button_save');
      dialogBtnSave.onclick = () => {
        if (inputFirstName.value != dataElement.name.firstName) {
          dataElement.name.firstName = inputFirstName.value;
        };
        if (inputLastName.value != dataElement.name.lastName) {
          dataElement.name.lastName = inputLastName.value;
        };
        if (inputAbout.value != dataElement.about) {
          dataElement.about = inputAbout.value;
        };
        if (inputEyeColor.value != dataElement.eyeColor) {
          dataElement.eyeColor = inputEyeColor.value;
        };
        tableView(tbody, dataArr, 0);
        toCloseDialog(dialog, inputFirstName, inputLastName, inputAbout, inputEyeColor);
      };
      // Закрытие диалогового окна по backdrop
      dialog.onclick = ({currentTarget, target}) => {
        const dialogElement = currentTarget;
        const isClickedOnBackDrop = target === dialogElement;
          if (isClickedOnBackDrop) {
            toCloseDialog(dialog, inputFirstName, inputLastName, inputAbout, inputEyeColor);
          };
      };
      // Закрытие диалогового окна по кнопке "Х"
      let closeButton = dialog.querySelector('.dialog__button_close');
      if (closeButton) {
        closeButton.onclick = () => {
          toCloseDialog(dialog, inputFirstName, inputLastName, inputAbout, inputEyeColor);
        };
      };
      // Закрытие диалогового окна по Esc
      document.addEventListener('keydown', (e) => {  
        if (e.key === 'Escape') {
          toCloseDialog(dialog, inputFirstName, inputLastName, inputAbout, inputEyeColor);
        };
      });
    };
    return {
      row,
    };
  };

  // Функция рендеринга таблицы
  function tableView(tbody, dataArr, i) {
    tbody.querySelectorAll('tr').forEach((el) => {
      el.remove();
    });
    if (dataArr.length) {
      for (let j = i; j < i + 10; j++) {
        tbody.append(getClient(dataArr[j]).row);
        // Обрезаем текст в поле "Описание"
        let arrOfAboutCell = document.querySelectorAll('.about__wrap');
        toCutString(arrOfAboutCell[arrOfAboutCell.length-1].textContent, arrOfAboutCell[arrOfAboutCell.length-1]);
      };
    };
  };

  // Основоное приложение
  function infotecsApp(tbody) {
    let countOfPagination = 0;
    // Вывод таблицы
    tableView(tbody, dataArr, 0);
    // Сортировка при нажатии ячеек шапки таблицы
    let sortData = [
      'name',
      'name',
      'about',
      'eyeColor',
    ];
    let sortFields = document.querySelectorAll('.table__th');
    let reversFirstName = false;
    let reversLastName = false;
    let reversAbout = false;
    let reversColor = false;
    sortFields.forEach((th_cell) => {
      th_cell.addEventListener('click', () => {
        countOfPagination = 0;
        switch (th_cell.getAttribute('data-path')) {
          case '0':
            sort(dataArr, `${sortData[th_cell.getAttribute('data-path')]}`, 'firstName', reversFirstName);
            reversFirstName = !reversFirstName;
            break;
          case '1':
            sort(dataArr, `${sortData[th_cell.getAttribute('data-path')]}`, 'lastName', reversLastName);
            reversLastName = !reversLastName;
            break;
          case '2':
            sort(dataArr, `${sortData[th_cell.getAttribute('data-path')]}`, '0', reversAbout);
            reversAbout = !reversAbout;
            break;
          case '3':
            sort(dataArr, `${sortData[th_cell.getAttribute('data-path')]}`, '0', reversColor);
            reversColor = !reversColor;
            break;
          default:
            sort(dataArr, 'name', 'firstName', false);
            !reversFirstName;
            break;
        };
        tableView(tbody, dataArr, 0);
      });
    });

    // Постраничный вывод
    let pagRight = document.querySelector('.pagination__button_right');
    let pagLeft = document.querySelector('.pagination__button_left');
    pagRight.onclick = () => {
      if (countOfPagination < dataArr.length - 10) {
        countOfPagination = countOfPagination + 10;
        tableView(tbody, dataArr, countOfPagination);
      };
    };
    pagLeft.onclick = () => {
      if (countOfPagination > 0) {
        countOfPagination = countOfPagination - 10;
        tableView(tbody, dataArr, countOfPagination);
      };
    };

    //Скрытие колонок для текущей страницы
    let flagFirstName = false;
    let flagLastName = false;
    let flagAbout = false;
    let flagEyeColor = false;
    let table = document.querySelector('.table');
    let arrBtnHidden = document.querySelectorAll('.pagination__button_hidden')
    arrBtnHidden.forEach((btn) => {
      btn.addEventListener('click', () => {
        switch (btn.getAttribute('data-path')) {
          case '0':
            if (!flagFirstName) {
              for (let i = 0; i < table.rows.length; i++) {
                table.rows[i].cells[0].classList.add('hidden');
              };
              btn.textContent = 'Показать имя';
              flagFirstName = !flagFirstName;
            } else {
                for (let i = 0; i < table.rows.length; i++) {
                  table.rows[i].cells[0].classList.remove('hidden');
                };
                btn.textContent = 'Скрыть имя';
                flagFirstName = !flagFirstName;
              };
            break;
          case '1':
            if (!flagLastName) {
              for (let i = 0; i < table.rows.length; i++) {
                table.rows[i].cells[1].classList.add('hidden');
              };
              btn.textContent = 'Показать фамилию';
              flagLastName = !flagLastName;
            } else {
                for (let i = 0; i < table.rows.length; i++) {
                  table.rows[i].cells[1].classList.remove('hidden');
                };
                btn.textContent = 'Скрыть фамилию';
                flagLastName = !flagLastName;
              };
            break;
          case '2':
            if (!flagAbout) {
              for (let i = 0; i < table.rows.length; i++) {
                table.rows[i].cells[2].classList.add('hidden');
              };
              btn.textContent = 'Показать описание';
              flagAbout = !flagAbout;
            } else {
                for (let i = 0; i < table.rows.length; i++) {
                  table.rows[i].cells[2].classList.remove('hidden');
                };
                btn.textContent = 'Скрыть описание';
                flagAbout = !flagAbout;
              };
            break;
            break;
          case '3':
            if (!flagEyeColor) {
              for (let i = 0; i < table.rows.length; i++) {
                table.rows[i].cells[3].classList.add('hidden');
              };
              btn.textContent = 'Показать цвет глаз';
              flagEyeColor = !flagEyeColor;
            } else {
                for (let i = 0; i < table.rows.length; i++) {
                  table.rows[i].cells[3].classList.remove('hidden');
                };
                btn.textContent = 'Скрыть цвет глаз';
                flagEyeColor = !flagEyeColor;
              };
            break;
        };
      });
    });
  };
  
  // Запись приложения в window для запуска из html
  window.createInfotecsApp = infotecsApp;
})();