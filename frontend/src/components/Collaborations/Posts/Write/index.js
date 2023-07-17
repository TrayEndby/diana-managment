import React from 'react';
import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import ErrorDialog from '../../../../util/ErrorDialog';

const propTypes = {
  onPost: PropTypes.func.isRequired,
};

class WritePostCard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      error: null,
      validated: false,
      submiting: false,
    };
    this.formRef = React.createRef();
  }

  handleChange = (e) => {
    this.setState({
      data: {
        ...this.state.data,
        [e.target.name]: e.target.value,
      },
      error: null,
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    if (this.formRef.current.checkValidity() === false) {
      this.setState({
        validated: true,
        error: null,
      });
    } else {
      try {
        this.setState({
          validated: false,
          submiting: true,
        });
        await this.props.onPost(this.state.data);
        this.setState({ error: null, submiting: false, data: {} });
      } catch (e) {
        console.error(e);
        this.setState({ error: e.message, submiting: false });
      }
    }
  };

  render() {
    const { data, validated, submiting, error } = this.state;
    const { name, text } = data;
    return (
      <Card className="p-2 w-100 rounded-0">
        <ErrorDialog error={error} />
        <Form ref={this.formRef} validated={validated} onSubmit={this.handleSubmit}>
          <Form.Label>New Post</Form.Label>
          <Form.Control required placeholder="Title" name="name" value={name || ''} onChange={this.handleChange} />
          <Form.Control
            required
            as="textarea"
            className="my-2"
            placeholder="Starting write your post"
            rows={5}
            name="text"
            value={text || ''}
            onChange={this.handleChange}
          />
          <Button type="submit" className="float-right m-2" disabled={submiting}>
            {submiting ? 'Saving...' : 'Post'}
          </Button>
        </Form>
      </Card>
    );
  }
}

WritePostCard.propTypes = propTypes;

export default WritePostCard;
