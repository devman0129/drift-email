import React from "react";
import Input from "rsuite/Input";
import "./PageFilter.scss";
import CustomDatePicker from "./CustomDatePicker/CustomDatePicker";
import CustomTypePicker from "./CustomTypePicker/CustomTypePicker";
import CustomSourcePicker from "./CustomSourcePicker/CustomSourcePicker";

const PageFilter = ({ filter, setFilter }) => {
  const handleFilter = (type, value) => {
    let newFilter = { ...filter };
    if (type === "date") {
      newFilter.date = value;
    }
    if (type === "emailType") {
      newFilter.emailType = value;
    }
    if (type === "source") {
      newFilter.source = value;
    }
    if (type === "search") {
      newFilter.search = value;
    }

    setFilter(newFilter);
  };

  return (
    <div className="inbox-page-filter">
      <div className="inbox-filters flex gap-4">
        <div className="w-1/6 self-center">
          <CustomDatePicker handleFilter={handleFilter} />
        </div>
        <div className="w-1/6 self-center flex items-center justify-center">
          <CustomTypePicker />
        </div>
        <div className="w-1/6 self-center flex items-center justify-center">
          <CustomSourcePicker handleFilter={handleFilter} />
        </div>
        <div className="flex-1 ml-2 self-center">
          <Input
            placeholder="Default Input"
            size="lg"
            onChange={(value) => handleFilter("search", value)}
          />
        </div>
      </div>
    </div>
  );
};

export default PageFilter;
