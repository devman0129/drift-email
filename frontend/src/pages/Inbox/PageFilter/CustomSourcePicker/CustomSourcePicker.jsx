import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CheckPicker, Checkbox, Button } from "rsuite";
import { isEmpty } from "utils";
import { getInboxAccountList } from "redux/Account/accountSlice";

const footerStyles = {
  padding: "10px 2px",
  borderTop: "1px solid #e5e5e5",
};

const footerButtonStyle = {
  float: "right",
  marginRight: 10,
  marginTop: 2,
};

const CustomSourcePicker = ({ handleFilter }) => {
  const dispatch = useDispatch();
  const picker = useRef();
  const [value, setValue] = useState([]);
  const [inboxes, setInboxes] = useState([]);
  const inboxData = useSelector((state) => state.account.inboxes);

  useEffect(() => {
    dispatch(getInboxAccountList());
  }, [dispatch]);

  useEffect(() => {
    if (!isEmpty(inboxData)) setInboxes(inboxData);
  }, [inboxData]);

  const data = inboxes.map((item) => ({
    label: item.email,
    value: item.email,
  }));

  const allValue = data.map((item) => item.value);

  const handleChange = (value) => {
    handleFilter("source", value);
    setValue(value);
  };

  const handleCheckAll = (value, checked) => {
    handleFilter("source", allValue);
    setValue(checked ? allValue : []);
  };

  return (
    <div>
      <CheckPicker
        size="lg"
        data={data}
        placeholder="Select source"
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
    </div>
  );
};

export default CustomSourcePicker;
