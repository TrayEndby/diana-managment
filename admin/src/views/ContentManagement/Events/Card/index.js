import React, { useState } from "react";
import { CButton } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import * as icons from "@coreui/icons";
import PropTypes from "prop-types";
import WebinarCard from "../Webinar/Card";
import styles from "../style.module.scss";

const propTypes = {
  res: PropTypes.object,
  handlePreview: PropTypes.func,
  handleEdit: PropTypes.func,
  handleDelete: PropTypes.func,
};

const EventCard = ({ res, handlePreview, handleEdit, handleDelete }) => {
  const [activeCard, setActiveCard] = useState(0);
  const nowDate = new Date();

  return (
    <div
      className={styles.eventCard}
      onMouseEnter={(e) => setActiveCard(res.id)}
      onMouseLeave={(e) => setActiveCard(0)}
    >
      {activeCard === res.id && (
        <div className={styles.maskDiv}>
          {res.startDateCvt >= nowDate && (
            <CButton
              color="success"
              className="m-auto"
              onClick={() => handlePreview(res)}
            >
              Preview
            </CButton>
          )}
          {res.startDateCvt < nowDate && (
            <CButton
              color="success"
              className="m-auto"
              onClick={() => handlePreview(res)}
            >
              Preview
            </CButton>
          )}
          <CIcon
            content={icons.cilPencil}
            size="lg"
            className="mr-3 mt-3"
            style={{ color: "white", position: "absolute", left: "320px" }}
            onClick={() => handleEdit(res)}
          />
          <CIcon
            content={icons.cilTrash}
            size="lg"
            className="mr-3 mt-3"
            style={{ color: "white", position: "absolute", left: "360px" }}
            onClick={() => handleDelete(res)}
          />
        </div>
      )}
      <WebinarCard item={res} noShare />
    </div>
  );
};
EventCard.prototype = propTypes;

export default EventCard;
