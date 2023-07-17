import React from 'react';
import cn from 'classnames';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputRange from 'react-input-range';

import EducatorService from 'service/EducatorService';
import SidebarPageLayout from 'layout/SidebarPageLayout';

import style from './style.module.scss';
import EducatorCard from './EducatorCard';

const GENDERS = [
  {
    id: 1,
    name: 'Man',
  },
  {
    id: 2,
    name: 'Woman',
  },
];

const EducatorsSearchPage = () => {
  const [educators, setEducators] = React.useState([]);
  const [serviceCategories, setServiceCategories] = React.useState([]);
  const [gender, setGender] = React.useState(null);
  const [showOnlySaved, setShowOnlySaved] = React.useState(null);
  const [search, setSearch] = React.useState('');
  const [rate, setRate] = React.useState(350);
  const [experience, setExperience] = React.useState(0);

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }
    const services = serviceCategories.filter((service) => service.checked).map((service) => service.id);
    let result = await EducatorService.getAllEducators({
      gender,
      hourlyRateMax: rate,
      serviceName: search,
      yearsExperience: experience,
      serviceType: services.length ? services : null,
    });

    result = result.map((educator) => {
      const minRate = educator.educatorService.reduce(
        (a, b) => Math.min(a, b.hourly_rate),
        educator.educatorService[0].hourly_rate,
      );
      const maxRate = educator.educatorService.reduce(
        (a, b) => Math.max(a, b.hourly_rate),
        educator.educatorService[0].hourly_rate,
      );
      const rate = minRate === maxRate ? `$${maxRate}` : `$${minRate} - $${maxRate}`;
      const minExp = educator.educatorService.reduce(
        (a, b) => Math.min(a, b.years_experience),
        educator.educatorService[0].years_experience,
      );
      const maxExp = educator.educatorService.reduce(
        (a, b) => Math.max(a, b.years_experience),
        educator.educatorService[0].years_experience,
      );
      const experience = minExp === maxExp ? `${maxExp} years` : `${minExp} - ${maxExp} years`;
      const services = educator.educatorService.map((service) => service.name).join(', ') + '.';
      return { ...educator, rate, experience, services };
    });
    setEducators(result);

    const { listOfIds } = await EducatorService.getSavedEducators();
    result = result.map((educator) => {
      const isSaved = listOfIds.includes(educator.educatorProfile.uid);
      return { ...educator, isSaved };
    });
    result = result.filter((educator) => !showOnlySaved || educator.isSaved);
    setEducators(result);
  };

  const toggleSavedState = React.useCallback(
    async (id, isSaved) => {
      if (isSaved) {
        await EducatorService.removeEducatorFromSaved(id);
      } else {
        await EducatorService.saveEducator(id);
      }
      setEducators(
        educators.map((educator) =>
          educator.educatorProfile.uid === id ? { ...educator, isSaved: !isSaved } : educator,
        ),
      );
    },
    [educators],
  );

  const changeCategoryState = (id, value) => {
    const categories = serviceCategories.map((category) =>
      category.id === id ? { ...category, checked: value } : category,
    );
    setServiceCategories(categories);
  };

  React.useEffect(() => {
    handleSubmit();
    EducatorService.getServiceCategories().then((result) => {
      setServiceCategories(result.map((i) => ({ ...i, checked: false })));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cn(style.page, 'App-body')}>
      <SidebarPageLayout
        sideBar={(closeSidebar) => (
          <Form className={style.sidebar} onSubmit={() => { handleSubmit(); closeSidebar(); }}>
            <h2 className={style.header}>Filters</h2>
            <Form.Group className={style.formField}>
              <Form.Control
                type="search"
                placeholder="Search by name or service"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Form.Group>
            <Form.Group className={style.formField}>
              <Form.Label>{`Hourly rate: <= ${rate}`} </Form.Label>
              <InputRange minValue={0} maxValue={350} value={rate} onChange={setRate} />
            </Form.Group>
            <Form.Group className={style.formField}>
              <Form.Label>{`Years of experience: >=${experience}`} </Form.Label>
              <InputRange minValue={0} maxValue={30} value={experience} onChange={setExperience} />
            </Form.Group>
            <Form.Group className={style.formField}>
              <Form.Label>Gender</Form.Label>
              <Form.Control as="select" value={gender || ''} name="major" onChange={(e) => setGender(+e.target.value)}>
                <option value="">No preference</option>
                {GENDERS.map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className={style.formField}>
              <Form.Label>Service categories</Form.Label>
              {serviceCategories.map((category) => (
                <Form.Group className={style.formCheck} key={category.id}>
                  <Form.Check
                    id={`Services-${category.id}`}
                    type="checkbox"
                    onChange={() => changeCategoryState(category.id, !category.checked)}
                    checked={category.checked}
                  />
                  <Form.Label htmlFor={`Services-${category.id}`}>{category.name}</Form.Label>
                </Form.Group>
              ))}
            </Form.Group>
            <Form.Group className={style.formField}>
              <Form.Label>Saved Educators</Form.Label>
              <Form.Group className={style.formCheck}>
                <Form.Check
                  id="showOnlySaved"
                  type="checkbox"
                  onChange={() => setShowOnlySaved(!showOnlySaved)}
                  checked={showOnlySaved}
                />
                <Form.Label htmlFor="showOnlySaved">Show only saved educators</Form.Label>
              </Form.Group>
            </Form.Group>
            <Button type="submit" className="float-right">
              Find educator
            </Button>
          </Form>
          // <CollegeSearchBoard
          //   left={left}
          //   sportsList={sportsList}
          //   onSearch={this.searchCollege}
          //   onError={this.handleError}
          //   onCloseSidebar={closeSidebar}
          // />
        )}
        rightSidebar
        wideSidebar
        noHeader
      >
        <section className={style.resultContainer}>
          {educators.map((educator) => (
            <EducatorCard key={educator.educatorProfile.uid} educator={educator} toggleSavedState={toggleSavedState} />
          ))}
        </section>
      </SidebarPageLayout>
    </div>
  );
};

export default EducatorsSearchPage;
