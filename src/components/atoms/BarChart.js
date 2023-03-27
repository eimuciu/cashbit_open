import styled from 'styled-components';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { createAndSumEachCategory } from '../../utils/commonFunctions';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);
const dataToRender = (expense) => {
  const eachCategorySummedUp = createAndSumEachCategory(expense);
  const data = [];

  for (let x in eachCategorySummedUp) {
    if (parseFloat(eachCategorySummedUp[x]) !== 0) {
      data.push({ name: x, value: parseFloat(eachCategorySummedUp[x]) });
    }
  }
  return data;
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
};

const getData = (expense, colors) => {
  const shapedData = dataToRender(expense);
  const data = {
    labels: shapedData.map(
      (item, idx) => idx + 1 + '. ' + item.name.toUpperCase(),
    ),
    datasets: [
      {
        label: 'EXPENSE',
        data: shapedData.map((item) => item.value),
        backgroundColor: shapedData.map((x) => colors[x.name]),
      },
    ],
  };
  return data;
};

const BarChart = ({ expense, colors }) => {
  return (
    <>
      <PieContainer>
        <Bar
          style={{ width: '100%', height: '100%' }}
          options={options}
          data={getData(expense, colors)}
        />
      </PieContainer>
    </>
  );
};

const PieContainer = styled.div`
  padding-top: 25px;
  width: 50%;
  height: 100%;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

export default BarChart;
