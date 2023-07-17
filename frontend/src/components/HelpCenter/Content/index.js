import React, { useState, useEffect } from 'react';

import FAQsList from '../List';
import FAQDetail from '../Detail';

import resourceService, { Resource_Type } from 'service/ResourceService';

const propTypes = {};

const HelpCenterContent = () => {
  const [hasError, setHasSetError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchKey, setSearchKey] = useState('');
  const [FAQs, setFAQs] = useState([]);
  const [searchFAQs, setSearchFAQs] = useState(null);
  const [FAQToShow, setFAQToShow] = useState(null);

  useEffect(() => {
    resourceService
      .list(Resource_Type.FQA)
      .then((res) => {
        setFAQs(res[0]);
      })
      .catch((e) => {
        console.error(e);
        setHasSetError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSearch = async (keyword) => {
    setSearchKey(keyword);
    keyword = keyword.trim().toLowerCase();
    if (!keyword) {
      setSearchFAQs(null);
    } else {
      try {
        const res = await resourceService.search(Resource_Type.FQA, keyword);
        setSearchFAQs(res[0]);
      } catch (e) {
        console.error(e);
      }
    }
  };

  if (hasError) {
    return null;
  }

  return (
    <>
      {(loading || FAQToShow == null) && (
        <FAQsList
          FAQs={searchFAQs || FAQs}
          loading={loading}
          showDescription={searchFAQs != null}
          searchKey={searchKey}
          onClick={setFAQToShow}
          onSearch={handleSearch}
        />
      )}
      {!loading && FAQToShow != null && (
        <FAQDetail id={FAQToShow} onBack={() => setFAQToShow(null)} />
      )}
    </>
  );
};

HelpCenterContent.propTypes = propTypes;

export default HelpCenterContent;
