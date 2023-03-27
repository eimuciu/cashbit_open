/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import NavBar from './components/molecules/NavBar';
import Wallet from './components/pages/Wallet';
import Stats from './components/pages/Stats';
import Profile from './components/pages/Profile';
import HeaderData from './components/molecules/HeaderData';
import { sortByDate } from './utils/sortByDate';
import { ExpenseData, IncomeData, SettingsData } from './types/types';
import { budgetFilter } from './utils/budgetFilters';
import { dataFilter } from './utils/dataFilters';
import { useAuthCtx } from './store/authProvider';
import { randomColorGenerator } from './utils/randomColorGenerator';

import {
  addExpenseToDb,
  getExpenseFromDb,
  addIncomeToDb,
  getIncomeFromDb,
  getSettingsfromDb,
  deleteExpenseDocFromDb,
  deleteIncomeDocFromDb,
  updateExpenseDocInDb,
  updateIncomeDocInDb,
  getUserDetailsFromDb,
  updateUserSettingsInDb,
} from './api/db';

// function reshapeColorsInDb(expenseCategoriesArr: any, colorsArr: any) {
//   const colorsObj: any = {};
//   expenseCategoriesArr.forEach((element: string, indx: number) => {
//     colorsObj[element.toLowerCase()] = colorsArr[indx];
//   });
//   console.log(colorsObj);
//   return colorsObj;
// }

const Finance = () => {
  const [expense, setExpense] = useState<ExpenseData[]>([]);
  const [income, setIncome] = useState<IncomeData[]>([]);
  const [pageToShow, setPageToShow] = useState<string>('wallet');
  const [whichForm, setWhichForm] = useState<string>('expense');
  const [filter, setFilter] = useState<string>('THIS_MONTH');
  const [isCustomDate, setIsCustomDate] = useState<boolean>(false);
  const [customDateData, setCustomDateData] = useState({
    startDate: '',
    finishDate: '',
  });
  const [common, setCommon] = useState({
    isExpenseOrIncomeTable: true,
    selectedChart: 'a',
    currentPage: 1,
    currentPageIncome: 1,
    postsPerPage: 10,
  });
  const [settings, setSettings] = useState<SettingsData>({
    expenseCategory: [],
    incomeSource: [],
    currency: '',
    colors: {},
    budget: [],
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { logout, user, addUserDetails } = useAuthCtx();

  // +
  useEffect(() => {
    if (user) {
      getExpenseFromDb(user.uid).then((expenseData) => {
        setExpense(sortByDate(expenseData || []));
        setIsLoading(false);
      });
      getSettingsfromDb(user.uid).then((settingsData: any) => {
        setSettings(settingsData[0] || {});
      });
      getIncomeFromDb(user.uid).then((incomeData) => {
        setIncome(sortByDate(incomeData || []));
      });
      getUserDetailsFromDb(user.uid).then((userDetails) => {
        addUserDetails(userDetails);
      });
    }
  }, []);

  // +
  function addBudget(budgetObj: any) {
    const budgetItem = settings.budget.find(
      (item: any) =>
        new Date(item?.date).getMonth() === new Date(budgetObj.date).getMonth(),
    );

    if (!budgetItem) {
      updateUserSettingsInDb(user.uid, {
        ...settings,
        budget: [...settings.budget, budgetObj],
      }).then(() => {
        setSettings((prev) => ({
          ...prev,
          budget: [...prev.budget, budgetObj],
        }));
      });
      return;
    }

    updateUserSettingsInDb(user.uid, {
      ...settings,
      budget: settings.budget.map((item: any) => {
        if (
          new Date(item.date).getMonth() === new Date(budgetObj.date).getMonth()
        ) {
          return budgetObj;
        } else {
          return item;
        }
      }),
    }).then(() => {
      setSettings((prev: any) => ({
        ...prev,
        budget: prev.budget.map((item: any) => {
          if (
            new Date(item.date).getMonth() ===
            new Date(budgetObj.date).getMonth()
          ) {
            return budgetObj;
          } else {
            return item;
          }
        }),
      }));
    });
  }

  // +
  function addIncome(values: IncomeData) {
    addIncomeToDb(user.uid, values).then((id) => {
      setIncome((prev) => sortByDate([...prev, { ...values, _id: id }]));
    });
  }

  // +
  function addExpense(values: ExpenseData) {
    addExpenseToDb(user.uid, values).then((id) => {
      setExpense((prev) => sortByDate([...prev, { ...values, _id: id }]));
    });
  }

  // +
  function removeIncome(item: IncomeData) {
    deleteIncomeDocFromDb(user.uid, item._id as string).then(() => {
      setIncome((prev) => prev.filter((x) => x._id !== item._id));
    });
  }

  // +
  function removeExpense(item: ExpenseData) {
    deleteExpenseDocFromDb(user.uid, item._id as string).then(() => {
      setExpense((prev) => prev.filter((x) => x._id !== item._id));
    });
  }

  // +
  function saveIncome(changedData: IncomeData) {
    updateIncomeDocInDb(user.uid, changedData).then(() => {
      setIncome((prev) =>
        sortByDate(
          prev.map((x) => (x._id === changedData._id ? changedData : x)),
        ),
      );
    });
  }

  // +
  function saveExpense(changedData: ExpenseData) {
    updateExpenseDocInDb(user.uid, changedData).then(() => {
      setExpense((prev) =>
        sortByDate(
          prev.map((x) => (x._id === changedData._id ? changedData : x)),
        ),
      );
    });
  }

  // +
  function selectTable(event: any) {
    let value = JSON.parse(event.target.value);
    setCommon({
      ...common,
      isExpenseOrIncomeTable: value,
    });
  }

  // +
  function selectChart(event: any) {
    setCommon({
      ...common,
      selectedChart: event.target.value,
    });
  }

  // +
  function paginateExpense(number: number) {
    setCommon({
      ...common,
      currentPage: number,
    });
  }

  // +
  function paginateIncome(number: number) {
    setCommon({
      ...common,
      currentPageIncome: number,
    });
  }

  // +
  function logoutAccount() {
    logout();
  }

  // +
  function changePage(page: string) {
    setPageToShow(page);
  }

  // +
  function changeForm(formDetails: string) {
    setWhichForm(formDetails);
  }

  // +
  function changeFilter(e: any) {
    if (e.target.value === 'CUSTOM_DATE') {
      setIsCustomDate(true);
      return;
    }
    setFilter(e.target.value);
    setIsCustomDate(false);
    setCustomDateData({ startDate: '', finishDate: '' });
  }

  // +
  function submitCustomDate(data: any) {
    setFilter('CUSTOM_DATE');
    setCustomDateData(data);
  }

  // +
  function handleChangeCurrency(currencyPicked: string) {
    updateUserSettingsInDb(user.uid, {
      ...settings,
      currency: currencyPicked,
    }).then(() => {
      setSettings((prev) => ({ ...prev, currency: currencyPicked }));
    });
  }

  // +
  function handleChangeExpenseCategories(amendedExpenses: any) {
    const expenseList = amendedExpenses.map((x: any) => x.toLowerCase());
    const anyChanges =
      JSON.stringify(expenseList) !== JSON.stringify(settings.expenseCategory);
    const expenseAdded = expenseList.length > settings.expenseCategory.length;
    if (anyChanges) {
      if (expenseAdded) {
        const colorsList: any = { ...settings.colors };

        expenseList.forEach((x: string) => {
          if (!colorsList[x.toLowerCase()]) {
            colorsList[x] = randomColorGenerator();
          }
        });
        updateUserSettingsInDb(user.uid, {
          ...settings,
          expenseCategory: expenseList,
          colors: colorsList,
        }).then(() => {
          setSettings((prev) => ({
            ...prev,
            expenseCategory: expenseList,
            colors: colorsList,
          }));
        });
      } else {
        const removedItems = settings.expenseCategory.filter(function (v: any) {
          return expenseList.indexOf(v) === -1;
        });

        const amendedColors: any = { ...settings.colors };

        removedItems.forEach((x) => {
          delete amendedColors[x.toLowerCase()];
        });
        updateUserSettingsInDb(user.uid, {
          ...settings,
          expenseCategory: expenseList,
          colors: amendedColors,
        }).then(() => {
          setSettings((prev) => ({
            ...prev,
            expenseCategory: expenseList,
            colors: amendedColors,
          }));
        });
      }
    }
  }

  // +
  function handleChangeIncomeSource(sourceList: any) {
    updateUserSettingsInDb(user.uid, {
      ...settings,
      incomeSource: sourceList,
    }).then(() => {
      setSettings((prev) => ({ ...prev, incomeSource: sourceList }));
    });
  }

  // +
  function handleChangeColor(colorsList: any) {
    updateUserSettingsInDb(user.uid, { ...settings, colors: colorsList })
      .then(() => {
        setSettings((prev) => ({ ...prev, colors: colorsList }));
      })
      .catch(() => {
        alert('Issue occured! Try again!');
      });
  }
  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Wrapper>
          <NavBar logOut={logoutAccount} changeThePage={changePage} />
          <Container>
            <HeaderData
              expense={dataFilter(expense, filter, customDateData)}
              income={dataFilter(income, filter, customDateData)}
              currency={settings.currency}
              changeFilter={changeFilter}
              submitCustomDate={submitCustomDate}
              isCustomDate={isCustomDate}
              label={{ filter: filter, customDate: customDateData }}
            />
            {pageToShow === 'wallet' && (
              <Wallet
                addBudget={addBudget}
                filter={filter}
                budget={budgetFilter(settings.budget, filter, customDateData)}
                whichForm={whichForm}
                expense={dataFilter(expense, filter, customDateData)}
                income={dataFilter(income, filter, customDateData)}
                common={common}
                currency={settings.currency}
                addExpense={addExpense}
                addIncome={addIncome}
                selectChart={selectChart}
                paginateExpense={paginateExpense}
                paginateIncome={paginateIncome}
                saveExpense={saveExpense}
                saveIncome={saveIncome}
                removeIncome={removeIncome}
                removeExpense={removeExpense}
                onSelectExpenseIncomeTable={selectTable}
                changeForm={changeForm}
                expenseCategories={settings.expenseCategory}
                incomeSource={settings.incomeSource}
              />
            )}
            {pageToShow === 'stats' && (
              <Stats
                selectChart={selectChart}
                selectedChart={common.selectedChart}
                expense={dataFilter(expense, filter, customDateData)}
                removeExpense={removeExpense}
                saveExpense={saveExpense}
                currency={settings.currency}
                colors={settings.colors}
                expenseCategories={settings.expenseCategory}
              />
            )}
            {pageToShow === 'profile' && (
              <Profile
                user={user}
                settings={settings}
                handleChangeCurrency={handleChangeCurrency}
                handleChangeExpenseCategories={handleChangeExpenseCategories}
                handleChangeIncomeSource={handleChangeIncomeSource}
                handleChangeColor={handleChangeColor}
                expense={expense}
                income={income}
              />
            )}
          </Container>
        </Wrapper>
      )}
    </>
  );
};

const Wrapper = styled.div`
  padding: 10px 0px;
`;

const Container = styled.div`
  width: 95%;
  margin: 0 auto;
  padding-left: 15%;
  @media (max-width: 768px) {
    padding-left: 0%;
  }
`;

export default Finance;
