import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Img from "components/Base/Img";
import IbListItem from "components/Base/IbListItem";
import { getEmailDetail, getMailList } from "redux/Mail/mailSlice";
import EmptyShowImage from "assets/img/empty-show.jpg";
import "fontello/css/fontello.css";
import "./MailBoxList.scss";

const MailBoxList = ({ filter }) => {
  const MailData = useSelector((state) => state.mail);
  const dispatch = useDispatch();
  const [activeKey, setActiveKey] = useState(0);
  const [selectedMailId, setSelectedMailId] = useState(0);

  const stateChange = (keys) => {
    setActiveKey(keys);
  };

  useEffect(() => {
    dispatch(getMailList(filter));
  }, [filter, dispatch]);

  useEffect(() => {
    if (selectedMailId) dispatch(getEmailDetail(selectedMailId));
  }, [selectedMailId, dispatch]);

  return (
    <div className="inbox-list">
      {MailData.mailListData.map((item, idx) => (
        <IbListItem
          key={item.mailId}
          idxs={idx}
          mailId={item.mailId}
          active={activeKey === idx ? true : false}
          subject={item.subject}
          from={item.from}
          date={item.date}
          count={item.count ?? 1}
          snippet={item.snippet}
          onClick={() => {
            stateChange(idx);
            setSelectedMailId(item.mailId);
          }}
        />
      ))}
      {MailData.mailTotalCount === 0 ? (
        <>
          <p
            style={{
              fontSize: "20px",
              color: "#98d997",
              textAlign: "center",
              marginTop: "50%",
            }}
          >
            New Emails will display here
          </p>
          <Img src={EmptyShowImage} alt={"emptyImage"} />
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default MailBoxList;
