import React from 'react';
import { Search as SearchIcon } from 'react-bootstrap-icons';
import GeneralSearchService from '../../../service/GeneralSearchService';
import styles from './styles.module.scss';

const SelectWithInput = ({ setCollegeId, setCollegeName }) => {
  const [query, setQuery] = React.useState('Harvard University');
  const [isOpened, setIsOpened] = React.useState(false);
  const [colleges, setColleges] = React.useState([]);

  const submitHandler = React.useCallback(
    (e) => {
      e.preventDefault();
      GeneralSearchService.search(query, ['college'])
        .then(({ college_entity }) => {
          if (college_entity) {
            setColleges(college_entity);
            setCollegeName(query);
            setIsOpened(true);
          } else {
            setColleges([]);
          }
        })
        .catch((e) => {
          console.error(e);
          alert('This college\'s data is not available at this moment');
        });
    },
    [query, setCollegeName],
  );

  const selectCollege = (college) => {
    setCollegeId(college.id);
    setQuery(college.name);
  };

  return (
    <form onSubmit={submitHandler} onClick={() => setIsOpened(!isOpened)} className={styles.input}>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search college name" />
      <SearchIcon size="20px" />
      {isOpened && (query !== "") && (
        <section className={styles.dropdown}>
          {colleges.length ? (
            colleges.map((item) => (
              <div key={item.id} onClick={() => selectCollege(item)}>
                {item.name}
              </div>
            ))
          ) : (
            <div>Not found</div>
          )}
        </section>
      )}
    </form>
  );
};

export default React.memo(SelectWithInput);
