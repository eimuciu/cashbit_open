import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Cross } from '@styled-icons/entypo/Cross';
import SettingsModal from './SettingsModal';

const SingleColor = ({ color, handleColorInput, category }) => {
  const [colorInput, setColorInput] = useState(color);

  const handleColorChange = (e) => {
    setColorInput(e.target.value);
    handleColorInput(e.target.value, category);
  };

  return (
    <ColorWrapper>
      <span>{category}</span>
      <ColorItem type="color" value={colorInput} onChange={handleColorChange} />
    </ColorWrapper>
  );
};

const ColorPicker = ({
  colors,
  onShow = false,
  handleShowColorPicker,
  handleChangeColor,
}) => {
  const [fetchedColors, setFetchedColors] = useState({});

  useEffect(() => {
    setFetchedColors(colors);
  }, [colors]);

  const handleColorInput = (colorValue, category) => {
    setFetchedColors((prev) => ({ ...prev, [category]: colorValue }));
  };

  return (
    <SettingsModal onShow={onShow}>
      <Container>
        <StyledCross onClick={() => handleShowColorPicker(false)} />
        {Object.entries(colors).map((item, idx) => (
          <SingleColor
            key={item}
            color={item[1]}
            category={item[0]}
            handleColorInput={handleColorInput}
          />
        ))}
        <ConfirmButton
          onClick={() => {
            handleShowColorPicker(false);
            handleChangeColor(fetchedColors);
          }}
        >
          Confirm
        </ConfirmButton>
      </Container>
    </SettingsModal>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  position: relative;
  top: 10%;
  width: 25%;
  padding: 20px;
  min-height: 25%;
  margin: 0px auto;
  background: #b5e1e6;
  border-radius: 5px;
  text-align: center;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  @media (max-width: 768px) {
    width: 50%;
    transform: translate(2.5%, 15%);
  }
`;

const ColorWrapper = styled.div`
  position: relative;
  width: 75%;
  padding: 2px;
  display: flex;
  justify-content: space-between;
`;

const ColorItem = styled.input`
  width: 15%;
  cursor: pointer;
  padding: 1px;
  border-radius: 5px;
`;

const ConfirmButton = styled.button`
  cursor: pointer;
  margin: 10px;
  font-weight: bold;
  padding: 5px;
  border-radius: 5px;
`;

const StyledCross = styled(Cross)`
  position: absolute;
  height: 1.2rem;
  top: 5px;
  right: 5px;
  cursor: pointer;
  &:hover {
    color: red;
  }
`;

export default ColorPicker;
