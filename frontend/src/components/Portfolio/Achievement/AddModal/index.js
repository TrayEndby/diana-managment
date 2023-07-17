import React from 'react';
import PropTypes from 'prop-types';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

import ErrorDialog from '../../../../util/ErrorDialog';
import ecaService from '../../../../service/ECAService';

const propTypes = {
  show: PropTypes.bool.isRequired,
  achievementInfo: PropTypes.object,
  name: PropTypes.string,
  onSave: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
};

class AddModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loadingCategoryList: true,
      ECACategoryList: [],
      data: {
        category_id: undefined,
        description: undefined,
        achievement: [],
        portfolios: [],
      },
    };
  }

  componentDidMount() {
    this.fetchCategoryList();
  }

  componentDidUpdate(prevProps) {
    const { show, achievementInfo } = this.props;
    if (!prevProps.show && show && achievementInfo != null) {
      const data = {
        ...achievementInfo,
      };
      this.setState({
        data,
      });
    }
  }

  handleError = (e) => {
    console.error(e);
    this.setState({
      error: e.message,
      loadingCategoryList: false,
    });
  };

  fetchCategoryList = async () => {
    try {
      this.setState({
        loadingCategoryList: true,
      });
      // const ECACategoryList = await userProfileListService.listID(9);
      const ECACategoryList = await ecaService.getCategories();
      this.setState({
        ECACategoryList,
        loadingCategoryList: false,
      });
    } catch (e) {
      this.handleError(e);
    }
  };

  handleCategoryChange = (event) => {
    const category_id = event.target.value ? Number(event.target.value) : undefined;
    if (category_id !== this.state.data.category_id) {
      this.setState({
        data: {
          ...this.state.data,
          category_id,
        },
      });
    }
  };

  handleChange = (event) => {
    this.setState({
      data: {
        ...this.state.data,
        [event.target.name]: event.target.value,
      },
    });
  };

  handleAddAchievement = () => {
    const { data } = this.state;
    let achievement = data.achievement || [];
    achievement = [...achievement, ''];
    this.setState({
      data: {
        ...data,
        achievement,
      },
    });
  };

  handleRemoveAchievement = (index) => {
    const { data } = this.state;
    let { achievement } = data;
    achievement = achievement.filter((_v, i) => i !== index);
    this.setState({
      data: {
        ...data,
        achievement,
      },
    });
  };

  handleChangeAchievement = (e, index) => {
    const { data } = this.state;
    let { achievement } = data;
    achievement = achievement.map((v, i) => (i === index ? e.target.value : v));
    this.setState({
      data: {
        ...data,
        achievement,
      },
    });
  };

  handleAddPortfolio = () => {
    const { data } = this.state;
    let portfolios = data.portfolios || [];
    portfolios = [...portfolios, ''];
    this.setState({
      data: {
        ...data,
        portfolios,
      },
    });
  };

  handleRemovePortfolio = (index) => {
    const { data } = this.state;
    let { portfolios } = data;
    portfolios = portfolios.filter((_v, i) => i !== index);
    this.setState({
      data: {
        ...data,
        portfolios,
      },
    });
  };

  handleChangePortfolio = (event, index) => {
    const { data } = this.state;
    let { portfolios } = data;
    portfolios = portfolios.map((v, i) => {
      if (i === index) {
        return {
          ...v,
          [event.target.name]: event.target.value,
        };
      } else {
        return v;
      }
    });
    this.setState({
      data: {
        ...data,
        portfolios,
      },
    });
  };

  handleSubmit = (event) => {
    try {
      event.preventDefault();
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        this.setState({ validated: true });
      } else {
        const { data } = this.state;
        this.props.onSave(data);
        this.handleClose();
      }
    } catch (e) {
      this.handleError(e);
    }
  };

  handleClose = () => {
    this.setState({
      validated: false,
      data: {},
      error: null,
    });
    this.props.onHide();
  };

  render() {
    const { show } = this.props;
    const { data, validated, error, loadingCategoryList, ECACategoryList } = this.state;
    const { category_id, description, achievement, portfolios } = data;
    return (
      <Modal show={show} onHide={this.handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Add achievement</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '80vh', overflowY: 'auto' }}>
          <ErrorDialog error={error} />
          <Form validated={validated} onSubmit={this.handleSubmit}>
              <Form.Group controlId="achievement-category">
                <Form.Label>Category</Form.Label>
                <SelectForm
                  loading={loadingCategoryList}
                  value={category_id || ''}
                  title="Select category"
                  options={ECACategoryList}
                  onChange={this.handleCategoryChange}
                />
              </Form.Group>
            <Form.Group controlId="achievement-description">
              <Form.Label>Brief description</Form.Label>
              <Form.Control required name="description" value={description || ''} onChange={this.handleChange} />
            </Form.Group>
            <AchievementsForm
              achievement={achievement || []}
              onAdd={this.handleAddAchievement}
              onRemove={this.handleRemoveAchievement}
              onChange={this.handleChangeAchievement}
            />
            <PortfolioForm
              portfolios={portfolios || []}
              onAdd={this.handleAddPortfolio}
              onRemove={this.handleRemovePortfolio}
              onChange={this.handleChangePortfolio}
            />
            <Button type="submit" className="float-right">
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
}

const SelectForm = ({ loading, value, title, options, onChange }) =>
  loading ? (
    <Form.Control value="Loading..." disabled />
  ) : (
    <Form.Control required as="select" value={value} onChange={onChange}>
      <option value="">{title}</option>
      {options.map(({ id, name }) => (
        <option key={id} value={id}>
          {name}
        </option>
      ))}
    </Form.Control>
  );

/* XXX TODO: reuse close button when the style is fixed */
const CloseButton = ({ onClick }) => (
  <button type="button" className="close" aria-label="Close" onClick={onClick}>
    <span aria-hidden="true">&times;</span>
  </button>
);

const AchievementsForm = ({ achievement, onAdd, onRemove, onChange }) => (
  <Form.Group controlId="activity-achievement">
    <Form.Label>Details</Form.Label>
    <p>Show us what the details about your achievement.</p>
    {achievement.map((value, index) => (
      <Form.Group key={index} controlId={`activity-achievement-${index + 1}`}>
        <Form.Label>
          <span className="mr-1">{`Detail ${index + 1}`}</span>
          <CloseButton onClick={() => onRemove(index)} />
        </Form.Label>
        <Form.Control
          required
          key={index}
          type="text"
          value={value || ''}
          placeholder="e.g. national olympic math champion..."
          onChange={(e) => onChange(e, index)}
        />
      </Form.Group>
    ))}
    <Button variant="primary" onClick={onAdd}>
      Add detail
    </Button>
  </Form.Group>
);

const PortfolioForm = ({ portfolios, onAdd, onRemove, onChange }) => (
  <Form.Group>
    <Form.Label>Related links</Form.Label>
    <p>
      Show us what you've made by adding links to your work, such as artwork, videos, music, blog posts, and Github
      repositories.
    </p>
    {portfolios.map(({ name, description, link }, index) => (
      <Form.Group key={index}>
        <Form.Label>
          {`Link ${index + 1}`}
          <CloseButton onClick={() => onRemove(index)} />
        </Form.Label>
        <br />
        <Form.Label>Name</Form.Label>
        <Form.Control required name="name" type="text" value={name || ''} onChange={(e) => onChange(e, index)} />
        <Form.Label>Description</Form.Label>
        <Form.Control
          required
          name="description"
          type="text"
          value={description || ''}
          onChange={(e) => onChange(e, index)}
        />
        <Form.Label>URL</Form.Label>
        <Form.Control name="link" type="text" value={link || ''} onChange={(e) => onChange(e, index)} />
      </Form.Group>
    ))}
    <Button variant="primary" onClick={onAdd}>
      Add link
    </Button>
  </Form.Group>
);

AddModal.propTypes = propTypes;

export default AddModal;
