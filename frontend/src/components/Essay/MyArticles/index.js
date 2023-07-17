import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

import { getUniqueArticleName } from '../util';
import ErrorDialog from 'util/ErrorDialog';
import ConfirmDialog from 'util/ConfirmDialog';
import DocItemList from 'util/DocItemList';
import useErrorHandler from 'util/hooks/useErrorHandler';
import writingService from 'service/WritingService';
import * as ROUTES from 'constants/routes';

import style from './style.module.scss';

const propTypes = {};

const MyArticles = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [error, setError] = useErrorHandler();

  const handleAddEssay = async () => {
    try {
      setError(null);
      const title = getUniqueArticleName(articles);
      const id = await writingService.create(title);
      setArticles([{ id, title }, ...articles]);
    } catch (e) {
      setError(e);
    }
  };

  const handleSelect = (id) => {
    history.push(`${ROUTES.ESSAY_COMPOSE}/${id}`);
  };

  const handleDelete = async () => {
    try {
      setError(null);
      const id = articleToDelete;
      setArticleToDelete(null);
      await writingService.delete(id);
      const newArticles = articles.filter((article) => article.id !== id);
      setArticles([...newArticles]);
    } catch (e) {
      setError(e);
    }
  };

  useEffect(() => {
    setLoading(true);
    writingService
      .list()
      .then((res) => {
        const articles = res.filter(({ event_id }) => event_id == null);
        setArticles(articles);
      })
      .catch(setError)
      .finally(() => {
        setLoading(false);
      });
  }, [setError]);

  const items = articles.map((article) => {
    return {
      ...article,
      shared: article.share_type != null,
    };
  });

  return (
    <>
      <div className={style.header}>
        <Button onClick={handleAddEssay}>New essay</Button>
      </div>
      <div className={style.lists}>
        <ErrorDialog error={error} />
        {loading && <div className={style.hint}>Loading...</div>}
        {!loading && articles.length === 0 && <div className={style.hint}>No essays</div>}
        {!loading && (
          <DocItemList noShare label="essays" items={items} onSelect={handleSelect} onDelete={setArticleToDelete} />
        )}
      </div>
      {articleToDelete != null && (
        <ConfirmDialog
          show={true}
          title="Delete essay"
          onSubmit={handleDelete}
          onClose={() => setArticleToDelete(null)}
        >
          Are you sure you want to delete the essay?
        </ConfirmDialog>
      )}
    </>
  );
};

MyArticles.propTypes = propTypes;

export default MyArticles;
