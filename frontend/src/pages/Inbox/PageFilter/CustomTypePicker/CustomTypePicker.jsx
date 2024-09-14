import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CheckPicker, Checkbox, Button } from "rsuite";
import { isEmpty } from "utils";
import { getTypes } from "redux/Type/typeSlice";

const footerStyles = {
  padding: "10px 2px",
  borderTop: "1px solid #e5e5e5",
};

const footerButtonStyle = {
  float: "right",
  marginRight: 10,
  marginTop: 2,
};

const CustomTypePicker = () => {
  const dispatch = useDispatch();
  const picker = useRef();
  const [value, setValue] = useState([]);
  const [types, setTypes] = useState([]);
  const typeData = useSelector((state) => state.type?.types?.result);

  const data = types.map((item) => ({ label: item.name, value: item.name }));

  const allValue = data.map((item) => item.value);

  useEffect(() => {
    dispatch(getTypes());
  }, [dispatch]);

  useEffect(() => {
    if (!isEmpty(typeData)) setTypes(typeData);
  }, [typeData]);

  const handleChange = (value) => {
    setValue(value);
  };

  const handleCheckAll = (value, checked) => {
    setValue(checked ? allValue : []);
  };

  return (
    <CheckPicker
      size="lg"
      data={data}
      placeholder="Select type"
      ref={picker}
      style={{ width: 290 }}
      value={value}
      onChange={handleChange}
      renderExtraFooter={() => (
        <div style={footerStyles}>
          <Checkbox
            indeterminate={value.length > 0 && value.length < allValue.length}
            checked={value.length === allValue.length}
            onChange={handleCheckAll}
          >
            Check all
          </Checkbox>

          <Button
            style={footerButtonStyle}
            appearance="primary"
            size="sm"
            onClick={() => {
              picker.current.close();
            }}
          >
            Ok
          </Button>
        </div>
      )}
    />
  );
};

export default CustomTypePicker;
