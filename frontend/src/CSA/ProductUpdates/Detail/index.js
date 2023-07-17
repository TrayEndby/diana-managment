import React, { useState, useEffect, useCallback } from 'react';
import cn from 'classnames';
import Back from '../../MySalesActivity/Prospect/Back';
import Markdown from 'components/Markdown';
import moment from 'moment';

import useErrorHandler from 'util/hooks/useErrorHandler';
import ShareButtons from 'util/ShareButtons';
import ErrorDialog from 'util/ErrorDialog';
import MarketService from 'service/CSA/MarketService';

import * as CSA_ROUTES from 'constants/CSA/routes';

import style from './style.module.scss';

const ProductDetailPage = (props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useErrorHandler();
  const [resource, setResource] = useState({});
  const id = props.match.params.id;

  const fetchResourceList = useCallback(async () => {
    try {
      setLoading(true);
      const resourceList = await MarketService.getProductUpdates();
      const resourceMatch = resourceList.filter((res) => parseInt(res.id) === parseInt(id));
      if (resourceMatch.length > 0) {
        const localDate = moment.utc(resourceMatch[0].updated_ts).local().format('MMMM DD, YYYY');
        setResource({ ...resourceMatch[0], localDate });
      }
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [id, setError]);

  useEffect(() => {
    fetchResourceList();
  }, [fetchResourceList]);

  return (
    <div>
      {error && <ErrorDialog error={error} />}
      {loading && <div className="text-center py-2">Loading...</div>}
      {!error && !loading && (
        <div className={cn(style.container, 'App-body')}>
          <div className={style.mainDiv}>
            <div style={{ marginTop: '15px', marginLeft: '13px' }}>
              <Back text="Back to all posts" path={CSA_ROUTES.PRODUCT_UPDATES} />
            </div>
            <div style={{ marginLeft: '20px', marginTop: '20px', paddingLeft: '24px' }}>
              <h1>{resource.title}</h1>
              <ShareButtons style={{ marginTop: '8px' }} />
              <h6 style={{ marginTop: '8px' }}>
                {resource.localDate} | by {resource.source}
              </h6>
              <Markdown source={resource.description} />
            </div>
          </div>
          <div className={style.rightDiv}>
            <h3 className="App-text-orange">Related Blog Posts</h3>
            <div
              style={{ width: '98%', margin: '8px', height: '1px', marginLeft: '1%', backgroundColor: 'grey' }}
            ></div>
            <div style={{ marginTop: '24px' }}>
              <h5>Customer Lifetime Value Part 1: Estimating Customer Lifetimes</h5>
              <h6>
                Download the Customer Lifetimes Part 1 notebook to demo the solution covered below, and watch the
                on-demand virtual workshop to learn more. You can also...
              </h6>
            </div>
            <div style={{ marginTop: '24px' }}>
              <h5>How a Fresh Approach to Safety Stock Analysis Can Optimize Inventory</h5>
              <h6>
                Refer to the accompanying notebook for more details. A manufacturer is working on an order for a
                customer only to find that the delivery of...
              </h6>
            </div>
            <div style={{ marginTop: '24px' }}>
              <h5>New Methods for Improving Supply Chain Demand Forecasting</h5>
              <h6>
                Organizations Are Rapidly Embracing Fine-Grained Demand Forecasting Retailers and Consumer Goods
                manufacturers are increasingly seeking improvements to their supply chain management in order to
                reduce...
              </h6>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
