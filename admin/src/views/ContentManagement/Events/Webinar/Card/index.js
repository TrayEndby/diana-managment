import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";

import MarketService from "service/CSA/MarketService";
import moment from "moment";

import EventCard from "./EventCard";
import SprintCard from "./SprintCard";

import * as ROUTES from "constants/routes";
import * as CSA_ROUTES from "constants/CSA/routes";

const propTypes = {
  className: PropTypes.string,
  item: PropTypes.object.isRequired,
  noShare: PropTypes.bool,
  size: PropTypes.string,
};

const WebinarCard = ({ className, item, noShare, size }) => {
  const { id, title, tags } = item;
  const lessTitle = title.substr(title.indexOf("-") + 1);
  const [startDateStr, setStartDateString] = useState("");
  const [shortStartDateStr, setShortStartDateString] = useState("");
  const [speakers, setSpeakers] = useState(null);
  const [isLoading, setLoading] = useState(true);

  const fetchWebinarEvent = useCallback(async () => {
    try {
      setLoading(true);
      let detailResource = await MarketService.getWebinarById(id, true);
      const calendarEvent = detailResource.calendarEvent;
      const startdate = moment.utc(calendarEvent.start, "YYYY-MM-DD hh:mm::ss");
      const enddate = moment.utc(calendarEvent.end, "YYYY-MM-DD hh:mm::ss");
      let western_startdate = moment(startdate).tz("America/Los_Angeles");
      let western_enddate = moment(enddate).tz("America/Los_Angeles");
      if (western_startdate.isDST()) western_startdate.subtract(1, "hours");
      if (western_enddate.isDST()) western_enddate.subtract(1, "hours");
      let eastern_time = moment(startdate).tz("America/New_York");
      if (eastern_time.isDST()) eastern_time.subtract(1, "hours");
      eastern_time = eastern_time.format("h:mm A");
      const startdate_str = western_startdate.format("MMM Do");
      const short_startdate_str = western_startdate.format("MMMM DD");
      const enddate_str = western_enddate.format("MMM Do, YYYY");
      const time_str = western_startdate.format("h:mm A");
      const startDateString = `${startdate_str} - ${enddate_str} ${time_str} PST | ${eastern_time} EST`;
      const shortStartDateString = `${short_startdate_str} | ${time_str} PST / ${eastern_time} EST`;
      setStartDateString(startDateString);
      setShortStartDateString(shortStartDateString);
      if (detailResource.meta != null && detailResource.meta !== "{}") {
        const speakersList = JSON.parse(detailResource.meta).speakers;
        if (speakersList.length === 0) {
          setSpeakers(null);
        } else {
          setSpeakers(speakersList);
        }
      } else {
        setSpeakers(null);
      }
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchWebinarEvent();
  }, [fetchWebinarEvent]);

  let toURL = "";
  let type = 0;
  if (tags === "csa event") {
    toURL = `${ROUTES.WEBINAR_DETAIL}/${id}`;
    type = 1;
  } else if (tags === "csa marketing") {
    toURL = `${CSA_ROUTES.MARKET_WEBINAR_DETAIL}/${id}`;
    type = 1;
  } else if (tags === "csa training") {
    toURL = `${CSA_ROUTES.TRAINING_WEBINARS_DETAIL}/${id}`;
    type = 1;
  } else if (tags === "sprint program") {
    toURL = `${ROUTES.SPRINT_DETAIL}/${id}`;
    type = 2;
  } else if (tags === "monthly counselling") {
    toURL = `${ROUTES.COUNSELING_DETAIL}/${id}`;
    type = 3;
  }

  return (
    <div>
      {(type === 1 || type === 3) && (
        <EventCard
          loading={isLoading}
          className={className}
          size={size}
          item={item}
          noShare={noShare}
          startDateStr={startDateStr}
          shortStartDateStr={shortStartDateStr}
          speakers={speakers}
          lessTitle={lessTitle}
          toURL={toURL}
          type={type}
        />
      )}
      {type === 2 && (
        <SprintCard
          loading={isLoading}
          className={className}
          size={size}
          item={item}
          noShare={noShare}
          startDateStr={startDateStr}
          lessTitle={lessTitle}
          speakers={speakers}
          toURL={toURL}
        />
      )}
    </div>
  );
};

WebinarCard.propTypes = propTypes;

export default WebinarCard;
