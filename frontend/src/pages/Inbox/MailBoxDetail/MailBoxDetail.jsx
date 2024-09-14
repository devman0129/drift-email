import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { MoonLoader } from "react-spinners";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import "./MailBoxDetail.scss";

const MailBoxDetail = () => {
  const MailData = useSelector((state) => state.mail.mailDetail);
  const detailRef = useRef(null);

  const timeFormatter = (date) => {
    var d = new Date(date);
    d = new Date(d.getTime() - 3000000);
    var date_format_str =
      d.getFullYear().toString() +
      "-" +
      ((d.getMonth() + 1).toString().length === 2
        ? (d.getMonth() + 1).toString()
        : "0" + (d.getMonth() + 1).toString()) +
      "-" +
      (d.getDate().toString().length === 2
        ? d.getDate().toString()
        : "0" + d.getDate().toString()) +
      " " +
      (d.getHours().toString().length === 2
        ? d.getHours().toString()
        : "0" + d.getHours().toString()) +
      ":" +
      ((parseInt(d.getMinutes() / 5) * 5).toString().length === 2
        ? (parseInt(d.getMinutes() / 5) * 5).toString()
        : "0" + (parseInt(d.getMinutes() / 5) * 5).toString()) +
      ":00";
    return date_format_str;
  };

  // useEffect(() => {
  //   const iFrameID = iframeEl.current;
  //   if (iframeScrollHeight) {
  //     iFrameID.height = iframeScrollHeight + 'px';
  //   }
  //   detailRef.current.scrollTo(0, 0);
  // }, [iframeScrollHeight]);

  // const handleIframeLoad = (event) => {
  //   console.time();
  //   // Get iframe height after load
  //   const height = event.target.contentWindow.document.body.scrollHeight;
  //   setIframeScrollHeight(height);
  //   console.log('----------------', height);
  //   // setIsLoading(false);
  //   console.timeEnd();
  // };

  // console.log(MailData);

  return (
    <div ref={detailRef} className="flex-1 inbox-detail">
      <div className="email-content">
        {MailData.length ? (
          MailData.length === 1 ? (
            <section key={MailData[0].mailId}>
              <div className="flex justify-between">
                <div className="flex gap-1">
                  <div className="mail-sender-name">
                    {MailData[0].from ? (
                      MailData[0]?.from?.indexOf("<") >= 0 ? (
                        MailData[0]?.from?.slice(
                          0,
                          MailData[0]?.from?.indexOf("<")
                        )
                      ) : (
                        MailData[0]?.from
                      )
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="mail-sender-email">
                    {MailData[0].from?.indexOf("<") >= 0
                      ? MailData[0].from?.slice(MailData[0].from?.indexOf("<"))
                      : ""}
                  </div>
                </div>
                <div className="mail-send-date">
                  {MailData[0].date ? timeFormatter(MailData[0].date) : <></>}
                </div>
              </div>
              <div className="flex">
                <div className="mail-receiver">
                  {MailData[0].to ? `To: <${MailData[0].to}>` : <></>}
                </div>
                <div className="text-right"></div>
              </div>
              <div className="flex mt-1">
                <div className="mail-subject">
                  {MailData[0].subject ? (
                    `Subject: ${MailData[0].subject}`
                  ) : (
                    <></>
                  )}
                </div>
                <div className="text-right"></div>
              </div>
              <div className="mt-2">
                <div className="mail-body">
                  <iframe
                    key={MailData[0].mailId}
                    title={MailData[0].mailId}
                    // onLoad={handleIframeLoad}
                    // scrolling="no"
                    // ref={iframeEl}
                    srcDoc={MailData[0]?.message}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "65vh",
                      // overflow: 'hidden',
                      // display: isLoading ? 'none' : 'unset',
                    }}
                  />
                </div>
              </div>
            </section>
          ) : (
            MailData.map((eachMail) => {
              return (
                <Accordion key={eachMail.mailId}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <div className="flex w-full justify-between text-[#4e5c65]">
                      <div className="flex-col gap-1">
                        <div className="flex gap-2">
                          <div className="mail-sender-name">
                            {eachMail.from ? (
                              eachMail?.from?.indexOf("<") >= 0 ? (
                                eachMail?.from?.slice(
                                  0,
                                  eachMail?.from?.indexOf("<")
                                )
                              ) : (
                                eachMail?.from
                              )
                            ) : (
                              <></>
                            )}
                          </div>
                          <div className="mail-sender-email">
                            {eachMail.from?.indexOf("<") >= 0
                              ? eachMail.from?.slice(
                                  eachMail.from?.indexOf("<")
                                )
                              : ""}
                          </div>
                        </div>

                        <div className="flex">
                          <div className="mail-receiver">
                            {eachMail.to ? `To: <${eachMail.to}>` : <></>}
                          </div>
                          <div className="text-right"></div>
                        </div>
                        <div className="flex mt-1">
                          <div className="mail-subject">
                            {eachMail.subject ? (
                              `Subject: ${eachMail.subject}`
                            ) : (
                              <></>
                            )}
                          </div>
                          <div className="text-right"></div>
                        </div>
                      </div>
                      <div className="mail-send-date">
                        {eachMail.date ? timeFormatter(eachMail.date) : <></>}
                      </div>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <section key={eachMail.mailId}>
                      <div className="mt-2">
                        <div className="mail-body">
                          <iframe
                            key={eachMail.mailId}
                            title={eachMail.mailId}
                            // onLoad={handleIframeLoad}
                            // scrolling="no"
                            // ref={iframeEl}
                            srcDoc={eachMail?.message}
                            loading="lazy"
                            style={{
                              width: "100%",
                              height: "65vh",
                              // overflow: 'hidden',
                              // display: isLoading ? 'none' : 'unset',
                            }}
                          />
                        </div>
                      </div>
                    </section>
                  </AccordionDetails>
                </Accordion>
              );
            })
          )
        ) : (
          <div className="flex gap-2 items-center">
            <MoonLoader
              color="#00c124"
              // cssOverride={{
              //   margin: '0 auto',
              //   background: '#b5b5b552',
              //   borderRadius: '4px',
              //   padding: '60px 20px 54px 20px',
              //   textAlign: 'center',
              // }}
              loading
              size={40}
              speedMultiplier={1}
            />
            <p className="text-lg">Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MailBoxDetail;
