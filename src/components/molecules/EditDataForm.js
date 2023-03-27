import { Formik, Field, Form, ErrorMessage } from 'formik';
import StyledInput from '../atoms/Input';
import StyledSelect from '../atoms/Select';
import Button from '../atoms/Button';
import { validateExpense, validateIncome } from '../../utils/formValidation';
import styled from 'styled-components';

const EditDataForm = ({
  item,
  remove,
  save,
  date,
  source,
  description,
  amount,
  wallet,
  sourceArr,
  handleShowModal,
  catOrSour,
}) => {
  return (
    <Div>
      <Formik
        initialValues={{
          date: date,
          [catOrSour]: source,
          description: description,
          amount: amount,
          wallet: wallet,
        }}
        validate={wallet === 'expense' ? validateExpense : validateIncome}
        onSubmit={(values) => {
          save({ ...item, ...values });
          handleShowModal(false);
        }}
      >
        <Form>
          <ErrorMessage name="date" />
          <Field name="date" type="date" as={StyledInput} />
          <ErrorMessage name={catOrSour} />
          <Field name={catOrSour} as={StyledSelect}>
            {sourceArr.map((item) => {
              return (
                <option key={item} value={item}>
                  {item}
                </option>
              );
            })}
          </Field>
          <ErrorMessage name="amount" />
          <Field
            name="amount"
            type="number"
            placeholder="0.00"
            as={StyledInput}
          />
          <ErrorMessage name="description" />
          <Field
            name="description"
            type="text"
            placeholder="Note"
            as={StyledInput}
          />
          <div style={{ display: 'flex' }}>
            <Button type="submit" text="Save" />
            <Button
              add={() => {
                remove(item);
                handleShowModal(false);
              }}
              text="Delete"
            />
          </div>
        </Form>
      </Formik>
    </Div>
  );
};

const Div = styled.div`
  width: 75%;
  @media (max-width: 768px) {
    width: 75%;
  }
`;

export default EditDataForm;
